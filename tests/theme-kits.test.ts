import { describe, expect, test } from "bun:test";
import { contrastRatio, parseHexColor } from "@/lib/color";
import { findThemeKit, THEME_KITS, themeKitToCss } from "@/lib/theme-kits";
import { hexToOklch, oklchToHex } from "@/lib/theme-kits/oklch";
import { BASE_DARK, BASE_LIGHT } from "@/lib/themes";

const REQUIRED_SHADCN_KEYS = [
  "background",
  "foreground",
  "card",
  "primary",
  "accent",
  "border",
  "ring",
  "destructive",
];

describe("theme kits", () => {
  test("produces exactly 19 kits with unique slugs", () => {
    expect(THEME_KITS.length).toBe(19);
    const slugs = THEME_KITS.map((kit) => kit.slug);
    expect(new Set(slugs).size).toBe(19);
  });

  test("every kit has a complete token set for each of its modes", () => {
    for (const kit of THEME_KITS) {
      for (const mode of kit.modes) {
        const tokenSet = mode === "light" ? kit.light : kit.dark;
        expect(tokenSet).toBeDefined();
        if (!tokenSet) continue;
        expect(Object.keys(tokenSet.wb).length).toBe(42);
        expect(Object.keys(tokenSet.charts).length).toBe(6);
        for (const key of REQUIRED_SHADCN_KEYS) {
          expect(typeof tokenSet.shadcn[key]).toBe("string");
          expect(tokenSet.shadcn[key].length).toBeGreaterThan(0);
        }
      }
    }
  });

  test("single-mode kits render the same --wb-accent value in :root and .dark", () => {
    const singleModeKits = THEME_KITS.filter((kit) => kit.modes.length === 1);
    expect(singleModeKits.length).toBeGreaterThan(0);
    for (const kit of singleModeKits) {
      const css = themeKitToCss(kit);
      const rootBlock = css.match(/:root \{([\s\S]*?)\}/)?.[1] ?? "";
      const darkBlock = css.match(/\.dark \{([\s\S]*?)\}/)?.[1] ?? "";
      const rootAccent = rootBlock.match(/--wb-accent: (.+);/)?.[1];
      const darkAccent = darkBlock.match(/--wb-accent: (.+);/)?.[1];
      expect(rootAccent).toBeDefined();
      expect(rootAccent).toBe(darkAccent);
    }
  });

  test("chart colors sit in the documented lightness band and stay in gamut", () => {
    for (const kit of THEME_KITS) {
      for (const mode of kit.modes) {
        const tokenSet = mode === "light" ? kit.light : kit.dark;
        if (!tokenSet) continue;
        const [minL, maxL] = mode === "light" ? [0.5, 0.72] : [0.5, 0.66];
        for (const value of Object.values(tokenSet.charts)) {
          expect(value).toMatch(/^oklch\(/);
          const match = value.match(/^oklch\(([\d.]+) [\d.]+ [\d.]+\)$/);
          expect(match).not.toBeNull();
          const l = Number.parseFloat(match?.[1] ?? "NaN");
          expect(l).toBeGreaterThanOrEqual(minL - 0.001);
          expect(l).toBeLessThanOrEqual(maxL + 0.001);
        }
      }
    }
  });

  test("chart colors contrast at least 2:1 against the kit's background, where resolvable", () => {
    let checked = 0;
    for (const kit of THEME_KITS) {
      for (const mode of kit.modes) {
        const tokenSet = mode === "light" ? kit.light : kit.dark;
        if (!tokenSet) continue;
        const bg = tokenSet.shadcn.background;
        let bgHex: string | null = null;
        if (parseHexColor(bg)) {
          bgHex = bg;
        } else {
          const parsed = hexToOklch(bg);
          if (parsed) bgHex = oklchToHex(parsed.l, parsed.c, parsed.h ?? 0);
        }
        if (!bgHex) {
          // e.g. frost's translucent `rgba(...)` canvas has no fixed backing
          // color to contrast against — nothing to resolve, skip this kit/mode.
          continue;
        }
        for (const value of Object.values(tokenSet.charts)) {
          const match = value.match(/^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/);
          if (!match) continue;
          const [, lRaw, cRaw, hRaw] = match;
          const chartHex = oklchToHex(
            Number.parseFloat(lRaw),
            Number.parseFloat(cRaw),
            Number.parseFloat(hRaw),
          );
          expect(contrastRatio(chartHex, bgHex)).toBeGreaterThanOrEqual(2);
          checked += 1;
        }
      }
    }
    expect(checked).toBeGreaterThan(0);
  });

  test("graphite's shadcn tokens equal BASE_LIGHT/BASE_DARK verbatim", () => {
    const graphiteKit = THEME_KITS.find((kit) => kit.slug === "graphite");
    if (!graphiteKit?.light || !graphiteKit?.dark) {
      throw new Error("expected the graphite kit to have both token sets");
    }
    for (const [key, value] of Object.entries(BASE_LIGHT)) {
      expect(graphiteKit.light.shadcn[key.replace(/^--/, "")]).toBe(value);
    }
    for (const [key, value] of Object.entries(BASE_DARK)) {
      expect(graphiteKit.dark.shadcn[key.replace(/^--/, "")]).toBe(value);
    }
  });

  test("graphite's rendered CSS includes the expected token families", () => {
    const graphiteKit = THEME_KITS.find((kit) => kit.slug === "graphite");
    if (!graphiteKit) throw new Error("expected the graphite kit to exist");
    const css = themeKitToCss(graphiteKit);
    for (const needle of ["--wb-accent", "--chart-6", "--ease-out", "--radius", ".dark {"]) {
      expect(css).toContain(needle);
    }
  });

  test("codex desktop v1 pins the calibrated dual-mode system-preset tokens", () => {
    const kit = findThemeKit("codex-desktop-v1");
    if (!kit?.light || !kit.dark) {
      throw new Error("expected the Codex Desktop v1 kit to have both token sets");
    }

    expect(kit.source).toBe("system-preset");
    expect(kit.modes).toEqual(["light", "dark"]);
    expect(Object.keys(kit.light.wb)).toHaveLength(42);
    expect(Object.keys(kit.dark.wb)).toHaveLength(42);
    expect(Object.keys(kit.light.charts)).toHaveLength(6);
    expect(Object.keys(kit.dark.charts)).toHaveLength(6);

    expect(kit.fonts).toEqual({
      body: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      display: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      mono: 'ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
    });
    expect(kit.statics["font-sans"]).toBe(kit.fonts.body);
    expect(kit.statics["font-display"]).toBe(kit.fonts.display);
    expect(kit.statics["font-mono"]).toBe(kit.fonts.mono);

    expect(kit.light.shadcn).toMatchObject({
      background: "#fff",
      foreground: "#181818",
      primary: "#303030",
      accent: "#e5f3ff",
      border: "rgb(0 0 0 / 0.08)",
      ring: "#339cff",
    });
    expect(kit.dark.shadcn).toMatchObject({
      background: "#181818",
      foreground: "#f3f3f3",
      primary: "#f3f3f3",
      accent: "color-mix(in srgb, #339cff 18%, #212121)",
      border: "rgb(255 255 255 / 0.08)",
      ring: "#339cff",
    });
    expect(kit.light.wb).toMatchObject({
      "wb-surface": "#fff",
      "wb-surface-translucent": "rgb(249 249 249 / 0.82)",
      "wb-inset-strong": "rgb(0 0 0 / 0.05)",
      "wb-border": "rgb(0 0 0 / 0.08)",
      "wb-accent": "#339cff",
    });
    expect(kit.dark.wb).toMatchObject({
      "wb-surface": "#181818",
      "wb-surface-translucent": "rgb(24 24 24 / 0.82)",
      "wb-inset-strong": "rgb(255 255 255 / 0.08)",
      "wb-border": "rgb(255 255 255 / 0.08)",
      "wb-accent": "#339cff",
    });

    expect(kit.statics).toMatchObject({
      radius: "10px",
      "radius-hairline": "2px",
      "radius-panel": "12px",
      "text-display": "24px",
      "text-headline": "18px",
      "text-title": "16px",
      "text-body": "14px",
      "text-body-sm": "12px",
      "text-caption": "11px",
      space: "8px",
      "space-row": "32px",
      "space-padding": "8px",
      "ease-out": "cubic-bezier(.19, 1, .22, 1)",
      "ease-swift-out": "cubic-bezier(.19, 1, .22, 1)",
      "ease-in-out": "cubic-bezier(.23, 1, .32, 1)",
      "ease-snappy": "cubic-bezier(.23, 1, .32, 1)",
      "ease-duration-quick": "150ms",
      "ease-duration-standard": "150ms",
      "ease-duration-deliberate": "300ms",
    });

    const shadows = {
      "shadow-hairline": "0px 0px 0px .5px #0000001a",
      "shadow-sm": "0px 1px 2px -1px #00000014",
      "shadow-md": "0px 2px 4px -1px #00000014",
      "shadow-lg": "0px 4px 8px -2px #0000001a",
      "shadow-xl": "0px 8px 16px -4px #0000001f",
      "shadow-2xl": "0px 16px 32px -8px #00000030",
      "shadow-raised": "0px 1px 2px -1px #00000014",
      "shadow-floating": "0px 4px 8px -2px #0000001a",
      shadow: "0px 1px 2px -1px #00000014",
    };
    expect(kit.light.extra).toMatchObject(shadows);
    expect(kit.dark.extra).toMatchObject(shadows);
  });
});
