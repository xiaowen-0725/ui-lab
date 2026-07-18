// Source of truth for the Layouts module (整站版式).
// Whole-page shells reverse-recreated from real products. Same site-wide
// formula: live sample + names/aliases + source + "say this to AI" prompt +
// recipe. The unit is a page *layout archetype*, one per real site.

import { kimiLayout } from "./kimi";
import type { LayoutEntry } from "./types";

export { DESIGN_SYSTEMS, graphiteDesignSystem } from "./design-systems";
export type { WbSkinBase } from "./skin";
export { makeWbSkin } from "./skin";
export type { DesignSystemEntry, LayoutEntry, WorkbenchSkin } from "./types";

export const LAYOUTS: LayoutEntry[] = [kimiLayout];
