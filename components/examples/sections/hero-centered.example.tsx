"use client";

import type { ComponentProps } from "react";
import { HeroCentered } from "@/components/sections/hero";

// Supply your own content, data, and callbacks through the installed component's props.
export function HeroCenteredExample(props: ComponentProps<typeof HeroCentered>) {
  return <HeroCentered locale="zh" {...props} />;
}
