// Read-only delivery and browser checks against a running production build.
import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";
import { buildCatalog } from "../lib/catalog";
import { NAV_SPACES } from "../lib/nav";
import { allShadcnTargets } from "../lib/registry-server";
import { THEME_KITS } from "../lib/theme-kits";
import { PAGES } from "../lib/pages";
import { SITES } from "../lib/sites";

const base = process.env.UILAB_SITE_BASE ?? "http://localhost:3000";
const evidence = await mkdtemp(join(tmpdir(), "uilab-catalog-site-"));
await mkdir(join(evidence, "screenshots"));
const results: { path: string; status: number; kind: string }[] = [];
function assert(value: unknown, message: string): asserts value {
  if (!value) throw new Error(`${message}; evidence: ${evidence}`);
}
async function get(path: string, kind = "html") {
  const response = await fetch(`${base}${path}`);
  results.push({ path, status: response.status, kind });
  assert(response.ok, `HTTP ${response.status}: ${path}`);
  const text = await response.text();
  if (kind === "html") assert(text.includes("<html") && !text.includes("NEXT_HTTP_ERROR_FALLBACK;500"), `Invalid page ${path}`);
  return text;
}
async function batch<T>(items: T[], fn: (item: T) => Promise<void>) {
  for (let i = 0; i < items.length; i += 8) await Promise.all(items.slice(i, i + 8).map(fn));
}
try {
  const live = JSON.parse(await get("/catalog.json", "json"));
  const expected = await buildCatalog();
  const snapshot = JSON.parse(await readFile(new URL("../cli/catalog.snapshot.json", import.meta.url), "utf8"));
  assert(JSON.stringify(live.items) === JSON.stringify(expected), "Production Catalog differs from source");
  assert(JSON.stringify(snapshot.items) === JSON.stringify(expected), "CLI snapshot differs from source");
  const targets = allShadcnTargets();
  await batch(targets, async (target) => {
    const item = JSON.parse(await get(`/r/${target.slug}.json`, "json"));
    assert(item.name === target.slug && item.files?.length, `Invalid registry target ${target.slug}`);
    assert(!item.files.some((file: { path: string }) => file.path.startsWith("components/examples/")), `Usage leaked into installation ${target.slug}`);
    const detail = JSON.parse(await get(`/r/${target.slug}`, "json"));
    assert(detail.usage?.path === target.usageFile, `Missing standalone usage ${target.slug}`);
    assert(detail.usage.content === await readFile(target.usageFile as string, "utf8"), `Stale standalone usage ${target.slug}`);
    assert((await get(`/r/${target.slug}/raw`, "text")).length > 50, `Empty raw ${target.slug}`);
  });
  await batch(THEME_KITS, async (kit) => {
    const item = JSON.parse(await get(`/r/theme-${kit.slug}.json`, "json"));
    assert(item.type === "registry:theme" && item.cssVars.light && item.cssVars.dark, `Invalid theme ${kit.slug}`);
    const css = await get(`/themes/${kit.slug}.css`, "css");
    assert(css.includes(":root") && css.includes(".dark"), `Missing dual theme ${kit.slug}`);
  });
  const system = JSON.parse(await get("/r/system-workbench.json", "json"));
  assert(system.type === "registry:lib", "System defaults must preserve consumer theme");
  for (const path of ["/registry.json", "/llms.txt", "/llms-full.txt", "/sitemap.xml", "/robots.txt", "/theme.css"]) await get(path, "machine");
  const sitemap = await get("/sitemap.xml", "xml");
  assert(!sitemap.includes("/r/") && !sitemap.includes("/catalog.json"), "Machine registry indexed as pages");
  for (const page of PAGES) assert(sitemap.includes(page.pagePath), `Missing sitemap page ${page.slug}`);
  for (const site of SITES) assert(sitemap.includes(site.pagePath), `Missing sitemap site ${site.slug}`);
  // Exercise every retained baseline and new visual route, including deep-link syntax.
  const csv = await readFile(new URL("../plans/005-asset-migration-inventory.csv", import.meta.url), "utf8");
  const rows = csv.trim().split(/\r?\n/).map((line) => [...line.matchAll(/"((?:""|[^"])*)"(?:,|$)/g)].map((m) => m[1].replaceAll('""', '"')));
  const header = rows.shift();
  assert(header, "Missing inventory header");
  const routes = new Set<string>([...NAV_SPACES.map((space) => space.href), ...PAGES.map(page => page.pagePath), ...SITES.map(site => site.pagePath), "/themes/blue-ink"]);
  for (const row of rows) for (const field of ["oldRoute", "newRoute"]) {
    const route = row[header.indexOf(field)];
    if (route?.startsWith("/") && !route.startsWith("/r/") && !/\.[a-z]+(?:[?#]|$)/.test(route)) routes.add(route.split("#")[0]);
  }
  await batch([...routes], async (route) => { await get(`${route}?acceptance=005#sample`); await get(`/en${route}?acceptance=005#sample`); });
  const browser = await chromium.launch({ channel: process.env.UILAB_BROWSER_CHANNEL ?? "chrome", headless: true });
  const browserPaths = [...NAV_SPACES.map((space) => space.href), "/pages/saas-landing-page", "/sites/agent-workbench-site", "/themes/graphite", "/themes/blue-ink"];
  const errors: string[] = [];
  const screens: string[] = [];
  try {
    for (const locale of ["zh", "en"]) for (const theme of ["light", "dark"]) for (const width of [390, 768, 1440]) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: "reduce", colorScheme: theme as "light" | "dark", isMobile: width === 390, hasTouch: width === 390 });
      await context.addInitScript((value) => localStorage.setItem("theme", value), theme);
      const page = await context.newPage();
      page.on("pageerror", (error) => errors.push(`${locale}/${theme}/${width}/${page.url()}: ${error.message}`));
      for (const path of browserPaths) {
        await page.goto(`${base}${locale === "en" ? "/en" : ""}${path}`, { waitUntil: "domcontentloaded" });
        await page.locator("h1").first().waitFor({ state: "visible" });
        assert(await page.locator("h1").count(), `Missing heading ${path}`);
        assert(await page.locator("html").getAttribute("lang") === locale, `Lost locale ${path}`);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
        assert(overflow <= 2, `Horizontal overflow ${path}/${locale}/${theme}/${width}: ${overflow}`);
        if (width === 1440) {
          const hrefs = await page.locator("header nav").first().locator("a").evaluateAll((links) => links.map((link) => link.getAttribute("href")));
          for (const space of NAV_SPACES) assert(hrefs.includes(`${locale === "en" ? "/en" : ""}${space.href}`), `Locale header link ${path}/${space.key}`);
        }
        if (["/pages/saas-landing-page", "/sites/agent-workbench-site", "/themes/graphite"].includes(path)) {
          const name = `${locale}-${theme}-${width}-${path.replaceAll("/", "_")}.png`;
          await page.screenshot({ path: join(evidence, "screenshots", name), fullPage: false });
          screens.push(name);
        }
      }
      // The original detail route must remain usable with query/hash unchanged.
      const legacy = `${base}${locale === "en" ? "/en" : ""}/components/blocks/otp-input?acceptance=005#preview`;
      await page.goto(legacy);
      assert(page.url() === legacy, "Legacy deep link lost query/hash");
      await context.close();
    }
    assert(errors.length === 0, `Browser exceptions: ${errors.join("; ")}`);
    await writeFile(join(evidence, "result.json"), JSON.stringify({ base, catalog: live.count, installationTargets: targets.length, retainedVisualRoutes: routes.size, browser: browser.version(), browserScenarios: browserPaths.length * 12, localeThemeViewportCombinations: 12, screenshots: screens, errors, requests: results }, null, 2));
  } finally { await browser.close(); }
  console.log(`PASS Catalog/source/snapshot, ${targets.length} JSON+raw targets, ${routes.size} zh/en routes, ${browserPaths.length * 12} browser scenarios. Evidence: ${evidence}`);
} catch (error) {
  await writeFile(join(evidence, "failure.json"), JSON.stringify({ error: String(error), requests: results }, null, 2));
  throw error;
}
