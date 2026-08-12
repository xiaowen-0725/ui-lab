import { describe, expect, test } from "bun:test";
import { PALETTES, paletteContrastReport } from "@/lib/palettes";

const KNOWN_AA_DEBT = new Set([
  "business:muted-on-background",
  "cream:muted-on-background",
  "dopamine:primary-foreground-on-primary",
  "earth:muted-on-background",
  "earth:primary-foreground-on-primary",
  "forest-night:primary-foreground-on-primary",
  "ink-wash:muted-on-background",
  "macaron:muted-on-background",
  "midnight:primary-foreground-on-primary",
  "morandi:muted-on-background",
  "morandi:primary-foreground-on-primary",
  "ocean:muted-on-background",
  "sage:muted-on-background",
  "sage:primary-foreground-on-primary",
  "sunset:muted-on-background",
  "sunset:primary-foreground-on-primary",
]);

describe("palette contrast reports", () => {
  test("reports the four semantic foreground/background pairs with WCAG states", () => {
    const palette = PALETTES.find((entry) => entry.slug === "business");
    if (!palette) throw new Error('Expected the "business" palette to exist.');

    const report = paletteContrastReport(palette);

    expect(report).toHaveLength(4);
    expect(report.map((result) => result.id)).toEqual([
      "text-on-background",
      "muted-on-background",
      "text-on-surface",
      "primary-foreground-on-primary",
    ]);
    expect(report[0]).toMatchObject({
      foregroundRole: "text",
      backgroundRole: "bg",
      aaNormal: true,
      aaLarge: true,
      aaaNormal: true,
      aaaLarge: true,
    });
    expect(report[1]?.ratio).toBeCloseTo(4.47, 2);
    expect(report[1]).toMatchObject({
      aaNormal: false,
      aaLarge: true,
      aaaNormal: false,
      aaaLarge: false,
    });
  });

  test("does not introduce new normal-text AA failures beyond known palette debt", () => {
    const failures = PALETTES.flatMap((palette) =>
      paletteContrastReport(palette)
        .filter((result) => !result.aaNormal)
        .map((result) => `${palette.slug}:${result.id}`),
    );

    expect(failures.sort()).toEqual([...KNOWN_AA_DEBT].sort());
  });
});
