// Renders a PaletteEntry as a standalone, drop-in CSS file: the 8 semantic
// roles mapped onto shadcn-compatible tokens, plus derived tokens so the
// block covers full shadcn token surface on its own. Hex literals only (no
// var() chains) so it stays valid pasted into any project's globals.css.

import { PALETTE_GROUPS } from "./types";
import type { PaletteEntry } from "./types";

function groupLabel(entry: PaletteEntry): string {
  const group = PALETTE_GROUPS.find((g) => g.key === entry.group);
  return group?.label ?? entry.group;
}

/** color-mix expression shared by --border-strong and --ring. */
function borderStrongMix(entry: PaletteEntry): string {
  const { border, text } = entry.colors;
  return `color-mix(in oklab, ${border} 78%, ${text} 22%)`;
}

/**
 * Generates a standalone CSS file for a palette: header comment block with
 * the prompt-adjacent description/bestFor/recipe, a `:root` block with the 8
 * semantic roles mapped to shadcn tokens (hex literals, `/* role *\/`
 * comments), and a derived block covering the rest of shadcn's token surface.
 */
export function paletteToCss(entry: PaletteEntry): string {
  const c = entry.colors;
  const borderStrong = borderStrongMix(entry);

  const header = [
    `/**`,
    ` * ${entry.name} · ${entry.nameZh} — UI Lab palette (${groupLabel(entry)})`,
    ` *`,
    ` * ${entry.description}`,
    ` *`,
    ` * Best for: ${entry.bestFor}`,
    ` *`,
    ...entry.recipe.map((line) => ` * - ${line}`),
    ` *`,
    ` * Paste this below \`@import "tailwindcss";\` in your globals.css. This`,
    ` * is a single light/dark-agnostic theme — if this palette is from the`,
    ` * "dark" group, its colors already are the dark theme. Pairs with UI`,
    ` * Lab's /theme.css theme layer if you're using it.`,
    ` */`,
  ].join("\n");

  const root = [
    `:root {`,
    `  --background: ${c.bg}; /* bg */`,
    `  --foreground: ${c.text}; /* text */`,
    `  --card: ${c.surface}; /* surface */`,
    `  --muted-foreground: ${c.muted}; /* muted */`,
    `  --border: ${c.border}; /* border */`,
    `  --primary: ${c.primary}; /* primary */`,
    `  --primary-foreground: ${c.primaryFg}; /* primaryFg */`,
    `  --accent: ${c.accent}; /* accent */`,
    ``,
    `  /* Derived — full shadcn token coverage so this block is drop-in for any shadcn project */`,
    `  --card-foreground: ${c.text};`,
    `  --popover: ${c.surface};`,
    `  --popover-foreground: ${c.text};`,
    `  --secondary: ${c.surface};`,
    `  --secondary-foreground: ${c.text};`,
    `  --muted: ${c.surface};`,
    `  --accent-foreground: ${c.text};`,
    `  --input: ${c.border};`,
    `  --border-strong: ${borderStrong};`,
    `  --ring: ${borderStrong};`,
    `  /* --destructive: not set — this palette has no danger role; keep your project's default */`,
    `}`,
  ].join("\n");

  return `${header}\n\n${root}\n`;
}
