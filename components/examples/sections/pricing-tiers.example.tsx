"use client";

import type { ComponentProps } from "react";
import { PricingTiers } from "@/components/sections/commerce";

// Supply your own content, data, and callbacks through the installed component's props.
export function PricingTiersExample(props: ComponentProps<typeof PricingTiers>) {
  return <PricingTiers locale="zh" {...props} />;
}
