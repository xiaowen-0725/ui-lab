// Read-only projections of domain facts. Words and external references never
// acquire an installation command merely by appearing in the Catalog.
import type { CatalogItem } from "@/lib/catalog";
import { CONCEPTS } from "@/lib/concepts";
import { INSPIRATION_BRANDS, INSPIRATION_SITES, INSPIRATION_SOURCES } from "@/lib/inspiration";
import { MOTIONS } from "@/lib/motions";
import { LAYOUT_PATTERNS } from "@/lib/patterns";
import { SCROLL_PATTERNS } from "@/lib/scroll";
import { SECTION_ASSETS } from "@/lib/section-assets";
import { SECTIONS } from "@/lib/sections";
import { SITE_URL } from "@/lib/site";

export function buildVocabularyItems(): CatalogItem[] {
  const words: CatalogItem[] = [
    ...CONCEPTS.map((entry): CatalogItem => ({
      kind: "vocabulary", category: "concept", slug: `concept-${entry.slug}`,
      name: entry.name, nameZh: entry.nameZh, aliases: entry.aliases,
      description: entry.sentence, descriptionZh: entry.sentenceZh,
      prompt: entry.prompt, promptZh: entry.promptZh,
      pageUrl: `${SITE_URL}/dictionary/concepts/${entry.slug}`,
      ...(entry.confusableWith?.length ? { confusableWith: entry.confusableWith.map((slug) => `concept-${slug}`) } : {}),
      ...(entry.crossNames ? { crossNames: entry.crossNames } : {}),
      fetch: { method: "copy-prompt", value: entry.prompt },
      related: entry.component ? [{ kind: "component", slug: entry.component.installSlug }] : entry.related ? [{ kind: "component", slug: entry.related.slug }] : [],
    })),
    ...MOTIONS.map((entry): CatalogItem => ({
      kind: "vocabulary", category: "motion", slug: `motion-${entry.slug}`,
      name: entry.name, nameZh: entry.nameZh, aliases: entry.aliases,
      description: entry.sentence, descriptionZh: entry.sentenceZh,
      prompt: entry.prompt, promptZh: entry.promptZh,
      pageUrl: `${SITE_URL}/dictionary/motion/${entry.slug}`,
      fetch: { method: "copy-prompt", value: entry.prompt },
      related: entry.component ? [{ kind: "component", slug: entry.component.installSlug }] : entry.related ? [{ kind: "component", slug: entry.related.slug }] : [],
    })),
    ...LAYOUT_PATTERNS.map((entry): CatalogItem => ({
      kind: "vocabulary", category: "layout-pattern", slug: `layout-${entry.slug}`,
      name: entry.name, nameZh: entry.nameZh, aliases: entry.aliases,
      description: entry.whenUse, descriptionZh: entry.whenUseZh,
      prompt: entry.promptEn, promptZh: entry.promptZh,
      pageUrl: `${SITE_URL}/patterns#${entry.slug}`,
      fetch: { method: "copy-tokens", value: entry.recipe },
    })),
    ...SCROLL_PATTERNS.map((entry): CatalogItem => ({
      kind: "vocabulary", category: "scroll-pattern", slug: `scroll-${entry.slug}`,
      name: entry.name, nameZh: entry.nameZh, aliases: entry.aliases,
      description: entry.whenUse, descriptionZh: entry.whenUseZh,
      prompt: entry.promptEn, promptZh: entry.promptZh,
      pageUrl: `${SITE_URL}/scroll#${entry.slug}`,
      fetch: { method: "copy-tokens", value: entry.recipe },
    })),
    ...SECTIONS.map((entry): CatalogItem => ({
      kind: "vocabulary", category: "section-anatomy", slug: `section-${entry.slug}`,
      name: entry.name, nameZh: entry.nameZh, aliases: entry.aliases,
      description: entry.description, descriptionZh: entry.descriptionZh,
      prompt: entry.recipe.join("\n"), promptZh: entry.recipeZh.join("\n"),
      pageUrl: `${SITE_URL}/sections?section=${entry.slug}`,
      fetch: { method: "copy-prompt", value: entry.recipe.join("\n") },
      related: SECTION_ASSETS.filter((asset) => asset.sectionSlug === entry.slug).map((asset) => ({ kind: "component" as const, slug: asset.slug })),
    })),
  ];
  return words;
}

export function buildReferenceItems(): CatalogItem[] {
  return [
    ...INSPIRATION_SOURCES.map((entry): CatalogItem => ({
      kind: "reference", category: "source", slug: `source-${entry.slug}`,
      name: entry.name, nameZh: entry.nameZh, aliases: entry.aliases,
      description: entry.description, descriptionZh: entry.descriptionZh,
      pageUrl: `${SITE_URL}/inspiration#${entry.slug}`,
      fetch: { method: "endpoint", endpoint: entry.url },
      reference: { url: entry.url, rightsStatus: entry.rightsStatus, provenance: entry.provenance, reviewedAt: entry.reviewedAt },
    })),
    ...INSPIRATION_SITES.map((entry): CatalogItem => ({
      kind: "reference", category: "site", slug: `site-${entry.slug}`,
      name: entry.name, nameZh: entry.nameZh, aliases: entry.aliases,
      description: entry.description, descriptionZh: entry.descriptionZh,
      pageUrl: `${SITE_URL}/inspiration/sites/${entry.slug}`,
      fetch: { method: "endpoint", endpoint: entry.url },
      reference: { url: entry.url, rightsStatus: entry.rightsStatus, provenance: entry.provenance, reviewedAt: entry.reviewedAt },
    })),
    ...INSPIRATION_BRANDS.map((entry): CatalogItem => ({
      kind: "reference", category: "brand", slug: `brand-${entry.slug}`,
      name: entry.name, nameZh: entry.nameZh, aliases: [entry.folder],
      description: entry.description, descriptionZh: entry.descriptionZh,
      pageUrl: `${SITE_URL}/inspiration/brands/${entry.slug}`,
      fetch: { method: "endpoint", endpoint: entry.getDesignUrl },
      reference: { url: entry.officialUrl, rightsStatus: entry.brandAssetRights, documentLicense: entry.documentLicense, provenance: [{ url: entry.sourceBrowseUrl, kind: "upstream-document" }], reviewedAt: entry.reviewedAt },
    })),
  ];
}
