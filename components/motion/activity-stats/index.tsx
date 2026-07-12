"use client";

import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useMemo } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface StatsBarProps {
  className?: string;
  children?: ReactNode;
}

/** Connected row of `StatsItem`s, hairline-divided between siblings. */
export function StatsBar({ className, children }: StatsBarProps) {
  return (
    <div
      className={cn(
        "flex overflow-hidden rounded-[20px] border border-black/10 dark:border-white/[0.06]",
        "divide-x-[1px] divide-black/5 dark:divide-white/[0.06]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface StatsItemProps {
  /** Typically an `AnimatedNumber`/`NumberTicker` node so it counts in on mount. */
  value: ReactNode;
  label: ReactNode;
  className?: string;
}

/** One metric cell inside a `StatsBar` — a value line over a muted label line, both truncating equally. */
export function StatsItem({ value, label, className }: StatsItemProps) {
  return (
    <div
      className={cn(
        "flex min-w-px flex-1 flex-col items-center justify-center px-3 py-2.5 text-center",
        className,
      )}
    >
      <div className="w-full truncate text-sm leading-5 text-foreground">{value}</div>
      <div className="w-full truncate text-sm leading-5 text-muted-foreground">{label}</div>
    </div>
  );
}

/** Opacity bands for level 1–4, keyed by `value / max` thresholds (<=.25/.5/.75/1). */
const HEAT_ALPHA: Record<1 | 2 | 3 | 4, number> = { 1: 0.25, 2: 0.45, 3: 0.7, 4: 1 };

function heatLevel(value: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (value <= 0 || max <= 0) return 0;
  const ratio = value / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

export interface ActivityHeatmapProps {
  /**
   * Column-major cell values: index `week * 7 + day`, top to bottom then
   * left to right. Shorter arrays are zero-padded up to `weeks * 7`.
   */
  data: number[];
  weeks?: number;
  /** Ceiling for the color scale; defaults to the highest value in `data`. */
  max?: number;
  /** Month-axis labels under the grid, `week` is the column index they sit above. */
  months?: { label: string; week: number }[];
  /** Native `title` tooltip text; defaults to the raw value. */
  cellTitle?: (index: number, value: number) => string;
  className?: string;
}

/**
 * GitHub-style contribution grid. Colors come from a single `--heat-accent`
 * CSS variable (blue, tuned separately for each color scheme) mixed at four
 * opacity bands via `color-mix`, so cells never need a per-scheme class list.
 * Entrance is a one-time column-cascade fade: each of the (up to) 52 columns
 * is its own `motion.div` fading in with a small stagger, while the 7 cells
 * inside a column mount statically — animating per-column instead of per-cell
 * keeps this to `weeks` motion nodes instead of `weeks * 7`.
 * `useReducedMotion()` skips the cascade and renders everything in place.
 */
export function ActivityHeatmap({
  data,
  weeks = 52,
  max,
  months,
  cellTitle,
  className,
}: ActivityHeatmapProps) {
  const reduce = useReducedMotion() ?? false;
  const total = weeks * 7;

  const padded = useMemo(
    () => Array.from({ length: total }, (_, i) => data[i] ?? 0),
    [data, total],
  );
  const effectiveMax = useMemo(() => max ?? Math.max(1, ...padded), [max, padded]);
  const columns = useMemo(
    () => Array.from({ length: weeks }, (_, w) => padded.slice(w * 7, w * 7 + 7)),
    [padded, weeks],
  );

  return (
    <div className={cn("[--heat-accent:#339CFF] dark:[--heat-accent:#83C3FF]", className)}>
      <div className="flex gap-[3px]">
        {columns.map((column, weekIndex) => (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: columns are a fixed-length, position-derived grid — index is a stable identity here.
            key={weekIndex}
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={
              reduce ? undefined : { duration: 0.2, ease: EASE_OUT, delay: weekIndex * 0.006 }
            }
            className="grid grid-rows-7 gap-[3px]"
          >
            {column.map((value, day) => {
              const index = weekIndex * 7 + day;
              const level = heatLevel(value, effectiveMax);
              return (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: day is a fixed 0-6 row position within the column.
                  key={day}
                  title={cellTitle ? cellTitle(index, value) : `${value}`}
                  style={
                    level !== 0
                      ? {
                          backgroundColor: `color-mix(in srgb, var(--heat-accent) ${HEAT_ALPHA[level] * 100}%, transparent)`,
                        }
                      : undefined
                  }
                  className={cn(
                    "block h-[11px] w-[11px] rounded-[4px] transition-transform hover:scale-125",
                    level === 0 && "bg-black/[0.06] dark:bg-white/[0.043]",
                  )}
                />
              );
            })}
          </motion.div>
        ))}
      </div>
      {months && months.length > 0 ? (
        <div className="relative mt-1 h-4 text-xs text-muted-foreground">
          {months.map((month) => (
            <span
              key={`${month.label}-${month.week}`}
              className="absolute"
              style={{ left: month.week * 14 }}
            >
              {month.label}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export interface StatsPeriodTabsProps {
  options: { value: string; label: ReactNode }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/** Plain-text period switch (e.g. "Daily / Weekly / Total") — no pill, just color contrast on the active option. */
export function StatsPeriodTabs({ options, value, onChange, className }: StatsPeriodTabsProps) {
  return (
    <div className={cn("flex items-center gap-3 text-sm", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={option.value === value}
          onClick={() => onChange(option.value)}
          className={cn(
            "transition-colors",
            option.value === value
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
