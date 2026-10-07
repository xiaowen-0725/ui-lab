"use client";

import { useLocale } from "next-intl";
import { CtaBoxed } from "@/components/sections/basics";

export function CtaBoxedPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <CtaBoxed locale={locale} />;
}
