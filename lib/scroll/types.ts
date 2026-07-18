/** One scroll-driven storytelling technique in the Scroll vocabulary. */
export type ScrollPatternSlug =
  | "parallax"
  | "pinned"
  | "reveal"
  | "progress"
  | "horizontal"
  | "snap"
  | "zoom"
  | "stacking";

export type ScrollPatternEntry = {
  slug: ScrollPatternSlug;
  name: string;
  nameZh: string;
  /** Common Chinese and English names people may search for. */
  aliases: string[];
  whenUse: string;
  whenUseZh: string;
  /** Compact, copy-ready CSS or Motion recipe. */
  recipe: string;
  promptZh: string;
  promptEn: string;
};
