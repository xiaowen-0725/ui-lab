"use client";

import { useLocale } from "next-intl";
import { TestimonialCards } from "@/components/sections/content";

export function TestimonialCardsPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <TestimonialCards locale={locale} />;
}
