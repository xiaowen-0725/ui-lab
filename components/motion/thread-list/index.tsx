"use client";

import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useId } from "react";
import { SPRING_PANEL } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ThreadListProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Sidebar conversation/task list root — a tight `flex flex-col` stack of
 * `ThreadListSection`s. Wraps `children` in a `LayoutGroup` scoped to this
 * instance (via `useId`), so the active-row indicator's `layoutId="active"`
 * animation (see `ThreadListItem`) stays local to this list — two
 * `ThreadList`s rendered on the same page never fight over which one owns
 * the moving highlight.
 */
export function ThreadList({ className, children }: ThreadListProps) {
  const groupId = useId();

  return (
    <LayoutGroup id={groupId}>
      <div className={cn("flex flex-col gap-0.5", className)}>{children}</div>
    </LayoutGroup>
  );
}

export interface ThreadListSectionProps {
  /** Muted section label, e.g. "Pinned" or "Recent". */
  title?: ReactNode;
  /** Trailing slot beside the title, e.g. a "new" `ThreadListAction`. */
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/**
 * Named group of rows inside a `ThreadList`. The header row (label plus an
 * optional trailing action) only renders when `title` or `action` is
 * passed, so a section can also be used as a bare, unlabeled row group.
 */
export function ThreadListSection({ title, action, className, children }: ThreadListSectionProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {title !== undefined || action !== undefined ? (
        <div className="flex items-center justify-between px-2 pt-3 pb-1">
          <span className="text-xs font-medium text-muted-foreground">{title}</span>
          {action}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export interface ThreadListItemProps {
  /** Highlights the row and pins the moving indicator here. */
  active?: boolean;
  /** Renders a small blue dot after the title. */
  unread?: boolean;
  /** 16px leading icon, e.g. `<MessageSquare className="h-4 w-4" />`. */
  icon?: ReactNode;
  /** Trailing meta, e.g. a relative timestamp. Hidden on row hover in favor of `actions` when both are passed; stays visible when `actions` is omitted. */
  meta?: ReactNode;
  /** Row of `ThreadListAction`s revealed on hover, replacing `meta`. */
  actions?: ReactNode;
  onSelect?: () => void;
  className?: string;
  /** The row's title — truncates to a single line. */
  children?: ReactNode;
}

/**
 * One row in a `ThreadList` — a conversation or task entry. The signature
 * motion is the active indicator: a `layoutId="active"` pill that glides
 * between rows as selection moves (`SPRING_PANEL`), scoped to the enclosing
 * `ThreadList`'s `LayoutGroup` so unrelated lists sharing a page don't
 * collide. Reduced motion swaps the animated pill for a static span.
 *
 * Deliberately *not* a single `<button>` wrapping everything: `actions`
 * renders real `ThreadListAction` buttons (pin, delete, ...), and a
 * `<button>` cannot legally contain another `<button>`. Instead the row is a
 * plain container with the selectable button filling it, and — only when
 * `actions` is passed — a sibling, absolutely-positioned action cluster
 * layered on top at the trailing edge, shown on hover in place of `meta`.
 * Both stay real, independently focusable buttons with no nested-control
 * hit-testing tricks required.
 */
export function ThreadListItem({
  active = false,
  unread = false,
  icon,
  meta,
  actions,
  onSelect,
  className,
  children,
}: ThreadListItemProps) {
  const reduce = useReducedMotion() ?? false;
  const hasMeta = meta !== undefined && meta !== null;
  const hasActions = actions !== undefined && actions !== null;

  return (
    <div className={cn("group relative flex h-[30px] w-full", className)}>
      <button
        type="button"
        onClick={onSelect}
        aria-current={active || undefined}
        className={cn(
          "relative flex w-full min-w-0 items-center gap-2 rounded-lg px-2 text-left text-sm",
          !active && "hover:bg-black/[0.03] dark:hover:bg-white/5",
        )}
      >
        {active ? (
          reduce ? (
            <span aria-hidden className="absolute inset-0 rounded-lg bg-black/5 dark:bg-white/10" />
          ) : (
            <motion.span
              aria-hidden
              layoutId="active"
              className="absolute inset-0 rounded-lg bg-black/5 dark:bg-white/10"
              transition={SPRING_PANEL}
            />
          )
        ) : null}

        {icon ? (
          <span className="relative z-10 flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
            {icon}
          </span>
        ) : null}

        <span
          className={cn(
            "relative z-10 min-w-0 flex-1 truncate",
            active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground",
          )}
        >
          {children}
        </span>

        {unread ? (
          <span className="relative z-10 h-1.5 w-1.5 shrink-0 rounded-full bg-[#339CFF]" />
        ) : null}

        {hasMeta ? (
          <span
            className={cn(
              "relative z-10 shrink-0 text-xs text-muted-foreground/70",
              hasActions && "group-hover:hidden",
            )}
          >
            {meta}
          </span>
        ) : null}
      </button>

      {hasActions ? (
        <span className="absolute inset-y-0 right-2 z-10 hidden items-center gap-0.5 group-hover:flex">
          {actions}
        </span>
      ) : null}
    </div>
  );
}

export interface ThreadListActionProps {
  "aria-label": string;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

/** Small 20px icon button for a `ThreadListItem`'s hover-revealed actions
 * (pin, delete, ...) or a `ThreadListSection`'s trailing action slot. */
export function ThreadListAction({
  "aria-label": ariaLabel,
  onClick,
  children,
  className,
}: ThreadListActionProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        "flex h-5 w-5 items-center justify-center rounded text-muted-foreground transition-colors hover:bg-black/10 hover:text-foreground dark:hover:bg-white/15",
        className,
      )}
    >
      {children}
    </button>
  );
}
