"use client";

import { useLocale } from "next-intl";
import * as Sections from "@/components/sections/hero";

export function HeroCentered() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.HeroCentered locale={locale} />;
}

export function HeroSplit() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.HeroSplit locale={locale} />;
}

export function HeroScreenshot() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.HeroScreenshot locale={locale} />;
}
