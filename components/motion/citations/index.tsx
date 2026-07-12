"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Children, type ReactNode, useCallback, useRef, useState } from "react";
import { EASE_OUT, SPRING_PANEL } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface CitationSource {
  title: ReactNode;
  domain: ReactNode;
  favicon?: ReactNode;
  snippet?: ReactNode;
  href?: string;
}

const CHIP_CLASSNAME =
  "inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-black/[0.07] px-1 text-[10px] font-medium text-muted-foreground align-super dark:bg-white/10";

const OPEN_DELAY_MS = 150;
const CLOSE_DELAY_MS = 200;

export interface CitationChipProps {
  index: number;
  source?: CitationSource;
  className?: string;
}

/**
 * Small circular `[n]` badge dropped inline after a claim in body copy. With
 * no `source` it's a static, non-interactive pill (`vertical-align: super`
 * via `align-super`, standing in for a real `<sup>` without the cramped
 * default line-height). With a `source`, it becomes a button that reveals a
 * preview popover on hover (150ms open delay, 200ms close delay) or focus —
 * a single shared timeout ref means moving the pointer from the chip into
 * the popover itself cancels the pending close rather than dismissing it.
 */
export function CitationChip({ index, source, className }: CitationChipProps) {
  const reduce = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const scheduleOpen = useCallback(() => {
    clearTimer();
    timeoutRef.current = setTimeout(() => setOpen(true), OPEN_DELAY_MS);
  }, [clearTimer]);

  const scheduleClose = useCallback(() => {
    clearTimer();
    timeoutRef.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }, [clearTimer]);

  const openNow = useCallback(() => {
    clearTimer();
    setOpen(true);
  }, [clearTimer]);

  if (!source) {
    return <span className={cn(CHIP_CLASSNAME, className)}>{index}</span>;
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: hover/focus preview trigger wrapping the real button below; the span itself holds no semantics.
    <span
      className="relative inline-block"
      onMouseEnter={scheduleOpen}
      onMouseLeave={scheduleClose}
      onFocus={openNow}
      onBlur={scheduleClose}
    >
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        className={cn(
          CHIP_CLASSNAME,
          "transition-colors hover:bg-[#339CFF] hover:text-white",
          className,
        )}
      >
        {index}
      </button>
      <AnimatePresence>
        {open ? (
          <motion.span
            role="tooltip"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 4 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 4 }}
            transition={reduce ? { duration: 0.15, ease: EASE_OUT } : SPRING_PANEL}
            style={{
              transformOrigin: "bottom center",
              boxShadow:
                "0 0 0 0.5px var(--citation-hairline), 0 3px 7.5px rgba(0,0,0,0.04), 0 0 20px rgba(0,0,0,0.05)",
            }}
            className={cn(
              // Span-based throughout (styled block via classes): the chip is
              // designed to sit inside <p> prose, where a <div> descendant is
              // invalid HTML and would break hydration.
              "absolute bottom-[calc(100%+6px)] left-1/2 z-30 block w-64 -translate-x-1/2 rounded-xl bg-white/95 p-3 text-left normal-case backdrop-blur-xl",
              "[--citation-hairline:rgba(0,0,0,0.08)] dark:bg-neutral-800/95 dark:[--citation-hairline:rgba(255,255,255,0.15)]",
            )}
          >
            <span className="flex items-center gap-1.5">
              {source.favicon ? (
                <span className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
                  {source.favicon}
                </span>
              ) : null}
              <span className="truncate text-muted-foreground text-xs">{source.domain}</span>
            </span>
            <span className="mt-1 line-clamp-2 font-medium text-[13px]">
              {source.href ? (
                <a href={source.href} target="_blank" rel="noreferrer" className="hover:underline">
                  {source.title}
                </a>
              ) : (
                source.title
              )}
            </span>
            {source.snippet ? (
              <span className="mt-1 line-clamp-2 text-muted-foreground text-xs">{source.snippet}</span>
            ) : null}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );
}

export interface SourceCardProps {
  source: CitationSource;
  index?: number;
  className?: string;
}

/**
 * One row in a `SourceList` — a favicon slot, then domain (with an optional
 * static index badge floated to the right, styled like `CitationChip` but
 * inert) over the title over a two-line snippet. The whole card links out
 * when `source.href` is set.
 */
export function SourceCard({ source, index, className }: SourceCardProps) {
  const rootClassName = cn(
    "flex gap-3 rounded-xl p-3 transition-colors hover:bg-black/[0.03] dark:hover:bg-white/5",
    className,
  );

  const content = (
    <>
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10">
        {source.favicon}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-muted-foreground text-xs">{source.domain}</span>
          {index !== undefined ? (
            <span className="ml-auto inline-flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-black/[0.07] px-1 text-[10px] font-medium text-muted-foreground dark:bg-white/10">
              {index}
            </span>
          ) : null}
        </div>
        <div className="truncate font-medium text-sm">{source.title}</div>
        {source.snippet ? (
          <div className="line-clamp-2 text-[13px] text-muted-foreground">{source.snippet}</div>
        ) : null}
      </div>
    </>
  );

  if (source.href) {
    return (
      <a href={source.href} target="_blank" rel="noreferrer" className={rootClassName}>
        {content}
      </a>
    );
  }

  return <div className={rootClassName}>{content}</div>;
}

export interface SourceListProps {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * Vertical stack of `SourceCard`s under an optional muted title row (e.g.
 * "Sources · 3"). Children fade/slide in together with a per-card stagger
 * (`delay: index * 0.05`); `useReducedMotion()` renders the list directly
 * with no entrance animation.
 */
export function SourceList({ title, children, className }: SourceListProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      {title ? (
        <div className="px-3 pb-1 font-medium text-muted-foreground text-xs">{title}</div>
      ) : null}
      {reduce
        ? children
        : Children.map(children, (child, index) => (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: EASE_OUT, delay: index * 0.05 }}
            >
              {child}
            </motion.div>
          ))}
    </div>
  );
}
