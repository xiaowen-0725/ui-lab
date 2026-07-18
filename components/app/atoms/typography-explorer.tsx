"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { AtomCard } from "@/components/app/atoms/atom-card";
import { AtomExportActions } from "@/components/app/atoms/atom-export-actions";
import { CopyValue } from "@/components/app/atoms/copy-value";
import type { Locale } from "@/i18n/routing";
import {
  FONT_PAIRS,
  fontPairCssValue,
  createTypographyExports,
  TYPE_SCALE,
  typeScaleCssValue,
} from "@/lib/atoms";
import type { FontPairAtom } from "@/lib/atoms";
import { cn } from "@/lib/utils";

const TYPOGRAPHY_EXPORTS = createTypographyExports(FONT_PAIRS, TYPE_SCALE);

const COPY = {
  zh: {
    kicker: "Typography specimen · 字体样张",
    title: "字形决定产品说话的声音",
    subtitle: "在同一块真实内容上切换字体配对，观察标题气质、正文密度与代码节奏如何一起改变。",
    paragraphOne:
      "好的排印不会抢走内容的注意力。它先建立层级，再让阅读速度自然落下来；标题负责定调，正文负责长期相处。",
    paragraphTwo:
      "这套样张不加载 webfont，中文交给系统字体稳定托底。把组件写成 inline-flex，并让视觉选择服务于信息。",
    caption: "说明小字 · 12px · 字距略微放宽，避免紧成一团。",
    code: "inline-flex",
  },
  en: {
    kicker: "Typography specimen · 字体样张",
    title: "Type gives a product its voice",
    subtitle: "Switch the full pairing on one real specimen and watch display tone, reading density, and code rhythm change together.",
    paragraphOne:
      "Good typography never competes with the content. It establishes hierarchy first, then settles into a natural reading pace: display type sets the tone while body type carries the relationship.",
    paragraphTwo:
      "This specimen loads no webfont and lets Chinese fall back to the system family. Set the component to inline-flex, and make every visual choice serve the information.",
    caption: "Caption · 12px · tracking opens slightly so small text can breathe.",
    code: "inline-flex",
  },
} as const;

function TypographySample({ pair }: { pair: FontPairAtom }) {
  const locale = useLocale() as Locale;
  const copy = COPY[locale];

  return (
    <div className="rounded-3xl border border-border bg-background/55 p-6 sm:p-10" style={{ fontFamily: pair.body }}>
      <p
        className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground"
        style={{ fontFamily: pair.mono }}
      >
        {copy.kicker}
      </p>
      <h3
        className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.025em] text-foreground sm:text-5xl"
        style={{ fontFamily: pair.display }}
      >
        {copy.title}
      </h3>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
        {copy.subtitle}
      </p>
      <div className="mt-10 grid max-w-4xl gap-5 text-[15px] leading-7 text-foreground/85 md:grid-cols-2">
        <p>{copy.paragraphOne}</p>
        <p>
          {copy.paragraphTwo.split(copy.code)[0]}
          <code
            className="rounded-md border border-border bg-card px-1.5 py-0.5 text-[0.85em] text-foreground"
            style={{ fontFamily: pair.mono }}
          >
            {copy.code}
          </code>
          {copy.paragraphTwo.split(copy.code)[1]}
        </p>
      </div>
      <p
        className="mt-8 border-t border-border pt-4 text-xs leading-relaxed tracking-[0.01em] text-muted-foreground"
        style={{ fontFamily: pair.body }}
      >
        {copy.caption}
      </p>
    </div>
  );
}

export function TypographyExplorer() {
  const locale = useLocale() as Locale;
  const t = useTranslations("atoms");
  const [pairSlug, setPairSlug] = useState("system-neutral");
  const activePair = FONT_PAIRS.find((entry) => entry.slug === pairSlug) ?? FONT_PAIRS[0];

  if (!activePair) return null;

  return (
    <div className="flex flex-col gap-12">
      <section aria-labelledby="type-comparator-title">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {t("comparator")}
        </p>
        <h2 id="type-comparator-title" className="mt-2 text-2xl font-semibold text-foreground">
          {t("typeComparatorTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("typeComparatorHint")}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {FONT_PAIRS.map((entry) => {
            const active = entry.slug === activePair.slug;
            return (
              <button
                key={entry.slug}
                type="button"
                onClick={() => setPairSlug(entry.slug)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  active
                    ? "border-(--color-border-strong) bg-card text-foreground"
                    : "border-border bg-card/20 text-muted-foreground hover:text-foreground",
                )}
              >
                {locale === "zh" ? entry.nameZh : entry.name}
              </button>
            );
          })}
        </div>
        <div className="mt-4">
          <TypographySample pair={activePair} />
        </div>
        <div className="mt-4 grid gap-4 rounded-2xl border border-border bg-card/20 p-4 lg:grid-cols-[minmax(0,1fr)_24rem] lg:items-center">
          <div>
            <div className="flex flex-wrap items-baseline gap-2">
              <h3 className="font-semibold text-foreground">
                {locale === "zh" ? activePair.nameZh : activePair.name}
              </h3>
              <span className="text-xs text-muted-foreground">
                {locale === "zh" ? activePair.name : activePair.nameZh}
              </span>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              {locale === "zh" ? activePair.whenUseZh : activePair.whenUse}
            </p>
          </div>
          <CopyValue
            value={fontPairCssValue(activePair)}
            label={`font-pair-${activePair.slug}`}
          />
        </div>
      </section>

      <section aria-labelledby="type-scale-title">
        <h2 id="type-scale-title" className="text-2xl font-semibold text-foreground">
          {t("typeScaleTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("typeScaleHint")}
        </p>
        <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card/20">
          {TYPE_SCALE.map((step, index) => (
            <div
              key={step.slug}
              className={cn(
                "grid gap-4 p-5 md:grid-cols-[7rem_minmax(0,1fr)_18rem] md:items-center",
                index > 0 && "border-t border-border",
              )}
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {locale === "zh" ? step.nameZh : step.name}
                </p>
                <p className="mt-1 font-mono text-[0.65rem] text-muted-foreground">
                  {step.fontSize} / {step.lineHeight}
                </p>
              </div>
              <p
                className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap text-foreground"
                style={{
                  fontFamily: activePair.display,
                  fontSize: step.fontSize,
                  lineHeight: step.lineHeight,
                  letterSpacing: step.letterSpacing,
                }}
              >
                {locale === "zh" ? "排印层级的真实刻度" : "A real scale for type hierarchy"}
              </p>
              <CopyValue
                value={typeScaleCssValue(step)}
                label={`type-scale-${step.slug}`}
              />
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="type-values-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("entryList")}
            </p>
            <h2 id="type-values-title" className="mt-2 text-2xl font-semibold text-foreground">
              {t("typeValuesTitle")}
            </h2>
          </div>
          <AtomExportActions bundle={TYPOGRAPHY_EXPORTS} category="typography" />
        </div>

        <h3 className="mt-6 text-sm font-semibold text-foreground">{t("fontPairs")}</h3>
        <div className="mt-3 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {FONT_PAIRS.map((entry) => (
            <AtomCard
              key={entry.slug}
              id={entry.slug}
              {...entry}
              sample={
                <div className="flex h-20 items-end justify-between gap-3">
                  <span
                    className="text-4xl font-semibold tracking-tight text-foreground"
                    style={{ fontFamily: entry.display }}
                  >
                    Aa 字
                  </span>
                  <code className="text-xs text-muted-foreground" style={{ fontFamily: entry.mono }}>
                    01 / mono
                  </code>
                </div>
              }
              value={
                <CopyValue
                  value={fontPairCssValue(entry)}
                  label={`font-pair-${entry.slug}`}
                />
              }
              note={entry.displayNote ? `${entry.note} ${entry.displayNote}` : entry.note}
              noteZh={
                entry.displayNoteZh
                  ? `${entry.noteZh}${entry.displayNoteZh}`
                  : entry.noteZh
              }
            />
          ))}
        </div>

        <h3 className="mt-8 text-sm font-semibold text-foreground">{t("typeScale")}</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {TYPE_SCALE.map((entry) => (
            <AtomCard
              key={entry.slug}
              id={entry.slug}
              {...entry}
              sample={
                <div className="flex h-20 items-center overflow-hidden">
                  <span
                    className="whitespace-nowrap text-foreground"
                    style={{
                      fontFamily: activePair.display,
                      fontSize: entry.fontSize,
                      lineHeight: entry.lineHeight,
                      letterSpacing: entry.letterSpacing,
                    }}
                  >
                    Aa 字体
                  </span>
                </div>
              }
              value={
                <CopyValue
                  value={typeScaleCssValue(entry)}
                  label={`type-scale-${entry.slug}`}
                />
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
