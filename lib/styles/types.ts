// Shared types + group taxonomy for the Styles module. Entry data lives in
// the per-group files next to this one; lib/styles/index.ts assembles them.

export type StyleGroupKey =
  | "material"
  | "raw"
  | "minimal"
  | "retro"
  | "tech"
  | "layout"
  | "organic"
  | "system";

export type StyleGroup = {
  key: StyleGroupKey;
  label: string;
  labelZh: string;
};

/** Display order of the switcher's group sections. */
export const STYLE_GROUPS: readonly StyleGroup[] = [
  { key: "material", label: "Material & Texture", labelZh: "材质质感" },
  { key: "raw", label: "Raw & Rebel", labelZh: "粗野反叛" },
  { key: "minimal", label: "Minimal & Type", labelZh: "极简排版" },
  { key: "retro", label: "Retro", labelZh: "复古" },
  { key: "tech", label: "Tech & Future", labelZh: "科技未来" },
  { key: "layout", label: "Layout-driven", labelZh: "布局驱动" },
  { key: "organic", label: "Organic & Playful", labelZh: "有机手作" },
  { key: "system", label: "Design Systems", labelZh: "体系化" },
];

export type StyleSkin = {
  /**
   * Semantic theme tokens applied to the demo wrapper as inline CSS vars.
   * Required: --st-page-bg, --st-page-fg, --st-muted, --st-card-bg,
   * --st-card-border, --st-card-blur, --st-radius-lg, --st-radius-sm,
   * --st-shadow, --st-divider, --st-accent, --st-heading-weight,
   * --st-heading-tracking, --st-badge-bg, --st-badge-fg, --st-badge-border,
   * --st-badge-transform, --st-badge-tracking, --st-btn-primary-bg,
   * --st-btn-primary-fg, --st-btn-primary-border, --st-btn-primary-shadow,
   * --st-btn-secondary-bg, --st-btn-secondary-fg, --st-btn-secondary-border.
   * Optional: --st-font (body font stack), --st-heading-font,
   * --st-heading-transform, --st-card-fg / --st-card-muted (text colors
   * inside cards when the card bg clashes with the page fg).
   */
  vars: Record<string, string>;
  /** Decorative layer behind the demo content. */
  backdrop: "aurora" | "grid" | "scanlines" | "none";
  /** Demo card-grid variant; "bento" spans the first card across two columns. */
  layout?: "default" | "bento";
};

export type StyleEntry = {
  slug: string;
  name: string;
  nameZh: string;
  group: StyleGroupKey;
  /** Common alternative names, mixed zh/en — the vocabulary layer. */
  aliases: string[];
  description: string;
  descriptionZh: string;
  bestFor: string;
  bestForZh: string;
  /** Copy-paste prompt for AI tools: named style + concrete moves + forbidden list. */
  promptZh: string;
  promptEn: string;
  /** Implementation crib notes, collapsed by default in the UI. */
  recipe: string[];
  recipeZh: string[];
  skin: StyleSkin;
};
