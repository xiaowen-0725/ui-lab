"use client";

import { useLocale } from "next-intl";
import { FeaturesAlternating } from "@/components/sections/content";

export function FeaturesAlternatingPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <FeaturesAlternating locale={locale} />;
}
