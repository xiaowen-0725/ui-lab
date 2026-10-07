"use client";

import { useLocale } from "next-intl";
import { FaqTwoColumn } from "@/components/sections/commerce";

export function FaqTwoColumnPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <FaqTwoColumn locale={locale} />;
}
