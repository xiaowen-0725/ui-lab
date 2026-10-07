"use client";

import type { ComponentProps } from "react";
import { FeaturesGrid } from "@/components/sections/content";

// Supply your own content, data, and callbacks through the installed component's props.
export function FeaturesGridExample(props: ComponentProps<typeof FeaturesGrid>) {
  return <FeaturesGrid locale="zh" {...props} />;
}
