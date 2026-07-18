import { BACKGROUNDS } from "@/lib/atoms/backgrounds";
import { ICON_STYLES } from "@/lib/atoms/icons";
import { LINES } from "@/lib/atoms/lines";
import { MOTION_CURVES, MOTION_DURATIONS, MOTION_SPRINGS } from "@/lib/atoms/motion";
import { RADII, SHADOWS } from "@/lib/atoms/shape";
import { DENSITIES, SPACING_SCALE } from "@/lib/atoms/spacing";
import type { AtomCategorySlug, AtomSearchItem } from "@/lib/atoms/types";
import { FONT_PAIRS, TYPE_SCALE } from "@/lib/atoms/typography";

export * from "@/lib/atoms/export";
export * from "@/lib/atoms/backgrounds";
export * from "@/lib/atoms/icons";
export * from "@/lib/atoms/lines";
export * from "@/lib/atoms/motion";
export * from "@/lib/atoms/shape";
export * from "@/lib/atoms/spacing";
export * from "@/lib/atoms/typography";
export type * from "@/lib/atoms/types";

export const ATOM_CATEGORIES: readonly AtomCategorySlug[] = [
  "motion",
  "shape",
  "typography",
  "spacing",
  "lines",
  "icons",
  "backgrounds",
];

type SearchableAtom = Omit<AtomSearchItem, "category">;

function toAtomSearchItems(
  category: AtomCategorySlug,
  entries: readonly SearchableAtom[],
): AtomSearchItem[] {
  return entries.map((entry) => ({ ...entry, category }));
}

export const ATOM_SEARCH_ITEMS: readonly AtomSearchItem[] = [
  ...toAtomSearchItems("motion", [
    ...MOTION_CURVES,
    ...MOTION_SPRINGS,
    ...MOTION_DURATIONS,
  ]),
  ...toAtomSearchItems("shape", [...RADII, ...SHADOWS]),
  ...toAtomSearchItems("typography", [...FONT_PAIRS, ...TYPE_SCALE]),
  ...toAtomSearchItems("spacing", [...SPACING_SCALE, ...DENSITIES]),
  ...toAtomSearchItems("lines", LINES),
  ...toAtomSearchItems("icons", ICON_STYLES),
  ...toAtomSearchItems("backgrounds", BACKGROUNDS),
];
