"use client";

import {
  Atom,
  CircleDashed,
  Droplets,
  FileText,
  Palette,
  PanelsTopLeft,
  Search,
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
import { ATOM_SEARCH_ITEMS } from "@/lib/atoms";
import { SECTIONS } from "@/lib/sections";
import { STYLES } from "@/lib/styles";
import { localizedName } from "@/lib/i18n-content";

const PAGES = [
  { slug: "ai-agents", labelKey: "aiAgents", href: "/docs/ai-agents" },
  {
    slug: "motion-patterns",
    labelKey: "motionGuides",
    href: "/docs/motion-patterns",
  },
] as const;

/** Site search trigger backed by the library's own command palette. */
export function SiteSearch({ className }: { className?: string }) {
  const router = useRouter();
  const locale = useLocale() as Locale;
  const t = useTranslations("search");
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
      ...PAGES.map((page) => ({
        id: page.slug,
        label: tSidebar(page.labelKey),
        group: t("pages"),
        keywords: [page.slug],
        icon: FileText,
        onSelect: () => router.push(page.href),
      })),
    ],
    [router, locale, t, tSidebar, tNav],
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
