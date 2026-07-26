export type MotionCurveAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  value: readonly [number, number, number, number];
};

export type MotionSpringAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  value: Readonly<{
    type?: "spring";
    stiffness: number;
    damping: number;
    mass: number;
  }>;
};

export type MotionDurationAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  milliseconds: number;
};

export type RadiusAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  value: string;
  note?: string;
  noteZh?: string;
};

export type ShadowAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  light: string;
  dark: string;
};

export type FontPairAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  display: string;
  body: string;
  mono: string;
  note: string;
  noteZh: string;
  displayNote?: string;
  displayNoteZh?: string;
};

export type TypeScaleAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  fontSize: string;
  lineHeight: number;
  letterSpacing: string;
};

export type SpacingAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  pixels: number;
};

export type LayerAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  z: number;
};

export type BreakpointAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  minWidth: number;
};

export type DensityAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  rowHeight: number;
  padding: number;
};

export type LineAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  property: "border" | "box-shadow" | "outline";
  light: string;
  dark: string;
  offset?: string;
};

export type IconStyleAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  spec: string;
  specZh: string;
  rendering:
    | {
        mode: "stroke";
        strokeWidth: number;
        linecap: "round";
        linejoin: "miter" | "round";
      }
    | { mode: "fill" }
    | { mode: "duotone"; secondaryOpacity: number }
    | { mode: "pixel"; grid: 16 };
};

export type BackgroundAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  light: string;
  dark: string;
};

/**
 * A fade is orthogonal to a texture: any {@link BackgroundAtom} can wear any
 * fade. It carries no light/dark pair because a mask only decides *where* the
 * layer is visible, never what colour it is.
 */
export type BackgroundFadeAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  mask: string;
};

export type IconMotionPattern =
  | "draw"
  | "wiggle"
  | "spin"
  | "bounce"
  | "pop"
  | "pulse"
  | "nudge";

export type IconMotionAtom = {
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  prompt: string;
  promptZh: string;
  pattern: IconMotionPattern;
};

export type AtomCategorySlug =
  | "motion"
  | "shape"
  | "typography"
  | "spacing"
  | "lines"
  | "icons"
  | "backgrounds";

export type AtomSearchItem = {
  slug: string;
  category: AtomCategorySlug;
  name: string;
  nameZh: string;
  aliases: readonly string[];
};
