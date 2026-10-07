import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { allComponents } from "../lib/registry";
import { allShadcnTargets, buildEntry, buildShadcnItem } from "../lib/registry-server";
import { allStandaloneUsages } from "../lib/standalone-usage";

test("every family and displayed variant declares a real standalone usage", () => {
  const usages = allStandaloneUsages();
  expect(new Set(usages.map((usage) => usage.key)).size).toBe(usages.length);
  for (const entry of allComponents()) {
    expect(entry.usageFile, entry.slug).toBeTruthy();
    expect(readFileSync(entry.usageFile as string, "utf8"), entry.slug).toContain("export function");
    for (const variant of entry.examples ?? []) {
      expect(variant.usageFile, `${entry.slug}/${variant.slug}`).toBeTruthy();
      const key = variant.installSlug ?? `${entry.slug}-${variant.slug}`;
      expect(usages.find((usage) => usage.key === key)?.usageFile).toBe(variant.usageFile);
    }
  }
});

test("machine detail delivers copyable usage while installation remains implementation-only", async () => {
  for (const target of allShadcnTargets()) {
    const entry = await buildEntry(target.categorySlug, target.slug);
    expect(entry?.usage?.path, target.slug).toBe(target.usageFile);
    expect(entry?.usage?.content, target.slug).toBe(readFileSync(target.usageFile as string, "utf8"));
    const item = await buildShadcnItem(target.categorySlug, target.slug);
    expect(item?.files?.some((file) => file.path.startsWith("components/examples/")), target.slug).toBe(false);
  }
});

test("base variants retain their own source entry and narrow copyable usage", async () => {
  const base = await buildEntry("motion", "button-base");
  expect(base?.usage?.content).toContain('from "@/components/motion/button/base"');
  expect(base?.usage?.content).not.toContain('from "@/components/motion/button"');
  const install = await buildShadcnItem("motion", "button-base");
  expect(install?.files?.some((file) => file.path === "components/motion/button/index.tsx")).toBe(false);
});
