"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT, SPRING_PANEL } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface WorkbenchSummaryCardProps {
  /** Controlled open state — mounts/unmounts through `AnimatePresence`. */
  open: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * Pinned summary card overlay — a floating panel anchored to the top-right
 * corner, meant for at-a-glance session/environment info that stays visible
 * above the thread. Must be rendered inside `<WorkbenchMain>` (its `relative`
 * ancestor); it does not read from `useWorkbench()` and is unaware of
 * sidebar/panel state.
 *
 * `top-[54px]` = the 46px `HEADER_HEIGHT` toolbar overlay plus an 8px gap.
 */
export function WorkbenchSummaryCard({ open, className, children }: WorkbenchSummaryCardProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, x: 8 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, x: 8 }}
          transition={reduce ? { duration: 0.15, ease: EASE_OUT } : SPRING_PANEL}
          style={{
            transformOrigin: "top right",
            boxShadow:
              "0 0 0 0.5px var(--wsc-hairline), 0 3px 7.5px rgba(0,0,0,0.04), 0 0 20px rgba(0,0,0,0.05)",
          }}
          className={cn(
            "absolute right-4 top-[54px] z-20 w-[260px] overflow-hidden rounded-3xl bg-white/95 pt-2.5 backdrop-blur-xl",
            "[--wsc-hairline:rgba(0,0,0,0.08)] dark:bg-neutral-800/95 dark:[--wsc-hairline:rgba(255,255,255,0.1)]",
            className,
          )}
        >
          <div className="flex max-h-[420px] flex-col gap-3 overflow-y-auto pb-1.5">{children}</div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export interface WorkbenchSummarySectionProps {
  title?: ReactNode;
  /** Rendered at the right end of the title row — e.g. a small icon button. */
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/**
 * A titled group of rows inside `WorkbenchSummaryCard`. Only lays out the
 * title row and a trailing hairline divider — row styling (hover surface,
 * icon slot, trailing badge) is left to the caller to compose.
 */
export function WorkbenchSummarySection({
  title,
  action,
  className,
  children,
}: WorkbenchSummarySectionProps) {
  return (
    <section
      className={cn(
        "flex flex-col border-black/10 border-b-[0.5px] px-2 pb-3 last:border-0 dark:border-white/10",
        className,
      )}
    >
      {title ? (
        <div className="flex items-center justify-between px-1.5 pb-1">
          <span className="text-muted-foreground text-xs">{title}</span>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}
