"use client";

import { useLocale } from "next-intl";
import { FooterMinimal } from "@/components/sections/commerce";

export function FooterMinimalPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <FooterMinimal locale={locale} />;
}
