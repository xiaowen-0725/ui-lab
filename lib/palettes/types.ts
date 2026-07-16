// Shared types + group taxonomy for the Palettes module (配色方案).
// Entry data lives in the per-group files next to this one;
// lib/palettes/index.ts assembles them and maps entries onto the style-demo
// skin contract so the same demo scene previews every palette.

export type PaletteGroupKey = "soft" | "vivid" | "dark" | "earthy";

export type PaletteGroup = {
  key: PaletteGroupKey;
  label: string;
  labelZh: string;
};

/** Display order of the switcher's group sections. */
export const PALETTE_GROUPS: readonly PaletteGroup[] = [
  { key: "soft", label: "Soft & Muted", labelZh: "柔和淡雅" },
  { key: "vivid", label: "Vivid & Playful", labelZh: "鲜活明快" },
  { key: "dark", label: "Dark", labelZh: "深色系" },
  { key: "earthy", label: "Earthy & Classic", labelZh: "自然经典" },
];

/**
 * The eight semantic roles every palette assigns. Roles — not loose swatches —
 * are what make a palette sayable to AI: each hex comes with a job.
 */
export type PaletteColors = {
  /** Page background. */
  bg: string;
  /** Cards / raised surfaces. */
  surface: string;
  /** Hairlines and outlines. */
  border: string;
  /** Primary text. */
  text: string;
  /** Secondary text. */
  muted: string;
  /** Primary actions (buttons, links). */
  primary: string;
  /** Text on top of primary. */
  primaryFg: string;
  /** Small doses of emphasis (badges, numbers, icons). */
  accent: string;
};

export type PaletteEntry = {
  slug: string;
  name: string;
  nameZh: string;
  group: PaletteGroupKey;
  /** Common alternative names, mixed zh/en — the vocabulary layer. */
  aliases: string[];
  description: string;
  descriptionZh: string;
  bestFor: string;
  bestForZh: string;
  /** Copy-paste prompt for AI tools: hexes with roles + mood + forbidden list. */
  promptZh: string;
  promptEn: string;
  /** Usage notes: proportions, contrast, do/don't — 5 bullets per language. */
  recipe: string[];
  recipeZh: string[];
  colors: PaletteColors;
};
