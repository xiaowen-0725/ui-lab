import type { ComponentType } from "react";
import {
  CtaBanner,
  CtaBoxed,
  LogoWallRow,
  NavbarCentered,
  NavbarSimple,
  StatsRow,
} from "./demos/basics";
import {
  FaqAccordion,
  FaqTwoColumn,
  FooterColumns,
  FooterMinimal,
  PricingSimple,
  PricingTiers,
} from "./demos/commerce";
import {
  FeaturesAlternating,
  FeaturesGrid,
  TestimonialCards,
  TestimonialQuote,
} from "./demos/content";
import { HeroCentered, HeroScreenshot, HeroSplit } from "./demos/hero";

/** Live demo lookup, keyed by `${entry.slug}/${variant.key}`. */
export const SECTION_DEMOS: Record<string, ComponentType> = {
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
};
