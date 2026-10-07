"use client";

import { useLocale } from "next-intl";
import * as Sections from "@/components/sections/commerce";

export function PricingTiers() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.PricingTiers locale={locale} />;
}

export function PricingSimple() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.PricingSimple locale={locale} />;
}

export function FaqAccordion() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.FaqAccordion locale={locale} />;
}

export function FaqTwoColumn() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.FaqTwoColumn locale={locale} />;
}

export function FooterColumns() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.FooterColumns locale={locale} />;
}

export function FooterMinimal() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.FooterMinimal locale={locale} />;
}
