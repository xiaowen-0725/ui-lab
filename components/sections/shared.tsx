"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Widen bilingual default copy while keeping its consumer-facing structure. */
export type SectionContent<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
    ? readonly SectionContent<U>[]
    : T extends (...args: never[]) => unknown
      ? T
      : T extends object
        ? { [K in keyof T]: SectionContent<T[K]> }
        : T;

export interface SectionProps<T> {
  locale?: "zh" | "en";
  content?: Partial<SectionContent<T>>;
  className?: string;
  /** Action keys: primary, secondary, sign-in, start, tier name or link label. */
  onAction?: (action: string) => void;
  hrefs?: Readonly<Record<string, string>>;
}

export interface SectionActionProps {
  action: string;
  onAction?: (action: string) => void;
  hrefs?: Readonly<Record<string, string>>;
  className?: string;
  children?: ReactNode;
}

export function SectionAction({
  action,
  onAction,
  hrefs,
  className,
  children,
}: SectionActionProps) {
  const classes = cn(
    "cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
    className,
  );
  const href = hrefs?.[action];
  if (href)
    return (
      <a href={href} onClick={() => onAction?.(action)} className={classes}>
        {children}
      </a>
    );
  return (
    <button type="button" onClick={() => onAction?.(action)} className={classes}>
      {children}
    </button>
  );
}
