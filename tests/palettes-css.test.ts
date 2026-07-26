import { describe, expect, test } from "bun:test";
import { PALETTES, paletteToCss } from "@/lib/palettes";

describe("palettes CSS export", () => {
  const morandi = PALETTES.find((p) => p.slug === "morandi");
  if (!morandi) throw new Error("expected the morandi palette to exist");

  test("maps the 8 semantic roles of a specific palette to the right token lines", () => {
    const css = paletteToCss(morandi);
    const { bg, surface, border, text, muted, primary, primaryFg, accent } =
      morandi.colors;

    expect(css).toContain(`--background: ${bg}; /* bg */`);
    expect(css).toContain(`--foreground: ${text}; /* text */`);
    expect(css).toContain(`--card: ${surface}; /* surface */`);
    expect(css).toContain(`--muted-foreground: ${muted}; /* muted */`);
    expect(css).toContain(`--border: ${border}; /* border */`);
    expect(css).toContain(`--primary: ${primary}; /* primary */`);
    expect(css).toContain(`--primary-foreground: ${primaryFg}; /* primaryFg */`);
    expect(css).toContain(`--accent: ${accent}; /* accent */`);

    // All 8 hexes appear somewhere in the output.
    for (const hex of [bg, surface, border, text, muted, primary, primaryFg, accent]) {
      expect(css).toContain(hex);
    }
  });

  test("starts with a block comment and contains a balanced :root block", () => {
    const css = paletteToCss(morandi);

    expect(css.trimStart().startsWith("/*")).toBe(true);
    expect(css).toContain(":root {");

    const openBraces = (css.match(/{/g) ?? []).length;
    const closeBraces = (css.match(/}/g) ?? []).length;
    expect(openBraces).toBe(closeBraces);
    expect(openBraces).toBeGreaterThan(0);
  });

  test("every palette in the catalog renders non-empty, drop-in CSS", () => {
    for (const palette of PALETTES) {
      const css = paletteToCss(palette);
      expect(css.length).toBeGreaterThan(0);
      expect(css).toContain("--background:");
      expect(css).toContain("--ring:");
    }
  });
});
