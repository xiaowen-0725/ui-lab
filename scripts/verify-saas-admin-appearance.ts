/** Verify the real customizer, layout geometry, persistence and draft continuity. */
import assert from "node:assert/strict";
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium, type Page } from "playwright";

const origin = process.env.SAAS_ADMIN_ORIGIN ?? "http://localhost:3109";
const evidence = await mkdtemp(join(tmpdir(), "uilab-saas-appearance-"));
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const errors: string[] = [];
const checks: string[] = [];
let passed = false;
const context = await browser.newContext({
	viewport: { width: 1920, height: 1200 },
	reducedMotion: "reduce",
});
const page = await context.newPage();
page.on("pageerror", (error) => errors.push(error.message));

async function openPanel(page: Page) {
	const panel = page.getByRole("dialog", {
		name: "Theme Customizer",
		exact: true,
	});
	if (!(await panel.isVisible()))
		await page
			.getByRole("button", { name: "Theme Customizer", exact: true })
			.click();
	await panel.waitFor();
	return panel;
}

async function choose(group: string, choice: string) {
	const panel = await openPanel(page);
	await panel
		.getByRole("group", { name: group, exact: true })
		.getByRole("button", { name: choice, exact: true })
		.click();
}

async function select(label: string, choice: string) {
	const panel = await openPanel(page);
	await panel.getByRole("combobox", { name: label, exact: true }).click();
	await page.getByRole("option", { name: choice, exact: true }).click();
}

async function saved() {
	return page.evaluate(() =>
		JSON.parse(
			localStorage.getItem("uilab.saas-admin.preferences.v1") ?? "null",
		),
	);
}

try {
	await page.goto(
		`${origin}/en/sites/saas-admin-site/preview/pages/user-settings`,
	);
	await page
		.getByRole("heading", { name: "Account & User Management", exact: true })
		.waitFor();
	await page
		.getByPlaceholder("John", { exact: true })
		.fill("Unsaved appearance draft");
	await openPanel(page);
	await page.screenshot({ path: join(evidence, "panel-default-desktop.png") });
	for (const variant of ["Inset", "Floating", "Sidebar"]) {
		await choose("Sidebar", variant);
		assert.equal(
			await page.locator('[data-slot="sidebar"]').getAttribute("data-variant"),
			variant.toLowerCase(),
		);
		const bounds = await page
			.locator('[data-slot="sidebar-inset"]')
			.boundingBox();
		assert(bounds && bounds.width > 500, "Inset keeps a real content region");
		checks.push(`sidebar ${variant}`);
	}
	for (const [label, mode] of [
		["Compact", "icon"],
		["Full layout", "offcanvas"],
	]) {
		await choose("Layout", label);
		assert.equal(
			await page
				.locator('[data-slot="sidebar"]')
				.getAttribute("data-collapsible"),
			mode,
		);
		assert.equal((await saved()).appearance.sidebarOpen, false);
		checks.push(`navigation ${label}`);
	}
	await choose("Layout", "Default");
	assert.equal(
		await page.locator('[data-slot="sidebar"]').getAttribute("data-state"),
		"expanded",
	);
	checks.push("expanded navigation");
	await choose("Content Layout", "Full");
	assert.equal(
		await page
			.locator("#saas-admin-content")
			.evaluate((element) => getComputedStyle(element).maxWidth),
		"none",
	);
	await choose("Content Layout", "Compact");
	assert.equal(
		await page
			.locator("#saas-admin-content")
			.evaluate((element) => getComputedStyle(element).maxWidth),
		"1440px",
	);
	checks.push("content width is independent of navigation layout");
	await choose("Radius", "None");
	assert.equal(
		await page.evaluate(() =>
			getComputedStyle(document.documentElement)
				.getPropertyValue("--radius")
				.trim(),
		),
		"0rem",
	);
	await choose("Radius", "LG");
	assert.equal(
		await page.evaluate(() =>
			getComputedStyle(document.documentElement)
				.getPropertyValue("--radius")
				.trim(),
		),
		"0.875rem",
	);
	checks.push("radius updates the document and portals");
	for (const [choice, scale] of [
		["SM", "0.9"],
		["LG", "1.1"],
	]) {
		await choose("Scale", choice);
		assert.equal(
			await page.evaluate(() =>
				getComputedStyle(document.documentElement)
					.getPropertyValue("--saas-admin-scale")
					.trim(),
			),
			scale,
		);
		assert.equal(
			await page.evaluate(
				() => getComputedStyle(document.documentElement).fontSize,
			),
			"16px",
		);
	}
	checks.push("size tokens change without zoom or root font-size changes");
	await select("Font", "System sans-serif");
	assert(
		!(
			await page
				.getByRole("dialog", { name: "Theme Customizer" })
				.evaluate((element) => getComputedStyle(element).fontFamily)
		).includes("SaaS Admin Geist"),
	);
	await select("Theme Preset", "Blue Ink");
	await choose("Color Mode", "Dark");
	assert.equal(
		await page.locator("html").getAttribute("data-saas-admin-brand"),
		"blue-ink",
	);
	assert(
		await page
			.locator("html")
			.evaluate((element) => element.classList.contains("dark")),
	);
	checks.push("font, brand and mode share existing state");
	await choose("Sidebar Mode", "Full");
	assert.equal((await saved()).appearance.sidebarMode, "none");
	await choose("Layout", "Full layout");
	assert.equal(
		await page
			.locator('[data-slot="sidebar"]')
			.getAttribute("data-collapsible"),
		"offcanvas",
	);
	checks.push("full navigation can return to a collapsible layout");
	assert.equal(
		await page.getByPlaceholder("John", { exact: true }).inputValue(),
		"Unsaved appearance draft",
	);
	await page
		.getByRole("button", { name: "Reset appearance", exact: true })
		.click();
	const reset = await saved();
	assert.equal(reset.brand, "default");
	assert.equal(reset.mode, "system");
	assert.equal(reset.appearance.radius, "md");
	assert.equal(reset.appearance.scale, "md");
	assert.equal(reset.appearance.sidebarMode, "icon");
	assert.equal(reset.appearance.sidebarOpen, true);
	assert.equal(
		await page.getByPlaceholder("John", { exact: true }).inputValue(),
		"Unsaved appearance draft",
	);
	assert.equal(
		new URL(page.url()).pathname,
		"/en/sites/saas-admin-site/preview/pages/user-settings",
	);
	checks.push("reset preserves URL and unsaved settings");
	await choose("Sidebar", "Floating");
	await choose("Layout", "Compact");
	await select("Font", "System sans-serif");
	await choose("Scale", "LG");
	await page.reload();
	await page
		.getByRole("heading", { name: "Account & User Management", exact: true })
		.waitFor();
	assert.equal(
		await page.locator('[data-slot="sidebar"]').getAttribute("data-variant"),
		"floating",
	);
	assert.equal(
		await page
			.locator('[data-slot="sidebar"]')
			.getAttribute("data-collapsible"),
		"icon",
	);
	assert.equal((await saved()).appearance.font, "system");
	checks.push("refresh restores persisted appearance");
	const cookies = await context.cookies();
	const ssr = await fetch(
		`${origin}/en/sites/saas-admin-site/preview/pages/user-settings`,
		{
			headers: {
				cookie: cookies
					.map((cookie) => `${cookie.name}=${cookie.value}`)
					.join("; "),
			},
		},
	).then((response) => response.text());
	assert(
		ssr.includes('data-variant="floating"') &&
			ssr.includes('data-collapsible="icon"'),
		"Server renders cookie-owned layout before hydration",
	);
	checks.push("SSR renders saved sidebar configuration");
	await openPanel(page);
	await page.keyboard.press("Escape");
	await page
		.getByRole("dialog", { name: "Theme Customizer", exact: true })
		.waitFor({ state: "hidden" });
	await page.waitForFunction(
		() =>
			document.activeElement?.getAttribute("aria-label") === "Theme Customizer",
	);
	assert(
		await page
			.getByRole("button", { name: "Theme Customizer", exact: true })
			.evaluate((element) => element === document.activeElement),
	);
	checks.push("Escape returns focus to palette trigger");
	const keyboardPanel = await openPanel(page);
	const fontTrigger = keyboardPanel.getByRole("combobox", { name: "Font", exact: true });
	await fontTrigger.focus();
	await page.keyboard.press("Space");
	await page.getByRole("listbox").waitFor();
	await page.keyboard.press("Escape");
	await page.getByRole("listbox").waitFor({ state: "hidden" });
	assert(await keyboardPanel.isVisible(), "Nested Select Escape keeps the customizer open");
	await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "combobox");
	await choose("Color Mode", "Light");
	await keyboardPanel.getByRole("group", { name: "Color Mode", exact: true }).getByRole("button", { name: "Light", exact: true }).focus();
	await page.keyboard.press("ArrowRight");
	await page.keyboard.press("Space");
	await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
	checks.push("Select nested Escape and ToggleGroup keyboard navigation");

	for (const width of [390, 1440]) {
		await page.setViewportSize({ width, height: 900 });
		await openPanel(page);
		for (const mode of ["Light", "Dark"]) {
			await choose("Color Mode", mode);
			// Wait for the consumer's document mode and inherited color transition.
			// Scanning midway through that transition reports a transient contrast pair.
			await page.waitForFunction((dark) => {
				const input = document.querySelector("#email");
				const form = input?.closest("form");
				return document.documentElement.classList.contains("dark") === dark &&
					input && form && getComputedStyle(input).color === getComputedStyle(form).color;
			}, mode === "Dark");
			for (const variant of ["Inset", "Floating", "Sidebar"]) {
				await choose("Sidebar", variant);
				await page.waitForFunction(() => {
					const input = document.querySelector("#email");
					const form = input?.closest("form");
					return input && form && getComputedStyle(input).color === getComputedStyle(form).color;
				});
				// Let next-themes' temporary transition guard and its following paint
				// settle before capturing or running the visual contrast scanner.
				await page.waitForTimeout(300);
				assert(
					await page.evaluate(
						() => document.documentElement.scrollWidth <= innerWidth + 1,
					),
					"No horizontal overflow",
				);
			}
			for (const sidebarMode of ["Default", "Icon", "Full"]) {
				await choose("Sidebar Mode", sidebarMode);
				assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), "Sidebar modes keep the viewport usable");
			}
			const panel = page.getByRole("dialog", { name: "Theme Customizer" });
			const box = await panel.boundingBox();
			assert(
				box &&
					box.x >= 0 &&
					box.x + box.width <= width + 1 &&
					box.y >= 0 &&
					box.y + box.height <= 901,
				"Panel fits viewport",
			);
			await page.screenshot({
				path: join(evidence, `panel-${width}-${mode.toLowerCase()}.png`),
			});
			if (process.env.SAAS_ADMIN_AXE) {
				await page.addScriptTag({
					content: await readFile(process.env.SAAS_ADMIN_AXE, "utf8"),
				});
				const result = await page.evaluate(async () =>
					(
						window as unknown as {
							axe: { run: () => Promise<{ violations: { id: string }[] }> };
						}
					).axe.run(),
				);
				await writeFile(join(evidence, `axe-${width}-${mode.toLowerCase()}.json`), JSON.stringify(result, null, 2));
				assert.equal(
					result.violations.length,
					0,
					JSON.stringify(result.violations),
				);
			}
			checks.push(
				`${width}px ${mode}: all sidebar styles, bounds${process.env.SAAS_ADMIN_AXE ? ", axe" : ""}`,
			);
		}
		await page.keyboard.press("Escape");
		if (width === 390) {
			await page
				.getByRole("button", { name: "Toggle Sidebar", exact: true })
				.click();
			await page
				.getByRole("dialog", { name: "Sidebar", exact: true })
				.waitFor();
			await page.keyboard.press("Escape");
			checks.push("mobile Sheet navigation remains available");
		}
	}
	const isolated = await browser.newContext({ viewport: { width: 390, height: 900 }, reducedMotion: "reduce" });
	await isolated.addInitScript(() => {
		Storage.prototype.getItem = () => { throw new Error("Storage unavailable"); };
		Storage.prototype.setItem = () => { throw new Error("Storage unavailable"); };
	});
	const chinese = await isolated.newPage();
	chinese.on("pageerror", error => errors.push(error.message));
	await chinese.goto(`${origin}/zh/sites/saas-admin-site/preview/dashboard/orders`);
	await chinese.getByRole("button", { name: "主题定制", exact: true }).click();
	const chinesePanel = chinese.getByRole("dialog", { name: "主题定制", exact: true });
	await chinesePanel.getByRole("group", { name: "侧栏", exact: true }).getByRole("button", { name: "悬浮", exact: true }).click();
	await chinesePanel.getByRole("group", { name: "导航布局", exact: true }).getByRole("button", { name: "隐藏侧栏", exact: true }).click();
	assert(await chinese.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
	await chinesePanel.getByRole("group", { name: "导航布局", exact: true }).scrollIntoViewIfNeeded();
	await chinese.screenshot({ path: join(evidence, "panel-390-zh.png") });
	await isolated.close();
	checks.push("Chinese mobile visual cards work without localStorage");
	assert.equal(errors.length, 0, errors.join("\n"));
	passed = true;
	console.log(`PASS ${checks.length} appearance checks. Evidence: ${evidence}`);
} finally {
	await writeFile(
		join(evidence, "result.json"),
		JSON.stringify(
			{ origin, browser: browser.version(), passed, checks, errors },
			null,
			2,
		),
	);
	await browser.close();
}
