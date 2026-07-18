"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import type { CSSProperties } from "react";
import { AtomCard } from "@/components/app/atoms/atom-card";
import { AtomExportActions } from "@/components/app/atoms/atom-export-actions";
import { CopyValue } from "@/components/app/atoms/copy-value";
import type { Locale } from "@/i18n/routing";
import {
  createLinesExports,
  lineCssValue,
  LINES,
} from "@/lib/atoms";
import type { LineAtom } from "@/lib/atoms";
import { cn } from "@/lib/utils";

const LINES_EXPORTS = createLinesExports(LINES);

function linePreviewStyle(
  entry: LineAtom,
  scheme: "light" | "dark",
  focused = false,
): CSSProperties {
  const value = entry[scheme];
  if (entry.property === "border") return { border: value };
  if (entry.property === "box-shadow") return { boxShadow: value };
  if (focused) return { outline: value, outlineOffset: entry.offset };
  return {};
}

function PairedLinePreview({ entry }: { entry: LineAtom }) {
  const t = useTranslations("atoms");
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 gap-2">
      {(["light", "dark"] as const).map((scheme) => {
        const focusKey = `${entry.slug}-${scheme}`;
        const dark = scheme === "dark";
        return (
          <div
            key={scheme}
            className="rounded-xl p-3"
            style={{
              background: dark ? "#171717" : "#f7f7f8",
              color: dark ? "#f5f5f5" : "#171717",
            }}
          >
            <span className="font-mono text-[0.55rem] uppercase tracking-wider opacity-55">
              {scheme === "light" ? t("lightValue") : t("darkValue")}
            </span>
            {entry.property === "outline" ? (
              <button
                type="button"
                onFocus={() => setFocused(focusKey)}
                onBlur={() => setFocused(null)}
                className="mt-3 block h-9 w-full rounded-lg px-2 text-[0.65rem] font-medium"
                style={{
                  ...linePreviewStyle(entry, scheme, focused === focusKey),
                  background: dark ? "#2a2a2a" : "#fff",
                }}
              >
                {t("focusDemoButton")}
              </button>
            ) : (
              <div
                className="mt-3 flex h-12 items-center justify-center rounded-lg text-[0.6rem] font-medium"
                style={{
                  ...linePreviewStyle(entry, scheme),
                  background: dark ? "#222" : "#fff",
                }}
              >
                {t("lineDemoSurface")}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function LinesExplorer({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("atoms");

  return (
    <div className={cn("flex flex-col gap-12", className)}>
      <section aria-labelledby="lines-comparator-title">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {t("comparator")}
        </p>
        <h2 id="lines-comparator-title" className="mt-2 text-2xl font-semibold text-foreground">
          {t("linesComparatorTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("linesComparatorHint")}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {LINES.map((entry) => (
            <article key={entry.slug} className="rounded-3xl border border-border bg-card/20 p-4">
              <div className="flex flex-wrap items-baseline gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {locale === "zh" ? entry.nameZh : entry.name}
                </h3>
                <span className="text-[0.65rem] text-muted-foreground">
                  {locale === "zh" ? entry.name : entry.nameZh}
                </span>
              </div>
              <div className="mt-4">
                <PairedLinePreview entry={entry} />
              </div>
              {entry.property === "outline" ? (
                <p className="mt-3 text-[0.65rem] leading-relaxed text-muted-foreground">
                  {t("focusTabHint")}
                </p>
              ) : null}
              <div className="mt-3 space-y-2">
                <CopyValue
                  value={lineCssValue(entry, "light")}
                  label={`line-comparator-light-${entry.slug}`}
                />
                <CopyValue
                  value={lineCssValue(entry, "dark")}
                  label={`line-comparator-dark-${entry.slug}`}
                />
              </div>
            </article>
          ))}
        </div>
        <p className="mt-4 rounded-2xl border border-border bg-card/20 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          {t("linesAntiSlop")}
        </p>
      </section>

      <section aria-labelledby="lines-values-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("entryList")}
            </p>
            <h2 id="lines-values-title" className="mt-2 text-2xl font-semibold text-foreground">
              {t("linesValuesTitle")}
            </h2>
          </div>
          <AtomExportActions bundle={LINES_EXPORTS} category="lines" />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {LINES.map((entry) => (
            <AtomCard
              key={entry.slug}
              id={entry.slug}
              {...entry}
              sample={<PairedLinePreview entry={entry} />}
              value={
                <div className="space-y-2">
                  <div>
                    <span className="text-[0.65rem] text-muted-foreground">{t("lightValue")}</span>
                    <CopyValue
                      value={lineCssValue(entry, "light")}
                      label={`line-light-${entry.slug}`}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <span className="text-[0.65rem] text-muted-foreground">{t("darkValue")}</span>
                    <CopyValue
                      value={lineCssValue(entry, "dark")}
                      label={`line-dark-${entry.slug}`}
                      className="mt-1"
                    />
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
