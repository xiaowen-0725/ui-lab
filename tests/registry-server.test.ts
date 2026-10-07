import { describe, expect, test } from "bun:test";
import { buildShadcnItem, buildWorkbenchSystemItem } from "@/lib/registry-server";
import { WB_TOKEN_COUNT, WORKBENCH_SYSTEM_SLUG } from "@/lib/registry-wb-tokens";
import { SITE_URL } from "@/lib/site";

describe("registry workbench token distribution", () => {
  test("workbench components depend on one token system and do not copy cssVars", async () => {
    const system = buildWorkbenchSystemItem();
    expect(system.name).toBe(WORKBENCH_SYSTEM_SLUG);
    expect(system.type).toBe("registry:lib");
    expect(Object.keys(system.cssVars?.light ?? {})).toHaveLength(WB_TOKEN_COUNT);
    expect(Object.keys(system.cssVars?.dark ?? {})).toHaveLength(WB_TOKEN_COUNT);
    expect(system.cssVars?.light?.["wb-overlay-scrim"]).toBe("rgb(0 0 0 / 0.06)");
    expect(system.cssVars?.dark?.["wb-overlay-scrim"]).toBe("rgb(0 0 0 / 0.24)");

    const settings = await buildShadcnItem("blocks", "settings-panel", {
      includeContent: false,
    });
    if (!settings) throw new Error("settings-panel registry item is missing");
    expect(settings.cssVars).toBeUndefined();
    expect(settings.registryDependencies).toEqual([
      `${SITE_URL}/r/${WORKBENCH_SYSTEM_SLUG}.json`,
    ]);

    const unrelated = await buildShadcnItem("blocks", "login-card", {
      includeContent: false,
    });
    if (!unrelated) throw new Error("login-card registry item is missing");
    expect(unrelated.cssVars).toBeUndefined();
    expect(unrelated.registryDependencies).toEqual([]);
  });
});
