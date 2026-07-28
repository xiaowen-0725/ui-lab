import { describe, expect, test } from "bun:test";
import { buildShadcnItem } from "@/lib/registry-server";
import { WB_TOKEN_COUNT } from "@/lib/registry-wb-tokens";

describe("registry workbench token distribution", () => {
  test("ships the full token contract with settings-panel only when listed", async () => {
    const settings = await buildShadcnItem("blocks", "settings-panel", {
      includeContent: false,
    });
    if (!settings) throw new Error("settings-panel registry item is missing");

    expect(Object.keys(settings.cssVars?.light ?? {})).toHaveLength(
      WB_TOKEN_COUNT,
    );
    expect(Object.keys(settings.cssVars?.dark ?? {})).toHaveLength(
      WB_TOKEN_COUNT,
    );
    expect(settings.cssVars?.light?.["wb-overlay-scrim"]).toBe(
      "rgb(0 0 0 / 0.06)",
    );
    expect(settings.cssVars?.dark?.["wb-overlay-scrim"]).toBe(
      "rgb(0 0 0 / 0.24)",
    );

    const unrelated = await buildShadcnItem("blocks", "login-card", {
      includeContent: false,
    });
    if (!unrelated) throw new Error("login-card registry item is missing");
    expect(unrelated.cssVars).toBeUndefined();
  });
});
