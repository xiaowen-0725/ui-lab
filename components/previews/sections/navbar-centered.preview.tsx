"use client";

import { useLocale } from "next-intl";
import { NavbarCentered } from "@/components/sections/basics";

export function NavbarCenteredPreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <NavbarCentered locale={locale} />;
}
