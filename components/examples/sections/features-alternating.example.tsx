"use client";

import type { ComponentProps } from "react";
import { FeaturesAlternating } from "@/components/sections/content";

// Supply your own content, data, and callbacks through the installed component's props.
export function FeaturesAlternatingExample(props: ComponentProps<typeof FeaturesAlternating>) {
  return <FeaturesAlternating locale="zh" {...props} />;
}
