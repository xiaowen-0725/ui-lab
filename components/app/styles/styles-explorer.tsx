"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CopyButton } from "@/components/app/docs/copy-button";
import { StyleDemo } from "@/components/app/styles/style-demo";
import type { Locale } from "@/i18n/routing";
import { localizedDescription, localizedName } from "@/lib/i18n-content";
import { STYLE_GROUPS, STYLES } from "@/lib/styles";
import { cn } from "@/lib/utils";

/** Skin-swap comparator: one fixed demo scene, N styles, plus the vocabulary panel. */
export function StylesExplorer() {
  const t = useTranslations("styles");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const paramSlug = searchParams.get("style");
  const [slug, setSlug] = useState(
    () =>
      (paramSlug && STYLES.some((s) => s.slug === paramSlug)
        ? paramSlug
        : undefined) ?? STYLES[0]?.slug,
  );
  const [promptLang, setPromptLang] = useState<"zh" | "en">(
    locale === "zh" ? "zh" : "en",
  );

  // Follow in-app navigations (e.g. picking a style from site search while
  // already on this page). Manual switches below use replaceState, which
  // doesn't touch useSearchParams — no loop.
  useEffect(() => {
    if (paramSlug && STYLES.some((s) => s.slug === paramSlug)) {
      setSlug(paramSlug);
    }
  }, [paramSlug]);

  const selectStyle = (nextSlug: string) => {
    setSlug(nextSlug);
    window.history.replaceState(null, "", `?style=${nextSlug}`);
  };

  const active = STYLES.find((s) => s.slug === slug) ?? STYLES[0];
  if (!active) return null;

  const prompt = promptLang === "zh" ? active.promptZh : active.promptEn;
  const recipe = locale === "zh" ? active.recipeZh : active.recipe;

  return (
    <div>
      <div className="flex flex-col gap-3">
        {STYLE_GROUPS.map((group) => {
          const groupStyles = STYLES.filter((s) => s.group === group.key);
          if (!groupStyles.length) return null;
          return (
            <div key={group.key} className="flex flex-wrap items-center gap-2">
              <span className="w-16 shrink-0 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
                {locale === "zh" ? group.labelZh : group.label}
              </span>
              {groupStyles.map((style) => {
                const isActive = style.slug === active.slug;
                return (
                  <button
                    key={style.slug}
                    type="button"
                    onClick={() => selectStyle(style.slug)}
                    aria-pressed={isActive}
                    className={cn(
                      "flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-sm transition-colors",
                      isActive
                        ? "border-(--color-border-strong) bg-card text-foreground"
                        : "border-border bg-card/20 text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="relative h-4.5 w-4.5 overflow-hidden rounded-md border border-border"
                      style={{ background: style.skin.vars["--st-page-bg"] }}
                    >
                      <span
                        className="absolute bottom-0.5 right-0.5 h-1.5 w-1.5 rounded-full"
                        style={{ background: style.skin.vars["--st-accent"] }}
                      />
                    </span>
                    {localizedName(style, locale)}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:items-start">
        <StyleDemo entry={active} className="min-h-105" />

        <aside className="flex flex-col gap-6 rounded-3xl border border-border bg-card/20 p-6">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-xl font-semibold text-foreground">
                {localizedName(active, locale)}
              </h2>
              <span className="text-sm text-muted-foreground">
                {locale === "zh" ? active.name : active.nameZh}
              </span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {localizedDescription(active, locale)}
            </p>
          </div>

          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("aliases")}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {active.aliases.map((alias) => (
                <span
                  key={alias}
                  className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                >
                  {alias}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("bestFor")}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {locale === "zh" ? active.bestForZh : active.bestFor}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {t("promptTitle")}
              </p>
              <div className="flex gap-1">
                {(["zh", "en"] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setPromptLang(lang)}
                    aria-pressed={promptLang === lang}
                    className={cn(
                      "rounded-md px-2 py-0.5 text-xs transition-colors",
                      promptLang === lang
                        ? "bg-card text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {lang === "zh" ? t("langZh") : t("langEn")}
                  </button>
                ))}
              </div>
            </div>
            <div className="relative mt-2 rounded-2xl border border-border bg-background/60 p-4 pr-12">
              <CopyButton
                text={prompt}
                className="absolute right-2 top-2"
                eventName="copy_style_prompt"
                eventLabel={`${active.slug}-${promptLang}`}
              />
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                {prompt}
              </p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground/80">{t("promptHint")}</p>
          </div>

          <details>
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              {t("recipeTitle")}
            </summary>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
              {recipe.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </details>
        </aside>
      </div>
    </div>
  );
}
