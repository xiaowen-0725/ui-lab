"use client";

import { useLocale } from "next-intl";
import { HeroCentered } from "@/components/sections/hero";

export function HeroCenteredPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <HeroCentered locale={locale} />;
}
