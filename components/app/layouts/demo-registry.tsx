import type { ComponentType } from "react";
import { KimiHome } from "./demos/kimi";

/** Live full-page replica lookup, keyed by layout entry slug. */
export const LAYOUT_DEMOS: Record<string, ComponentType> = {
  kimi: KimiHome,
};
