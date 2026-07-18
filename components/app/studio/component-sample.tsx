"use client";

import { Check, ChevronRight } from "lucide-react";
import type { CSSProperties } from "react";
import type { WorkbenchSkin } from "@/lib/layouts/types";
import type { StudioConfig, StudioResolvedTokens } from "@/lib/studio";
import { cn } from "@/lib/utils";

type ComponentSampleProps = {
  config: StudioConfig;
  skin: WorkbenchSkin;
  tokens: StudioResolvedTokens;
  copy: {
    title: string;
    hint: string;
    primary: string;
    secondary: string;
    cardTitle: string;
    cardBody: string;
    inputPlaceholder: string;
    badge: string;
    rowTitle: string;
    rowMeta: string;
  };
  className?: string;
};

export function ComponentSample({
  config,
  skin,
  tokens,
  copy,
  className,
}: ComponentSampleProps) {
  const style = {
    ...skin.vars,
    ...skin.siteVars,
    "--font-display": tokens.fontPairing.display,
    "--font-sans": tokens.fontPairing.body,
    "--font-mono": tokens.fontPairing.mono,
    "--studio-radius": tokens.radius.value,
    "--studio-shadow": tokens.elevation[config.scheme],
    "--studio-space": `${tokens.density.padding}px`,
    "--studio-row-height": `${tokens.density.rowHeight}px`,
    colorScheme: config.scheme,
    fontFamily: tokens.fontPairing.body,
  } as CSSProperties;

  const surfaceClass =
    "rounded-[var(--studio-radius)] border border-[var(--wb-border)] bg-[var(--wb-surface-raised)] shadow-[var(--studio-shadow)]";

  return (
    <section
      style={style}
      data-workbench-scheme={config.scheme}
      className={cn(
        "overflow-hidden rounded-3xl border border-[var(--wb-border)] bg-background p-4 text-foreground sm:p-5",
        config.scheme === "dark" && "dark",
        className,
      )}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="font-display text-sm font-semibold [font-family:var(--font-display)]">
          {copy.title}
        </h2>
        <p className="text-xs text-muted-foreground">{copy.hint}</p>
      </div>

      <div className="mt-4 grid gap-[var(--studio-space)] xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-[var(--studio-space)]">
          <div className="flex flex-wrap gap-[var(--studio-space)]">
            <button
              type="button"
              className="min-h-[var(--studio-row-height)] rounded-[var(--studio-radius)] bg-[var(--wb-accent)] px-[var(--studio-space)] text-sm font-medium text-[var(--wb-accent-fg)] shadow-[var(--studio-shadow)]"
            >
              {copy.primary}
            </button>
            <button
              type="button"
              className="min-h-[var(--studio-row-height)] rounded-[var(--studio-radius)] border border-[var(--wb-border)] bg-[var(--wb-surface-raised)] px-[var(--studio-space)] text-sm font-medium text-foreground"
            >
              {copy.secondary}
            </button>
            <span className="inline-flex min-h-6 items-center rounded-[var(--studio-radius)] border border-[var(--wb-accent)] bg-[color-mix(in_srgb,var(--wb-accent)_12%,transparent)] px-2.5 text-xs font-medium text-[var(--wb-accent)]">
              {copy.badge}
            </span>
          </div>

          <label className="sr-only" htmlFor="studio-component-sample-input">
            {copy.inputPlaceholder}
          </label>
          <input
            id="studio-component-sample-input"
            placeholder={copy.inputPlaceholder}
            className="min-h-[var(--studio-row-height)] rounded-[var(--studio-radius)] border border-[var(--wb-border)] bg-[var(--wb-surface)] px-[var(--studio-space)] text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-[var(--wb-accent)]"
          />

          <button
            type="button"
            className={cn(
              surfaceClass,
              "flex min-h-[var(--studio-row-height)] items-center gap-[var(--studio-space)] p-[var(--studio-space)] text-left",
            )}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--studio-radius)] bg-[color-mix(in_srgb,var(--wb-accent)_14%,transparent)] text-[var(--wb-accent)]">
              <Check className="h-4 w-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">{copy.rowTitle}</span>
              <span className="block truncate text-xs text-muted-foreground">{copy.rowMeta}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </div>

        <article className={cn(surfaceClass, "p-[var(--studio-space)]")}> 
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-base font-semibold [font-family:var(--font-display)]">
                {copy.cardTitle}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {copy.cardBody}
              </p>
            </div>
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--wb-success)]" />
          </div>
          <div className="mt-[var(--studio-space)] h-1.5 overflow-hidden rounded-full bg-[var(--wb-inset-strong)]">
            <div className="h-full w-2/3 rounded-full bg-[var(--wb-accent)]" />
          </div>
        </article>
      </div>
    </section>
  );
}
