"use client";

import {
  CalendarDays,
  Kanban,
  LayoutDashboard,
  Mail,
  Users,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { APPS, APPS_HOME, type AppSample } from "@/lib/apps";
import { cn } from "@/lib/utils";
import { focusRing } from "./ui";

const ICONS: Record<AppSample["slug"] | "overview", LucideIcon> = {
  overview: LayoutDashboard,
  board: Kanban,
  inbox: Mail,
  calendar: CalendarDays,
  customers: Users,
};

function active(href: string, pathname: string) {
  if (href === APPS_HOME) return pathname === APPS_HOME;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppsShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations("apps");
  const items = [
    { slug: "overview" as const, href: APPS_HOME, label: t("overview") },
    ...APPS.map((app) => ({
      slug: app.slug,
      href: app.href,
      label: t(app.slug),
    })),
  ];

  return (
    <div className="flex h-full min-h-0 w-full flex-1 bg-background text-foreground">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-card/40 md:flex">
        <div className="flex items-center gap-3 px-4 py-4">
          <span
            aria-hidden="true"
            className="grid size-9 place-items-center rounded-xl bg-foreground text-sm font-semibold text-background"
          >
            N
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{t("workspace")}</span>
            <span className="block truncate text-xs text-muted-foreground">
              {t("workspaceHint")}
            </span>
          </span>
        </div>
        <nav aria-label={t("menu")} className="flex flex-1 flex-col gap-1 px-3">
          <p className="px-2 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("group")}
          </p>
          {items.map((item) => {
            const Icon = ICONS[item.slug];
            const current = active(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm transition-colors motion-reduce:transition-none",
                  focusRing,
                  current
                    ? "bg-foreground/[0.06] font-medium text-foreground"
                    : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
                )}
              >
                <Icon aria-hidden="true" className="size-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <p className="px-4 py-4 text-xs leading-relaxed text-muted-foreground">
          {t("sampleFoot")}
        </p>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <nav
          aria-label={t("menu")}
          className="flex gap-1 overflow-x-auto border-b border-border px-3 py-2 md:hidden"
        >
          {items.map((item) => {
            const current = active(item.href, pathname);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={current ? "page" : undefined}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-sm transition-colors motion-reduce:transition-none",
                  focusRing,
                  current
                    ? "bg-foreground text-background"
                    : "bg-foreground/[0.04] text-muted-foreground",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="min-h-0 flex-1 overflow-hidden">{children}</div>
      </div>
    </div>
  );
}
