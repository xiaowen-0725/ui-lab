import { describe, expect, test } from "bun:test";
import { contrastRatio } from "@/lib/color";
import {
  formatColor,
  formatGeneratedPaletteCss,
  generatePalette,
  generatorParamsToSearch,
  parseGeneratorParams,
  RAMP_STEPS,
} from "@/lib/palettes/generator";
import { hexToOklch } from "@/lib/theme-kits/oklch";

describe("palette generator", () => {
  test("builds deterministic 11-step OKLCH-derived ramps from one brand color", () => {
    const first = generatePalette({ base: "#3d7dff" });
    const second = generatePalette({ base: "3D7DFF" });

    expect(first).toEqual(second);
    expect(Object.keys(first.ramps.primary)).toEqual(RAMP_STEPS.map(String));
    expect(Object.values(first.ramps.primary)).toHaveLength(11);
    expect(new Set(Object.values(first.ramps.primary)).size).toBe(11);
    expect(first.ramps.primary[500]).toBe("#3D7DFF");
  });

  test("derives each documented harmony at its intended hue rotation", () => {
    const baseHue = hexToOklch("#3d7dff")?.h ?? 0;
    const expected = {
      complementary: 180,
      analogous: 32,
      triadic: 120,
      split: 150,
      monochromatic: 0,
    } as const;

    for (const [scheme, offset] of Object.entries(expected)) {
      const result = generatePalette({
        base: "#3d7dff",
        scheme: scheme as keyof typeof expected,
      });
      const accentHue = hexToOklch(result.ramps.accent[500])?.h ?? 0;
      const actualOffset = ((accentHue - baseHue + 540) % 360) - 180;
      const normalizedExpected = ((offset + 180) % 360) - 180;
      expect(Math.abs(actualOffset - normalizedExpected)).toBeLessThan(3);
    }
  });

  test("keeps achromatic brand seeds achromatic instead of inventing blue", () => {
    for (const base of ["#000000", "#808080", "#FFFFFF"]) {
      const result = generatePalette({ base });
      for (const color of Object.values(result.ramps.primary)) {
        expect(hexToOklch(color)?.c ?? 1).toBeLessThan(0.006);
      }
    }
  });

  test("moves semantic steps until every declared pair meets AA or AAA", () => {
    for (const target of ["AA", "AAA"] as const) {
      const result = generatePalette({ base: "#3d7dff", contrast: target });
      const minimum = target === "AAA" ? 7 : 4.5;
      const { bg, surface, text, muted, primary, primaryFg } = result.entry.colors;

      expect(contrastRatio(text, bg)).toBeGreaterThanOrEqual(minimum);
      expect(contrastRatio(muted, bg)).toBeGreaterThanOrEqual(minimum);
      expect(contrastRatio(text, surface)).toBeGreaterThanOrEqual(minimum);
      expect(contrastRatio(primaryFg, primary)).toBeGreaterThanOrEqual(minimum);
    }
  });

  test("builds distinct light and dark semantic surfaces with complete status roles", () => {
    const result = generatePalette({ base: "#3d7dff", contrast: "AAA", scope: "full" });

    expect(result.modes.light.canvas).not.toBe(result.modes.light.surface);
    expect(result.modes.light.surface).not.toBe(result.modes.light.surfaceRaised);
    expect(result.modes.dark.canvas).not.toBe(result.modes.dark.surface);
    expect(result.modes.dark.surface).not.toBe(result.modes.dark.surfaceRaised);

    for (const mode of [result.modes.light, result.modes.dark]) {
      expect(contrastRatio(mode.text, mode.canvas)).toBeGreaterThanOrEqual(7);
      expect(contrastRatio(mode.primaryForeground, mode.primary)).toBeGreaterThanOrEqual(7);
      expect(contrastRatio(mode.primaryForeground, mode.primaryHover)).toBeGreaterThanOrEqual(7);
      expect(contrastRatio(mode.primaryForeground, mode.primaryActive)).toBeGreaterThanOrEqual(7);
      for (const status of Object.values(mode.statuses)) {
        expect(contrastRatio(status.foreground, status.fill)).toBeGreaterThanOrEqual(7);
      }
      expect(mode.charts).toHaveLength(6);
    }
  });

  test("models transparency by semantic purpose instead of loose alpha swatches", () => {
    const result = generatePalette({ base: "#3d7dff", scope: "full" });

    expect(result.modes.light.alpha.overlayHover.alpha).toBe(0.04);
    expect(result.modes.dark.alpha.overlayHover.alpha).toBe(0.06);
    expect(result.modes.light.alpha.overlayScrim.alpha).toBe(0.48);
    expect(result.modes.dark.alpha.overlayScrim.alpha).toBe(0.72);
    expect(Object.keys(result.modes.light.alpha)).toEqual([
      "surfaceTranslucent",
      "surfaceRaisedTranslucent",
      "overlayHover",
      "overlayActive",
      "overlaySelected",
      "overlayScrim",
      "glassBackground",
      "glassBorder",
      "shadowColor",
    ]);
  });

  test("formats exports without changing the generated palette", () => {
    const result = generatePalette({ base: "#3d7dff", scope: "full" });

    expect(formatGeneratedPaletteCss(result, "hex")).toContain("#");
    expect(formatGeneratedPaletteCss(result, "rgb")).toContain("rgb(");
    expect(formatGeneratedPaletteCss(result, "hsl")).toContain("hsl(");
    expect(formatGeneratedPaletteCss(result, "oklch")).toContain("oklch(");
    expect(formatColor("#3D7DFF", "rgb")).toBe("rgb(61 125 255)");
    expect(formatColor("#3D7DFF", "hsl")).toMatch(
      /^hsl\(\d+ \d+% \d+%\)$/,
    );
    expect(formatColor("#3D7DFF", "oklch")).toMatch(
      /^oklch\(\d\.\d{3} \d\.\d{3} \d+\.\d\)$/,
    );
    expect(formatGeneratedPaletteCss(result, "hex")).not.toContain("undefined");
  });

  test("basic scope omits raw ramps while full exports all eight 11-step families", () => {
    const basic = generatePalette({ base: "#3d7dff", scope: "basic" });
    const full = generatePalette({ base: "#3d7dff", scope: "full" });
    expect(formatGeneratedPaletteCss(basic)).not.toContain("--color-primary-50");
    expect(formatGeneratedPaletteCss(basic)).not.toContain("--overlay-scrim:");
    expect(formatGeneratedPaletteCss(basic)).not.toContain("--chart-1:");
    expect(formatGeneratedPaletteCss(full).match(/--color-/g)).toHaveLength(88);
  });

  test("exports a dual-mode production token contract", () => {
    const result = generatePalette({ base: "#3d7dff", scope: "full" });
    const css = formatGeneratedPaletteCss(result, "oklch");

    expect(css).toContain(":root {");
    expect(css).toContain(".dark {");
    expect(css).toContain("--surface-raised:");
    expect(css).toContain("--primary-hover:");
    expect(css).toContain("--success-subtle:");
    expect(css).toContain("--warning-foreground:");
    expect(css).toContain("--danger-border:");
    expect(css).toContain("--info:");
    expect(css).toContain("--overlay-hover:");
    expect(css).toContain("--overlay-scrim:");
    expect(css).toContain("--chart-6:");
  });

  test("round-trips the five generator controls through URLSearchParams", () => {
    const params = {
      base: "#3D7DFF",
      scope: "full" as const,
      scheme: "analogous" as const,
      contrast: "AAA" as const,
      format: "hsl" as const,
    };
    const search = generatorParamsToSearch(params);

    expect(search.toString()).toBe("b=3D7DFF&m=full&s=analogous&c=AAA&f=hsl");
    expect(parseGeneratorParams(search)).toEqual(params);
  });
});
