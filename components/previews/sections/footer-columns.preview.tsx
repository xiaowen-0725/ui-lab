"use client";

import { useLocale } from "next-intl";
import { FooterColumns } from "@/components/sections/commerce";

export function FooterColumnsPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <FooterColumns locale={locale} />;
}
