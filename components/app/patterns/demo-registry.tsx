import type { ComponentType } from "react";
import type { LayoutPatternSlug } from "@/lib/patterns";
import {
  CanvasDemo,
  CenteredDemo,
  DashboardDemo,
  HolyGrailDemo,
  ListDetailDemo,
  SidebarDemo,
  SplitDemo,
  ThreePaneDemo,
} from "./demos/layout-patterns";

/** Live wireframe lookup, keyed by LayoutPatternEntry.slug. */
export const PATTERN_DEMOS: Record<LayoutPatternSlug, ComponentType> = {
  centered: CenteredDemo,
  sidebar: SidebarDemo,
  "holy-grail": HolyGrailDemo,
  split: SplitDemo,
  "three-pane": ThreePaneDemo,
  dashboard: DashboardDemo,
  "list-detail": ListDetailDemo,
  canvas: CanvasDemo,
};
