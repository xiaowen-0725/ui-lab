import { expect, test } from "bun:test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildCatalog } from "@/lib/catalog";
import { CONCEPTS } from "@/lib/concepts";
import { MOTIONS } from "@/lib/motions";
import { INSPIRATION_BRANDS, INSPIRATION_SITES, INSPIRATION_SOURCES } from "@/lib/inspiration";
import { SECTION_ASSETS } from "@/lib/section-assets";
import { allComponents } from "@/lib/registry";
import { allShadcnTargets, buildShadcnItem } from "@/lib/registry-server";
import { THEME_KITS } from "@/lib/theme-kits";
import { validateCatalog } from "../cli/src/catalog-source";

const root = resolve(import.meta.dir, "..");

test("every baseline record and expanded variant has a real source and machine identity", async () => {
  const catalog = await buildCatalog();
  const identities = new Set(catalog.map((item) => `${item.kind}/${item.slug}`));
  const csv = readFileSync(resolve(root, "plans/005-asset-migration-inventory.csv"), "utf8");
  const cells = csv.trim().split(/\r?\n/).map((line) => [...line.matchAll(/"((?:""|[^"])*)"(?:,|$)/g)].map((match) => match[1].replaceAll('""', '"')));
  const header = cells.shift();
  if (!header) throw new Error("Missing inventory header");
  const records = cells.map((row) => Object.fromEntries(header.map((name, index) => [name, row[index]])));
  expect(records).toHaveLength(649);
  expect(new Set(records.map((row) => row.id)).size).toBe(649);
  expect(records.slice(0, 595).every((row) => !row.id.startsWith("new-registry/") && !row.id.startsWith("install-variant/"))).toBe(true);
  for (const row of records) {
    expect(row.role, row.id).toBeTruthy();
    expect(row.reason, row.id).toBeTruthy();
    expect(row.rollback, row.id).toBeTruthy();
    expect(row.status, row.id).not.toBe("待实施");
    for (const file of [row.data, row.source, row.newSource].filter(Boolean)) expect(existsSync(resolve(root, file)), `${row.id}: ${file}`).toBe(true);
    if (row.catalogIdentity) expect(identities.has(row.catalogIdentity), row.id).toBe(true);
    else expect(["layout", "system"]).toContain(row.type);
  }
});

test("all knowledge and references project from their domain truths without fake installs", async () => {
  const catalog = await buildCatalog();
  validateCatalog({ count: catalog.length, items: catalog });
  expect(catalog.filter((item) => item.category === "concept")).toHaveLength(CONCEPTS.length);
  expect(catalog.filter((item) => item.kind === "vocabulary" && item.category === "motion")).toHaveLength(MOTIONS.length);
  const references = catalog.filter((item) => item.kind === "reference");
  expect(references).toHaveLength(INSPIRATION_SOURCES.length + INSPIRATION_SITES.length + INSPIRATION_BRANDS.length);
  expect(references.every((item) => item.reference?.rightsStatus && item.reference.provenance.length && !item.fetch.command)).toBe(true);
  for (const kit of THEME_KITS) expect(catalog.find((item) => item.kind === "design-system" && item.slug === kit.slug)?.pageUrl).toEndWith(`/themes/${kit.slug}`);
  for (const asset of SECTION_ASSETS) expect(catalog.find((item) => item.kind === "component" && item.slug === asset.slug)?.section).toEqual({ slug: asset.sectionSlug, variant: asset.variantKey });
});

test("every emitted installation command and standalone usage resolves to real distribution", async () => {
  const catalog = await buildCatalog();
  for (const target of allShadcnTargets()) {
    const item = await buildShadcnItem(target.categorySlug, target.slug);
    expect(item?.files?.length, target.slug).toBeGreaterThan(0);
    expect(catalog.find((item) => item.kind === "component" && item.slug === target.slug)?.fetch.command).toEndWith(`/r/${target.slug}.json`);
  }
  for (const entry of allComponents().filter((entry) => entry.usageFile)) {
    const source = readFileSync(resolve(root, entry.usageFile as string), "utf8");
    expect(source).not.toContain("next-intl");
    expect(source).not.toContain("components/previews");
    expect(source).not.toContain("ApplicationPreviewControls");
    const item = catalog.find((item) => item.kind === "component" && item.slug === entry.slug);
    expect(source).toContain(`@/${item?.sourceFile?.replace(/\.tsx$/, "")}`);
  }
});
