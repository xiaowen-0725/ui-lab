"use client";

import type { ComponentProps } from "react";
import { FooterMinimal } from "@/components/sections/commerce";

// Supply your own content, data, and callbacks through the installed component's props.
export function FooterMinimalExample(props: ComponentProps<typeof FooterMinimal>) {
  return <FooterMinimal locale="zh" {...props} />;
}
