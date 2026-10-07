"use client";

import type { ComponentProps } from "react";
import { FooterColumns } from "@/components/sections/commerce";

// Supply your own content, data, and callbacks through the installed component's props.
export function FooterColumnsExample(props: ComponentProps<typeof FooterColumns>) {
  return <FooterColumns locale="zh" {...props} />;
}
