import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";

const base = process.env.UILAB_SITE_BASE ?? "http://localhost:3000";
const evidence = await mkdtemp(join(tmpdir(), "uilab-deep-links-"));
const csv = await readFile(new URL("../plans/005-asset-migration-inventory.csv", import.meta.url), "utf8");
const rows = csv.trim().split(/\r?\n/).map((line) => [...line.matchAll(/"((?:""|[^"])*)"(?:,|$)/g)].map((m) => m[1].replaceAll('""', '"')));
const header = rows.shift(); assert(header);
const routes = [...new Set(rows.map((row) => row[header.indexOf("oldRoute")]).filter((route) => route?.includes("#")))];
const browser = await chromium.launch({ channel: process.env.UILAB_BROWSER_CHANNEL ?? "chrome", headless: true });
const checks: { locale: string; route: string; anchor: string; visible: boolean }[] = [];
const errors: string[] = [];
try {
  for (const locale of ["zh", "en"]) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
    page.on("pageerror", (error) => errors.push(`${page.url()}: ${error.message}`));
    for (const route of routes) {
      const href = `${base}${locale === "en" ? "/en" : ""}${route}`;
      await page.goto(href, { waitUntil: "domcontentloaded" });
      const anchor = decodeURIComponent(new URL(href).hash.slice(1));
      const target = page.locator(`[id=${JSON.stringify(anchor)}]`);
      await target.waitFor({ state: "visible" });
      assert.equal(page.url(), href, `Lost old query/hash: ${route}`);
      await page.waitForFunction((id) => {
        const el = document.getElementById(id); if (!el) return false;
        const rect = el.getBoundingClientRect(); return rect.bottom > 0 && rect.top < innerHeight;
      }, anchor, { timeout: 5000 });
      checks.push({ locale, route, anchor, visible: true });
    }
    await page.close();
  }
  assert.deepEqual(errors, []);
  await writeFile(join(evidence, "result.json"), JSON.stringify({ base, browser: browser.version(), originalHashedRoutes: routes.length, checks, errors }, null, 2));
  console.log(`PASS ${routes.length} actual historical anchors in zh/en: query/hash and target scrolling. Evidence: ${evidence}`);
} catch (error) { await writeFile(join(evidence, "failure.json"), JSON.stringify({ error: String(error), checks, errors }, null, 2)); throw error; }
finally { await browser.close(); }
