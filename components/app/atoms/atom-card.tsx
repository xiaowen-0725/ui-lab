"use client";

import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function AtomCard({
  id,
  name,
  nameZh,
  aliases,
  whenUse,
  whenUseZh,
  sample,
  value,
  valueLabel,
  note,
  noteZh,
  className,
}: {
  id: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  whenUse: string;
  whenUseZh: string;
  sample: ReactNode;
  value: ReactNode;
  valueLabel?: string;
  note?: string;
  noteZh?: string;
  className?: string;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("atoms");

  return (
    <article
      id={id}
      className={cn(
        "scroll-mt-28 rounded-3xl border border-border bg-card/20 p-5",
        className,
      )}
    >
      <div className="min-h-24 rounded-2xl border border-border bg-background/45 p-4">
        {sample}
      </div>
      <div className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <h3 className="text-base font-semibold text-foreground">
          {locale === "zh" ? nameZh : name}
        </h3>
        <span className="text-xs text-muted-foreground">
          {locale === "zh" ? name : nameZh}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {aliases.map((alias) => (
          <span
            key={alias}
            className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] text-muted-foreground"
          >
            {alias}
          </span>
        ))}
      </div>
      <p className="mt-4 text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
        {valueLabel ?? t("valueLabel")}
      </p>
      <div className="mt-2">{value}</div>
      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        <span className="font-medium text-foreground">{t("whenUse")} </span>
        {locale === "zh" ? whenUseZh : whenUse}
      </p>
      {note || noteZh ? (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground/80">
          {locale === "zh" ? noteZh : note}
        </p>
      ) : null}
    </article>
  );
}
