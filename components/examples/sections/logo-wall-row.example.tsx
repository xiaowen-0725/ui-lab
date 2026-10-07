"use client";

import type { ComponentProps } from "react";
import { LogoWallRow } from "@/components/sections/basics";

// Supply your own content, data, and callbacks through the installed component's props.
export function LogoWallRowExample(props: ComponentProps<typeof LogoWallRow>) {
  return <LogoWallRow locale="zh" {...props} />;
}
