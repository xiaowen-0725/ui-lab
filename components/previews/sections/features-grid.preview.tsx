"use client";

import { useLocale } from "next-intl";
import { FeaturesGrid } from "@/components/sections/content";

export function FeaturesGridPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <FeaturesGrid locale={locale} />;
}
