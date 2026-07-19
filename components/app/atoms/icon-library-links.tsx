"use client";

import { useLocale } from "next-intl";
import type { Locale } from "@/i18n/routing";

export type IconLibrary = {
  name: string;
  href: string;
  desc: string;
  descZh: string;
};

export function IconLibraryLinks({
  title,
  hint,
  libraries,
}: {
  title: string;
  hint: string;
  libraries: readonly IconLibrary[];
}) {
  const locale = useLocale() as Locale;

  return (
    <div className="mt-8">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{hint}</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {libraries.map((lib) => (
          <a
            key={lib.name}
            href={lib.href}
            target="_blank"
            rel="noreferrer noopener"
            className="rounded-2xl border border-border bg-card/20 px-4 py-3 transition-colors hover:border-(--color-border-strong) hover:bg-card"
          >
            <p className="text-sm font-semibold text-foreground">{lib.name}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              {locale === "zh" ? lib.descZh : lib.desc}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
