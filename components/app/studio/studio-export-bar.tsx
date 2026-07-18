"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCopyFeedback } from "@/components/app/atoms/copy-value";
import type { StudioExportBundle } from "@/lib/studio";
import { cn } from "@/lib/utils";

export function StudioExportBar({
  name,
  bundle,
  onNameChange,
  className,
}: {
  name: string;
  bundle: StudioExportBundle;
  onNameChange: (name: string) => void;
  className?: string;
}) {
  const t = useTranslations("studio");
  const { copiedLabel, copyValue } = useCopyFeedback();
  const formats = [
    { key: "css", label: t("exportCss"), value: bundle.css },
    { key: "tailwind", label: t("exportTailwind"), value: bundle.tailwind },
    { key: "design", label: t("exportDesign"), value: bundle.designMd },
  ] as const;

  return (
    <section
      className={cn(
        "sticky bottom-4 z-30 rounded-3xl border border-border bg-background/95 p-4 shadow-lg backdrop-blur-xl sm:p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {t("exportEyebrow")}
          </p>
          <h2 className="mt-1 text-base font-semibold text-foreground">{t("exportTitle")}</h2>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
            {t("exportHint")}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <label className="flex min-w-0 flex-col gap-1.5 text-xs font-medium text-muted-foreground sm:w-56">
            {t("systemName")}
            <input
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              placeholder={t("systemNamePlaceholder")}
              className="h-9 rounded-xl border border-border bg-card/30 px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-(--color-border-strong)"
            />
          </label>

          <fieldset className="flex flex-wrap gap-2">
            <legend className="sr-only">{t("exportTitle")}</legend>
            {formats.map((format) => {
              const eventLabel = `studio-export-${format.key}`;
              const copied = copiedLabel === eventLabel;
              return (
                <button
                  key={format.key}
                  type="button"
                  onClick={() => copyValue(format.value, eventLabel)}
                  aria-label={t("copyExport", { format: format.label })}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-card/30 px-3.5 text-xs font-medium text-muted-foreground transition-colors hover:border-(--color-border-strong) hover:text-foreground"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 text-(--color-success)" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                  {copied ? t("copied") : format.label}
                </button>
              );
            })}
          </fieldset>
        </div>
      </div>
    </section>
  );
}
