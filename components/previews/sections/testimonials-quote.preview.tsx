"use client";

import { useLocale } from "next-intl";
import { TestimonialQuote } from "@/components/sections/content";

export function TestimonialQuotePreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <TestimonialQuote locale={locale} />;
}
