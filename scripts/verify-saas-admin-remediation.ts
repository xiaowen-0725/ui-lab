/** Browser verification against a running preview; no source copies or publishing. */
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium, type Browser, type Page } from "playwright";

const origin = process.env.SAAS_ADMIN_ORIGIN ?? "http://localhost:3109";
const evidence =
	process.env.SAAS_ADMIN_EVIDENCE ??
	(await mkdtemp(join(tmpdir(), "uilab-saas-remediation-")));
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const base = (locale = "en") =>
	`${origin}/${locale}/sites/saas-admin-site/preview`;
const paths = [
	"/dashboard/orders",
	"/apps/users/list",
	...["account", "security", "billing", "notifications", "connections"].map(
		(tab) => `/apps/users/view?tab=${tab}`,
	),
	"/pages/user-profile",
	"/pages/user-profile?view=connections",
	"/pages/user-settings",
	"/pages/user-settings?setting=workspace",
	"/datatable",
	"/forms/form-layouts/vertical",
	"/forms/form-layouts/horizontal",
	"/forms/form-validation",
	"/pages/auth/login",
	"/pages/auth/register",
	"/pages/auth/forgot-password",
];
async function ready(page: Page) {
	await page.locator("h1").waitFor({ state: "attached" });
	await page.waitForFunction(() => document.title.length > 0);
	await page.waitForTimeout(150);
}
async function contextFor(
	browser: Browser,
	brand = "default",
	mode = "light",
	width = 1440,
) {
	const context = await browser.newContext({
		viewport: { width, height: 1000 },
		colorScheme: mode === "dark" ? "dark" : "light",
		reducedMotion: "reduce",
	});
	await context.addInitScript(
		({ brand, mode }) => {
			localStorage.setItem(
				"uilab.saas-admin.preferences.v1",
				JSON.stringify({ brand, mode }),
			);
		},
		{ brand, mode },
	);
	return context;
}
async function audit() {
	const axePath = process.env.SAAS_ADMIN_AXE;
	if (!axePath)
		throw new Error("Set SAAS_ADMIN_AXE to a local axe-core 4.11.0 script.");
	const axeSource = await readFile(axePath, "utf8");
	const results: unknown[] = [];
	const auditPaths: string[] = process.env.SAAS_ADMIN_AUDIT_PATHS ? JSON.parse(process.env.SAAS_ADMIN_AUDIT_PATHS) : paths;
	const variants = ["en", "zh"].flatMap((locale) =>
		["default", "blue-ink"].flatMap((brand) =>
			["light", "dark"].flatMap((mode) =>
				[390, 1440].map((width) => ({ locale, brand, mode, width })),
			),
		),
	);
	// Two browser contexts at once bound CPU/memory while covering every variant.
	for (let start = 0; start < variants.length; start += 2) {
		await Promise.all(
			variants.slice(start, start + 2).map(async (variant) => {
				const context = await contextFor(
					browser,
					variant.brand,
					variant.mode,
					variant.width,
				);
				const page = await context.newPage();
				const errors: string[] = [];
				page.on("pageerror", (error) => errors.push(error.message));
				for (const path of auditPaths) {
					await page.goto(base(variant.locale) + path);
					await ready(page);
					await page.addScriptTag({ content: axeSource });
					const result = await page.evaluate(async () => {
						const axe = (
							window as unknown as {
								axe: {
									version: string;
									run: (
										document: Document,
										options: unknown,
									) => Promise<{ violations: unknown[] }>;
								};
							}
						).axe;
						if (axe.version !== "4.11.0")
							throw new Error(`Expected axe 4.11.0; got ${axe.version}`);
						const result = await axe.run(document, {
							runOnly: {
								type: "tag",
								values: ["wcag2a", "wcag2aa", "wcag21aa", "best-practice"],
							},
						});
						return {
							version: axe.version,
							violations: result.violations,
							mains: document.querySelectorAll("main").length,
							h1: document.querySelectorAll("h1").length,
							overflow: document.documentElement.scrollWidth > innerWidth + 1,
						};
					});
					results.push({ ...variant, path, ...result });
					console.log(
						"AUDIT",
						JSON.stringify({
							...variant,
							path,
							violations: result.violations.length,
							overflow: result.overflow,
						}),
					);
				}
				results.push({ ...variant, runtimeErrors: errors });
				await context.close();
			}),
		);
	}
	await writeFile(
		join(evidence, "browser-axe.json"),
		JSON.stringify(
			{
				date: new Date().toISOString(),
				browser: browser.version(),
				cases: results,
			},
			null,
			2,
		),
	);
	const failed = results.filter((result) => {
		const r = result as {
			violations?: unknown[];
			runtimeErrors?: string[];
			mains?: number;
			h1?: number;
			overflow?: boolean;
		};
		return (
			r.violations?.length ||
			r.runtimeErrors?.length ||
			(r.mains !== undefined && r.mains !== 1) ||
			(r.h1 !== undefined && r.h1 !== 1) ||
			r.overflow
		);
	});
	assert.equal(
		failed.length,
		0,
		`${failed.length} browser audit scenarios failed; see ${evidence}`,
	);
}
async function flows() {
	const context = await contextFor(browser);
	const page = await context.newPage();
	const checks: string[] = [];
	const errors: string[] = [];
	page.on("pageerror", (error) => errors.push(error.message));
	const go = async (path: string) => {
		await page.goto(base() + path);
		await ready(page);
	};
	const check = async (name: string, action: () => Promise<void>) => {
		await action();
		checks.push(name);
		console.log("PASS", name);
	};
	try {
		await check("user URL state, refresh, unrelated parameters", async () => {
			await go(
				"/apps/users/list?role=Admin&size=25&sort=user&direction=desc&campaign=demo",
			);
			assert.equal(await page.locator("#search-user").inputValue(), "");
			await page.locator("#search-user").fill("Ava");
			await page.waitForURL((url) => url.searchParams.get("q") === "Ava");
			assert.equal(new URL(page.url()).searchParams.get("campaign"), "demo");
			await page.reload();
			await ready(page);
			assert.equal(await page.locator("#search-user").inputValue(), "Ava");
		});
		await check(
			"delete confirmation, safe initial focus, cancel and confirm",
			async () => {
				await go("/apps/users/list");
				const row = page.locator("tbody tr").first();
				const target = await row
					.locator('a[href*="/apps/users/view?user="]')
					.first()
					.getAttribute("href");
				assert.ok(target);
				await row
					.getByRole("button", { name: "Delete user", exact: true })
					.click();
				const dialog = page.getByRole("alertdialog");
				await dialog.waitFor();
				await page.waitForFunction(
					() => document.activeElement?.textContent?.trim() === "Cancel",
				);
				await dialog
					.getByRole("button", { name: "Cancel", exact: true })
					.click();
				assert.ok(await page.locator(`tbody a[href="${target}"]`).count());
				await row
					.getByRole("button", { name: "Delete user", exact: true })
					.click();
				await dialog
					.getByRole("button", { name: "Delete", exact: true })
					.click();
				await dialog.waitFor({ state: "hidden" });
				assert.equal(
					await page.locator(`tbody a[href="${target}"]`).count(),
					0,
				);
			},
		);
		await check("detail tab URL, refresh and back", async () => {
			await go("/apps/users/view");
			await page.getByRole("tab", { name: "Security", exact: true }).click();
			await page.waitForURL(
				(url) => url.searchParams.get("tab") === "security",
			);
			await page.reload();
			await ready(page);
			assert.equal(
				await page
					.getByRole("tab", { name: "Security", exact: true })
					.getAttribute("aria-selected"),
				"true",
			);
			await page.goBack();
			await page.getByRole("tab", { name: "Account", exact: true }).waitFor();
		});
		await check(
			"settings drafts, tab history, cancel leave, back and discard",
			async () => {
				await go("/pages/user-profile");
				await page
					.getByRole("navigation", { name: "Main navigation" })
					.getByRole("link", { name: "User Settings", exact: true })
					.click();
				await page.waitForURL("**/pages/user-settings?setting=general");
				await ready(page);
				const social = page.getByRole("textbox", {
					name: "Social URL 1",
					exact: true,
				});
				await social.fill("https://example.com/draft");
				await page.getByRole("tab", { name: "Workspace", exact: true }).click();
				await page.waitForURL("**setting=workspace");
				await page.waitForFunction(
					() =>
						document
							.querySelector('[role="tab"][aria-selected="true"]')
							?.textContent?.trim() === "Workspace",
				);
				await page.getByRole("tab", { name: "General", exact: true }).click();
				await page.waitForURL("**setting=general");
				await page.waitForFunction(
					() =>
						document
							.querySelector('[role="tab"][aria-selected="true"]')
							?.textContent?.trim() === "General",
				);
				assert.equal(await social.inputValue(), "https://example.com/draft");
				await page.goBack();
				await page.waitForURL("**setting=workspace");
				assert.equal(await page.getByRole("alertdialog").count(), 0);
				await page.goBack();
				await page.waitForURL("**setting=general");
				assert.equal(await social.inputValue(), "https://example.com/draft");
				const profile = page
					.getByRole("navigation", { name: "Main navigation" })
					.getByRole("link", { name: "User Profile", exact: true });
				await profile.click();
				const dialog = page.getByRole("alertdialog");
				await dialog.waitFor();
				await dialog
					.getByRole("button", { name: "Keep editing", exact: true })
					.click();
				assert.equal(await social.inputValue(), "https://example.com/draft");
				await page.evaluate(() => history.back());
				await dialog.waitFor();
				assert.ok(
					new URL(page.url()).pathname.endsWith("/pages/user-settings"),
				);
				await dialog
					.getByRole("button", { name: "Keep editing", exact: true })
					.click();
				assert.equal(await social.inputValue(), "https://example.com/draft");
				await page.evaluate(() => history.back());
				await dialog.waitFor();
				await dialog
					.getByRole("button", { name: "Discard & leave", exact: true })
					.click();
				await page.waitForURL("**/pages/user-profile");
				await page.goForward();
				await page.waitForURL("**setting=general");
				assert.equal(await social.inputValue(), "");
				await social.fill("https://example.com/saved");
				await page
					.locator('[data-admin-action="settings.social-url"]')
					.getByRole("button", { name: "Save Changes", exact: true })
					.click();
				await page
					.locator('[data-admin-action="settings.social-url"]')
					.getByRole("status")
					.filter({ hasText: "Action completed." })
					.waitFor();
				await profile.click();
				await page.waitForURL("**view=profile");
				assert.equal(await dialog.count(), 0);
			},
		);
		await check(
			"timezone formatter reuse, search and keyboard draft signal",
			async () => {
				await page.addInitScript(() => {
					const original = Intl.DateTimeFormat;
					(window as unknown as { timezoneFormats: number }).timezoneFormats =
						0;
					Intl.DateTimeFormat = new Proxy(original, {
						construct(target, args) {
							if (args[1]?.timeZoneName === "shortOffset")
								(window as unknown as { timezoneFormats: number })
									.timezoneFormats++;
							return Reflect.construct(target, args);
						},
					});
				});
				await go("/pages/user-settings?setting=workspace");
				const count = () =>
					page.evaluate(
						() =>
							(window as unknown as { timezoneFormats: number })
								.timezoneFormats,
					);
				await page.waitForFunction(
					() =>
						(window as unknown as { timezoneFormats: number }).timezoneFormats >
						0,
				);
				const before = await count();
				const picker = page.locator(
					'[data-admin-action="settings.workspace-name"] button[role="combobox"]',
				);
				await picker.click();
				await page.getByPlaceholder("Search timezone").fill("Calcutta");
				await page.keyboard.press("ArrowDown");
				await page.keyboard.press("Enter");
				await page.waitForFunction(() =>
					document
						.querySelector(
							'[data-admin-action="settings.workspace-name"] button[role="combobox"]',
						)
						?.textContent?.includes("Asia/Calcutta"),
				);
				assert.equal(await count(), before);
				await page
					.getByRole("navigation", { name: "Main navigation" })
					.getByRole("link", { name: "User Profile", exact: true })
					.click();
				const dialog = page.getByRole("alertdialog");
				await dialog.waitFor();
				await dialog
					.getByRole("button", { name: "Keep editing", exact: true })
					.click();
				assert.equal(await count(), before);
				await page
					.locator('[data-admin-action="settings.workspace-name"]')
					.getByRole("button", { name: "Save Changes", exact: true })
					.click();
				await page
					.locator('[data-admin-action="settings.workspace-name"]')
					.getByRole("status")
					.filter({ hasText: "Action completed." })
					.waitFor();
			},
		);
		await check(
			"reduced motion gates profile grid; normal mode can pause",
			async () => {
				await go("/pages/user-profile");
				assert.equal(await page.locator(".cell").count(), 0);
				await page.emulateMedia({ reducedMotion: "no-preference" });
				await page.locator(".cell").first().waitFor({ state: "attached" });
				await page
					.getByRole("button", { name: "Pause background", exact: true })
					.click();
				assert.equal(await page.locator(".cell").count(), 0);
				await page
					.getByRole("button", { name: "Resume background", exact: true })
					.click();
				await page.locator(".cell").first().waitFor({ state: "attached" });
				await page.emulateMedia({ reducedMotion: "reduce" });
				await page.waitForFunction(
					() => document.querySelectorAll(".cell").length === 0,
				);
			},
		);
		await check("authentication autocomplete and email spelling", async () => {
			await go("/pages/auth/login");
			assert.equal(
				await page.locator('input[type="email"]').getAttribute("autocomplete"),
				"email",
			);
			assert.equal(
				await page.locator('input[type="email"]').getAttribute("spellcheck"),
				"false",
			);
			assert.equal(
				await page
					.locator('input[name="password"]')
					.getAttribute("autocomplete"),
				"current-password",
			);
		});
		assert.deepEqual(errors, []);
	} finally {
		await page
			.screenshot({
				path: join(evidence, "flows-last-page.png"),
				fullPage: true,
			})
			.catch(() => {});
		await writeFile(
			join(evidence, "browser-flows.json"),
			JSON.stringify(
				{
					date: new Date().toISOString(),
					browser: browser.version(),
					checks,
					errors,
				},
				null,
				2,
			),
		);
		await context.close();
	}
}
try {
	if (process.argv.includes("--audit")) await audit();
	else await flows();
} finally {
	await browser.close();
	console.log("Evidence", evidence);
}
