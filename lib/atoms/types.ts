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

export type AtomCategorySlug = "motion" | "shape" | "typography";

export type AtomSearchItem = {
  slug: string;
  category: AtomCategorySlug;
  name: string;
  nameZh: string;
  aliases: readonly string[];
};
