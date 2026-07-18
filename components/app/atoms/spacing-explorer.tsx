"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { AtomCard } from "@/components/app/atoms/atom-card";
import { AtomExportActions } from "@/components/app/atoms/atom-export-actions";
import { CopyValue } from "@/components/app/atoms/copy-value";
import type { Locale } from "@/i18n/routing";
import {
  createSpacingExports,
  DENSITIES,
  SPACING_SCALE,
  spacingCssValue,
} from "@/lib/atoms";
import { cn } from "@/lib/utils";

const COPY = {
  zh: [
    { title: "设计评审", subtitle: "今天 14:30", action: "打开" },
    { title: "组件盘点", subtitle: "8 个条目待确认", action: "查看" },
    { title: "排版规范", subtitle: "刚刚更新", action: "阅读" },
    { title: "交付清单", subtitle: "完成 12 / 16", action: "继续" },
  ],
  en: [
    { title: "Design review", subtitle: "Today at 14:30", action: "Open" },
    { title: "Component audit", subtitle: "8 items to confirm", action: "View" },
    { title: "Type guidelines", subtitle: "Updated just now", action: "Read" },
    { title: "Delivery checklist", subtitle: "12 of 16 complete", action: "Continue" },
  ],
} as const;

const SPACING_EXPORTS = createSpacingExports(SPACING_SCALE, DENSITIES);

export function SpacingExplorer({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("atoms");
  const [densitySlug, setDensitySlug] = useState("standard");
  const copy = COPY[locale];

  return (
    <div className={cn("flex flex-col gap-12", className)}>
      <section aria-labelledby="density-comparator-title">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {t("comparator")}
        </p>
        <h2 id="density-comparator-title" className="mt-2 text-2xl font-semibold text-foreground">
          {t("densityComparatorTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("densityComparatorHint")}
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {DENSITIES.map((density) => {
            const active = density.slug === densitySlug;
            return (
              <article
                key={density.slug}
                id={density.slug}
                className={cn(
                  "scroll-mt-28 overflow-hidden rounded-3xl border bg-card/20",
                  active ? "border-(--color-border-strong)" : "border-border",
                )}
              >
                <button
                  type="button"
                  onClick={() => setDensitySlug(density.slug)}
                  aria-pressed={active}
                  className="flex w-full items-center justify-between gap-3 border-b border-border px-4 py-3 text-left transition-colors hover:bg-card/40"
                >
                  <span>
                    <span className="block text-sm font-semibold text-foreground">
                      {locale === "zh" ? density.nameZh : density.name}
                    </span>
                    <span className="mt-0.5 block font-mono text-[0.65rem] text-muted-foreground">
                      {t("densityParams", {
                        row: density.rowHeight,
                        padding: density.padding,
                      })}
                    </span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-2.5 w-2.5 rounded-full border",
                      active ? "border-accent bg-accent" : "border-border",
                    )}
                  />
                </button>
                <div className="bg-background/35">
                  {copy.map((row, index) => (
                    <div
                      key={row.title}
                      className={cn(
                        "flex items-center gap-2",
                        index > 0 && "border-t border-border",
                      )}
                      style={{
                        height: `${density.rowHeight}px`,
                        paddingInline: `${density.padding}px`,
                      }}
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border bg-card">
                        <span className="h-1.5 w-1.5 rounded-sm bg-accent" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[0.68rem] font-medium leading-3 text-foreground">
                          {row.title}
                        </span>
                        <span className="block truncate text-[0.58rem] leading-2.5 text-muted-foreground">
                          {row.subtitle}
                        </span>
                      </span>
                      <span className="shrink-0 text-[0.58rem] font-medium text-muted-foreground">
                        {row.action}
                      </span>
                    </div>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
        <p className="mt-4 rounded-2xl border border-border bg-card/20 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          {t("spacingAntiSlop")}
        </p>
      </section>

      <section aria-labelledby="spacing-values-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("entryList")}
            </p>
            <h2 id="spacing-values-title" className="mt-2 text-2xl font-semibold text-foreground">
              {t("spacingValuesTitle")}
            </h2>
          </div>
          <AtomExportActions bundle={SPACING_EXPORTS} category="spacing" />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPACING_SCALE.map((entry) => {
            const value = spacingCssValue(entry.pixels);
            return (
              <AtomCard
                key={entry.slug}
                id={entry.slug}
                {...entry}
                sample={
                  <div className="flex h-16 items-center">
                    <span
                      className="block h-3 rounded-full bg-accent"
                      style={{ width: `${entry.pixels * 2}px` }}
                    />
                  </div>
                }
                value={<CopyValue value={value} label={`spacing-${entry.slug}`} />}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
