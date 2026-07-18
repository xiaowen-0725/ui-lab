import { MOTION_CURVES, MOTION_DURATIONS, MOTION_SPRINGS } from "@/lib/atoms/motion";
import { RADII, SHADOWS } from "@/lib/atoms/shape";
import type { AtomCategorySlug, AtomSearchItem } from "@/lib/atoms/types";
import { FONT_PAIRS, TYPE_SCALE } from "@/lib/atoms/typography";

export * from "@/lib/atoms/motion";
export * from "@/lib/atoms/shape";
export * from "@/lib/atoms/typography";
export type * from "@/lib/atoms/types";

export const ATOM_CATEGORIES: readonly AtomCategorySlug[] = [
  "motion",
  "shape",
  "typography",
];

export const ATOM_SEARCH_ITEMS: readonly AtomSearchItem[] = [
  ...[...MOTION_CURVES, ...MOTION_SPRINGS, ...MOTION_DURATIONS].map((entry) => ({
    slug: entry.slug,
    category: "motion" as const,
    name: entry.name,
    nameZh: entry.nameZh,
    aliases: entry.aliases,
  })),
  ...[...RADII, ...SHADOWS].map((entry) => ({
    slug: entry.slug,
    category: "shape" as const,
    name: entry.name,
    nameZh: entry.nameZh,
    aliases: entry.aliases,
  })),
  ...[...FONT_PAIRS, ...TYPE_SCALE].map((entry) => ({
    slug: entry.slug,
    category: "typography" as const,
    name: entry.name,
    nameZh: entry.nameZh,
    aliases: entry.aliases,
  })),
];
