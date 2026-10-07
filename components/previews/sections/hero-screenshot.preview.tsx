"use client";

import { useLocale } from "next-intl";
import { HeroScreenshot } from "@/components/sections/hero";

export function HeroScreenshotPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <HeroScreenshot locale={locale} />;
}
