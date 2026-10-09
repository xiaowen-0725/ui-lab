"use client";

import type { ReactNode } from "react";
import { EASE_OUT } from "@/lib/ease";
import { useHydratedReducedMotion } from "@/lib/hooks/use-hydrated-reduced-motion";
import { cn } from "@/lib/utils";

export const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

/** True while motion preference is unknown or reduced, so the first paint stays still. */
export function useQuietMotion() {
  const reduced = useHydratedReducedMotion();
  return reduced !== false;
}

export function enterTransition(quiet: boolean, delay = 0) {
  if (quiet) {
    return {
      initial: false as const,
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0 },
    };
  }
  return {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.28, delay, ease: EASE_OUT },
  };
}

export function textFor(locale: string, en: string, zh: string) {
  return locale === "zh" ? zh : en;
}

export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.slice(0, 1))
    .join("")
    .toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-[11px] font-medium text-foreground",
        className,
      )}
    >
      {initials}
    </span>
  );
}

export function SearchField({
  label,
  value,
  onChange,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={cn("relative block min-w-0 flex-1 md:max-w-xs", className)}>
      <span className="sr-only">{label}</span>
      <input
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={cn(
          "h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground",
          focusRing,
        )}
      />
    </label>
  );
}

export function IconButton({
  label,
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-foreground/[0.05] hover:text-foreground motion-reduce:transition-none",
        focusRing,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
