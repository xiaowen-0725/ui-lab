import { describe, expect, test } from "bun:test";
import { buildCatalog } from "@/lib/catalog";
import { allShadcnTargets, buildShadcnItem } from "@/lib/registry-server";
import { catalogContractHash } from "../cli/src/project-lock";

describe("Catalog installation contract", () => {
  test("display families and every variant are installable without duplicate identities", async () => {
    const targets = allShadcnTargets();
    expect(new Set(targets.map((target) => target.slug)).size).toBe(targets.length);
    for (const slug of ["button", "text-animation", "number", "action-swap", "scroll-animation", "not-found", "empty-state"]) {
      const target = targets.find((item) => item.slug === slug);
      expect(target, slug).toBeDefined();
      if (!target) throw new Error(slug);
      expect(await buildShadcnItem(target.categorySlug, slug), slug).not.toBeNull();
    }
    const catalog = await buildCatalog();
    const base = catalog.find((item) => item.kind === "component" && item.slug === "button-base");
    expect(base).toBeDefined();
    expect(base?.fetch.command).toContain("/r/button-base.json");
  });
  test("owned family and mandatory installation closure are separate", async () => {
    const catalog = await buildCatalog();
    const button = catalog.find((item) => item.kind === "component" && item.slug === "button-base");
    expect(button?.sourceFiles).toEqual(["components/motion/button/base.tsx"]);
    expect(button?.installationFiles).toContain("lib/utils.ts");
    expect(button?.installationFiles).toContain("lib/ease.ts");
    expect(button?.installationFiles).not.toContain("components/motion/button/metallic.tsx");
    expect(button?.assetRole).toBe("component");
    expect(button?.sourceVersion).toMatch(/^[a-f0-9]{64}$/);
    if (!button) throw new Error("missing variant");
    expect(catalogContractHash({ ...button, sourceVersion: "0".repeat(64) })).not.toBe(catalogContractHash(button));
  });
});
