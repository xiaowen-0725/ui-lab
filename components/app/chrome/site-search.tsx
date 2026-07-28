"use client";

import {
  Atom,
  CircleDashed,
  Droplets,
  FileText,
  Lightbulb,
  LayoutTemplate,
  MoveVertical,
  Palette,
  PanelsTopLeft,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
  CommandPalette,
  type CommandItem,
} from "@/components/motion/command-palette";
import { NewBadge } from "@/components/app/docs/new-badge";
import { registry } from "@/lib/registry";
import { PALETTES } from "@/lib/palettes";
import { LAYOUT_PATTERNS } from "@/lib/patterns";
import { ATOM_SEARCH_ITEMS } from "@/lib/atoms";
import { SECTIONS } from "@/lib/sections";
import { SCROLL_PATTERNS } from "@/lib/scroll";
import { STYLES } from "@/lib/styles";
import { localizedName } from "@/lib/i18n-content";
import { INSPIRATION_SOURCES } from "@/lib/inspiration";
import { INSPIRATION_BRANDS } from "@/lib/inspiration-brands";
import {
  INSPIRATION_COLLECTION_META,
  INSPIRATION_DOMAIN_META,
} from "@/lib/inspiration-taxonomy";
import { INSPIRATION_SITES } from "@/lib/inspiration-sites";

const PAGES = [
  { slug: "ai-agents", labelKey: "aiAgents", href: "/docs/ai-agents" },
  {
    slug: "motion-patterns",
    labelKey: "motionGuides",
    href: "/docs/motion-patterns",
  },
] as const;

const INSPIRATION_DOMAIN_NAMES = new Map(
  INSPIRATION_DOMAIN_META.map((domain) => [
    domain.key,
    [domain.name, domain.nameZh],
  ]),
);

const INSPIRATION_COLLECTION_NAMES = new Map(
  INSPIRATION_COLLECTION_META.map((collection) => [
    collection.key,
    [collection.name, collection.nameZh],
  ]),
);

/** Site search trigger backed by the library's own command palette. */
export function SiteSearch({ className }: { className?: string }) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("search");
  const tInspiration = useTranslations("inspiration");
  const tSidebar = useTranslations("sidebar");
  const tNav = useTranslations("nav");
  const [open, setOpen] = useState(false);

  const items = useMemo<CommandItem[]>(
    () => [
      ...registry.flatMap((cat) =>
        cat.components.map((comp) => ({
          id: `${cat.slug}-${comp.slug}`,
          label: localizedName(comp, locale),
          group: localizedName(cat, locale),
          // Keep both languages searchable regardless of active locale.
          keywords: [
            comp.slug,
            comp.name,
            comp.nameZh ?? "",
            cat.name,
            cat.nameZh ?? "",
          ].filter(Boolean),
          icon: CircleDashed,
          badge: comp.badge === "new" ? <NewBadge /> : undefined,
          onSelect: () => router.push(`/components/${cat.slug}/${comp.slug}`),
        })),
      ),
      // Styles are searchable by every alias — typing "毛玻璃" lands on
      // glassmorphism. The vocabulary layer is the point of the module.
      ...STYLES.map((style) => ({
        id: `style-${style.slug}`,
        label: localizedName(style, locale),
        group: tNav("styles"),
        keywords: [
          style.slug,
          style.name,
          style.nameZh,
          ...style.aliases,
        ].filter(Boolean),
        icon: Palette,
        onSelect: () => router.push(`/styles?style=${style.slug}`),
      })),
      ...PALETTES.map((palette) => ({
        id: `palette-${palette.slug}`,
        label: localizedName(palette, locale),
        group: tNav("palettes"),
        keywords: [
          palette.slug,
          palette.name,
          palette.nameZh,
          ...palette.aliases,
        ].filter(Boolean),
        icon: Droplets,
        onSelect: () => router.push(`/palettes?palette=${palette.slug}`),
      })),
      ...SECTIONS.map((section) => ({
        id: `section-${section.slug}`,
        label: localizedName(section, locale),
        group: tNav("sections"),
        keywords: [
          section.slug,
          section.name,
          section.nameZh,
          ...section.aliases,
        ].filter(Boolean),
        icon: PanelsTopLeft,
        onSelect: () => router.push(`/sections?section=${section.slug}`),
      })),
      ...LAYOUT_PATTERNS.map((pattern) => ({
        id: `pattern-${pattern.slug}`,
        label: localizedName(pattern, locale),
        group: tNav("patterns"),
        keywords: [
          pattern.slug,
          pattern.name,
          pattern.nameZh,
          ...pattern.aliases,
        ].filter(Boolean),
        icon: LayoutTemplate,
        onSelect: () => router.push(`/patterns#${pattern.slug}`),
      })),
      ...SCROLL_PATTERNS.map((pattern) => ({
        id: `scroll-${pattern.slug}`,
        label: localizedName(pattern, locale),
        group: tNav("scroll"),
        keywords: [
          pattern.slug,
          pattern.name,
          pattern.nameZh,
          ...pattern.aliases,
        ].filter(Boolean),
        icon: MoveVertical,
        onSelect: () => router.push(`/scroll#${pattern.slug}`),
      })),
      ...ATOM_SEARCH_ITEMS.map((atom) => ({
        id: `atom-${atom.category}-${atom.slug}`,
        label: locale === "zh" ? atom.nameZh : atom.name,
        group: tNav("atoms"),
        keywords: [
          atom.slug,
          atom.name,
          atom.nameZh,
          ...atom.aliases,
        ].filter(Boolean),
        icon: Atom,
        onSelect: () => router.push(`/atoms?cat=${atom.category}#${atom.slug}`),
      })),
      ...INSPIRATION_SOURCES.map((source) => ({
        id: `inspiration-${source.slug}`,
        label: localizedName(source, locale),
        group: tNav("inspiration"),
        keywords: [
          source.name,
          source.nameZh,
          ...source.aliases,
          new URL(source.canonicalUrl).hostname,
          ...source.contentTypes,
          ...source.useCases,
          ...source.visualTraits,
        ].filter(Boolean),
        icon: Lightbulb,
        onSelect: () => router.push(`/inspiration#${source.slug}`),
      })),
      ...INSPIRATION_SITES.map((site) => ({
        id: `inspiration-site-${site.slug}`,
        label: localizedName(site, locale),
        group: tInspiration("sitesTitle"),
        keywords: [
          site.name,
          site.nameZh,
          ...site.aliases,
          new URL(site.canonicalUrl).hostname,
          site.domain,
          ...(INSPIRATION_DOMAIN_NAMES.get(site.domain) ?? []),
          ...site.pageTypes,
          ...site.visualTraits,
          ...site.badges,
        ].filter(Boolean),
        icon: Lightbulb,
        onSelect: () => router.push(`/inspiration/sites/${site.slug}`),
      })),
      ...INSPIRATION_BRANDS.map((brand) => ({
        id: `inspiration-brand-${brand.slug}`,
        label: localizedName(brand, locale),
        group: tInspiration("brandsTitle"),
        keywords: [
          brand.name,
          brand.nameZh,
          brand.description,
          brand.descriptionZh,
          brand.domain,
          ...(INSPIRATION_DOMAIN_NAMES.get(brand.domain) ?? []),
          ...brand.collections,
          ...brand.collections.flatMap(
            (collection) => INSPIRATION_COLLECTION_NAMES.get(collection) ?? [],
          ),
        ],
        icon: Lightbulb,
        onSelect: () => router.push(`/inspiration/brands/${brand.slug}`),
      })),
      {
        id: "studio",
        label: tNav("studio"),
        group: t("pages"),
        keywords: [
          "studio",
          "工坊",
          "设计系统生成器",
          "自定义主题",
          "design system generator",
          "custom theme",
        ],
        icon: SlidersHorizontal,
        onSelect: () => router.push("/studio"),
      },
      ...PAGES.map((page) => ({
        id: page.slug,
        label: tSidebar(page.labelKey),
        group: t("pages"),
        keywords: [page.slug],
        icon: FileText,
        onSelect: () => router.push(page.href),
      })),
    ],
    [router, locale, t, tInspiration, tSidebar, tNav],
  );

  return (
    <>
      <button
        type="button"
        aria-label={t("aria")}
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-full border border-border bg-card px-3 text-sm text-muted-foreground transition-colors hover:border-(--color-border-strong) hover:text-foreground",
          className,
        )}
      >
        <Search className="h-3.5 w-3.5 shrink-0" />
        <span className="hidden flex-1 text-left sm:block">{t("trigger")}</span>
        <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground md:inline-block">
          ⌘K
        </kbd>
      </button>
      <CommandPalette
        items={items}
        open={open}
        onOpenChange={setOpen}
        placeholder={t("placeholder")}
      />
    </>
  );
}
