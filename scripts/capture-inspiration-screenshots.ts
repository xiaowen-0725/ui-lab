import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { chromium, type Page } from "playwright";
import sharp from "sharp";
import {
	INSPIRATION_BRAND_OFFICIAL_URLS,
	type InspirationAssetKind,
	type InspirationScreenshot,
} from "../lib/inspiration-assets";
import { INSPIRATION_SITES } from "../lib/inspiration-sites";
import { INSPIRATION_SOURCES } from "../lib/inspiration";

const ROOT = path.resolve(import.meta.dir, "..");
const PUBLIC_ROOT = path.join(ROOT, "public");
const MANIFEST_PATH = path.join(
	ROOT,
	"content/inspiration/screenshots-manifest.json",
);
const WIDTH = 1440 as const;
const HEIGHT = 900 as const;
const CAPTURED_AT = new Date().toISOString().slice(0, 10);
const CONCURRENCY = 4;

type Target = {
	key: string;
	kind: "sources" | "sites" | "brands";
	slug: string;
	url: string;
	captureUrl?: string;
	waitMs?: number;
	preferFallback?: boolean;
	reuseKey?: string;
	fallbackImage?: {
		fetchUrl: string;
		sourceUrl: string;
		assetKind: InspirationAssetKind;
	};
};

type Manifest = {
	generatedAt: string;
	viewport: { width: 1440; height: 900 };
	entries: Record<string, InspirationScreenshot>;
	failures?: Record<string, string>;
};

const normalizedUrl = (value: string) =>
	value.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

const siteTargets: Target[] = INSPIRATION_SITES.map((site) => ({
	key: `sites/${site.slug}`,
	kind: "sites",
	slug: site.slug,
	url: site.url,
}));
const sourceTargets: Target[] = INSPIRATION_SOURCES.map((source) => ({
	key: `sources/${source.slug}`,
	kind: "sources",
	slug: source.slug,
	url: source.url,
}));
const siteByUrl = new Map(
	siteTargets.map((target) => [normalizedUrl(target.url), target]),
);
const brandTargets: Target[] = Object.entries(
	INSPIRATION_BRAND_OFFICIAL_URLS,
).map(([slug, url]) => {
	const matchingSite = siteByUrl.get(normalizedUrl(url));
	return {
		key: `brands/${slug}`,
		kind: "brands",
		slug,
		url,
		reuseKey: matchingSite?.key,
	};
});
const overrides: Partial<Record<string, Partial<Target>>> = {
	"sources/behance": { waitMs: 3_000 },
	"sources/dribbble": { waitMs: 3_000 },
	"sources/mobbin": { waitMs: 3_000 },
	"sources/shadcn-studio": { waitMs: 3_000 },
	"sources/react-bits": { waitMs: 3_000 },
	"sources/checklist-design": { waitMs: 2_000 },
	"sources/ogpedia": { captureUrl: "https://ogpedia.xyz/" },
	"sources/page-flows": { waitMs: 3_000 },
	"sources/refero": { waitMs: 3_000 },
	"sites/active-theory": {
		fallbackImage: {
			fetchUrl:
				"https://storage.googleapis.com/activetheory-v6.appspot.com/media/social.jpg",
			sourceUrl:
				"https://storage.googleapis.com/activetheory-v6.appspot.com/media/social.jpg",
			assetKind: "og-image",
		},
	},
	"sites/aman": {
		captureUrl: "https://www.aman.com/resorts/aman-tokyo",
		waitMs: 8_000,
	},
	"sites/mistral-ai": { captureUrl: "https://mistral.ai/news" },
	"brands/dell-1996": {
		captureUrl: undefined,
		fallbackImage: {
			fetchUrl:
				"https://images.weserv.nl/?url=www.webdesignmuseum.org/uploaded/timeline/dell/dell-1996.png",
			sourceUrl:
				"https://www.webdesignmuseum.org/uploaded/timeline/dell/dell-1996.png",
			assetKind: "archival-screenshot",
		},
	},
	"brands/ferrari": {
		captureUrl: "https://www.ferrari.com/en-US/auto",
		waitMs: 5_000,
	},
	"brands/mastercard": { waitMs: 2_000 },
	"brands/mistral.ai": { captureUrl: "https://mistral.ai/news" },
	"brands/nintendo-2001": {
		captureUrl: undefined,
		fallbackImage: {
			fetchUrl:
				"https://images.weserv.nl/?url=www.webdesignmuseum.org/uploaded/timeline/nintendo/nintendo-2001.png",
			sourceUrl:
				"https://www.webdesignmuseum.org/uploaded/timeline/nintendo/nintendo-2001.png",
			assetKind: "archival-screenshot",
		},
	},
	"brands/nvidia": { waitMs: 8_000 },
	"brands/renault": {
		captureUrl: "https://media.renault.com/?lang=eng",
		fallbackImage: {
			fetchUrl:
				"https://assets.renaultgroup.com/uploads/2025/06/Logo-RG-yoast.png",
			sourceUrl:
				"https://assets.renaultgroup.com/uploads/2025/06/Logo-RG-yoast.png",
			assetKind: "og-image",
		},
	},
	"brands/tesla": {
		captureUrl: "https://www.tesla.com/modely",
		preferFallback: true,
		fallbackImage: {
			fetchUrl:
				"https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-2-Hero-Desktop.jpg",
			sourceUrl:
				"https://digitalassets.tesla.com/tesla-contents/image/upload/f_auto,q_auto/Model-Y-2-Hero-Desktop.jpg",
			assetKind: "official-image",
		},
	},
};
for (const target of [...sourceTargets, ...siteTargets, ...brandTargets]) {
	Object.assign(target, overrides[target.key]);
}
const targets = [...sourceTargets, ...siteTargets, ...brandTargets];

async function readManifest(): Promise<Manifest> {
	try {
		return JSON.parse(await readFile(MANIFEST_PATH, "utf8")) as Manifest;
	} catch {
		return {
			generatedAt: new Date().toISOString(),
			viewport: { width: WIDTH, height: HEIGHT },
			entries: {},
		};
	}
}

function publicFile(assetPath: string) {
	return path.join(PUBLIC_ROOT, assetPath.replace(/^\//, ""));
}

async function hasUsableExisting(entry?: InspirationScreenshot) {
	if (!entry) return false;
	try {
		return (await stat(publicFile(entry.path))).size > 20_000;
	} catch {
		return false;
	}
}

async function resolveHistoricalUrl(url: string) {
	if (!url.includes("web.archive.org/web/")) return url;
	const match = url.match(/web\/(\d{4})\/https?:\/\/(?:www\.)?([^/]+)/);
	if (!match) return url;
	const [, year, host] = match;
	const endpoint = new URL("https://web.archive.org/cdx/search/cdx");
	endpoint.searchParams.set("url", host);
	endpoint.searchParams.set("from", year);
	endpoint.searchParams.set("to", year);
	endpoint.searchParams.set("output", "json");
	endpoint.searchParams.set("filter", "statuscode:200");
	endpoint.searchParams.set("filter", "mimetype:text/html");
	endpoint.searchParams.set("fl", "timestamp,original");
	endpoint.searchParams.set("collapse", "digest");
	endpoint.searchParams.set("limit", "1");
	const response = await fetch(endpoint, {
		headers: { "user-agent": "UI-Lab-Inspiration-Capture/1.0" },
	});
	if (!response.ok) throw new Error(`Wayback CDX ${response.status}`);
	const rows = (await response.json()) as string[][];
	if (!rows[1]) throw new Error(`No ${year} Wayback snapshot for ${host}`);
	return `https://web.archive.org/web/${rows[1][0]}id_/${rows[1][1]}`;
}

async function acceptCookies(page: Page) {
	for (const selector of [
		"#onetrust-accept-btn-handler",
		"[data-testid*='accept']",
		".didomi-continue-without-agreeing",
		"[class*='cookie'] [aria-label*='close' i]",
		"[class*='consent'] [aria-label*='close' i]",
	]) {
		const button = page.locator(selector).first();
		if (await button.isVisible({ timeout: 250 }).catch(() => false)) {
			await button.click({ timeout: 1_000 }).catch(() => undefined);
			return;
		}
	}
	for (const label of [
		/^accept$/i,
		/accept all/i,
		/accept cookies/i,
		/allow all/i,
		/i agree/i,
		/^agree$/i,
		/reject all/i,
		/decline/i,
		/continue without accepting/i,
		/同意全部/,
		/接受全部/,
	]) {
		const button = page.getByRole("button", { name: label }).first();
		if (await button.isVisible({ timeout: 350 }).catch(() => false)) {
			await button.click({ timeout: 1_000 }).catch(() => undefined);
			return;
		}
	}
}

async function removeConsentOverlays(page: Page) {
	await page.evaluate(() => {
		const explicitSelectors = [
			"#onetrust-banner-sdk",
			"#didomi-host",
			"[class*='cookie-banner' i]",
			"[class*='cookieBanner' i]",
			"[id*='cookie-banner' i]",
			"[class*='consent-banner' i]",
			"[id*='consent-banner' i]",
		];
		for (const selector of explicitSelectors) {
			for (const element of document.querySelectorAll(selector)) element.remove();
		}
		for (const element of document.body.querySelectorAll("*")) {
			const htmlElement = element as HTMLElement;
			const style = getComputedStyle(htmlElement);
			if (style.position !== "fixed" && style.position !== "sticky") continue;
			const rect = htmlElement.getBoundingClientRect();
			if (rect.width < 220 || rect.height < 70) continue;
			const text = (htmlElement.innerText ?? "").slice(0, 800);
			if (
				/(this (website|site) uses cookies|how we use cookies|cookie preferences|privacy choices|consent preferences|we use cookies|cookies, pixel tags)/i.test(
					text,
				)
			) {
				htmlElement.remove();
			}
		}
	});
}

async function normalizeImage(buffer: Buffer, outputPath: string) {
	await mkdir(path.dirname(outputPath), { recursive: true });
	await sharp(buffer)
		.resize(WIDTH, HEIGHT, { fit: "cover", position: "top" })
		.webp({ quality: 80, effort: 5 })
		.toFile(outputPath);
}

async function auditImage(filePath: string) {
	const file = await stat(filePath);
	const image = sharp(filePath);
	const metadata = await image.metadata();
	const stats = await image.stats();
	const entropy = stats.entropy;
	if (metadata.width !== WIDTH || metadata.height !== HEIGHT) {
		throw new Error(
			`wrong dimensions ${metadata.width ?? "?"}x${metadata.height ?? "?"}`,
		);
	}
	if (file.size < 8_000) throw new Error(`suspiciously small (${file.size} bytes)`);
	if (entropy < 0.08) throw new Error(`low entropy (${entropy.toFixed(3)})`);
	return { bytes: file.size, entropy };
}

async function fallbackFromOg(
	page: Page,
	target: Target,
	outputPath: string,
): Promise<{ sourceUrl: string; assetKind: InspirationAssetKind }> {
	const explicitFallback = target.fallbackImage;
	if (
		explicitFallback &&
		(target.preferFallback ||
			explicitFallback.assetKind === "archival-screenshot")
	) {
		const response = await fetch(explicitFallback.fetchUrl, {
			headers: { "user-agent": "Mozilla/5.0 UI-Lab-Inspiration-Capture/1.0" },
		});
		if (!response.ok) throw new Error(`archive image ${response.status}`);
		await normalizeImage(Buffer.from(await response.arrayBuffer()), outputPath);
		await auditImage(outputPath);
		return {
			sourceUrl: explicitFallback.sourceUrl,
			assetKind: explicitFallback.assetKind,
		};
	}
	const ogUrl = await page
		.locator('meta[property="og:image"], meta[name="twitter:image"]')
		.first()
		.getAttribute("content")
		.catch(() => null);
	const candidates = [ogUrl].filter(
		(value): value is string => Boolean(value),
	);
	for (const candidate of candidates) {
		try {
			const absolute = new URL(candidate, page.url() || target.url).href;
			const response = await fetch(absolute, {
				headers: { "user-agent": "Mozilla/5.0 UI-Lab-Inspiration-Capture/1.0" },
			});
			if (!response.ok) continue;
			await normalizeImage(Buffer.from(await response.arrayBuffer()), outputPath);
			await auditImage(outputPath);
			return {
				sourceUrl: absolute,
				assetKind: "og-image",
			};
		} catch {
			// Try the next explicitly attributed fallback.
		}
	}
	if (target.fallbackImage) {
		const response = await fetch(target.fallbackImage.fetchUrl, {
			headers: { "user-agent": "Mozilla/5.0 UI-Lab-Inspiration-Capture/1.0" },
		});
		if (response.ok) {
			await normalizeImage(
				Buffer.from(await response.arrayBuffer()),
				outputPath,
			);
			await auditImage(outputPath);
			return {
				sourceUrl: target.fallbackImage.sourceUrl,
				assetKind: target.fallbackImage.assetKind,
			};
		}
	}
	throw new Error("no usable screenshot or attributed fallback image");
}

async function captureTarget(page: Page, target: Target) {
	const captureUrl = target.fallbackImage?.assetKind === "archival-screenshot"
		? target.url
		: await resolveHistoricalUrl(target.captureUrl ?? target.url);
	const outputAssetPath = `/inspiration/screenshots/${target.kind}/${target.slug}.webp`;
	const outputPath = publicFile(outputAssetPath);
	let responseStatus = 0;
	let finalUrl = captureUrl;
	let title = "";
	if (
		target.preferFallback ||
		target.fallbackImage?.assetKind === "archival-screenshot"
	) {
		const fallback = await fallbackFromOg(page, target, outputPath);
		return {
			path: outputAssetPath,
			sourceUrl: fallback.sourceUrl,
			finalUrl: target.url,
			capturedAt: CAPTURED_AT,
			width: WIDTH,
			height: HEIGHT,
			status: "fallback" as const,
			assetKind: fallback.assetKind,
			title:
				fallback.assetKind === "archival-screenshot"
					? `${target.slug} historical website archive`
					: `${target.slug} official website image`,
		};
	}
	try {
		const response = await page.goto(captureUrl, {
			waitUntil: "domcontentloaded",
			timeout: 30_000,
		});
		responseStatus = response?.status() ?? 0;
		finalUrl = page.url();
		title = await page.title();
		await page.evaluate(() => document.fonts.ready);
		await page.waitForTimeout(2_500);
		if (target.waitMs) await page.waitForTimeout(target.waitMs);
		await acceptCookies(page);
		await page.waitForTimeout(800);
		await acceptCookies(page);
		await removeConsentOverlays(page);
		await page.waitForTimeout(250);
		const bodyStart = (
			await page.locator("body").innerText({ timeout: 2_000 }).catch(() => "")
		)
			.slice(0, 600)
			.toLowerCase();
		const looksLikeError =
			responseStatus >= 400 ||
			/(access denied|page not found|just a moment|verify you are human|internal server error|captcha)/i.test(
				`${title} ${bodyStart}`,
			);
		if (looksLikeError) {
			throw new Error(`error or challenge page (${responseStatus}: ${title})`);
		}
		const png = await page.screenshot({
			type: "png",
			fullPage: false,
			animations: "disabled",
		});
		await normalizeImage(png, outputPath);
		await auditImage(outputPath);
		return {
			path: outputAssetPath,
			sourceUrl: target.url,
			finalUrl,
			capturedAt: CAPTURED_AT,
			width: WIDTH,
			height: HEIGHT,
			status: "captured" as const,
			assetKind: "screenshot" as const,
			title,
		};
	} catch (captureError) {
		const fallback = await fallbackFromOg(page, target, outputPath);
		return {
			path: outputAssetPath,
			sourceUrl: fallback.sourceUrl,
			finalUrl,
			capturedAt: CAPTURED_AT,
			width: WIDTH,
			height: HEIGHT,
			status: "fallback" as const,
			assetKind: fallback.assetKind,
			title,
			captureError:
				captureError instanceof Error ? captureError.message : String(captureError),
		};
	}
}

async function runPool<T>(
	items: readonly T[],
	worker: (item: T, workerIndex: number) => Promise<void>,
) {
	let cursor = 0;
	await Promise.all(
		Array.from({ length: CONCURRENCY }, async (_, workerIndex) => {
			while (cursor < items.length) {
				const item = items[cursor++];
				if (item) await worker(item, workerIndex);
			}
		}),
	);
}

async function auditOnly(manifest: Manifest) {
	const failures: string[] = [];
	for (const target of targets) {
		const entry = manifest.entries[target.key];
		if (!entry) {
			failures.push(`${target.key}: missing manifest entry`);
			continue;
		}
		try {
			await auditImage(publicFile(entry.path));
		} catch (error) {
			failures.push(
				`${target.key}: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	}
	if (failures.length) throw new Error(failures.join("\n"));
	console.log(`Audited ${targets.length} inspiration assets.`);
}

async function main() {
	const manifest = await readManifest();
	if (process.argv.includes("--audit-only")) {
		await auditOnly(manifest);
		return;
	}

	const browser = await chromium.launch({ channel: "chrome", headless: true });
	const context = await browser.newContext({
		viewport: { width: WIDTH, height: HEIGHT },
		deviceScaleFactor: 1,
		locale: "en-US",
		colorScheme: "light",
		userAgent:
			"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
	});
	const pages = await Promise.all(
		Array.from({ length: CONCURRENCY }, () => context.newPage()),
	);
	const failures: Record<string, string> = {};

	const onlyArgument = process.argv.find((argument) =>
		argument.startsWith("--only="),
	);
	const onlyKeys = new Set(
		onlyArgument?.slice("--only=".length).split(",").filter(Boolean) ?? [],
	);
	const captureTargets = onlyKeys.size
		? targets.filter((target) => onlyKeys.has(target.key))
		: targets;

	await runPool(captureTargets, async (target, workerIndex) => {
		if (target.reuseKey) {
			const reused = manifest.entries[target.reuseKey];
			if (await hasUsableExisting(reused)) {
				manifest.entries[target.key] = {
					...reused,
					sourceUrl: target.url,
				};
				console.log(`reuse ${target.key} <- ${target.reuseKey}`);
				return;
			}
		}
		const existing = manifest.entries[target.key];
		const page = pages[workerIndex];
		if (!page) throw new Error(`Missing browser worker ${workerIndex}`);
		try {
			const result = await captureTarget(page, target);
			const { captureError, ...entry } = result;
			manifest.entries[target.key] = entry;
			if (captureError) failures[target.key] = captureError;
			console.log(
				`${entry.status} ${target.key} (${entry.assetKind}) ${entry.finalUrl}`,
			);
		} catch (error) {
			const reason = error instanceof Error ? error.message : String(error);
			failures[target.key] = reason;
			if (!(await hasUsableExisting(existing))) {
				console.error(`failed ${target.key}: ${reason}`);
			}
		}
	});

	await browser.close();
	manifest.generatedAt = new Date().toISOString();
	manifest.viewport = { width: WIDTH, height: HEIGHT };
	manifest.failures = failures;
	await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
	await auditOnly(manifest);
}

await main();
