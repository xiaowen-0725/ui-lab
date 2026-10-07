"use client";

import { useLocale } from "next-intl";
import * as Sections from "@/components/sections/content";

export function FeaturesGrid() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.FeaturesGrid locale={locale} />;
}

export function FeaturesAlternating() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.FeaturesAlternating locale={locale} />;
}

export function TestimonialCards() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.TestimonialCards locale={locale} />;
}

export function TestimonialQuote() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.TestimonialQuote locale={locale} />;
}
