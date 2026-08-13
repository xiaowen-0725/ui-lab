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

  test("basic scope omits raw ramp exports while full keeps all 44 steps", () => {
    const basic = generatePalette({ base: "#3d7dff", scope: "basic" });
    const full = generatePalette({ base: "#3d7dff", scope: "full" });
    expect(formatGeneratedPaletteCss(basic)).not.toContain("--color-primary-50");
    expect(formatGeneratedPaletteCss(full).match(/--color-/g)).toHaveLength(44);
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
