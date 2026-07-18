// Shared types for the Layouts module (整站版式).
// The unit here is a *whole-page layout* reverse-recreated from a real product
// — one rung above the Sections module (which is single slices). Each entry is
// a faithful, interactive live replica of a real site's page shell, carried
// with the site-wide formula: live sample + names/aliases + source + "say this
// to AI" prompt + structural recipe. Entry data lives in per-site files next to
// this one; lib/layouts/index.ts assembles them.

export type LayoutEntry = {
  slug: string;
  name: string;
  nameZh: string;
  /** Common alternative names for this layout archetype, mixed zh/en. */
  aliases: string[];
  /** The real product this layout is recreated from (display label). */
  source: string;
  /** Link to the real product, for side-by-side comparison. */
  sourceUrl: string;
  description: string;
  descriptionZh: string;
  /** One line on the kind of product this shell fits. */
  bestFor: string;
  bestForZh: string;
  /** Structural crib notes — how the page is scaffolded (grid, rails, widths). */
  recipe: string[];
  recipeZh: string[];
  /** "Say this to AI" — named archetype + concrete structure + FORBIDDEN. */
  promptZh: string;
  promptEn: string;
};

export type WorkbenchSkin = {
  /** `--wb-*` overrides. Empty means the workbench follows the site theme. */
  vars: Record<string, string>;
  /** Site semantic-token overrides applied only to the showcase stage. */
  siteVars: Record<string, string>;
  /** Contrast context the stage should establish for this skin. */
  scheme: "light" | "dark" | "auto";
  /** Display-only font stacks; no webfonts are loaded by this module. */
  fonts?: { body?: string; display?: string; mono?: string };
};

export type DesignSystemEntry = {
  slug: string;
  /** Neutral display name: real-product names belong only in hidden keywords. */
  name: string;
  nameZh: string;
  aliases: string[];
  description: string;
  descriptionZh: string;
  skin: WorkbenchSkin;
  /** Named style + concrete visual moves + a FORBIDDEN section. */
  promptZh: string;
  promptEn: string;
  /** Copy-ready DESIGN.md source for recreating the system. */
  designMd: string;
  /** Hidden search/SEO vocabulary; never rendered as entry copy. */
  keywords: string[];
};
