"use client";

import { Check, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useLayoutEffect, useRef, useState } from "react";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type InboxRisk = "low" | "medium" | "high";
export type InboxStatus = "pending" | "approved" | "denied" | "expired";

interface InboxActionButtonProps {
  variant?: "ghost" | "primary";
  onClick?: () => void;
  children?: ReactNode;
}

/** Self-contained ghost/primary button for `InboxItem`'s approve/deny row — deliberately not imported from `agent-thread` so this block distributes independently. */
function InboxActionButton({ variant = "ghost", onClick, children }: InboxActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-7 items-center rounded-lg text-sm transition-colors",
        variant === "ghost" &&
          "px-2 text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10",
        variant === "primary" && "bg-foreground px-3 text-background transition-opacity hover:opacity-85",
      )}
    >
      {children}
    </button>
  );
}

interface InboxCountBadgeProps {
  count: number;
}

/** Small pill in `AgentInbox`'s header — the digits crossfade with a short y-shift on change, matching `ThreadBranchSwitcher`'s readout. */
function InboxCountBadge({ count }: InboxCountBadgeProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <span className="relative inline-flex h-5 min-w-5 items-center justify-center overflow-hidden rounded-full bg-[#339CFF]/15 px-1.5 text-xs font-medium text-[#339CFF] tabular-nums">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={count}
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
          transition={{ duration: 0.15, ease: EASE_OUT }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export interface AgentInboxProps {
  title?: ReactNode;
  /** Pending-count badge shown next to the title; omit to hide it entirely. */
  count?: number;
  /** Trailing slot for the caller's own controls, e.g. a "Clear" button. */
  action?: ReactNode;
  className?: string;
  /** `InboxItem`s (or any other row, e.g. a standalone `ActionReceipt`) — hairline-separated top to bottom. */
  children?: ReactNode;
}

/**
 * Approval-queue container — a hairline-ringed card (the same CSS-variable
 * box-shadow technique as `ThreadCard`) with a header row (title, optional
 * count badge, trailing action) above a stack of rows. Rows are rendered
 * directly as `children` and separated by a hairline via a descendant
 * selector, so any row shape (an `InboxItem`, a bare `ActionReceipt`) drops in
 * cleanly without the container needing to know its type.
 */
export function AgentInbox({ title, count, action, className, children }: AgentInboxProps) {
  return (
    <div
      style={{ boxShadow: "0 0 0 0.5px var(--inbox-hairline)" }}
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl bg-white",
        "[--inbox-hairline:rgba(0,0,0,0.08)] dark:bg-neutral-900 dark:[--inbox-hairline:rgba(255,255,255,0.157)]",
        className,
      )}
    >
      <div className="flex h-11 shrink-0 items-center gap-2 border-black/5 border-b-[0.5px] px-4 dark:border-white/[0.06]">
        {title ? <span className="text-sm font-medium">{title}</span> : null}
        {count !== undefined ? <InboxCountBadge count={count} /> : null}
        {action ? <div className="ml-auto shrink-0">{action}</div> : null}
      </div>
      <div className="flex flex-col [&>*+*]:border-black/5 [&>*+*]:border-t-[0.5px] dark:[&>*+*]:border-white/[0.06]">
        {children}
      </div>
    </div>
  );
}

export interface InboxRiskBadgeProps {
  risk: InboxRisk;
  className?: string;
}

/** Uppercase risk pill — low is neutral, medium is amber, high is red, matching the library's warning/danger hues. */
export function InboxRiskBadge({ risk, className }: InboxRiskBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-4.5 items-center rounded-full px-1.5 text-[10px] font-medium uppercase tracking-wide",
        risk === "low" && "bg-black/5 text-muted-foreground dark:bg-white/10",
        risk === "medium" && "bg-[#e25507]/10 text-[#e25507] dark:text-[#ff8549]",
        risk === "high" && "bg-red-500/10 text-red-500 dark:text-[#FA423E]",
        className,
      )}
    >
      {risk}
    </span>
  );
}

export interface InboxItemProps {
  /** 16px leading icon, e.g. `<Mail className="h-4 w-4" />`. */
  icon?: ReactNode;
  /** Requesting agent, e.g. "deploy-agent". */
  source?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  risk?: InboxRisk;
  /** Trailing countdown readout, e.g. "expires in 2h". */
  expires?: ReactNode;
  status?: InboxStatus;
  onApprove?: () => void;
  onDeny?: () => void;
  approveLabel?: ReactNode;
  denyLabel?: ReactNode;
  /** Replaces the approve/deny row once `status` is no longer "pending". */
  resolution?: ReactNode;
  className?: string;
  /** Optional detail region (e.g. a command preview or an `ActionReceipt`) revealed by a "Details" toggle. */
  children?: ReactNode;
}

/**
 * One queued approval request. While `pending`, a ghost Deny and a primary
 * Approve button sit at the trailing edge; once resolved, `resolution`
 * replaces them and the rest of the row's content dims to `opacity-70` (the
 * resolution line stays at full opacity). The optional `children` region is
 * measured with a `ResizeObserver` and tweened open/closed (`EASE_OUT`,
 * 0.25s), shown instantly under `useReducedMotion()` — the same idiom as
 * `ThreadCollapse`. The root is a `motion.div` with `layout` so the height
 * change on resolution settles smoothly instead of snapping.
 */
export function InboxItem({
  icon,
  source,
  title,
  description,
  risk,
  expires,
  status = "pending",
  onApprove,
  onDeny,
  approveLabel = "Approve",
  denyLabel = "Deny",
  resolution,
  className,
  children,
}: InboxItemProps) {
  const reduce = useReducedMotion() ?? false;
  const [detailsOpen, setDetailsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const pending = status === "pending";
  const hasDetails = children !== undefined && children !== null;

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
      layout={!reduce}
      transition={{ layout: SPRING_LAYOUT }}
      className={cn("px-4 py-3", className)}
    >
      <div className={cn(!pending && "opacity-70")}>
        <div className="flex items-center gap-2">
          {icon ? (
            <span className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
              {icon}
            </span>
          ) : null}
          {source ? <span className="text-xs text-muted-foreground">{source}</span> : null}
          {risk ? <InboxRiskBadge risk={risk} /> : null}
          {expires ? (
            <span className="ml-auto text-xs text-muted-foreground/70 tabular-nums">{expires}</span>
          ) : null}
        </div>
        <div className="mt-1.5 font-medium text-sm">{title}</div>
        {description ? <div className="text-[13px] text-muted-foreground">{description}</div> : null}
        {hasDetails ? (
          <>
            <button
              type="button"
              aria-expanded={detailsOpen}
              onClick={() => setDetailsOpen((open) => !open)}
              className="-mx-1 mt-1 inline-flex items-center gap-1 self-start rounded-md px-1 text-muted-foreground text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/10"
            >
              Details
              <motion.span
                aria-hidden
                className="flex text-muted-foreground/60"
                animate={reduce ? undefined : { rotate: detailsOpen ? 90 : 0 }}
                style={reduce ? { transform: detailsOpen ? "rotate(90deg)" : "rotate(0deg)" } : undefined}
                transition={reduce ? undefined : { duration: 0.2, ease: EASE_OUT }}
              >
                <ChevronRight className="h-3 w-3" />
              </motion.span>
            </button>
            <motion.div
              initial={false}
              animate={reduce ? undefined : { height: detailsOpen ? contentHeight : 0 }}
              transition={{ duration: 0.25, ease: EASE_OUT }}
              className={cn("overflow-hidden", reduce && (detailsOpen ? "h-auto" : "h-0"))}
            >
              <div ref={contentRef} className="pt-2">
                {children}
              </div>
            </motion.div>
          </>
        ) : null}
      </div>
      {pending ? (
        <div className="mt-2 flex items-center gap-1.5">
          <InboxActionButton variant="ghost" onClick={onDeny}>
            {denyLabel}
          </InboxActionButton>
          <InboxActionButton variant="primary" onClick={onApprove}>
            {approveLabel}
          </InboxActionButton>
        </div>
      ) : resolution !== undefined ? (
        <div
          className={cn(
            "mt-2 text-[13px]",
            status === "approved" && "text-emerald-600 dark:text-[#40C977]",
            status === "denied" && "text-muted-foreground",
            status === "expired" && "text-muted-foreground/60 italic",
          )}
        >
          {resolution}
        </div>
      ) : null}
    </motion.div>
  );
}

export interface ActionReceiptProps {
  /** 16px icon, defaults to a `Check` in the library's success green. */
  icon?: ReactNode;
  title: ReactNode;
  /** Sub-line describing what was acted on, e.g. "db: production/users, sessions". */
  scope?: ReactNode;
  added?: number;
  removed?: number;
  timestamp?: ReactNode;
  onUndo?: () => void;
  undoLabel?: ReactNode;
  className?: string;
  /** Optional extra content, e.g. a list of affected file rows. */
  children?: ReactNode;
}

/**
 * Operation receipt — the record of a completed action, usable standalone or
 * dropped into an `InboxItem`'s detail region (e.g. a "planned changes"
 * preview before approval, or a completion summary after). A hairline-ringed
 * surface (the `ThreadCard` box-shadow technique) rather than `AgentInbox`'s
 * full card chrome, since it's meant to nest inside other rows.
 */
export function ActionReceipt({
  icon,
  title,
  scope,
  added,
  removed,
  timestamp,
  onUndo,
  undoLabel = "Undo",
  className,
  children,
}: ActionReceiptProps) {
  return (
    <div
      style={{ boxShadow: "0 0 0 0.5px var(--receipt-hairline)" }}
      className={cn(
        "rounded-xl bg-black/[0.02] p-3",
        "[--receipt-hairline:rgba(0,0,0,0.08)] dark:bg-white/[0.03] dark:[--receipt-hairline:rgba(255,255,255,0.157)]",
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <span className="flex h-4 w-4 shrink-0 items-center justify-center text-emerald-600 dark:text-[#40C977]">
          {icon ?? <Check className="h-4 w-4" />}
        </span>
        <span className="font-medium text-sm">{title}</span>
        {timestamp ? (
          <span className="ml-auto text-muted-foreground/70 text-xs">{timestamp}</span>
        ) : null}
      </div>
      {scope ? <div className="mt-1 text-[13px] text-muted-foreground">{scope}</div> : null}
      {added !== undefined || removed !== undefined ? (
        <div className="mt-1 flex gap-1.5 text-[13px]">
          {added !== undefined ? (
            <span className="text-emerald-600 dark:text-[#40C977]">+{added}</span>
          ) : null}
          {removed !== undefined ? (
            <span className="text-red-500 dark:text-[#FA423E]">−{removed}</span>
          ) : null}
        </div>
      ) : null}
      {children}
      {onUndo ? (
        <div className="mt-2">
          <button
            type="button"
            onClick={onUndo}
            className="flex h-6 items-center rounded-md px-2 text-muted-foreground text-xs transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
          >
            {undoLabel}
          </button>
        </div>
      ) : null}
    </div>
  );
}
