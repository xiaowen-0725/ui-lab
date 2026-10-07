"use client";

import type { ComponentProps } from "react";
import { CtaBanner } from "@/components/sections/basics";

// Supply your own content, data, and callbacks through the installed component's props.
export function CtaBannerExample(props: ComponentProps<typeof CtaBanner>) {
  return <CtaBanner locale="zh" {...props} />;
}
