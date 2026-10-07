"use client";

import { useLocale } from "next-intl";
import * as Sections from "@/components/sections/basics";

export function NavbarSimple() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.NavbarSimple locale={locale} />;
}

export function NavbarCentered() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.NavbarCentered locale={locale} />;
}

export function LogoWallRow() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.LogoWallRow locale={locale} />;
}

export function StatsRow() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.StatsRow locale={locale} />;
}

export function CtaBanner() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.CtaBanner locale={locale} />;
}

export function CtaBoxed() {
  const locale = useLocale() === "zh" ? "zh" : "en";
  return <Sections.CtaBoxed locale={locale} />;
}
