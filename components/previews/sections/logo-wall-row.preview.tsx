"use client";

import { useLocale } from "next-intl";
import { LogoWallRow } from "@/components/sections/basics";

export function LogoWallRowPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <LogoWallRow locale={locale} />;
}
