"use client";

import { useId } from "react";
import {
  NavbarSimple,
  CtaBanner,
  LogoWallRow,
  StatsRow,
  type NavbarSimpleProps,
  type CtaBannerProps,
  type LogoWallRowProps,
  type StatsRowProps,
} from "@/components/sections/basics";
import { HeroScreenshot, type HeroScreenshotProps } from "@/components/sections/hero";
import {
  FeaturesGrid,
  FeaturesAlternating,
  TestimonialCards,
  type FeaturesGridProps,
  type FeaturesAlternatingProps,
  type TestimonialCardsProps,
} from "@/components/sections/content";
import {
  PricingTiers,
  FaqAccordion,
  FooterColumns,
  type PricingTiersProps,
  type FaqAccordionProps,
  type FooterColumnsProps,
} from "@/components/sections/commerce";
import { cn } from "@/lib/utils";
import { type ApplicationPageState, PageState, type PageStateContent } from "./page-state";

export interface SaasLandingContent {
  navbar?: NavbarSimpleProps["content"];
  hero?: HeroScreenshotProps["content"];
  logos?: LogoWallRowProps["content"];
  features?: FeaturesGridProps["content"];
  alternating?: FeaturesAlternatingProps["content"];
  stats?: StatsRowProps["content"];
  testimonials?: TestimonialCardsProps["content"];
  pricing?: PricingTiersProps["content"];
  faq?: FaqAccordionProps["content"];
  cta?: CtaBannerProps["content"];
  footer?: FooterColumnsProps["content"];
  status?: Partial<PageStateContent>;
  navigationLabel?: string;
  menu?: string;
}
export interface SaasLandingPageProps {
  locale?: "zh" | "en";
  content?: SaasLandingContent;
  media?: HeroScreenshotProps["media"];
  featureMedia?: FeaturesAlternatingProps["media"];
  state?: ApplicationPageState;
  showPricing?: boolean;
  /** The same section action keys are forwarded without business assumptions. */
  onAction?: (action: string) => void;
  hrefs?: Readonly<Record<string, string>>;
  className?: string;
}

/** Complete section composition; product claims/assets can all be replaced. */
export function SaasLandingPage({
  locale = "zh",
  content = {},
  media,
  featureMedia,
  state = "ready",
  showPricing = true,
  onAction,
  hrefs,
  className,
}: SaasLandingPageProps) {
  const prefix = useId().replace(/:/g, "");
  const ids = {
    features: `${prefix}-features`,
    pricing: `${prefix}-pricing`,
    faq: `${prefix}-faq`,
    about: `${prefix}-about`,
    start: `${prefix}-start`,
  };
  const links =
    content.navbar?.links ??
    (locale === "zh" ? ["产品", "定价", "文档", "关于"] : ["Product", "Pricing", "Docs", "About"]);
  const destinations = [ids.features, showPricing ? ids.pricing : ids.start, ids.faq, ids.about];
  const sectionHrefs: Record<string, string> = {
    primary: `#${showPricing ? ids.pricing : ids.start}`,
    secondary: `#${ids.features}`,
    start: `#${showPricing ? ids.pricing : ids.start}`,
    ...Object.fromEntries(
      links.map((label, index) => [label, `#${destinations[index % destinations.length]}`]),
    ),
    ...hrefs,
  };
  const shared = { locale, onAction, hrefs: sectionHrefs };
  return (
    <div lang={locale} className={cn("w-full bg-background text-foreground", className)}>
      <NavbarSimple {...shared} content={{ ...content.navbar, links }} />
      <details className="border-b border-border px-6 py-3 sm:hidden">
        <summary className="cursor-pointer text-sm">
          {content.menu ?? (locale === "zh" ? "页面导航" : "Page navigation")}
        </summary>
        <nav
          aria-label={content.navigationLabel ?? (locale === "zh" ? "页面导航" : "Page navigation")}
          className="mt-3 flex flex-wrap gap-4"
        >
          {links.map((label) => (
            <a
              key={label}
              href={sectionHrefs[label]}
              className="text-sm text-muted-foreground"
              onClick={() => onAction?.(label)}
            >
              {label}
            </a>
          ))}
        </nav>
      </details>
      <main aria-busy={state === "loading"}>
        {state === "ready" ? (
          <div className="mx-auto max-w-6xl">
            <HeroScreenshot {...shared} headingLevel="h1" content={content.hero} media={media} />
            <LogoWallRow {...shared} content={content.logos} />
            <div id={ids.features}>
              <FeaturesGrid {...shared} content={content.features} />
              <FeaturesAlternating {...shared} content={content.alternating} media={featureMedia} />
            </div>
            <StatsRow {...shared} content={content.stats} />
            <div id={ids.about}>
              <TestimonialCards {...shared} content={content.testimonials} />
            </div>
            {showPricing ? (
              <div id={ids.pricing}>
                <PricingTiers {...shared} content={content.pricing} />
              </div>
            ) : null}
            <div id={ids.faq}>
              <FaqAccordion {...shared} content={content.faq} />
            </div>
            <div id={ids.start}>
              <CtaBanner {...shared} content={content.cta} />
            </div>
          </div>
        ) : (
          <PageState
            state={state}
            locale={locale}
            content={content.status}
            onRetry={onAction ? () => onAction("retry") : undefined}
          />
        )}
      </main>
      <FooterColumns {...shared} content={content.footer} className="mx-auto max-w-6xl" />
    </div>
  );
}
