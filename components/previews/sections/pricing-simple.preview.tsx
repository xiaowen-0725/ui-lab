"use client";

import { useLocale } from "next-intl";
import { PricingSimple } from "@/components/sections/commerce";

export function PricingSimplePreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <PricingSimple locale={locale} />;
}
