"use client";

import { useLocale } from "next-intl";
import { FaqAccordion } from "@/components/sections/commerce";

export function FaqAccordionPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <FaqAccordion locale={locale} />;
}
