"use client";

import { Check, ChevronRight, Clock, RefreshCw, Sparkles, Wrench } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type ComponentType, type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface TraceProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Activity-rail container for an agent's execution trace — a hairline
 * strung through the center of every step's icon node, top and bottom
 * insets leaving breathing room before the first and after the last step.
 * Purely a positioning shell: `TraceStep`, `TraceGroup` and `TraceSubagent`
 * line their own markers up against it, so the rail visually threads
 * through whatever mix of step kinds is mounted.
 */
export function Trace({ className, children }: TraceProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-0",
        "before:absolute before:top-3 before:bottom-3 before:left-[11px] before:w-px before:bg-black/10 dark:before:bg-white/10",
        className,
      )}
    >
      {children}
    </div>
  );
}

export type TraceStepKind = "plan" | "tool" | "reflection" | "done";

const KIND_ICON: Record<TraceStepKind, ComponentType<{ className?: string }>> = {
  plan: Sparkles,
  tool: Wrench,
  reflection: RefreshCw,
  done: Check,
};

const KIND_NODE_STYLE: Record<TraceStepKind, string> = {
  plan: "border-black/15 text-muted-foreground dark:border-white/15",
  tool: "border-black/15 text-muted-foreground dark:border-white/15",
  reflection: "border-dashed border-black/15 text-muted-foreground dark:border-white/15",
  done: "border-emerald-500/40 text-emerald-600 dark:text-[#40C977]",
};

interface TraceShimmerTextProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Cadenced shimmer for a step's live label — a 1s sweep followed by a 2s
 * rest, matching the pulse-of-activity read the thread block's shimmer
 * uses. Deliberately reimplemented here rather than imported, so this block
 * distributes as one self-contained unit. Falls back to a plain muted span
 * under `useReducedMotion()`.
 */
function TraceShimmerText({ className, children }: TraceShimmerTextProps) {
  const reduce = useReducedMotion() ?? false;

  if (reduce) {
    return <span className={cn("text-muted-foreground", className)}>{children}</span>;
  }

  return (
    <motion.span
      style={{
        backgroundImage:
          "linear-gradient(90deg, var(--trace-dim) 0%, var(--trace-dim) 40%, var(--trace-bright) 50%, var(--trace-dim) 60%, var(--trace-dim) 100%)",
        backgroundSize: "200% 100%",
      }}
      animate={{ backgroundPosition: ["100% 0%", "-100% 0%"] }}
      transition={{ duration: 1, repeat: Infinity, repeatDelay: 2, ease: "linear" }}
      className={cn(
        "bg-clip-text text-transparent",
        "[--trace-dim:rgba(0,0,0,0.40)] [--trace-bright:rgba(0,0,0,0.85)] dark:[--trace-dim:rgba(255,255,255,0.40)] dark:[--trace-bright:rgba(255,255,255,0.95)]",
        className,
      )}
    >
      {children}
    </motion.span>
  );
}

export interface TraceStepProps {
  /** Drives the icon-node border style and the default icon; @default "tool" */
  kind?: TraceStepKind;
  /** 13px icon overriding the `kind` default (Sparkles/Wrench/RefreshCw/Check). */
  icon?: ReactNode;
  label: ReactNode;
  /** Second line under the label. */
  detail?: ReactNode;
  /** Right-floating slot, e.g. elapsed time — pass a colored span for a slow-running highlight. */
  meta?: ReactNode;
  /** Live state: pulses the icon ring and shimmers the label. */
  active?: boolean;
  /** Controlled "View raw" open state — only meaningful when `children` is passed. */
  open?: boolean;
  onOpenChange?: (next: boolean) => void;
  /** Raw content revealed by "View raw", e.g. a mono JSON block styled by the caller. */
  children?: ReactNode;
  className?: string;
}

/**
 * One row on the activity rail. Renders an icon node on the rail (styled by
 * `kind`), a label (shimmering while `active`), an optional detail line and
 * a right-floating `meta` slot. When `children` is passed, a "View raw"
 * button appends to the label row and toggles a height-measured region
 * below — controlled (`open`/`onOpenChange`) or uncontrolled, matching the
 * `ThreadCollapse` idiom (`ResizeObserver` + 0 ↔ measured height tween,
 * instant under `useReducedMotion()`). Mounts with the same opacity + slide
 * entrance as `ThreadItem`; callers drive when a step mounts to script the
 * trace's pacing.
 */
export function TraceStep({
  kind = "tool",
  icon,
  label,
  detail,
  meta,
  active = false,
  open: openProp,
  onOpenChange,
  children,
  className,
}: TraceStepProps) {
  const reduce = useReducedMotion() ?? false;
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);
  const hasRaw = children !== undefined && children !== null;
  const Icon = KIND_ICON[kind];

  const toggle = () => {
    const next = !open;
    setOpenState(next);
    onOpenChange?.(next);
  };

  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    const update = () => setContentHeight(node.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.25, ease: EASE_OUT }}
      className={cn("relative flex gap-3 py-2", className)}
    >
      <span
        className={cn(
          "z-10 flex h-[23px] w-[23px] shrink-0 items-center justify-center rounded-full border bg-white dark:bg-neutral-900",
          KIND_NODE_STYLE[kind],
        )}
      >
        {active && !reduce ? (
          <motion.span
            aria-hidden
            className="absolute h-[23px] w-[23px] rounded-full border border-[#339CFF]"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: EASE_OUT }}
          />
        ) : null}
        <span className="relative z-10 flex items-center justify-center">
          {icon ?? <Icon className="h-[13px] w-[13px]" />}
        </span>
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          {active ? (
            <TraceShimmerText className="text-sm">{label}</TraceShimmerText>
          ) : (
            <span className="text-sm text-foreground">{label}</span>
          )}
          {hasRaw ? (
            <button
              type="button"
              aria-expanded={open}
              onClick={toggle}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              View raw
            </button>
          ) : null}
          {meta !== undefined && meta !== null ? (
            <span className="ml-auto shrink-0 text-xs tabular-nums text-muted-foreground">{meta}</span>
          ) : null}
        </div>
        {detail !== undefined && detail !== null ? (
          <div className="text-[13px] text-muted-foreground">{detail}</div>
        ) : null}
        {hasRaw ? (
          <motion.div
            initial={false}
            animate={reduce ? undefined : { height: open ? contentHeight : 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className={cn("overflow-hidden", reduce && (open ? "h-auto" : "h-0"))}
          >
            <div ref={contentRef} className="pt-1.5">
              {children}
            </div>
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}

/** <0.01 keeps 4 decimal places, otherwise 3 — trailing zeros are trimmed either way (e.g. 0.003 → "$0.003", not "$0.0030"). */
function formatTraceCost(cost: number): string {
  const decimals = cost < 0.01 ? 4 : 3;
  const trimmed = cost.toFixed(decimals).replace(/0+$/, "").replace(/\.$/, "");
  return `$${trimmed}`;
}

/** K/M abbreviation for a raw token count; values under 1000 render as-is. */
function formatTraceTokenCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return `${count}`;
}

export interface TraceCostBadgeProps {
  tokens?: number;
  cost?: number;
  className?: string;
}

/**
 * Compact usage pill sized for a `TraceStep`'s `meta` slot — token count
 * and/or cost, joined by a middle dot when both are passed. Deliberately
 * reimplements its own K/M and price formatting rather than importing the
 * thread block's, keeping this block self-contained.
 */
export function TraceCostBadge({ tokens, cost, className }: TraceCostBadgeProps) {
  const fragments: string[] = [];
  if (tokens !== undefined) fragments.push(`${formatTraceTokenCount(tokens)} tok`);
  if (cost !== undefined) fragments.push(formatTraceCost(cost));

  if (fragments.length === 0) return null;

  return (
    <span
      className={cn(
        "inline-flex h-[18px] items-center gap-1 rounded-full bg-black/5 px-1.5 text-[10px] tabular-nums text-muted-foreground dark:bg-white/10",
        className,
      )}
    >
      {fragments.join(" · ")}
    </span>
  );
}

export interface TraceGroupProps {
  /** Header line, e.g. "Running 3 tools in parallel". */
  label: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * Parallel-execution group — a muted header line followed by a
 * dashed-ruled sub-list, indented to align under a `TraceStep`'s label
 * column. `children` are typically simplified rows the caller composes
 * (icon + text + meta) rather than full `TraceStep`s. Mounts as one entrance
 * unit, matching the other rail rows.
 */
export function TraceGroup({ label, children, className }: TraceGroupProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.25, ease: EASE_OUT }}
      className={cn("relative flex flex-col py-2", className)}
    >
      <div className="ml-9 text-[13px] text-muted-foreground">{label}</div>
      <div className="ml-9 mt-1 flex flex-col gap-1 border-l border-dashed border-black/10 pl-3 dark:border-white/10">
        {children}
      </div>
    </motion.div>
  );
}

export interface TraceSubagentProps {
  label: ReactNode;
  /** Controlled expand state. */
  open?: boolean;
  onOpenChange?: (next: boolean) => void;
  /** Nested `TraceStep`s — rendered inside a mini `Trace` of their own. */
  children?: ReactNode;
  className?: string;
}

/**
 * Nested sub-agent trace — a clickable header (chevron rotates on toggle)
 * that reveals its own indented `Trace` of steps below, styled like
 * `ThreadTurnHeader`'s hover pill. Height-measured expand/collapse mirrors
 * `ThreadCollapse` (`ResizeObserver`, 0 ↔ measured, `EASE_OUT` 0.25s,
 * instant under `useReducedMotion()`). Works controlled or uncontrolled.
 */
export function TraceSubagent({
  label,
  open: openProp,
  onOpenChange,
  children,
  className,
}: TraceSubagentProps) {
  const reduce = useReducedMotion() ?? false;
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const toggle = () => {
    const next = !open;
    setOpenState(next);
    onOpenChange?.(next);
  };

  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    const update = () => setContentHeight(node.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.25, ease: EASE_OUT }}
      className={cn("relative flex flex-col py-2", className)}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={toggle}
        className="ml-9 inline-flex items-center gap-1 self-start rounded-lg px-1 py-0.5 text-sm text-foreground transition-colors hover:bg-black/5 dark:hover:bg-white/10"
      >
        {label}
        <motion.span
          aria-hidden
          className="flex text-muted-foreground/60"
          animate={reduce ? undefined : { rotate: open ? 90 : 0 }}
          style={reduce ? { transform: open ? "rotate(90deg)" : "rotate(0deg)" } : undefined}
          transition={reduce ? undefined : { duration: 0.2, ease: EASE_OUT }}
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={reduce ? undefined : { height: open ? contentHeight : 0 }}
        transition={{ duration: 0.25, ease: EASE_OUT }}
        className={cn("overflow-hidden", reduce && (open ? "h-auto" : "h-0"))}
      >
        <div ref={contentRef} className="ml-9 border-black/10 border-l pl-4 dark:border-white/10">
          <Trace>{children}</Trace>
        </div>
      </motion.div>
    </motion.div>
  );
}

export interface TraceSummaryProps {
  duration?: ReactNode;
  tokens?: number;
  cost?: number;
  className?: string;
  children?: ReactNode;
}

/**
 * Run-summary tail row appended below a trace's last step — total duration,
 * token count and cost, ruled off from the steps above. Mounts with the
 * same opacity + slide entrance as `TraceStep` (`EASE_OUT`, 0.25s), reduced
 * to an opacity-only fade under `useReducedMotion()`.
 */
export function TraceSummary({ duration, tokens, cost, className, children }: TraceSummaryProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.15 : 0.25, ease: EASE_OUT }}
      className={cn(
        "ml-9 mt-1 flex items-center gap-3 border-t-[0.5px] border-black/10 pt-2 text-xs text-muted-foreground dark:border-white/10",
        className,
      )}
    >
      {duration !== undefined && duration !== null ? (
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {duration}
        </span>
      ) : null}
      {tokens !== undefined ? <span>{formatTraceTokenCount(tokens)} tokens</span> : null}
      {cost !== undefined ? <span>{formatTraceCost(cost)}</span> : null}
      {children}
    </motion.div>
  );
}
