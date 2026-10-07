"use client";

import type { ComponentProps } from "react";
import { StatsRow } from "@/components/sections/basics";

// Supply your own content, data, and callbacks through the installed component's props.
export function StatsRowExample(props: ComponentProps<typeof StatsRow>) {
  return <StatsRow locale="zh" {...props} />;
}
