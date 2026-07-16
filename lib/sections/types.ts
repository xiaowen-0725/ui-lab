// Shared types for the Sections module (落地页区块解剖图).
// Entry data lives in the per-batch files next to this one;
// lib/sections/index.ts assembles them in landing-page anatomy order.

/**
 * One concrete shape of a section (e.g. hero: centered / split / screenshot).
 * Each variant has its own live demo (registered in the demo registry under
 * `${entry.slug}/${variant.key}`) and its own copy-ready prompt.
 */
export type SectionVariant = {
  key: string;
  name: string;
  nameZh: string;
  /** One line on when to pick this shape over its siblings. */
  whenToUse: string;
  whenToUseZh: string;
  promptZh: string;
  promptEn: string;
};

export type SectionEntry = {
  slug: string;
  name: string;
  nameZh: string;
  /** Common alternative names, mixed zh/en — the vocabulary layer. */
  aliases: string[];
  description: string;
  descriptionZh: string;
  bestFor: string;
  bestForZh: string;
  /** Structural crib notes shared by all variants — 5 bullets per language. */
  recipe: string[];
  recipeZh: string[];
  variants: SectionVariant[];
};
