import { CtaBanner, CtaBoxed, LogoWallRow, NavbarCentered, NavbarSimple, StatsRow } from "./basics";
import {
  FaqAccordion,
  FaqTwoColumn,
  FooterColumns,
  FooterMinimal,
  PricingSimple,
  PricingTiers,
} from "./commerce";
import { FeaturesAlternating, FeaturesGrid, TestimonialCards, TestimonialQuote } from "./content";
import { HeroCentered, HeroScreenshot, HeroSplit } from "./hero";

/** All 19 distributable variants; no Catalog or site metadata in source. */
export const SECTION_VARIANTS = {
  "navbar/simple": NavbarSimple,
  "navbar/centered": NavbarCentered,
  "hero/centered": HeroCentered,
  "hero/split": HeroSplit,
  "hero/screenshot": HeroScreenshot,
  "logo-wall/row": LogoWallRow,
  "features/grid": FeaturesGrid,
  "features/alternating": FeaturesAlternating,
  "stats/row": StatsRow,
  "testimonials/cards": TestimonialCards,
  "testimonials/quote": TestimonialQuote,
  "pricing/tiers": PricingTiers,
  "pricing/simple": PricingSimple,
  "faq/accordion": FaqAccordion,
  "faq/two-column": FaqTwoColumn,
  "cta/banner": CtaBanner,
  "cta/boxed": CtaBoxed,
  "footer/columns": FooterColumns,
  "footer/minimal": FooterMinimal,
} as const;

export * from "./basics";
export * from "./hero";
export * from "./content";
export * from "./commerce";
export type { SectionProps, SectionContent } from "./shared";
