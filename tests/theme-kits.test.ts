import { describe, expect, test } from "bun:test";
import { contrastRatio, parseHexColor } from "@/lib/color";
import { THEME_KITS, themeKitToCss } from "@/lib/theme-kits";
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
  test("produces exactly 18 kits with unique slugs", () => {
    expect(THEME_KITS.length).toBe(18);
    const slugs = THEME_KITS.map((kit) => kit.slug);
    expect(new Set(slugs).size).toBe(18);
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
});
