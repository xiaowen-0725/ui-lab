"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CopyButton } from "@/components/app/docs/copy-button";
import { SECTION_DEMOS } from "@/components/app/sections/demo-registry";
import type { Locale } from "@/i18n/routing";
import { localizedDescription, localizedName } from "@/lib/i18n-content";
import { SECTIONS } from "@/lib/sections";
import { cn } from "@/lib/utils";

/** Section anatomy explorer: numbered type list, per-variant demo + prompt. */
export function SectionsExplorer() {
  const t = useTranslations("sections");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const paramSlug = searchParams.get("section");
  const [slug, setSlug] = useState(
    () =>
      (paramSlug && SECTIONS.some((s) => s.slug === paramSlug)
        ? paramSlug
        : undefined) ?? SECTIONS[0]?.slug,
  );
  const [variantKey, setVariantKey] = useState<string | undefined>(undefined);
  const [promptLang, setPromptLang] = useState<"zh" | "en">(
    locale === "zh" ? "zh" : "en",
  );

  // Follow in-app navigations (e.g. site search while already on this page).
  useEffect(() => {
    if (paramSlug && SECTIONS.some((s) => s.slug === paramSlug)) {
      setSlug(paramSlug);
      setVariantKey(undefined);
    }
  }, [paramSlug]);

  const active = SECTIONS.find((s) => s.slug === slug) ?? SECTIONS[0];
  if (!active) return null;

  const variant =
    active.variants.find((v) => v.key === variantKey) ?? active.variants[0];
  if (!variant) return null;

  const Demo = SECTION_DEMOS[`${active.slug}/${variant.key}`];
  const prompt = promptLang === "zh" ? variant.promptZh : variant.promptEn;
  const recipe = locale === "zh" ? active.recipeZh : active.recipe;

  const selectSection = (nextSlug: string) => {
    setSlug(nextSlug);
    setVariantKey(undefined);
    window.history.replaceState(null, "", `?section=${nextSlug}`);
  };

  return (
    <div>
      {/* Anatomy order is the lesson: a landing page, top to bottom. */}
      <div className="flex flex-wrap items-center gap-2">
        {SECTIONS.map((section, index) => {
          const isActive = section.slug === active.slug;
          return (
            <button
              key={section.slug}
              type="button"
              onClick={() => selectSection(section.slug)}
              aria-pressed={isActive}
              className={cn(
                "flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-sm transition-colors",
                isActive
                  ? "border-(--color-border-strong) bg-card text-foreground"
                  : "border-border bg-card/20 text-muted-foreground hover:text-foreground",
              )}
            >
              <span className="font-mono text-[0.65rem] text-muted-foreground/70">
                {String(index + 1).padStart(2, "0")}
              </span>
              {localizedName(section, locale)}
            </button>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:items-start">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("variants")}
            </span>
            {active.variants.map((v) => (
              <button
                key={v.key}
                type="button"
                onClick={() => setVariantKey(v.key)}
                aria-pressed={v.key === variant.key}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs transition-colors",
                  v.key === variant.key
                    ? "border-(--color-border-strong) bg-card text-foreground"
                    : "border-border bg-card/20 text-muted-foreground hover:text-foreground",
                )}
              >
                {locale === "zh" ? v.nameZh : v.name}
              </button>
            ))}
          </div>
          <div className="overflow-hidden rounded-3xl border border-border bg-background">
            {Demo ? <Demo /> : null}
          </div>
          <p className="text-xs text-muted-foreground/80">
            {locale === "zh" ? variant.whenToUseZh : variant.whenToUse}
          </p>
        </div>

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
                eventName="copy_section_prompt"
                eventLabel={`${active.slug}-${variant.key}-${promptLang}`}
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
