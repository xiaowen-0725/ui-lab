"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface ArtifactPanelProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Panel shell for a live artifact/canvas surface next to a conversation — the
 * hairline-ringed card that hosts a header, a scrollable content region and
 * (optionally) a version-nav footer. Uses the same CSS-variable box-shadow
 * hairline technique as `ThreadCard` / `WorkbenchSummaryCard`, tuned to a
 * full opaque surface rather than a tinted one since this panel is the
 * primary content, not an inline card in a message stream.
 */
export function ArtifactPanel({ className, children }: ArtifactPanelProps) {
  return (
    <div
      style={{ boxShadow: "0 0 0 0.5px var(--artifact-hairline)" }}
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-white",
        "[--artifact-hairline:rgba(0,0,0,0.08)] dark:bg-neutral-900 dark:[--artifact-hairline:rgba(255,255,255,0.15)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface ArtifactHeaderProps {
  /** 16px leading icon, e.g. `<FileCode2 className="h-4 w-4" />`. */
  icon?: ReactNode;
  title: ReactNode;
  /** Rendered beside the title on the same line, truncating independently. */
  subtitle?: ReactNode;
  /** Trailing slot for the caller's own controls — copy/download buttons, an `ArtifactViewToggle`. */
  actions?: ReactNode;
  className?: string;
}

/** Fixed 48px header row: icon, truncating title/subtitle, and a trailing action cluster. */
export function ArtifactHeader({ icon, title, subtitle, actions, className }: ArtifactHeaderProps) {
  return (
    <div
      className={cn(
        "flex h-12 shrink-0 items-center gap-2.5 border-black/5 border-b-[0.5px] px-3 dark:border-white/[0.06]",
        className,
      )}
    >
      {icon ? (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
          {icon}
        </span>
      ) : null}
      <div className="flex min-w-0 flex-1 items-baseline gap-2">
        <span className="truncate text-sm font-medium">{title}</span>
        {subtitle ? <span className="truncate text-muted-foreground text-xs">{subtitle}</span> : null}
      </div>
      {actions ? <div className="ml-auto flex shrink-0 items-center gap-0.5">{actions}</div> : null}
    </div>
  );
}

export interface ArtifactActionProps {
  "aria-label": string;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

/** One icon button inside an `ArtifactHeader`'s actions slot (copy, download, ...) — same visual as `ThreadActionButton`. */
export function ArtifactAction({
  "aria-label": ariaLabel,
  onClick,
  children,
  className,
}: ArtifactActionProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10",
        className,
      )}
    >
      {children}
    </button>
  );
}

export type ArtifactView = "preview" | "code";

export interface ArtifactViewToggleProps {
  value: ArtifactView;
  onChange: (next: ArtifactView) => void;
  previewLabel?: ReactNode;
  codeLabel?: ReactNode;
  className?: string;
}

/** Two-segment pill for switching between a rendered "Preview" and raw "Code" view — same visual language as the preview's scene-switcher pill. */
export function ArtifactViewToggle({
  value,
  onChange,
  previewLabel = "Preview",
  codeLabel = "Code",
  className,
}: ArtifactViewToggleProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-full border border-black/10 p-0.5 dark:border-white/10",
        className,
      )}
    >
      {(["preview", "code"] as const).map((view) => (
        <button
          key={view}
          type="button"
          aria-pressed={value === view}
          onClick={() => onChange(view)}
          className={cn(
            "h-6 rounded-full px-2.5 text-xs transition-colors",
            value === view
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {view === "preview" ? previewLabel : codeLabel}
        </button>
      ))}
    </div>
  );
}

export interface ArtifactContentProps {
  /** When passed, `children` cross-fades keyed on this value (e.g. the active `ArtifactView`, or a composite key that also folds in a version so version switches transition too). Omit for static content that never swaps. */
  view?: string | number;
  className?: string;
  children?: ReactNode;
}

/**
 * Scrollable body region of an `ArtifactPanel`. When `view` is passed, the
 * previous and next `children` cross-fade (opacity + a 4px rise, 0.15s
 * `EASE_OUT`, `AnimatePresence mode="wait"`) instead of swapping instantly —
 * reduced to a plain opacity fade under `useReducedMotion()`. Without `view`,
 * `children` render directly with no transition wrapper.
 */
export function ArtifactContent({ view, className, children }: ArtifactContentProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className={cn("relative min-h-0 flex-1 overflow-auto", className)}>
      {view !== undefined ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={view}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      ) : (
        children
      )}
    </div>
  );
}

export interface ArtifactVersionNavProps {
  /** 1-based position of the version currently shown. */
  index: number;
  count: number;
  onPrev?: () => void;
  onNext?: () => void;
  /** Renders a trailing ghost "Restore" button when passed — the caller decides when restoring makes sense (e.g. only on non-latest versions). */
  onRestore?: () => void;
  restoreLabel?: ReactNode;
  className?: string;
}

/**
 * Prev/next control for stepping through an artifact's version history — the
 * same shape as `ThreadBranchSwitcher`: chevron buttons flanking a
 * tabular-nums "v2 / 3" readout that crossfades with a short y-shift on
 * change (`AnimatePresence mode="popLayout"`), reduced to an instant swap
 * under `useReducedMotion()`. An optional trailing ghost "Restore" button
 * appears whenever `onRestore` is passed.
 */
export function ArtifactVersionNav({
  index,
  count,
  onPrev,
  onNext,
  onRestore,
  restoreLabel = "Restore",
  className,
}: ArtifactVersionNavProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <div className={cn("flex items-center gap-0.5 text-muted-foreground text-xs", className)}>
      <button
        type="button"
        aria-label="Previous version"
        disabled={index <= 1}
        onClick={onPrev}
        className="flex h-5 w-5 items-center justify-center rounded hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-white/10"
      >
        <ChevronLeft className="h-3 w-3" />
      </button>
      <span className="relative inline-flex h-4 min-w-[5ch] items-center justify-center overflow-hidden tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={`${index}/${count}`}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: EASE_OUT }}
            className="absolute inset-0 flex items-center justify-center"
          >
            v{index} / {count}
          </motion.span>
        </AnimatePresence>
      </span>
      <button
        type="button"
        aria-label="Next version"
        disabled={index >= count}
        onClick={onNext}
        className="flex h-5 w-5 items-center justify-center rounded hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30 dark:hover:bg-white/10"
      >
        <ChevronRight className="h-3 w-3" />
      </button>
      {onRestore ? (
        <button
          type="button"
          onClick={onRestore}
          className="ml-1 rounded px-1 text-muted-foreground text-xs transition-colors hover:text-foreground"
        >
          {restoreLabel}
        </button>
      ) : null}
    </div>
  );
}
