"use client";

import { Check, Copy } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { CSSProperties, ReactNode } from "react";
import { AtomCard } from "@/components/app/atoms/atom-card";
import { AtomExportActions } from "@/components/app/atoms/atom-export-actions";
import {
  CopyValue,
  useCopyFeedback,
} from "@/components/app/atoms/copy-value";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  BACKGROUND_FADES,
  BACKGROUNDS,
  createBackgroundsExports,
} from "@/lib/atoms";
import type { BackgroundAtom, BackgroundFadeAtom } from "@/lib/atoms";
import { useResolvedDark } from "@/lib/hooks/use-resolved-dark";
import { cn } from "@/lib/utils";

const BACKGROUNDS_EXPORTS = createBackgroundsExports(BACKGROUNDS, BACKGROUND_FADES);

/** The texture a fade is demonstrated on — the medium screen reads clearest under a mask. */
const FADE_REFERENCE =
  BACKGROUNDS.find((entry) => entry.slug === "halftone-med") ?? BACKGROUNDS[0];

/**
 * Every recipe is injected verbatim as a scoped class rather than parsed into
 * inline styles: recipes carry tiling, SVG data URIs, and mask declarations
 * that no property cherry-pick survives. Authored in-repo, so not user input.
 */
const RECIPE_STYLESHEET = [
  ...BACKGROUNDS.flatMap((entry) => [
    `.uilab-tex-${entry.slug}-light{${entry.light}}`,
    `.uilab-tex-${entry.slug}-dark{${entry.dark}}`,
  ]),
  ...BACKGROUND_FADES.map((entry) => `.uilab-mask-${entry.slug}{${entry.mask}}`),
].join("\n");

function RecipeStyles() {
  // Not a `<style>{css}</style>` child: style content is raw text in HTML, so
  // React's text escaping would leave a literal `&lt;svg` inside the noise data
  // URIs. The content is static, repo-authored CSS.
  return <style dangerouslySetInnerHTML={{ __html: RECIPE_STYLESHEET }} />;
}

const BASE_SURFACE: Record<"light" | "dark", CSSProperties> = {
  light: { backgroundColor: "#ffffff" },
  dark: { backgroundColor: "#111214" },
};

/**
 * Mirrors the structure the fade rule teaches: the texture lives on its own
 * absolutely-positioned layer above a plain surface, so a mask never touches
 * the content stacked on top of it.
 */
function TextureLayer({
  entry,
  dark,
  fade,
  className,
  children,
}: {
  entry: BackgroundAtom;
  dark: boolean;
  fade?: BackgroundFadeAtom;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-2xl", className)}
      style={BASE_SURFACE[dark ? "dark" : "light"]}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0",
          `uilab-tex-${entry.slug}-${dark ? "dark" : "light"}`,
          fade && `uilab-mask-${fade.slug}`,
        )}
      />
      {children}
    </div>
  );
}

function SwatchCaption({
  name,
  secondary,
  aliases,
}: {
  name: string;
  secondary: string;
  aliases: readonly string[];
}) {
  return (
    <div className="absolute inset-x-3 bottom-3 rounded-xl border border-black/10 bg-white/85 p-3 text-neutral-950 shadow-sm backdrop-blur-sm dark:border-white/10 dark:bg-neutral-950/85 dark:text-neutral-50">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-sm font-semibold">{name}</span>
        <span className="text-[0.65rem] opacity-60">{secondary}</span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {aliases.map((alias) => (
          <span
            key={alias}
            className="rounded-full border border-current/10 bg-current/5 px-2 py-0.5 text-[0.6rem] opacity-70"
          >
            {alias}
          </span>
        ))}
      </div>
    </div>
  );
}

function BackgroundSwatch({
  entry,
  dark,
  className,
}: {
  entry: BackgroundAtom;
  dark: boolean;
  className?: string;
}) {
  const locale = useLocale() as Locale;

  return (
    <TextureLayer entry={entry} dark={dark} className={className}>
      <SwatchCaption
        name={locale === "zh" ? entry.nameZh : entry.name}
        secondary={locale === "zh" ? entry.name : entry.nameZh}
        aliases={entry.aliases}
      />
    </TextureLayer>
  );
}

export function BackgroundsExplorer({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("atoms");
  const { copiedLabel, copyValue } = useCopyFeedback();
  const dark = useResolvedDark();
  const scheme = dark ? "dark" : "light";

  return (
    <div className={cn("flex flex-col gap-12", className)}>
      <RecipeStyles />
      <section aria-labelledby="backgrounds-comparator-title">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {t("comparator")}
        </p>
        <h2
          id="backgrounds-comparator-title"
          className="mt-2 text-2xl font-semibold text-foreground"
        >
          {t("backgroundsComparatorTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("backgroundsComparatorHint")}
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t.rich("backgroundsIntro", {
            webgl: (chunks) => (
              <Link
                href="/components/motion/webgl-background"
                className="font-mono text-foreground underline decoration-border-strong underline-offset-4"
              >
                {chunks}
              </Link>
            ),
          })}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {BACKGROUNDS.map((entry) => {
            const value = entry[scheme];
            const label = `background-comparator-${scheme}-${entry.slug}`;
            const copied = copiedLabel === label;
            const name = locale === "zh" ? entry.nameZh : entry.name;

            return (
              <button
                key={entry.slug}
                type="button"
                onClick={() => copyValue(value, label)}
                aria-label={
                  copied
                    ? t("copiedBackground", { name })
                    : t("copyBackground", {
                        name,
                        scheme: dark ? t("darkValue") : t("lightValue"),
                      })
                }
                className="group relative rounded-2xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <BackgroundSwatch entry={entry} dark={dark} className="h-56" />
                <span
                  aria-live="polite"
                  className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white/85 px-2.5 py-1 text-[0.65rem] font-medium text-neutral-700 shadow-sm backdrop-blur-sm transition-colors group-hover:text-neutral-950 dark:border-white/10 dark:bg-neutral-950/85 dark:text-neutral-300 dark:group-hover:text-white"
                >
                  {copied ? (
                    <Check className="h-3 w-3 text-(--color-success)" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                  {copied
                    ? t("copied")
                    : dark
                      ? t("darkValue")
                      : t("lightValue")}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="backgrounds-values-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("entryList")}
            </p>
            <h2
              id="backgrounds-values-title"
              className="mt-2 text-2xl font-semibold text-foreground"
            >
              {t("backgroundsValuesTitle")}
            </h2>
          </div>
          <AtomExportActions bundle={BACKGROUNDS_EXPORTS} category="backgrounds" />
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {BACKGROUNDS.map((entry) => (
            <AtomCard
              key={entry.slug}
              id={entry.slug}
              {...entry}
              sample={<BackgroundSwatch entry={entry} dark={dark} className="h-40" />}
              valueLabel={t("backgroundCssLabel")}
              value={
                <div className="space-y-2">
                  <div>
                    <span className="text-[0.65rem] text-muted-foreground">
                      {t("lightValue")}
                    </span>
                    <CopyValue
                      value={entry.light}
                      label={`background-light-${entry.slug}`}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <span className="text-[0.65rem] text-muted-foreground">
                      {t("darkValue")}
                    </span>
                    <CopyValue
                      value={entry.dark}
                      label={`background-dark-${entry.slug}`}
                      className="mt-1"
                    />
                  </div>
                </div>
              }
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="backgrounds-fades-title">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {t("entryList")}
        </p>
        <h2
          id="backgrounds-fades-title"
          className="mt-2 text-2xl font-semibold text-foreground"
        >
          {t("backgroundsFadesTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("backgroundsFadesHint", {
            texture: locale === "zh" ? FADE_REFERENCE.nameZh : FADE_REFERENCE.name,
          })}
        </p>

        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {BACKGROUND_FADES.map((entry) => (
            <AtomCard
              key={entry.slug}
              id={entry.slug}
              {...entry}
              sample={
                <TextureLayer
                  entry={FADE_REFERENCE}
                  dark={dark}
                  fade={entry}
                  className="h-40"
                />
              }
              valueLabel={t("backgroundFadeCssLabel")}
              value={
                <CopyValue value={entry.mask} label={`background-fade-${entry.slug}`} />
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
