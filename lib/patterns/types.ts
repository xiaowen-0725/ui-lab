/** One full-page spatial skeleton in the Layout vocabulary. */
export type LayoutPatternSlug =
  | "centered"
  | "sidebar"
  | "holy-grail"
  | "split"
  | "three-pane"
  | "dashboard"
  | "list-detail"
  | "canvas";

export type LayoutPatternEntry = {
  slug: LayoutPatternSlug;
  name: string;
  nameZh: string;
  /** Common Chinese and English names people may search for. */
  aliases: string[];
  whenUse: string;
  whenUseZh: string;
  /** Compact, copy-ready CSS for the structural layout. */
  recipe: string;
  /** One sentence describing how the structure collapses on narrow screens. */
  responsiveNote: string;
  responsiveNoteZh: string;
  promptZh: string;
  promptEn: string;
};
