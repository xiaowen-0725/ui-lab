import { SECTIONS } from "@/lib/sections";

/** Source/export identity for each distributable variant. Demonstrations and
 * pages import these same implementations; they are not separate templates. */
export const SECTION_EXPORTS: Readonly<Record<string, { module: string; exportName: string }>> = {
  "navbar/simple": { module: "basics", exportName: "NavbarSimple" },
  "navbar/centered": { module: "basics", exportName: "NavbarCentered" },
  "hero/centered": { module: "hero", exportName: "HeroCentered" },
  "hero/split": { module: "hero", exportName: "HeroSplit" },
  "hero/screenshot": { module: "hero", exportName: "HeroScreenshot" },
  "logo-wall/row": { module: "basics", exportName: "LogoWallRow" },
  "features/grid": { module: "content", exportName: "FeaturesGrid" },
  "features/alternating": { module: "content", exportName: "FeaturesAlternating" },
  "stats/row": { module: "basics", exportName: "StatsRow" },
  "testimonials/cards": { module: "content", exportName: "TestimonialCards" },
  "testimonials/quote": { module: "content", exportName: "TestimonialQuote" },
  "pricing/tiers": { module: "commerce", exportName: "PricingTiers" },
  "pricing/simple": { module: "commerce", exportName: "PricingSimple" },
  "faq/accordion": { module: "commerce", exportName: "FaqAccordion" },
  "faq/two-column": { module: "commerce", exportName: "FaqTwoColumn" },
  "cta/banner": { module: "basics", exportName: "CtaBanner" },
  "cta/boxed": { module: "basics", exportName: "CtaBoxed" },
  "footer/columns": { module: "commerce", exportName: "FooterColumns" },
  "footer/minimal": { module: "commerce", exportName: "FooterMinimal" },
};

export const SECTION_ASSETS = SECTIONS.flatMap((section) => section.variants.map((variant) => {
  const implementation = SECTION_EXPORTS[`${section.slug}/${variant.key}`];
  if (!implementation) throw new Error(`Missing section implementation ${section.slug}/${variant.key}`);
  const slug = `${section.slug}-${variant.key}`;
  return {
    slug, sectionSlug: section.slug, variantKey: variant.key,
    name: `${section.name} · ${variant.name}`, nameZh: `${section.nameZh} · ${variant.nameZh}`,
    description: variant.whenToUse, descriptionZh: variant.whenToUseZh,
    file: `components/sections/${implementation.module}.tsx`,
    exportName: implementation.exportName,
    previewFile: `components/previews/sections/${slug}.preview.tsx`,
  };
}));
