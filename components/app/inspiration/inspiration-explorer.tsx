"use client";

import { ArrowUpRight, Search, ShieldCheck } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { SourceReferencePreview } from "@/components/app/inspiration/brand-reference-preview";
import type { Locale } from "@/i18n/routing";
import { localizedDescription, localizedName } from "@/lib/i18n-content";
import {
  INSPIRATION_SOURCES,
  INSPIRATION_THEMES,
  type InspirationSource,
  type InspirationThemeKey,
} from "@/lib/inspiration";
import { cn } from "@/lib/utils";

function getDomain(source: InspirationSource): string {
  return new URL(source.canonicalUrl).hostname.replace(/^www\./, "");
}

function getMonogram(source: InspirationSource): string {
  return source.name
    .split(/[\s.-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function isThemeKey(value: string | null): value is InspirationThemeKey {
  return INSPIRATION_THEMES.some((theme) => theme.key === value);
}

/** Searchable, filterable shelf of reviewed external inspiration sources. */
export function InspirationExplorer({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("inspiration");
  const searchParams = useSearchParams();
  const paramTheme = searchParams.get("theme");
  const paramQuery = searchParams.get("q") ?? "";
  const [theme, setTheme] = useState<InspirationThemeKey | null>(() =>
    isThemeKey(paramTheme) ? paramTheme : null,
  );
  const [query, setQuery] = useState(paramQuery);

  useEffect(() => {
    setTheme(isThemeKey(paramTheme) ? paramTheme : null);
    setQuery(paramQuery);
  }, [paramQuery, paramTheme]);

  const availableThemes = useMemo(
    () =>
      INSPIRATION_THEMES.filter((candidate) =>
        INSPIRATION_SOURCES.some((source) => source.primaryTheme === candidate.key),
      ),
    [],
  );

  const filteredSources = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return INSPIRATION_SOURCES.filter((source) => {
      if (theme && source.primaryTheme !== theme) return false;
      if (!normalizedQuery) return true;

      const searchable = [
        source.name,
        source.nameZh,
        ...source.aliases,
        getDomain(source),
        source.description,
        source.descriptionZh,
        ...source.contentTypes,
        ...source.useCases,
        ...source.visualTraits,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return searchable.includes(normalizedQuery);
    });
  }, [query, theme]);

  const syncUrl = (nextTheme: InspirationThemeKey | null, nextQuery: string) => {
    const url = new URL(window.location.href);

    if (nextTheme) url.searchParams.set("theme", nextTheme);
    else url.searchParams.delete("theme");

    const trimmedQuery = nextQuery.trim();
    if (trimmedQuery) url.searchParams.set("q", trimmedQuery);
    else url.searchParams.delete("q");

    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  };

  const selectTheme = (nextTheme: InspirationThemeKey | null) => {
    setTheme(nextTheme);
    syncUrl(nextTheme, query);
  };

  const updateQuery = (nextQuery: string) => {
    setQuery(nextQuery);
    syncUrl(theme, nextQuery);
  };

  const clearFilters = () => {
    setTheme(null);
    setQuery("");
    syncUrl(null, "");
  };

  return (
    <div className={cn(className)}>
      <div className="rounded-3xl border border-border bg-card/20 p-4 md:p-5">
        <label className="relative block">
          <span className="sr-only">{t("searchLabel")}</span>
          <Search
            aria-hidden="true"
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={query}
            onChange={(event) => updateQuery(event.currentTarget.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-(--color-border-strong)"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => selectTheme(null)}
            aria-pressed={theme === null}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              theme === null
                ? "border-(--color-border-strong) bg-card text-foreground"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {t("allThemes")}
          </button>
          {availableThemes.map((candidate) => (
            <button
              key={candidate.key}
              type="button"
              onClick={() => selectTheme(candidate.key)}
              aria-pressed={theme === candidate.key}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                theme === candidate.key
                  ? "border-(--color-border-strong) bg-card text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {t(`theme.${candidate.key}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {t("results", { count: filteredSources.length })}
        </p>
        {(query || theme) && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground"
          >
            {t("clear")}
          </button>
        )}
      </div>

      {filteredSources.length ? (
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {filteredSources.map((source) => (
            <article
              key={source.slug}
              id={source.slug}
              className="scroll-mt-24 rounded-3xl border border-border bg-card/20 p-6"
            >
              <SourceReferencePreview
                source={source}
                ariaLabel={t("officialScreenshotLabel", { name: source.name })}
              />

              <div className="mt-5 flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-border bg-background font-mono text-xs font-semibold text-foreground"
                  >
                    {getMonogram(source)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-xs text-muted-foreground">{getDomain(source)}</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <span className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                        {t(`theme.${source.primaryTheme}`)}
                      </span>
                      <span className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] text-muted-foreground">
                        {t("source")}
                      </span>
                    </div>
                  </div>
                </div>
                <ShieldCheck
                  aria-label={t("externalOnly")}
                  className="h-4 w-4 shrink-0 text-muted-foreground"
                />
              </div>

              <h2 className="mt-5 text-lg font-semibold text-foreground">
                {localizedName(source, locale)}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {localizedDescription(source, locale)}
              </p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {source.contentTypes.slice(0, 3).map((contentType) => (
                  <span
                    key={contentType}
                    className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground"
                  >
                    {t(`contentType.${contentType}`)}
                  </span>
                ))}
              </div>

              <div className="mt-5 border-t border-border pt-4">
                <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
                  {t("useCases")}
                </p>
                <p className="mt-1.5 text-sm text-muted-foreground">
                  {source.useCases
                    .slice(0, 3)
                    .map((useCase) => t(`useCase.${useCase}`))
                    .join(" · ")}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                <div className="text-xs leading-relaxed text-muted-foreground/80">
                  <p>{t("externalOnly")}</p>
                  <p>{t(`access.${source.access}`)}</p>
                  <p>{t("reviewedAt", { date: source.reviewedAt })}</p>
                </div>
                <a
                  href={source.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:border-(--color-border-strong)"
                >
                  {t("openWebsite")}
                  <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-4 rounded-3xl border border-dashed border-border bg-card/20 px-6 py-16 text-center">
          <p className="text-sm font-medium text-foreground">{t("emptyTitle")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("emptyDescription")}</p>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground transition-colors hover:border-(--color-border-strong)"
          >
            {t("clear")}
          </button>
        </div>
      )}
    </div>
  );
}
