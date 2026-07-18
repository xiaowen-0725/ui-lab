"use client";

import { useTranslations } from "next-intl";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PatternFrame({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const t = useTranslations("patterns");

  return (
    <figure
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-background shadow-sm",
        className,
      )}
    >
      <figcaption className="sr-only">{t("wireframe")}</figcaption>
      <div className="flex h-10 items-center gap-2 border-b border-border bg-card/60 px-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        </span>
        <span className="mx-auto rounded-md border border-border bg-background/70 px-8 py-1 font-mono text-[9px] text-muted-foreground">
          layout.local
        </span>
        <span aria-hidden="true" className="w-10" />
      </div>
      <div className="h-[20rem] overflow-hidden bg-muted/25 p-2 sm:h-[23rem] sm:p-3">
        {children}
      </div>
    </figure>
  );
}

export function Region({
  label,
  className,
  style,
  children,
}: {
  label: string;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-0 min-w-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-card/70 p-2 text-center shadow-sm",
        className,
      )}
      style={style}
    >
      <span className="relative z-10 rounded-md border border-border bg-background/80 px-2 py-1 font-mono text-[9px] font-medium text-muted-foreground shadow-sm sm:text-[10px]">
        {label}
      </span>
      {children}
    </div>
  );
}
