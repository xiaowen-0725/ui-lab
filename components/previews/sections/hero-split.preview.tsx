"use client";

import { useLocale } from "next-intl";
import { HeroSplit } from "@/components/sections/hero";

export function HeroSplitPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <HeroSplit locale={locale} />;
}
