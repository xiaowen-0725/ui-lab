"use client";

import { useLocale } from "next-intl";
import { CtaBanner } from "@/components/sections/basics";

export function CtaBannerPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <CtaBanner locale={locale} />;
}
