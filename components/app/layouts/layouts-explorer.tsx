"use client";

import { Check, Copy } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { CopyButton } from "@/components/app/docs/copy-button";
import { type AnatomyId, AnatomyMap } from "@/components/app/layouts/anatomy-map";
import { WorkbenchStage } from "@/components/app/layouts/workbench-stage";
import { Button } from "@/components/motion/button";
import type { Locale } from "@/i18n/routing";
import { localizedDescription, localizedName } from "@/lib/i18n-content";
import { DESIGN_SYSTEMS } from "@/lib/layouts";
import { cn } from "@/lib/utils";

function DesignMdCopyButton({ text }: { text: string }) {
  const t = useTranslations("layouts");
  const [copied, setCopied] = useState(false);

  return (
    <Button
      variant="outline"
      size="sm"
      pressScale={0.9}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      aria-label={copied ? t("copiedDesignMd") : t("copyDesignMd")}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? t("copiedDesignMd") : t("copyDesignMd")}
    </Button>
  );
}

/** Immersive workbench showcase: live skin target, anatomy linkage, and copy-ready vocabulary. */
export function LayoutsExplorer({ className }: { className?: string }) {
  const t = useTranslations("layouts");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const paramSlug = searchParams.get("ds");
  const [slug, setSlug] = useState(
    () =>
      (paramSlug && DESIGN_SYSTEMS.some((entry) => entry.slug === paramSlug)
        ? paramSlug
        : undefined) ?? DESIGN_SYSTEMS[0]?.slug,
  );
  const [promptLang, setPromptLang] = useState<"zh" | "en">(
    locale === "zh" ? "zh" : "en",
  );
  const [activeAnatomy, setActiveAnatomy] = useState<AnatomyId | null>(null);

  useEffect(() => {
    if (paramSlug && DESIGN_SYSTEMS.some((entry) => entry.slug === paramSlug)) {
      setSlug(paramSlug);
    }
  }, [paramSlug]);

  const active = DESIGN_SYSTEMS.find((entry) => entry.slug === slug) ?? DESIGN_SYSTEMS[0];
  if (!active) return null;

  const selectEntry = (nextSlug: string) => {
    setSlug(nextSlug);
    window.history.replaceState(null, "", `?ds=${nextSlug}`);
  };

  const prompt = promptLang === "zh" ? active.promptZh : active.promptEn;

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div>
        <WorkbenchStage entry={active} activeAnatomy={activeAnatomy} scriptedReplay />
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground/80">
          {t("stageHint")}
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card/20 p-3 sm:flex-row sm:items-center">
        <span className="shrink-0 px-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
          {t("switcherLabel")}
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {DESIGN_SYSTEMS.map((entry) => {
            const isActive = entry.slug === active.slug;
            const canvas = entry.skin.siteVars["--background"];
            const surface = entry.skin.siteVars["--card"];
            const accent = entry.skin.vars["--wb-accent"];
            return (
              <button
                key={entry.slug}
                type="button"
                onClick={() => selectEntry(entry.slug)}
                aria-pressed={isActive}
                className={cn(
                  "flex items-center gap-2 rounded-2xl border px-3.5 py-1.5 text-sm transition-colors",
                  isActive
                    ? "border-(--color-border-strong) bg-card text-foreground"
                    : "border-border bg-card/20 text-muted-foreground hover:text-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className="h-4.5 w-4.5 rounded-md border border-border"
                  style={{
                    background:
                      entry.skin.scheme === "auto"
                        ? "linear-gradient(135deg, #f4f4f5 0%, #f4f4f5 49%, #27272a 51%, #27272a 100%)"
                        : `linear-gradient(135deg, ${canvas} 0%, ${canvas} 49%, ${surface} 51%, ${surface} 100%)`,
                  }}
                >
                  {accent ? (
                    <span
                      className="block h-1.5 w-1.5 translate-x-[7px] translate-y-[7px] rounded-full"
                      style={{ background: accent }}
                    />
                  ) : null}
                </span>
                {localizedName(entry, locale)}
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70">
                  {t(
                    entry.skin.scheme === "auto"
                      ? "schemeAuto"
                      : entry.skin.scheme === "dark"
                        ? "schemeDark"
                        : "schemeLight",
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnatomyMap activeId={activeAnatomy} onActiveChange={setActiveAnatomy} />

      <section className="grid gap-7 rounded-3xl border border-border bg-card/20 p-6 lg:grid-cols-[0.8fr_1.2fr] lg:p-8">
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("entryEyebrow")}
            </p>
            <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-2xl font-semibold text-foreground">
                {localizedName(active, locale)}
              </h2>
              <span className="text-sm text-muted-foreground">
                {locale === "zh" ? active.name : active.nameZh}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
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

          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <p className="text-sm font-medium text-foreground">{t("designMdTitle")}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {t("designMdDescription")}
            </p>
            <div className="mt-3">
              <DesignMdCopyButton text={active.designMd} />
            </div>
          </div>
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
          <div className="relative mt-2 rounded-2xl border border-border bg-background/60 p-5 pr-14">
            <CopyButton
              text={prompt}
              className="absolute right-2 top-2"
              eventName="copy_design_system_prompt"
              eventLabel={`${active.slug}-${promptLang}`}
            />
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
              {prompt}
            </p>
          </div>
          <p className="mt-2 text-xs text-muted-foreground/80">{t("promptHint")}</p>
        </div>
      </section>
    </div>
  );
}
