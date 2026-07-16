"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CopyButton } from "@/components/app/docs/copy-button";
import { StyleDemo } from "@/components/app/styles/style-demo";
import type { Locale } from "@/i18n/routing";
import { localizedDescription, localizedName } from "@/lib/i18n-content";
import {
  PALETTE_GROUPS,
  PALETTES,
  type PaletteColors,
  paletteToSkin,
} from "@/lib/palettes";
import { cn } from "@/lib/utils";

const ROLE_LABEL_KEYS: Record<keyof PaletteColors, string> = {
  bg: "roleBg",
  surface: "roleSurface",
  border: "roleBorder",
  text: "roleText",
  muted: "roleMuted",
  primary: "rolePrimary",
  primaryFg: "rolePrimaryFg",
  accent: "roleAccent",
};

const ROLE_ORDER = Object.keys(ROLE_LABEL_KEYS) as (keyof PaletteColors)[];

/** One role of the palette: swatch + label + hex; clicking copies the hex. */
function ColorChip({ label, value }: { label: string; value: string }) {
  const tCommon = useTranslations("common");
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      className="flex items-center gap-2 rounded-xl border border-border bg-card/20 px-2.5 py-1.5 text-left transition-colors hover:border-(--color-border-strong)"
    >
      <span
        aria-hidden="true"
        className="h-6 w-6 shrink-0 rounded-md border border-border"
        style={{ background: value }}
      />
      <span className="flex flex-col leading-tight">
        <span className="text-xs text-foreground">{label}</span>
        <span className="font-mono text-[0.65rem] uppercase text-muted-foreground">
          {copied ? tCommon("copied") : value}
        </span>
      </span>
    </button>
  );
}

/** Palette comparator: the shared demo scene re-colored, plus per-role swatches. */
export function PalettesExplorer() {
  const t = useTranslations("palettes");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const paramSlug = searchParams.get("palette");
  const [slug, setSlug] = useState(
    () =>
      (paramSlug && PALETTES.some((p) => p.slug === paramSlug)
        ? paramSlug
        : undefined) ?? PALETTES[0]?.slug,
  );
  const [promptLang, setPromptLang] = useState<"zh" | "en">(
    locale === "zh" ? "zh" : "en",
  );

  // Follow in-app navigations (e.g. site search while already on this page).
  // Manual switches use replaceState, which doesn't touch useSearchParams.
  useEffect(() => {
    if (paramSlug && PALETTES.some((p) => p.slug === paramSlug)) {
      setSlug(paramSlug);
    }
  }, [paramSlug]);

  const active = PALETTES.find((p) => p.slug === slug) ?? PALETTES[0];
  if (!active) return null;

  const prompt = promptLang === "zh" ? active.promptZh : active.promptEn;
  const recipe = locale === "zh" ? active.recipeZh : active.recipe;

  const selectPalette = (nextSlug: string) => {
    setSlug(nextSlug);
    window.history.replaceState(null, "", `?palette=${nextSlug}`);
  };

  return (
    <div>
      <div className="flex flex-col gap-3">
        {PALETTE_GROUPS.map((group) => {
          const groupPalettes = PALETTES.filter((p) => p.group === group.key);
          if (!groupPalettes.length) return null;
          return (
            <div key={group.key} className="flex flex-wrap items-center gap-2">
              <span className="w-16 shrink-0 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
                {locale === "zh" ? group.labelZh : group.label}
              </span>
              {groupPalettes.map((palette) => {
                const isActive = palette.slug === active.slug;
                return (
                  <button
                    key={palette.slug}
                    type="button"
                    onClick={() => selectPalette(palette.slug)}
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
                      className="flex h-4.5 w-4.5 flex-col overflow-hidden rounded-md border border-border"
                    >
                      <span
                        className="h-1/2"
                        style={{ background: palette.colors.bg }}
                      />
                      <span className="flex h-1/2">
                        <span
                          className="w-1/2"
                          style={{ background: palette.colors.primary }}
                        />
                        <span
                          className="w-1/2"
                          style={{ background: palette.colors.accent }}
                        />
                      </span>
                    </span>
                    {localizedName(palette, locale)}
                  </button>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_22.5rem] lg:items-start">
        <div className="flex flex-col gap-4">
          <StyleDemo skin={paletteToSkin(active)} className="min-h-105" />
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("swatches")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {ROLE_ORDER.map((role) => (
                <ColorChip
                  key={role}
                  label={t(ROLE_LABEL_KEYS[role])}
                  value={active.colors[role]}
                />
              ))}
            </div>
          </div>
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
                eventName="copy_palette_prompt"
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
