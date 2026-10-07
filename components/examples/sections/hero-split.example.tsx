"use client";

import type { ComponentProps } from "react";
import { HeroSplit } from "@/components/sections/hero";

// Supply your own content, data, and callbacks through the installed component's props.
export function HeroSplitExample(props: ComponentProps<typeof HeroSplit>) {
  return <HeroSplit locale="zh" {...props} />;
}
