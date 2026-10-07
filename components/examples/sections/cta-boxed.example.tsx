"use client";

import type { ComponentProps } from "react";
import { CtaBoxed } from "@/components/sections/basics";

// Supply your own content, data, and callbacks through the installed component's props.
export function CtaBoxedExample(props: ComponentProps<typeof CtaBoxed>) {
  return <CtaBoxed locale="zh" {...props} />;
}
