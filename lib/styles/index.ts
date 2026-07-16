// Source of truth for the Styles module (风格样本册).
// Each entry follows the site-wide formula: live sample (skin) + names/aliases
// + "say this to AI" prompt (positive moves + forbidden list) + core recipe.
// Skins are semantic CSS custom properties (--st-*) consumed by the style demo,
// so a future registry:theme export can reuse them as-is.
//
// Data is split per group so batches can land independently; assembly order
// here follows STYLE_GROUPS, and the explorer regroups by `group` anyway.

import { materialStyles } from "./material";
import { minimalStyles } from "./minimal";
import { otherStyles } from "./others";
import { rawStyles } from "./raw";
import { retroClassicStyles } from "./retro-classic";
import { retroPopStyles } from "./retro-pop";
import { techStyles } from "./tech";
import type { StyleEntry } from "./types";

export { STYLE_GROUPS } from "./types";
export type { StyleEntry, StyleGroup, StyleGroupKey, StyleSkin } from "./types";

export const STYLES: StyleEntry[] = [
  ...materialStyles,
  ...rawStyles,
  ...minimalStyles,
  ...retroPopStyles,
  ...retroClassicStyles,
  ...techStyles,
  ...otherStyles,
];
