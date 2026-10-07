"use client";

import type { ComponentProps } from "react";
import { FaqTwoColumn } from "@/components/sections/commerce";

// Supply your own content, data, and callbacks through the installed component's props.
export function FaqTwoColumnExample(props: ComponentProps<typeof FaqTwoColumn>) {
  return <FaqTwoColumn locale="zh" {...props} />;
}
