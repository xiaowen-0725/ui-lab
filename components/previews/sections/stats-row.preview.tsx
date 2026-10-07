"use client";

import { useLocale } from "next-intl";
import { StatsRow } from "@/components/sections/basics";

export function StatsRowPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <StatsRow locale={locale} />;
}
