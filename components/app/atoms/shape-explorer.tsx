"use client";

import { Check } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useState } from "react";
import type { ReactNode } from "react";
import { AtomCard } from "@/components/app/atoms/atom-card";
import { AtomExportActions } from "@/components/app/atoms/atom-export-actions";
import {
  CopyValue,
  useCopyFeedback,
} from "@/components/app/atoms/copy-value";
import type { Locale } from "@/i18n/routing";
import { createShapeExports, RADII, SHADOWS } from "@/lib/atoms";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

const COPY = {
  zh: {
    cardTitle: "真实表面",
    cardBody: "同一档圆角同时作用于卡片、按钮、徽章与输入框。",
    button: "创建项目",
    badge: "进行中",
    placeholder: "输入项目名称",
  },
  en: {
    cardTitle: "Real surface",
    cardBody: "One radius step shapes the card, button, badge, and input together.",
    button: "Create project",
    badge: "In progress",
    placeholder: "Enter project name",
  },
} as const;

const SHAPE_EXPORTS = createShapeExports(RADII, SHADOWS);

function ShadowSurface({
  shadow,
  canLift,
  children,
}: {
  shadow: string;
  canLift: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-card p-5 transition-transform duration-150",
        canLift && "hover:-translate-y-1",
      )}
      style={{ boxShadow: shadow }}
    >
      {children}
    </div>
  );
}

export function ShapeExplorer() {
  const locale = useLocale() as Locale;
  const t = useTranslations("atoms");
  const { resolvedTheme } = useTheme();
  const reducedMotion = useReducedMotion();
  const hoverCapable = useHoverCapable();
  const copy = COPY[locale];
  const [radiusSlug, setRadiusSlug] = useState("lg");
  const { copiedLabel, copyValue } = useCopyFeedback();
  const activeRadius = RADII.find((entry) => entry.slug === radiusSlug) ?? RADII[0];
  const dark = resolvedTheme !== "light";
  const canLift = hoverCapable && !reducedMotion;

  if (!activeRadius) return null;

  const radiusStyle = {
    borderRadius: activeRadius.value,
  };

  const copyShadow = async (slug: string, value: string) => {
    await copyValue(value, `shadow-comparator-${slug}`);
  };

  return (
    <div className="flex flex-col gap-12">
      <section aria-labelledby="radius-comparator-title">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {t("comparator")}
        </p>
        <h2 id="radius-comparator-title" className="mt-2 text-2xl font-semibold text-foreground">
          {t("radiusComparatorTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("radiusComparatorHint")}
        </p>

        <div className="mt-6 grid gap-5 rounded-3xl border border-border bg-card/20 p-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:p-6">
          <div className="rounded-3xl border border-border bg-background/50 p-5 sm:p-7" style={radiusStyle}>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-foreground">{copy.cardTitle}</h3>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
                  {copy.cardBody}
                </p>
              </div>
              <span
                className="border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground"
                style={radiusStyle}
              >
                {copy.badge}
              </span>
            </div>
            <label className="mt-7 block text-xs font-medium text-muted-foreground">
              {copy.placeholder}
              <input
                readOnly
                value={copy.placeholder}
                className="mt-2 h-10 w-full border border-border bg-card px-3 text-sm text-foreground outline-none"
                style={radiusStyle}
              />
            </label>
            <button
              type="button"
              className="mt-4 h-10 bg-foreground px-4 text-sm font-semibold text-background"
              style={radiusStyle}
            >
              {copy.button}
            </button>
          </div>

          <div className="flex flex-col justify-between gap-5 rounded-3xl border border-border bg-background/35 p-5">
            <div>
              <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {t("selectedRadius")}
              </p>
              <p className="mt-2 font-mono text-4xl font-semibold tracking-tight text-foreground">
                {activeRadius.value}
              </p>
              <CopyValue
                value={activeRadius.value}
                label={`radius-${activeRadius.slug}`}
                className="mt-3"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {RADII.map((entry) => {
                const active = entry.slug === activeRadius.slug;
                return (
                  <button
                    key={entry.slug}
                    type="button"
                    onClick={() => setRadiusSlug(entry.slug)}
                    aria-pressed={active}
                    className={cn(
                      "flex h-10 items-center justify-center border px-2 font-mono text-xs transition-colors",
                      active
                        ? "border-(--color-border-strong) bg-card text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                    style={{ borderRadius: entry.value }}
                  >
                    {entry.slug}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="shadow-comparator-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="shadow-comparator-title" className="text-2xl font-semibold text-foreground">
              {t("shadowComparatorTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t("shadowComparatorHint")}
            </p>
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            {dark ? t("darkValue") : t("lightValue")}
          </span>
        </div>
        <div className="mt-6 grid gap-5 rounded-3xl border border-border bg-background/50 p-6 sm:grid-cols-2 xl:grid-cols-4 xl:gap-7 xl:p-8">
          {SHADOWS.map((entry, index) => {
            const value = dark ? entry.dark : entry.light;
            return (
              <button
                key={entry.slug}
                type="button"
                onClick={() => copyShadow(entry.slug, value)}
                className="text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={t("copyValue", { value })}
              >
                <ShadowSurface shadow={value} canLift={canLift}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
                    {copiedLabel === `shadow-comparator-${entry.slug}` ? (
                      <span className="inline-flex items-center gap-1 text-[0.65rem] text-(--color-success)">
                        <Check className="h-3 w-3" /> {t("copied")}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-8 text-sm font-semibold text-foreground">
                    {locale === "zh" ? entry.nameZh : entry.name}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {locale === "zh" ? entry.whenUseZh : entry.whenUse}
                  </p>
                </ShadowSurface>
              </button>
            );
          })}
        </div>
        <p className="mt-4 rounded-2xl border border-border bg-card/20 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          {t("shadowAntiSlop")}
        </p>
      </section>

      <section aria-labelledby="shape-values-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("entryList")}
            </p>
            <h2 id="shape-values-title" className="mt-2 text-2xl font-semibold text-foreground">
              {t("shapeValuesTitle")}
            </h2>
          </div>
          <AtomExportActions bundle={SHAPE_EXPORTS} category="shape" />
        </div>

        <h3 className="mt-6 text-sm font-semibold text-foreground">{t("radii")}</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {RADII.map((entry) => (
            <AtomCard
              key={entry.slug}
              id={entry.slug}
              {...entry}
              sample={
                <div className="flex h-16 items-center justify-center">
                  <span
                    className="h-14 w-full max-w-28 border border-(--color-border-strong) bg-card"
                    style={{ borderRadius: entry.value }}
                  />
                </div>
              }
              value={<CopyValue value={entry.value} label={`radius-${entry.slug}`} />}
            />
          ))}
        </div>

        <h3 className="mt-8 text-sm font-semibold text-foreground">{t("shadows")}</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {SHADOWS.map((entry) => {
            const currentShadow = dark ? entry.dark : entry.light;
            return (
              <AtomCard
                key={entry.slug}
                id={entry.slug}
                {...entry}
                sample={
                  <div className="p-3">
                    <ShadowSurface shadow={currentShadow} canLift={canLift}>
                      <span className="text-xs font-medium text-foreground">
                        {dark ? t("darkValue") : t("lightValue")}
                      </span>
                    </ShadowSurface>
                  </div>
                }
                value={
                  <div className="space-y-2">
                    <div>
                      <span className="text-[0.65rem] text-muted-foreground">{t("lightValue")}</span>
                      <CopyValue value={entry.light} label={`shadow-light-${entry.slug}`} className="mt-1" />
                    </div>
                    <div>
                      <span className="text-[0.65rem] text-muted-foreground">{t("darkValue")}</span>
                      <CopyValue value={entry.dark} label={`shadow-dark-${entry.slug}`} className="mt-1" />
                    </div>
                  </div>
                }
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
