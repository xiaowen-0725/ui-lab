import type {
  BackgroundAtom,
  DensityAtom,
  IconStyleAtom,
  LineAtom,
  SpacingAtom,
  MotionCurveAtom,
  MotionDurationAtom,
  MotionSpringAtom,
  RadiusAtom,
  ShadowAtom,
  FontPairAtom,
  TypeScaleAtom,
} from "@/lib/atoms/types";
import {
  curveCssValue,
  durationCssValue,
  springJsValue,
} from "@/lib/atoms/motion";

export type AtomExportVariable = {
  name: `--${string}`;
  value: string;
};

export type AtomDesignValue = {
  name: string;
  value: string;
};

export type AtomDesignSection = {
  title: string;
  values: readonly AtomDesignValue[];
  rule: string;
};

export type AtomExportBundle = {
  cssVariables?: string;
  tailwindTheme?: string;
  designMarkdown: string;
};

function renderDeclarations(variables: readonly AtomExportVariable[]): string {
  return variables
    .map((variable) => `  ${variable.name}: ${variable.value};`)
    .join("\n");
}

export function renderCssVariables(variables: readonly AtomExportVariable[]): string {
  return `:root {\n${renderDeclarations(variables)}\n}`;
}

export function renderTailwindTheme(variables: readonly AtomExportVariable[]): string {
  return `@theme {\n${renderDeclarations(variables)}\n}`;
}

export function renderDesignMarkdown(section: AtomDesignSection): string {
  const rows = section.values
    .map((value) => `| ${value.name} | ${value.value} |`)
    .join("\n");

  return `## ${section.title}\n\n| Token | Value |\n| --- | --- |\n${rows}\n\n**Rule:** ${section.rule}`;
}

function createCategoryExports(
  variables: readonly AtomExportVariable[],
  design: AtomDesignSection,
): AtomExportBundle {
  return {
    cssVariables: renderCssVariables(variables),
    tailwindTheme: renderTailwindTheme(variables),
    designMarkdown: renderDesignMarkdown(design),
  };
}

export function createSpacingExports(
  scale: readonly SpacingAtom[],
  densities: readonly DensityAtom[],
): AtomExportBundle {
  const variables: AtomExportVariable[] = [
    ...scale.map((entry) => ({
      name: `--space-${entry.slug}` as const,
      value: `${entry.pixels}px`,
    })),
    ...densities.flatMap((entry) => [
      {
        name: `--space-density-${entry.slug}-row` as const,
        value: `${entry.rowHeight}px`,
      },
      {
        name: `--space-density-${entry.slug}-padding` as const,
        value: `${entry.padding}px`,
      },
    ]),
  ];

  return createCategoryExports(variables, {
    title: "Spacing",
    values: [
      ...scale.map((entry) => ({ name: entry.slug, value: `${entry.pixels}px` })),
      ...densities.map((entry) => ({
        name: `density/${entry.slug}`,
        value: `${entry.rowHeight}px row / ${entry.padding}px padding`,
      })),
    ],
    rule: "Use this scale across the entire product; never introduce off-scale values such as 13px or 18px.",
  });
}

export function createLinesExports(lines: readonly LineAtom[]): AtomExportBundle {
  const variables: AtomExportVariable[] = lines.flatMap((entry) => {
    if (entry.offset) {
      return [
        { name: `--line-${entry.slug}` as const, value: entry.light },
        { name: `--line-${entry.slug}-offset` as const, value: entry.offset },
      ];
    }

    return [
      { name: `--line-${entry.slug}-light` as const, value: entry.light },
      { name: `--line-${entry.slug}-dark` as const, value: entry.dark },
    ];
  });

  return createCategoryExports(variables, {
    title: "Lines",
    values: lines.flatMap((entry) => {
      const offset = entry.offset ? `; outline-offset: ${entry.offset}` : "";
      return [
        {
          name: `${entry.slug}/light`,
          value: `${entry.property}: ${entry.light}${offset}`,
        },
        {
          name: `${entry.slug}/dark`,
          value: `${entry.property}: ${entry.dark}${offset}`,
        },
      ];
    }),
    rule: "Do not mix a hairline ring and a 1px border on elements at the same hierarchy level.",
  });
}

export function createIconsExports(icons: readonly IconStyleAtom[]): AtomExportBundle {
  return {
    designMarkdown: renderDesignMarkdown({
      title: "Icon style",
      values: icons.map((entry) => ({ name: entry.slug, value: entry.spec })),
      rule: "Use one icon style across the product; never mix outline and filled icons in the same bar.",
    }),
  };
}

export function createBackgroundsExports(
  backgrounds: readonly BackgroundAtom[],
): AtomExportBundle {
  const recipes = backgrounds
    .map(
      (entry) => `### ${entry.name}

#### Light

\`\`\`css
${entry.light}
\`\`\`

#### Dark

\`\`\`css
${entry.dark}
\`\`\`

**Use when:** ${entry.whenUse}`,
    )
    .join("\n\n");

  return {
    designMarkdown: `## Backgrounds

${recipes}

**Rule:** Use these static CSS recipes for texture; for dynamic shader effects, use the \`webgl-background\` component.`,
  };
}

export function createMotionExports(
  curves: readonly MotionCurveAtom[],
  springs: readonly MotionSpringAtom[],
  durations: readonly MotionDurationAtom[],
): AtomExportBundle {
  const variables: AtomExportVariable[] = [
    ...curves.map((entry) => ({
      name: `--ease-${entry.slug}` as const,
      value: curveCssValue(entry.value),
    })),
    ...springs.flatMap((entry) => [
      {
        name: `--ease-${entry.slug}-stiffness` as const,
        value: `${entry.value.stiffness}`,
      },
      {
        name: `--ease-${entry.slug}-damping` as const,
        value: `${entry.value.damping}`,
      },
      {
        name: `--ease-${entry.slug}-mass` as const,
        value: `${entry.value.mass}`,
      },
    ]),
    ...durations.map((entry) => ({
      name: `--ease-duration-${entry.slug}` as const,
      value: durationCssValue(entry.milliseconds),
    })),
  ];

  return createCategoryExports(variables, {
    title: "Motion",
    values: [
      ...curves.map((entry) => ({
        name: `curve/${entry.slug}`,
        value: curveCssValue(entry.value),
      })),
      ...springs.map((entry) => ({
        name: `spring/${entry.slug}`,
        value: springJsValue(entry.value),
      })),
      ...durations.map((entry) => ({
        name: `duration/${entry.slug}`,
        value: durationCssValue(entry.milliseconds),
      })),
    ],
    rule: "Use these curves, spring physics, and durations consistently; never replace them with generic easing defaults.",
  });
}

export function createShapeExports(
  radii: readonly RadiusAtom[],
  shadows: readonly ShadowAtom[],
): AtomExportBundle {
  const variables: AtomExportVariable[] = [
    ...radii.map((entry) => ({
      name: `--radius-${entry.slug}` as const,
      value: entry.value,
    })),
    ...shadows.flatMap((entry) => [
      { name: `--shadow-${entry.slug}-light` as const, value: entry.light },
      { name: `--shadow-${entry.slug}-dark` as const, value: entry.dark },
    ]),
  ];

  return createCategoryExports(variables, {
    title: "Shape",
    values: [
      ...radii.map((entry) => ({ name: `radius/${entry.slug}`, value: entry.value })),
      ...shadows.flatMap((entry) => [
        { name: `shadow/${entry.slug}/light`, value: entry.light },
        { name: `shadow/${entry.slug}/dark`, value: entry.dark },
      ]),
    ],
    rule: "Use the radius scale consistently and establish elevation with hairlines and shallow shadows before prominent shadows.",
  });
}

export function createTypographyExports(
  fontPairs: readonly FontPairAtom[],
  typeScale: readonly TypeScaleAtom[],
): AtomExportBundle {
  const variables: AtomExportVariable[] = [
    ...fontPairs.flatMap((entry) => [
      {
        name: `--font-${entry.slug}-display` as const,
        value: entry.display,
      },
      { name: `--font-${entry.slug}-sans` as const, value: entry.body },
      { name: `--font-${entry.slug}-mono` as const, value: entry.mono },
    ]),
    ...typeScale.flatMap((entry) => [
      { name: `--text-${entry.slug}` as const, value: entry.fontSize },
      {
        name: `--text-${entry.slug}-line-height` as const,
        value: `${entry.lineHeight}`,
      },
      {
        name: `--text-${entry.slug}-letter-spacing` as const,
        value: entry.letterSpacing,
      },
    ]),
  ];

  return createCategoryExports(variables, {
    title: "Typography",
    values: [
      ...fontPairs.map((entry) => ({
        name: `font/${entry.slug}`,
        value: `display: ${entry.display}; body: ${entry.body}; mono: ${entry.mono}`,
      })),
      ...typeScale.map((entry) => ({
        name: `text/${entry.slug}`,
        value: `${entry.fontSize} / ${entry.lineHeight} / ${entry.letterSpacing}`,
      })),
    ],
    rule: "Load no webfonts for these system pairings, keep Chinese on the system family, and use only this type scale.",
  });
}
