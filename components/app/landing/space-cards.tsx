"use client";

import type { LucideIcon } from "lucide-react";
import {
  AppWindow,
  ArrowUpRight,
  BookOpen,
  Component,
  LayoutGrid,
  Lightbulb,
  PanelsTopLeft,
  SwatchBook,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { NAV_SPACES, type NavKey } from "@/lib/nav";

const SPACE_META: Record<NavKey, { icon: LucideIcon; descKey: string } | null> = {
  dictionary: { icon: BookOpen, descKey: "spaceDictionaryDesc" },
  concepts: null,
  motion: null,
  components: { icon: Component, descKey: "spaceComponentsDesc" },
  blocks: { icon: LayoutGrid, descKey: "spaceBlocksDesc" },
  pages: { icon: PanelsTopLeft, descKey: "spacePagesDesc" },
  sites: { icon: AppWindow, descKey: "spaceSitesDesc" },
  themes: { icon: SwatchBook, descKey: "spaceThemesDesc" },
  inspiration: { icon: Lightbulb, descKey: "spaceInspirationDesc" },
};

/** Landing entry cards for the top-level doors. */
export function SpaceCards() {
  const tNav = useTranslations("nav");
  const tLanding = useTranslations("landing");

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {NAV_SPACES.map((space) => {
        const meta = SPACE_META[space.key];
        if (!meta) return null;
        const Icon = meta.icon;
        return (
          <Link
            key={space.key}
            href={space.href}
            className="group flex flex-col gap-4 rounded-3xl border border-border bg-card/20 p-6 transition-colors hover:border-(--color-border-strong)"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/40 text-muted-foreground transition-colors group-hover:text-foreground">
              <Icon className="h-4 w-4" />
            </span>
            <span>
              <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                {tNav(space.key)}
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {tLanding(meta.descKey)}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
