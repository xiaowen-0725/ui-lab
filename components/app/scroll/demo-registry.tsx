import type { ComponentType } from "react";
import type { ScrollPatternSlug } from "@/lib/scroll";
import { HorizontalDemo } from "./demos/horizontal";
import { ParallaxDemo } from "./demos/parallax";
import { PinnedDemo } from "./demos/pinned";
import { ProgressDemo } from "./demos/progress";
import { RevealDemo } from "./demos/reveal";
import { SnapDemo } from "./demos/snap";
import { StackingDemo } from "./demos/stacking";
import { ZoomDemo } from "./demos/zoom";

/** Live demo lookup, keyed by ScrollPatternEntry.slug. */
export const SCROLL_DEMOS: Record<ScrollPatternSlug, ComponentType> = {
  parallax: ParallaxDemo,
  pinned: PinnedDemo,
  reveal: RevealDemo,
  progress: ProgressDemo,
  horizontal: HorizontalDemo,
  snap: SnapDemo,
  zoom: ZoomDemo,
  stacking: StackingDemo,
};
