"use client";

import { useLocale } from "next-intl";
import { NavbarSimple } from "@/components/sections/basics";

export function NavbarSimplePreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return <NavbarSimple locale={locale} />;
}
