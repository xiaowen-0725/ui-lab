"use client";

import { ArrowUp, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type KeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { EASE_OUT, SPRING_PANEL } from "@/lib/ease";
import { cn } from "@/lib/utils";

export { ComposerEffortSlider } from "./effort-slider";

export interface ComposerProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Composer shell — a translucent, rounded card that hosts a textarea and a
 * toolbar row. Renders `children` directly (auto-height textarea and toolbar
 * are stacked by the caller); the hairline shadow trio and glass surface use
 * the same `--composer-hairline` CSS-variable technique as
 * `WorkbenchSummaryCard`, so the right shade is picked per color scheme.
 * Sits at `z-10` so it stacks above a sibling `ComposerContextBar`.
 */
export function Composer({ className, children }: ComposerProps) {
  return (
    <div
      style={{
        boxShadow:
          "0 0 0 0.5px var(--composer-hairline), 0 3px 7.5px rgba(0,0,0,0.04), 0 0 20px rgba(0,0,0,0.05)",
      }}
      className={cn(
        "relative z-10 flex flex-col rounded-[25px] bg-white/90 backdrop-blur-lg",
        "[--composer-hairline:rgba(0,0,0,0.08)] dark:bg-neutral-800/90 dark:[--composer-hairline:rgba(255,255,255,0.15)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface ComposerContextBarProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Optional context bar meant to sit as a sibling right above `<Composer>` in
 * markup order. Its bottom padding is taller than its visible height and
 * pulled up with a negative margin, so `Composer` (rendered after it, at
 * `z-10`) sits on top and hides the lower half — the bar reads as tucked in
 * "behind" the composer shell.
 */
export function ComposerContextBar({ className, children }: ComposerContextBarProps) {
  return (
    <div
      className={cn(
        "-mb-5 flex items-center gap-4 rounded-t-2xl bg-black/5 px-2 pt-2 pb-7 dark:bg-white/5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface ComposerChipProps {
  icon?: ReactNode;
  /** Swapped in for `icon` on hover/focus (opacity crossfade, no layout shift).
   * Only meaningful on interactive chips — pair it with `onClick`. */
  hoverIcon?: ReactNode;
  /** Makes the chip a `<button>` with a hover pill surface. */
  onClick?: () => void;
  /** Native tooltip, e.g. "Change project". */
  title?: string;
  children?: ReactNode;
  className?: string;
}

const CHIP_BASE = "flex h-7 items-center gap-1.5 rounded-full px-2 text-[13px] text-muted-foreground";

/**
 * A single label inside `ComposerContextBar` — an optional 16px icon plus
 * text. With `onClick` it becomes a button whose hover state paints a pill
 * surface and (when `hoverIcon` is set) crossfades the icon — e.g. a project
 * chip whose folder icon turns into a clear-mark.
 */
export function ComposerChip({
  icon,
  hoverIcon,
  onClick,
  title,
  children,
  className,
}: ComposerChipProps) {
  const iconSlot = icon ? (
    hoverIcon ? (
      <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
        <span className="absolute inset-0 flex items-center justify-center opacity-100 transition-opacity group-focus-visible:opacity-0 group-hover:opacity-0">
          {icon}
        </span>
        <span className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-focus-visible:opacity-100 group-hover:opacity-100">
          {hoverIcon}
        </span>
      </span>
    ) : (
      <span className="flex h-4 w-4 shrink-0 items-center justify-center">{icon}</span>
    )
  ) : null;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        className={cn(
          CHIP_BASE,
          "group transition-colors hover:bg-black/10 hover:text-foreground dark:hover:bg-white/10",
          className,
        )}
      >
        {iconSlot}
        {children}
      </button>
    );
  }

  return (
    <span title={title} className={cn(CHIP_BASE, className)}>
      {iconSlot}
      {children}
    </span>
  );
}

export interface ComposerTextareaProps {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  /** Fires when Enter is pressed without Shift — the caller owns what "submit" means. */
  onSubmit?: () => void;
  "aria-label"?: string;
  className?: string;
}

/**
 * Auto-growing message field. A real `<textarea rows={1}>` — height tracks
 * content via `scrollHeight`, up to the scrollable container's
 * `max-h-[25dvh]`. The measure runs in a layout effect keyed on `value` (not
 * an input handler), so programmatic updates — e.g. the caller clearing the
 * draft after a send — collapse the field just like keystrokes do. Enter
 * submits (and is prevented from inserting a newline); Shift+Enter inserts a
 * newline as usual.
 */
export function ComposerTextarea({
  value,
  onChange,
  placeholder,
  onSubmit,
  "aria-label": ariaLabel,
  className,
}: ComposerTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `value` is the trigger — the height depends on the rendered content, which this effect reads from the DOM rather than from the prop.
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        onSubmit?.();
      }
    },
    [onSubmit],
  );

  return (
    <div className="max-h-[25dvh] overflow-y-auto px-4 pt-3.5 pb-1">
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        aria-label={ariaLabel}
        className={cn(
          "min-h-[44px] w-full resize-none border-none bg-transparent text-sm leading-5 outline-none",
          "placeholder:text-muted-foreground",
          className,
        )}
      />
    </div>
  );
}

export interface ComposerToolbarProps {
  className?: string;
  children?: ReactNode;
}

/**
 * Bottom action row. Just a flex container — order children left to right
 * and drop in a `<div className="ml-auto" />` spacer to split left/right
 * clusters (see the preview for the exact arrangement).
 */
export function ComposerToolbar({ className, children }: ComposerToolbarProps) {
  return <div className={cn("flex items-center gap-1 px-2 pb-2", className)}>{children}</div>;
}

export interface ComposerIconButtonProps {
  "aria-label": string;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
}

/** Circular 28px icon button for the toolbar (add attachment, dictate, ...). */
export function ComposerIconButton({
  "aria-label": ariaLabel,
  onClick,
  children,
  className,
  disabled,
}: ComposerIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors",
        "hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10",
        className,
      )}
    >
      {children}
    </button>
  );
}

export interface ComposerAccessChipProps {
  icon?: ReactNode;
  /** "warning" (default) reads as an orange access-level alert; "default" is muted. */
  tone?: "warning" | "default";
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

/** Pill button surfacing the current permission level (e.g. "Full access"). */
export function ComposerAccessChip({
  icon,
  tone = "warning",
  onClick,
  children,
  className,
}: ComposerAccessChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-7 items-center gap-1 rounded-full px-2 text-[13px] transition-colors",
        tone === "warning"
          ? "text-orange-600 hover:bg-orange-500/10 dark:text-[#ff8549] dark:hover:bg-[#e25507]/10"
          : "text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10",
        className,
      )}
    >
      {icon ? <span className="flex h-4 w-4 shrink-0 items-center justify-center">{icon}</span> : null}
      {children}
    </button>
  );
}

/**
 * Shared open state + dismiss behavior for the popover triggers below.
 * Controlled (`openProp`/`onOpenChange`) or uncontrolled; while open, Escape
 * or a pointerdown outside `rootRef` closes.
 */
function usePopover(openProp: boolean | undefined, onOpenChange?: (open: boolean) => void) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const rootRef = useRef<HTMLDivElement>(null);

  const setOpen = useCallback(
    (next: boolean) => {
      setOpenState(next);
      onOpenChange?.(next);
    },
    [onOpenChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, setOpen]);

  return { open, setOpen, rootRef };
}

interface PopoverPanelProps {
  open: boolean;
  /** Horizontal anchor against the trigger: "start" = left edges flush, "end" = right edges flush. */
  align: "start" | "end";
  className?: string;
  children?: ReactNode;
}

/**
 * The floating panel shell shared by `ComposerModelPicker` and
 * `ComposerMenuButton` — glass surface, hairline shadow trio, and the
 * scale/y/opacity + `SPRING_PANEL` entrance from `WorkbenchSummaryCard`,
 * reduced to an opacity-only fade under `useReducedMotion()`. Anchored above
 * the trigger; `align` picks the flush edge and the transform origin.
 */
function PopoverPanel({ open, align, className, children }: PopoverPanelProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 4 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 4 }}
          transition={reduce ? { duration: 0.15, ease: EASE_OUT } : SPRING_PANEL}
          style={{
            transformOrigin: align === "end" ? "bottom right" : "bottom left",
            boxShadow:
              "0 0 0 0.5px var(--composer-picker-hairline), 0 3px 7.5px rgba(0,0,0,0.04), 0 0 20px rgba(0,0,0,0.05)",
          }}
          className={cn(
            "absolute bottom-[calc(100%+8px)] z-20 min-w-[224px] rounded-2xl bg-white/95 p-1 backdrop-blur-xl",
            align === "end" ? "right-0" : "left-0",
            "[--composer-picker-hairline:rgba(0,0,0,0.08)] dark:bg-neutral-800/95 dark:[--composer-picker-hairline:rgba(255,255,255,0.15)]",
            className,
          )}
        >
          {children}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export interface ComposerModelPickerProps {
  /** Trigger content, e.g. `"5.6 · High"` — a chevron is appended automatically. */
  label: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
}

/**
 * Trigger plus a popover that springs open above and right-aligned to it —
 * for model/effort pickers. Works controlled (`open`/`onOpenChange`) or
 * uncontrolled; dismiss and entrance behavior come from `usePopover` /
 * `PopoverPanel`.
 */
export function ComposerModelPicker({
  label,
  open: openProp,
  onOpenChange,
  children,
  className,
}: ComposerModelPickerProps) {
  const { open, setOpen, rootRef } = usePopover(openProp, onOpenChange);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex h-7 items-center gap-1 rounded-full px-2 text-[13px] text-muted-foreground",
          "hover:bg-black/5 dark:hover:bg-white/10",
          className,
        )}
      >
        {label}
        <ChevronDown className="h-3.5 w-3.5" />
      </button>
      <PopoverPanel open={open} align="end">
        {children}
      </PopoverPanel>
    </div>
  );
}

export interface ComposerMenuButtonProps {
  /** 16px icon; alone it renders the circular icon-button look. */
  icon?: ReactNode;
  /** Optional text label; with it the trigger becomes a pill like the model-picker trigger (no chevron). */
  label?: ReactNode;
  "aria-label": string;
  /** Panel anchor edge — defaults to "start" (left-aligned above the trigger). */
  align?: "start" | "end";
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
  className?: string;
}

/**
 * Trigger plus a popover menu (compose `ComposerMenuSection` /
 * `ComposerMenuItem` as children) — e.g. the "+" add-attachments menu.
 * Controlled or uncontrolled; same panel shell and dismiss behavior as
 * `ComposerModelPicker`.
 */
export function ComposerMenuButton({
  icon,
  label,
  "aria-label": ariaLabel,
  align = "start",
  open: openProp,
  onOpenChange,
  children,
  className,
}: ComposerMenuButtonProps) {
  const { open, setOpen, rootRef } = usePopover(openProp, onOpenChange);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className={cn(
          label
            ? "flex h-7 items-center gap-1 rounded-full px-2 text-[13px] text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10"
            : "flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10",
          className,
        )}
      >
        {icon}
        {label}
      </button>
      <PopoverPanel open={open} align={align} className="min-w-[260px] max-w-[320px]">
        {children}
      </PopoverPanel>
    </div>
  );
}

export interface ComposerMenuSectionProps {
  title?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** A titled group of rows inside a `ComposerMenuButton` panel. */
export function ComposerMenuSection({ title, children, className }: ComposerMenuSectionProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {title ? <div className="px-2 pt-1.5 pb-1 text-muted-foreground text-xs">{title}</div> : null}
      {children}
    </div>
  );
}

export interface ComposerMenuItemProps {
  icon?: ReactNode;
  /** Muted one-liner rendered inline after the name, truncated when tight. */
  description?: ReactNode;
  onSelect?: () => void;
  children?: ReactNode;
  className?: string;
}

/** One selectable row in a `ComposerMenuButton` panel. */
export function ComposerMenuItem({
  icon,
  description,
  onSelect,
  children,
  className,
}: ComposerMenuItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors",
        "hover:bg-black/5 dark:hover:bg-white/10",
        className,
      )}
    >
      {icon ? (
        <span className="flex h-4 w-4 shrink-0 items-center justify-center text-muted-foreground">
          {icon}
        </span>
      ) : null}
      <span className="whitespace-nowrap">{children}</span>
      {description ? <span className="min-w-0 truncate text-muted-foreground">{description}</span> : null}
    </button>
  );
}

export interface ComposerSendButtonProps {
  running?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  "aria-label"?: string;
  className?: string;
}

/**
 * Morphing send/stop control. `running` swaps the arrow glyph for a solid
 * square via `AnimatePresence mode="wait"` — a scale+opacity springy pop
 * (`SPRING_PANEL`), reduced to a plain opacity cut under
 * `useReducedMotion()`.
 */
export function ComposerSendButton({
  running = false,
  disabled,
  onClick,
  "aria-label": ariaLabel,
  className,
}: ComposerSendButtonProps) {
  const reduce = useReducedMotion() ?? false;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? (running ? "Stop" : "Send")}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-full bg-foreground text-background",
        "disabled:pointer-events-none disabled:opacity-40",
        className,
      )}
    >
      <AnimatePresence mode="wait" initial={false}>
        {running ? (
          <motion.span
            key="stop"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
            transition={reduce ? { duration: 0.15, ease: EASE_OUT } : SPRING_PANEL}
            className="block h-2.5 w-2.5 rounded-[2px] bg-current"
          />
        ) : (
          <motion.span
            key="send"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
            transition={reduce ? { duration: 0.15, ease: EASE_OUT } : SPRING_PANEL}
            className="flex items-center justify-center"
          >
            <ArrowUp className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );
}

/** 3px dash / 4px gap horizontal dash pattern, colored by `currentColor`. */
const DICTATION_DASHES = "repeating-linear-gradient(90deg, currentColor 0 3px, transparent 3px 7px)";

export interface ComposerDictationProps {
  /** Elapsed recording time, owned by the caller; formatted as m:ss. */
  seconds: number;
  onStop?: () => void;
  className?: string;
  /** Label for the stop button — defaults to "Stop dictation". */
  "aria-label"?: string;
}

/**
 * Voice-dictation state for the toolbar's middle stretch: a dashed sound
 * track whose brighter right-end segment slowly flows leftward while
 * listening, an m:ss timer, and a white stop button (white in both themes).
 * The flow loops over exactly one dash period so it reads as continuous; a
 * static track is shown under `useReducedMotion()`.
 */
export function ComposerDictation({
  seconds,
  onStop,
  className,
  "aria-label": ariaLabel,
}: ComposerDictationProps) {
  const reduce = useReducedMotion() ?? false;
  const minutes = Math.floor(seconds / 60);
  const remainder = `${Math.floor(seconds % 60)}`.padStart(2, "0");

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        aria-hidden
        className="relative h-px flex-1 overflow-hidden text-muted-foreground/50"
        style={{ backgroundImage: DICTATION_DASHES }}
      >
        <motion.div
          className="absolute inset-y-0 right-0 w-[72px] text-foreground/80"
          style={{ backgroundImage: DICTATION_DASHES }}
          animate={reduce ? undefined : { backgroundPositionX: ["0px", "-7px"] }}
          transition={reduce ? undefined : { duration: 0.6, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <span className="text-[13px] text-muted-foreground tabular-nums">
        {minutes}:{remainder}
      </span>
      <button
        type="button"
        aria-label={ariaLabel ?? "Stop dictation"}
        onClick={onStop}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-neutral-900 shadow-[0_0_0_0.5px_rgba(0,0,0,0.08),0_1px_4px_rgba(0,0,0,0.2)]"
      >
        <span className="block h-2.5 w-2.5 rounded-[2px] bg-current" />
      </button>
    </div>
  );
}
