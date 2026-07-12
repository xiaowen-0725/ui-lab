"use client";

import { CircleDashed, FileText, Search } from "lucide-react";
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
      ...PAGES.map((page) => ({
        id: page.slug,
        label: tSidebar(page.labelKey),
        group: t("pages"),
        keywords: [page.slug],
        icon: FileText,
        onSelect: () => router.push(page.href),
      })),
    ],
    [router, locale, t, tSidebar],
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
