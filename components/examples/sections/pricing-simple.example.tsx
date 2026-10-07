"use client";

import type { ComponentProps } from "react";
import { PricingSimple } from "@/components/sections/commerce";

// Supply your own content, data, and callbacks through the installed component's props.
export function PricingSimpleExample(props: ComponentProps<typeof PricingSimple>) {
  return <PricingSimple locale="zh" {...props} />;
}
