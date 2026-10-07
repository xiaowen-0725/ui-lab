import { expect, test } from "bun:test";
import { buildCatalog } from "../lib/catalog";
import { allShadcnTargets, buildShadcnItem } from "../lib/registry-server";
import { allStandaloneUsages, type StandaloneUsage } from "../lib/standalone-usage";
import { selectConsumerUsages } from "../scripts/application-consumer-usage";

const usage = (installSlug: string, sourceFile = `${installSlug}.tsx`): StandaloneUsage => ({
  key: installSlug, installSlug, sourceFile, category: "test", usageFile: `components/examples/${installSlug}.tsx`,
});

test("available registry graphs and stray files do not count as installed assets", () => {
  const graphs = new Map([
    ["page", ["page.tsx", "section.tsx", "utils.ts"]],
    ["section", ["section.tsx", "utils.ts"]],
    ["other-recipe-asset", ["other-recipe-asset.tsx", "utils.ts"]],
  ]);
  const result = selectConsumerUsages(
    [usage("page"), usage("section"), usage("other-recipe-asset")], graphs, ["page"],
    ["page.tsx", "section.tsx", "utils.ts", "other-recipe-asset.tsx"],
  );
  expect(result.selected.map((item) => [item.key, item.reason])).toEqual([
    ["page", "installed-asset"], ["section", "installed-graph-subset"],
  ]);
  expect(result.excluded[0].reason).toBe("outside-installed-graph");
  expect(result.excluded[0].missingGraphFiles).toEqual(["other-recipe-asset.tsx"]);
  expect(result.installedGraph).not.toContain("other-recipe-asset.tsx");
});

test("an installed entry is insufficient when a required helper is absent", () => {
  const result = selectConsumerUsages([usage("page")], new Map([["page", ["page.tsx", "utils.ts"]]]), ["page"], ["page.tsx"]);
  expect(result.selected).toHaveLength(0);
  expect(result.excluded[0].reason).toBe("missing-installed-files");
  expect(result.excluded[0].missingInstalledFiles).toEqual(["utils.ts"]);
});

test("a narrow base install excludes the parent and its uninstalled variants", () => {
  const graphs = new Map([
    ["button-base", ["base.tsx", "utils.ts"]],
    ["button", ["index.tsx", "base.tsx", "metallic.tsx", "utils.ts"]],
  ]);
  const variant = { ...usage("button", "metallic.tsx"), key: "button-metallic" };
  const result = selectConsumerUsages([usage("button-base", "base.tsx"), usage("button", "index.tsx"), variant], graphs, ["button-base"], ["base.tsx", "utils.ts"]);
  expect(result.selected.map((item) => item.key)).toEqual(["button-base"]);
  expect(result.excluded.map((item) => item.key)).toEqual(["button", "button-metallic"]);
});

test("missing candidate graphs are excluded and missing installed graphs fail explicitly", () => {
  const result = selectConsumerUsages([usage("unknown")], new Map(), [], []);
  expect(result.excluded[0].reason).toBe("missing-required-graph");
  expect(() => selectConsumerUsages([], new Map(), ["unknown"], [])).toThrow("Missing installed graph: unknown");
});

test("the actual benchmark installation retains all 24 original section/page/site usages", async () => {
  const legacyFiles = [
    ...[
      "cta-banner", "cta-boxed", "faq-accordion", "faq-two-column", "features-alternating", "features-grid",
      "footer-columns", "footer-minimal", "hero-centered", "hero-screenshot", "hero-split", "logo-wall-row",
      "navbar-centered", "navbar-simple", "pricing-simple", "pricing-tiers", "stats-row", "testimonials-cards", "testimonials-quote",
    ].map((slug) => `components/examples/sections/${slug}.example.tsx`),
    ...["saas-landing-page", "workbench-artifact-page", "workbench-conversation-page", "workbench-settings-page"]
      .map((slug) => `components/examples/pages/${slug}.example.tsx`),
    "components/examples/sites/agent-workbench-site.example.tsx",
  ];
  expect(legacyFiles).toHaveLength(24);
  const catalog = await buildCatalog();
  const recipe = catalog.find((item) => item.kind === "recipe" && item.slug === "agent-workbench");
  expect(recipe).toBeDefined();
  const installedAssets = [...new Set([
    "button", "button-base", "saas-landing-page", "workbench-conversation-page", "workbench-artifact-page",
    "workbench-settings-page", "agent-workbench-site", ...(recipe?.components ?? []),
  ])];
  const usages = allStandaloneUsages();
  const targets = allShadcnTargets();
  const graphs = new Map<string, string[]>();
  for (const target of targets) {
    const item = await buildShadcnItem(target.categorySlug, target.slug);
    if (!item) throw new Error(`Missing target ${target.slug}`);
    graphs.set(target.slug, (item.files ?? []).map((file) => file.path));
  }
  const files = installedAssets.flatMap((slug) => graphs.get(slug) ?? []);
  const result = selectConsumerUsages(usages, graphs, installedAssets, files);
  const copied = new Set(result.selected.map((item) => item.usageFile));
  for (const path of legacyFiles) expect(copied.has(path), path).toBe(true);
  expect(result.selected.some((item) => item.category === "sections" && item.reason === "installed-graph-subset")).toBe(true);
  expect(result.excluded.length).toBeGreaterThan(0);
  expect(result.selected.every((item) => item.missingGraphFiles.length === 0 && item.missingInstalledFiles.length === 0)).toBe(true);
});
