"use client";

import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCopyFeedback } from "@/components/app/atoms/copy-value";
import type { AtomCategorySlug, AtomExportBundle } from "@/lib/atoms";
import { cn } from "@/lib/utils";

export function AtomExportActions({
  bundle,
  category,
  className,
}: {
  bundle: AtomExportBundle;
  category: AtomCategorySlug;
  className?: string;
}) {
  const t = useTranslations("atoms");
  const { copiedLabel, copyValue } = useCopyFeedback();
  const formats = [
    bundle.cssVariables
      ? { key: "css", label: t("exportCss"), value: bundle.cssVariables }
      : null,
    bundle.tailwindTheme
      ? { key: "tailwind", label: t("exportTailwind"), value: bundle.tailwindTheme }
      : null,
    {
      key: "design",
      label: t("exportDesign"),
      value: bundle.designMarkdown,
    },
  ].filter((format): format is { key: string; label: string; value: string } => Boolean(format));

  return (
    <fieldset className={cn("flex flex-wrap items-center gap-2", className)}>
      <legend className="sr-only">{t("exportTitle")}</legend>
      <span className="mr-1 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
        {t("exportTitle")}
      </span>
      {formats.map((format) => {
        const eventLabel = `atom-export-${category}-${format.key}`;
        const copied = copiedLabel === eventLabel;
        return (
          <button
            key={format.key}
            type="button"
            onClick={() => copyValue(format.value, eventLabel)}
            aria-label={t("copyExport", { format: format.label })}
            className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-card/30 px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-(--color-border-strong) hover:text-foreground"
          >
            {copied ? (
              <Check className="h-3 w-3 text-(--color-success)" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
            {format.label}
          </button>
        );
      })}
    </fieldset>
  );
}
