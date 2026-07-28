import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import {
	INSPIRATION_BRANDS,
	INSPIRATION_BRANDS_UPSTREAM,
	INSPIRATION_DOMAIN_META,
	INSPIRATION_SITES,
	INSPIRATION_SOURCES,
	INSPIRATION_THEMES,
} from "@/lib/inspiration";

describe("inspiration sources", () => {
	test("ships the 21 reviewed sources", () => {
		expect(INSPIRATION_SOURCES).toHaveLength(21);
		expect(INSPIRATION_SOURCES.map((source) => source.slug)).toEqual(
			expect.arrayContaining([
				"dribbble",
				"behance",
				"awwwards",
				"siteinspire",
				"land-book",
				"lapa-ninja",
				"one-page-love",
				"css-design-awards",
				"mobbin",
				"page-flows",
				"refero",
				"saasframe",
			]),
		);
		expect(
			INSPIRATION_SOURCES.some((source) => source.access === "freemium"),
		).toBe(true);
		expect(
			INSPIRATION_SOURCES.some((source) => source.access === "paid"),
		).toBe(true);
	});

	test("keeps slugs and canonical URLs unique", () => {
		const slugs = INSPIRATION_SOURCES.map((source) => source.slug);
		const canonicalUrls = INSPIRATION_SOURCES.map(
			(source) => source.canonicalUrl,
		);

		expect(new Set(slugs).size).toBe(slugs.length);
		expect(new Set(canonicalUrls).size).toBe(canonicalUrls.length);
	});

	test("uses known primary themes and external-only rights", () => {
		const themeKeys = new Set(INSPIRATION_THEMES.map((theme) => theme.key));

		for (const source of INSPIRATION_SOURCES) {
			expect(themeKeys.has(source.primaryTheme)).toBe(true);
			expect(source.entryKind).toBe("source");
			expect(source.rightsStatus).toBe("external-only");
		}
	});

	test("records a real attributed preview for every source", async () => {
		for (const source of INSPIRATION_SOURCES) {
			expect(source.screenshot.path).toBe(
				`/inspiration/screenshots/sources/${source.slug}.webp`,
			);
			expect(source.screenshot.sourceUrl).toBeTruthy();
			expect(source.screenshot.finalUrl).toBeTruthy();
			expect(source.screenshot.capturedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
			expect(
				["screenshot", "og-image", "official-image"].includes(
					source.screenshot.assetKind,
				),
			).toBe(true);

			const imagePath = path.join("public", source.screenshot.path);
			const metadata = await sharp(imagePath).metadata();
			expect(metadata.width).toBe(1440);
			expect(metadata.height).toBe(900);
		}
	});
});

describe("inspiration brand references", () => {
	test("pins the reviewed upstream revision and all 74 documents", () => {
		expect(INSPIRATION_BRANDS_UPSTREAM.commit).toBe(
			"664b3e78fd1a298ba11973822da988483256d4b4",
		);
		expect(INSPIRATION_BRANDS).toHaveLength(74);
	});

	test("keeps manifest identifiers and document hashes unique", () => {
		const slugs = INSPIRATION_BRANDS.map((brand) => brand.slug);
		const paths = INSPIRATION_BRANDS.map((brand) => brand.documentPath);
		const hashes = INSPIRATION_BRANDS.map((brand) => brand.documentSha256);

		expect(new Set(slugs).size).toBe(slugs.length);
		expect(new Set(paths).size).toBe(paths.length);
		expect(new Set(hashes).size).toBe(hashes.length);
	});

	test("matches every vendored document to its recorded sha256", async () => {
		for (const brand of INSPIRATION_BRANDS) {
			const document = await readFile(brand.documentPath);
			const sha256 = createHash("sha256").update(document).digest("hex");
			expect(sha256).toBe(brand.documentSha256);
		}
	});

	test("preserves the upstream parser and metadata provenance split", () => {
		expect(
			INSPIRATION_BRANDS.filter((brand) => brand.parserMode === "yaml"),
		).toHaveLength(64);
		expect(
			INSPIRATION_BRANDS.filter((brand) => brand.parserMode === "markdown"),
		).toHaveLength(10);
		expect(
			INSPIRATION_BRANDS.filter(
				(brand) => brand.metadataSource === "upstream-readme",
			),
		).toHaveLength(73);
		expect(
			INSPIRATION_BRANDS.filter(
				(brand) => brand.metadataSource === "design-document",
			),
		).toHaveLength(1);
		const slack = INSPIRATION_BRANDS.find((brand) => brand.slug === "slack");
		expect(slack?.metadataSource).toBe("design-document");
		expect(slack?.description).toBe(
			"Team communication platform with a deep aubergine foundation, clean white surfaces, soft cream-lavender gradients, and restrained multicolor accents.",
		);
		expect(slack?.descriptionZh).toBe(
			"团队沟通平台，以深茄紫为基底，搭配清爽白色表面、柔和的奶油薰衣草渐变与克制的多彩点缀。",
		);
	});

	test("uses known domains and keeps document and brand rights separate", () => {
		const domainKeys = new Set(INSPIRATION_DOMAIN_META.map((domain) => domain.key));
		expect(INSPIRATION_DOMAIN_META).toHaveLength(18);

		for (const brand of INSPIRATION_BRANDS) {
			expect(domainKeys.has(brand.domain)).toBe(true);
			expect(brand.documentLicense).toBe("MIT");
			expect(brand.brandAssetRights).toBe("external-owner");
		}
	});

	test("records an official URL and a real attributed image for every brand", async () => {
		for (const brand of INSPIRATION_BRANDS) {
			expect(new URL(brand.officialUrl).protocol).toBe("https:");
			expect(brand.screenshot.sourceUrl).toStartWith("https://");
			const metadata = await sharp(
				path.join("public", brand.screenshot.path),
			).metadata();
			expect(metadata.width).toBe(1440);
			expect(metadata.height).toBe(900);
		}
	});
});

describe("inspiration sites", () => {
	test("ships 26 unique accepted external website references", async () => {
		expect(INSPIRATION_SITES).toHaveLength(26);
		expect(new Set(INSPIRATION_SITES.map((site) => site.slug)).size).toBe(26);
		expect(new Set(INSPIRATION_SITES.map((site) => site.canonicalUrl)).size).toBe(26);
		for (const site of INSPIRATION_SITES) {
			expect(site.entryKind).toBe("site");
			expect(site.rightsStatus).toBe("external-only");
			expect(site.verdict).toBe("accept");
			expect(site.provenance[0]?.kind).toBe("first-party");
			expect(INSPIRATION_DOMAIN_META.some((domain) => domain.key === site.domain)).toBe(true);
			expect(site.screenshot.sourceUrl).toStartWith("https://");
			const metadata = await sharp(
				path.join("public", site.screenshot.path),
			).metadata();
			expect(metadata.width).toBe(1440);
			expect(metadata.height).toBe(900);
		}
	});

	test("keeps related brand links and retro collections precise", () => {
		for (const site of INSPIRATION_SITES) {
			if (site.relatedBrandSlug) expect(INSPIRATION_BRANDS.some((brand) => brand.slug === site.relatedBrandSlug)).toBe(true);
		}
		const retro = INSPIRATION_BRANDS.filter((brand) => brand.collections.includes("retro-web")).map((brand) => brand.slug);
		expect(retro).toEqual(["dell-1996", "nintendo-2001"]);
		expect(INSPIRATION_BRANDS.find((brand) => brand.slug === "clay")?.domain).toBe("productivity-saas");
		expect(INSPIRATION_BRANDS.find((brand) => brand.slug === "spacex")?.domain).toBe("aerospace-industrial");
	});
});
