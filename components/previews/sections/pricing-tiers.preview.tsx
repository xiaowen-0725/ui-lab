"use client";

import { useLocale } from "next-intl";
import { PricingTiers } from "@/components/sections/commerce";

export function PricingTiersPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <PricingTiers locale={locale} />;
}
