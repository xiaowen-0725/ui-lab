"use client";

import { ChevronDown } from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode, useEffect, useState } from "react";
import { isLightHexColor, normalizeHexColor } from "@/lib/color";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface SettingsGroupProps {
  title?: ReactNode;
  /** Header-right slot, e.g. a `SettingsGhostButton` plus a `SettingsSelectButton`. */
  actions?: ReactNode;
  className?: string;
  children?: ReactNode;
}

/**
 * Card shell for a group of preference rows. Renders a header row (title
 * left, `actions` right) only when either is passed; `children` — typically
 * a stack of `SettingsRow`s — sit in a region whose `[&>*+*]` selector draws
 * a hairline divider between adjacent rows without each row needing to know
 * about its neighbors.
 */
export function SettingsGroup({ title, actions, className, children }: SettingsGroupProps) {
  return (
    <div
      className={cn(
        "rounded-[20px] border border-black/10 bg-white dark:border-white/10 dark:bg-[#232323]",
        className,
      )}
    >
      {title || actions ? (
        <div className="flex items-center justify-between gap-3 px-4 pt-4 pb-1">
          {title ? <div className="text-[13px] font-medium">{title}</div> : <span />}
          {actions ? <div className="flex items-center gap-1">{actions}</div> : null}
        </div>
      ) : null}
      <div className="[&>*+*]:border-t-[0.5px] [&>*+*]:border-black/5 dark:[&>*+*]:border-white/[0.06]">
        {children}
      </div>
    </div>
  );
}

export interface SettingsRowProps {
  label: ReactNode;
  /** Muted one-liner rendered under `label`. */
  description?: ReactNode;
  className?: string;
  /** Trailing control slot, e.g. a `SettingsColorField` or a `Switch`. */
  children?: ReactNode;
}

/** One preference line inside a `SettingsGroup` — label (+ optional description) on the left, a control slot on the right. */
export function SettingsRow({ label, description, className, children }: SettingsRowProps) {
  return (
    <div className={cn("flex min-h-[52px] items-center justify-between gap-3 px-4 py-2", className)}>
      <div className="min-w-0">
        <div className="text-[13px] font-medium">{label}</div>
        {description ? <div className="text-xs text-muted-foreground">{description}</div> : null}
      </div>
      {children ? <div className="shrink-0">{children}</div> : null}
    </div>
  );
}

export interface SettingsColorFieldProps {
  /** Current color as `#RRGGBB` (or `#RGB`); the pill background and text contrast follow it. */
  value: string;
  onChange?: (hex: string) => void;
  "aria-label"?: string;
  className?: string;
}

/**
 * Hex-color pill — a decorative ring dot plus an editable mono hex code, the
 * pill's own background painted in `value` with a smooth color transition.
 * Text and ring contrast auto-flip (dark ink on light swatches, white ink on
 * dark ones) via `isLightColor`. Typing edits a local draft so partial input
 * doesn't get clobbered by the controlled `value`; Enter or blur commits —
 * a valid hex calls `onChange`, an invalid one snaps the draft back to the
 * last committed `value`.
 */
export function SettingsColorField({
  value,
  onChange,
  "aria-label": ariaLabel,
  className,
}: SettingsColorFieldProps) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const light = isLightHexColor(value);
  const textColor = light ? "#101010" : "#FFFFFF";

  const commit = () => {
    const normalized = normalizeHexColor(draft);
    if (normalized) {
      setDraft(normalized);
      if (normalized !== value.toUpperCase()) onChange?.(normalized);
    } else {
      setDraft(value);
    }
  };

  return (
    <motion.div
      animate={{ backgroundColor: value }}
      transition={{ duration: 0.3, ease: EASE_OUT }}
      className={cn("flex h-7 w-[136px] items-center gap-2 rounded-lg px-2", className)}
    >
      <span
        aria-hidden
        className={cn(
          "h-3.5 w-3.5 shrink-0 rounded-full border bg-transparent",
          light ? "border-black/15" : "border-white/40",
        )}
      />
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit();
          }
        }}
        aria-label={ariaLabel}
        spellCheck={false}
        style={{ color: textColor }}
        className="w-full bg-transparent font-mono text-xs uppercase outline-none"
      />
    </motion.div>
  );
}

export interface SettingsTextFieldProps {
  value: string;
  onChange?: (next: string) => void;
  placeholder?: string;
  "aria-label"?: string;
  className?: string;
}

/** Right-aligned lightweight text input, e.g. for a custom UI-font stack. */
export function SettingsTextField({
  value,
  onChange,
  placeholder,
  "aria-label": ariaLabel,
  className,
}: SettingsTextFieldProps) {
  return (
    <input
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      aria-label={ariaLabel}
      className={cn(
        "h-7 w-[176px] truncate rounded-lg border border-black/10 bg-black/[0.03] px-2 text-sm text-muted-foreground outline-none focus:text-foreground",
        "dark:border-white/10 dark:bg-white/5",
        className,
      )}
    />
  );
}

export interface SettingsSelectButtonProps {
  /** 14px leading icon. */
  icon?: ReactNode;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
  "aria-label"?: string;
}

/**
 * Preset-picker-styled trigger button — icon, label, trailing chevron. It
 * doesn't render a dropdown itself; wire `onClick` to whatever popover/select
 * the caller already has (see the preview for a stateless demo usage).
 */
export function SettingsSelectButton({
  icon,
  onClick,
  children,
  className,
  "aria-label": ariaLabel,
}: SettingsSelectButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      className={cn(
        "flex h-7 items-center gap-1.5 rounded-lg border border-black/10 bg-black/[0.03] px-3 text-sm",
        "dark:border-white/10 dark:bg-[#141414]",
        className,
      )}
    >
      {icon ? <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center">{icon}</span> : null}
      {children}
      <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
    </button>
  );
}

export interface SettingsGhostButtonProps {
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

/** Borderless header action, e.g. "Import" or "Copy" beside a `SettingsGroup` title. */
export function SettingsGhostButton({ onClick, children, className }: SettingsGhostButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-7 items-center gap-1 rounded-lg px-2 text-sm text-muted-foreground transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10",
        className,
      )}
    >
      {children}
    </button>
  );
}
