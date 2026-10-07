"use client";

import type { ComponentProps } from "react";
import { HeroScreenshot } from "@/components/sections/hero";

// Supply your own content, data, and callbacks through the installed component's props.
export function HeroScreenshotExample(props: ComponentProps<typeof HeroScreenshot>) {
  return <HeroScreenshot locale="zh" {...props} />;
}
