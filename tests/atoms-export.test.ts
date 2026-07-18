import { describe, expect, test } from "bun:test";
import {
  createIconsExports,
  createMotionExports,
  createShapeExports,
  createTypographyExports,
  createSpacingExports,
  createLinesExports,
  renderCssVariables,
  renderDesignMarkdown,
  renderTailwindTheme,
} from "@/lib/atoms/export";
import { DENSITIES, SPACING_SCALE } from "@/lib/atoms/spacing";
import { LINES } from "@/lib/atoms/lines";
import { ICON_STYLES } from "@/lib/atoms/icons";
import { MOTION_CURVES, MOTION_DURATIONS, MOTION_SPRINGS } from "@/lib/atoms/motion";
import { RADII, SHADOWS } from "@/lib/atoms/shape";
import { FONT_PAIRS, TYPE_SCALE } from "@/lib/atoms/typography";

describe("atom category exports", () => {
  test("renders a CSS variable block from exact atom values", () => {
    expect(
      renderCssVariables([
        { name: "--space-base", value: "16px" },
        { name: "--space-group", value: "24px" },
      ]),
    ).toBe(`:root {
  --space-base: 16px;
  --space-group: 24px;
}`);
  });

  test("renders the same exact values as a Tailwind v4 theme", () => {
    expect(
      renderTailwindTheme([
        { name: "--radius-md", value: "10px" },
        { name: "--radius-lg", value: "12.5px" },
      ]),
    ).toBe(`@theme {
  --radius-md: 10px;
  --radius-lg: 12.5px;
}`);
  });

  test("renders an English DESIGN.md section with values and one rule", () => {
    expect(
      renderDesignMarkdown({
        title: "Spacing",
        values: [
          { name: "micro", value: "4px" },
          { name: "base", value: "16px" },
        ],
        rule: "Use this scale only; never introduce off-scale spacing values.",
      }),
    ).toBe(`## Spacing

| Token | Value |
| --- | --- |
| micro | 4px |
| base | 16px |

**Rule:** Use this scale only; never introduce off-scale spacing values.`);
  });

  test("maps the complete spacing category to its fixed token names", () => {
    expect(createSpacingExports(SPACING_SCALE, DENSITIES).cssVariables).toBe(`:root {
  --space-micro: 4px;
  --space-tight: 8px;
  --space-element: 12px;
  --space-base: 16px;
  --space-group: 24px;
  --space-block: 32px;
  --space-section: 48px;
  --space-region: 64px;
  --space-density-compact-row: 32px;
  --space-density-compact-padding: 8px;
  --space-density-standard-row: 40px;
  --space-density-standard-padding: 12px;
  --space-density-comfortable-row: 48px;
  --space-density-comfortable-padding: 16px;
}`);
  });

  test("keeps paired line values and the focus offset in the export", () => {
    expect(createLinesExports(LINES).cssVariables).toContain(
      `--line-divider-light: 1px solid rgb(0 0 0 / 0.05);
  --line-divider-dark: 1px solid rgb(255 255 255 / 0.06);`,
    );
    expect(createLinesExports(LINES).cssVariables).toContain(
      `--line-focus-ring: 2px solid color-mix(in srgb, var(--accent) 55%, transparent);
  --line-focus-ring-offset: 2px;`,
    );
  });

  test("exports icon vocabulary as DESIGN.md only", () => {
    expect(createIconsExports(ICON_STYLES)).toEqual({
      designMarkdown: `## Icon style

| Token | Value |
| --- | --- |
| outline | Outline icons, 1.5px stroke, round line caps, 24px grid, and even visual weight. |
| bold-outline | Bold outline icons, 2px stroke, round line caps, 24px grid, with lively and even visual weight. |
| rounded | Rounded outline icons with clearly rounded caps and joins, a 24px grid, and friendly even weight. |
| filled | Filled icons with solid silhouettes, a 24px grid, high recognition, and consistent optical area. |
| duotone | Duotone icons with a solid primary shape and a same-color secondary shape at 30% opacity on a 24px grid. |
| pixel | Pixel icons built from hard-edged square cells on a 16px grid, with no curves or antialiased diagonals. |

**Rule:** Use one icon style across the product; never mix outline and filled icons in the same bar.`,
    });
  });

  test("maps motion curves, spring physics, and durations without losing values", () => {
    const result = createMotionExports(
      MOTION_CURVES,
      MOTION_SPRINGS,
      MOTION_DURATIONS,
    ).cssVariables;
    expect(result).toContain("--ease-swift-out: cubic-bezier(0.16, 1, 0.3, 1);");
    expect(result).toContain("--ease-press-stiffness: 500;");
    expect(result).toContain("--ease-duration-standard: 220ms;");
  });

  test("maps radius and paired shadow values into one shape export", () => {
    const result = createShapeExports(RADII, SHADOWS).cssVariables;
    expect(result).toContain("--radius-lg: 12.5px;");
    expect(result).toContain(
      "--shadow-floating-dark: 0 0 0 0.5px rgb(255 255 255 / 0.157), 0 3px 7.5px rgb(0 0 0 / 0.2), 0 0 20px rgb(0 0 0 / 0.25);",
    );
  });

  test("maps every font pairing and type-scale measure to distinct variables", () => {
    const result = createTypographyExports(FONT_PAIRS, TYPE_SCALE).cssVariables;
    expect(result).toContain(
      "--font-native-crisp-display: 'SF Pro Display', -apple-system, system-ui;",
    );
    expect(result).toContain("--text-display: 48px;");
    expect(result).toContain("--text-display-line-height: 1.1;");
    expect(result).toContain("--text-display-letter-spacing: -0.02em;");
  });
});
