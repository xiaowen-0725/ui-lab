"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { CopyButton } from "@/components/app/docs/copy-button";
import { SCROLL_DEMOS } from "@/components/app/scroll/demo-registry";
import type { Locale } from "@/i18n/routing";
import { SCROLL_PATTERNS, type ScrollPatternEntry } from "@/lib/scroll";
import { cn } from "@/lib/utils";

function ScrollPatternCard({
  entry,
  index,
  locale,
}: {
  entry: ScrollPatternEntry;
  index: number;
  locale: Locale;
}) {
  const t = useTranslations("scroll");
  const [promptLang, setPromptLang] = useState<"zh" | "en">(
    locale === "zh" ? "zh" : "en",
  );
  const Demo = SCROLL_DEMOS[entry.slug];
  const prompt = promptLang === "zh" ? entry.promptZh : entry.promptEn;
  const primaryName = locale === "zh" ? entry.nameZh : entry.name;
  const secondaryName = locale === "zh" ? entry.name : entry.nameZh;
  const whenUse = locale === "zh" ? entry.whenUseZh : entry.whenUse;

  return (
    <article
      id={entry.slug}
      className="scroll-mt-24 rounded-3xl border border-border bg-card/15 p-4 sm:p-6"
    >
      <header className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span className="font-mono text-[0.65rem] text-muted-foreground">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground">
              {primaryName}
            </h2>
            <span className="text-sm text-muted-foreground">{secondaryName}</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.aliases.map((alias) => (
              <span
                key={alias}
                className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                {alias}
              </span>
            ))}
          </div>
        </div>
        <span className="shrink-0 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {t("liveDemo")}
        </span>
      </header>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(20rem,0.75fr)] xl:items-start">
        <div>{Demo ? <Demo /> : null}</div>

        <aside className="space-y-6 xl:sticky xl:top-24">
          <section>
            <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("whenUse")}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{whenUse}</p>
          </section>

          <section>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {t("recipeTitle")}
              </h3>
              <CopyButton
                text={entry.recipe}
                eventName="copy_scroll_recipe"
                eventLabel={entry.slug}
              />
            </div>
            <pre className="mt-2 max-h-64 overflow-auto rounded-2xl border border-border bg-background/70 p-4 text-xs leading-relaxed text-foreground [scrollbar-width:thin]">
              <code>{entry.recipe}</code>
            </pre>
          </section>

          <section>
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {t("promptTitle")}
              </h3>
              <div className="flex items-center gap-1">
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
                <CopyButton
                  text={prompt}
                  eventName="copy_scroll_prompt"
                  eventLabel={`${entry.slug}-${promptLang}`}
                />
              </div>
            </div>
            <p
              lang={promptLang === "zh" ? "zh-CN" : "en"}
              className="mt-2 whitespace-pre-wrap rounded-2xl border border-border bg-background/70 p-4 text-sm leading-relaxed text-muted-foreground"
            >
              {prompt}
            </p>
          </section>
        </aside>
      </div>
    </article>
  );
}

/** Eight live patterns render together so container isolation is observable. */
export function ScrollExplorer() {
  const locale = useLocale() as Locale;

  return (
    <div className="space-y-8">
      {SCROLL_PATTERNS.map((entry, index) => (
        <ScrollPatternCard
          key={entry.slug}
          entry={entry}
          index={index}
          locale={locale}
        />
      ))}
    </div>
  );
}
