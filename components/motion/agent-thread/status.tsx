"use client";

import { ChevronRight } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { ThreadCard, ThreadCardButton, ThreadShimmerText } from "./cards";

export type ThreadToolCallStatus = "running" | "done" | "error" | "stopped";

export interface ThreadToolCallProps {
  /** 16px leading icon, e.g. `<Globe className="h-4 w-4" />`. */
  icon?: ReactNode;
  status?: ThreadToolCallStatus;
  /** Supplement after the label — e.g. a mono query or path; wrapping (such as `font-mono text-[13px]`) is the caller's choice. */
  detail?: ReactNode;
  /** Trailing elapsed-time readout. */
  elapsed?: ReactNode;
  className?: string;
  /** The label, verb-tensed by the caller: "Searching the web" while running, "Searched the web" when done. */
  children?: ReactNode;
}

/**
 * Generic tool-invocation row — web searches, file reads, directory
 * listings, MCP tools and anything else the agent runs mid-turn. The
 * general-purpose sibling of `ThreadCommandRow`, which stays around as the
 * command-scenario interface; both share the same row layout. `running`
 * pulses the icon and shimmers the label (`detail` stays static); `done` is
 * fully static and muted; `error` paints icon and label red while `detail`
 * stays muted; `stopped` stays muted with the caller wording the label
 * (e.g. "Stopped command").
 */
export function ThreadToolCall({
  icon,
  status = "done",
  detail,
  elapsed,
  className,
  children,
}: ThreadToolCallProps) {
  const reduce = useReducedMotion() ?? false;
  const running = status === "running";
  const error = status === "error";

  return (
    <div className={cn("flex items-center gap-2 py-1 text-sm text-muted-foreground", className)}>
      {icon ? (
        running ? (
          <motion.span
            className="flex h-4 w-4 shrink-0 items-center justify-center"
            animate={reduce ? { opacity: 1 } : { opacity: [0.4, 1, 0.4] }}
            transition={reduce ? undefined : { duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
          >
            {icon}
          </motion.span>
        ) : (
          <span
            className={cn(
              "flex h-4 w-4 shrink-0 items-center justify-center",
              error && "text-red-500 dark:text-[#FA423E]",
            )}
          >
            {icon}
          </span>
        )
      ) : null}
      {running ? (
        <ThreadShimmerText>{children}</ThreadShimmerText>
      ) : (
        <span className={cn(error && "text-red-500 dark:text-[#FA423E]")}>{children}</span>
      )}
      {detail !== undefined && detail !== null ? (
        <span className="min-w-0 truncate">{detail}</span>
      ) : null}
      {elapsed !== undefined && elapsed !== null ? (
        <span className="text-[13px] text-muted-foreground/70 tabular-nums">{elapsed}</span>
      ) : null}
    </div>
  );
}

export interface ThreadThinkingProps {
  /** Still reasoning: the label shimmers, the chevron is hidden and expansion is disabled (there is no summary to show yet). */
  thinking?: boolean;
  /** Controlled open state for the summary region. */
  open?: boolean;
  onOpenChange?: (next: boolean) => void;
  className?: string;
  /** "Thinking…" while `thinking`, then e.g. "Thought for 8s". */
  label: ReactNode;
  /** Optional reasoning summary revealed below the header once `thinking` is over. */
  children?: ReactNode;
}

/**
 * Reasoning-state row. Visually matches `ThreadTurnHeader` (deliberately an
 * independent implementation to avoid coupling): while `thinking` the label
 * shimmers with no chevron; once done, pass a summary as `children` to get
 * an expandable region — measured with a `ResizeObserver` and animated
 * height 0 ↔ measured (`EASE_OUT`, 0.25s), shown instantly under
 * `useReducedMotion()` — rendered as a left-ruled quote block. Works
 * controlled (`open`/`onOpenChange`) or uncontrolled.
 */
export function ThreadThinking({
  thinking = false,
  open: openProp,
  onOpenChange,
  className,
  label,
  children,
}: ThreadThinkingProps) {
  const reduce = useReducedMotion() ?? false;
  const [openState, setOpenState] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const expandable = !thinking && children !== undefined && children !== null;
  const open = expandable && (openProp ?? openState);

  const toggle = () => {
    const next = !open;
    setOpenState(next);
    onOpenChange?.(next);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: `expandable` is the trigger — the summary region only mounts once thinking ends, so the observer must re-attach to the node the effect reads from the DOM at that point.
  useLayoutEffect(() => {
    const node = contentRef.current;
    if (!node) return;
    const update = () => setContentHeight(node.offsetHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, [expandable]);

  return (
    <div className={cn("flex flex-col", className)}>
      <button
        type="button"
        disabled={!expandable}
        aria-expanded={expandable ? open : undefined}
        onClick={toggle}
        className="-mx-1 my-1 inline-flex items-center gap-1 self-start rounded-lg px-1 text-sm text-muted-foreground transition-colors hover:bg-black/5 disabled:pointer-events-none dark:hover:bg-white/10"
      >
        {thinking ? <ThreadShimmerText>{label}</ThreadShimmerText> : label}
        {expandable ? (
          <motion.span
            aria-hidden
            className="flex text-muted-foreground/60"
            animate={reduce ? undefined : { rotate: open ? 90 : 0 }}
            style={reduce ? { transform: open ? "rotate(90deg)" : "rotate(0deg)" } : undefined}
            transition={reduce ? undefined : { duration: 0.2, ease: EASE_OUT }}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </motion.span>
        ) : null}
      </button>
      {expandable ? (
        <motion.div
          initial={false}
          animate={reduce ? undefined : { height: open ? contentHeight : 0 }}
          transition={{ duration: 0.25, ease: EASE_OUT }}
          className={cn("overflow-hidden", reduce && (open ? "h-auto" : "h-0"))}
        >
          <div
            ref={contentRef}
            className="border-black/10 border-l-2 py-1 pl-3 text-[13px] text-muted-foreground leading-[20px] dark:border-white/10"
          >
            {children}
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}

export interface ThreadStreamingCaretProps {
  className?: string;
}

/**
 * Blinking block caret appended to text that is still streaming in. Inline —
 * drop it right after the last streamed character. Static at half opacity
 * under `useReducedMotion()`.
 */
export function ThreadStreamingCaret({ className }: ThreadStreamingCaretProps) {
  const reduce = useReducedMotion() ?? false;
  const base = "ml-0.5 inline-block h-3.5 w-[7px] translate-y-[2px] rounded-[2px] bg-foreground/70";

  if (reduce) {
    return <span aria-hidden className={cn(base, "opacity-50", className)} />;
  }

  return (
    <motion.span
      aria-hidden
      className={cn(base, className)}
      animate={{ opacity: [1, 0.15, 1] }}
      transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export type ThreadApprovalStatus = "pending" | "approved" | "denied";

export interface ThreadApprovalCardProps {
  /** 20px icon rendered in a 40px rounded slot, e.g. `<ShieldAlert className="h-5 w-5" />`. */
  icon?: ReactNode;
  title: ReactNode;
  /** Sub-line under the title — wraps, never truncated. */
  description?: ReactNode;
  /** Optional mono one-liner of what will run. */
  command?: ReactNode;
  status?: ThreadApprovalStatus;
  /** Shown in place of the buttons once `status` is no longer "pending". */
  resolution?: ReactNode;
  onApprove?: () => void;
  onDeny?: () => void;
  approveLabel?: ReactNode;
  denyLabel?: ReactNode;
  className?: string;
}

/**
 * Approval-gate card — the agent pauses and asks before running something
 * sensitive. While `pending`, a ghost Deny and a primary Approve button sit
 * at the trailing edge; once resolved, `resolution` replaces them (green
 * when `approved`, muted when `denied`). Built on `ThreadCard`, so it shares
 * the hairline surface with the file and diff cards.
 */
export function ThreadApprovalCard({
  icon,
  title,
  description,
  command,
  status = "pending",
  resolution,
  onApprove,
  onDeny,
  approveLabel = "Approve",
  denyLabel = "Deny",
  className,
}: ThreadApprovalCardProps) {
  return (
    <ThreadCard className={className}>
      <div className="flex items-center gap-3 px-3 py-2.5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-black/5 dark:bg-white/10">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="font-medium text-sm">{title}</div>
          {description ? <div className="text-[13px] text-muted-foreground">{description}</div> : null}
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {status === "pending" ? (
            <>
              <ThreadCardButton variant="ghost" onClick={onDeny}>
                {denyLabel}
              </ThreadCardButton>
              <ThreadCardButton variant="primary" onClick={onApprove}>
                {approveLabel}
              </ThreadCardButton>
            </>
          ) : resolution ? (
            <span
              className={cn(
                "text-[13px]",
                status === "approved"
                  ? "text-emerald-600 dark:text-[#40C977]"
                  : "text-muted-foreground",
              )}
            >
              {resolution}
            </span>
          ) : null}
        </div>
      </div>
      {command ? (
        <div className="mx-3 mb-3 rounded-lg bg-black/[0.04] px-3 py-2 font-mono text-[13px] dark:bg-white/5">
          {command}
        </div>
      ) : null}
    </ThreadCard>
  );
}
