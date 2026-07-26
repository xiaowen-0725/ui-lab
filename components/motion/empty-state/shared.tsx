"use client";

import type { ReactNode } from "react";
import { Button } from "@/components/motion/button";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/** Centers an illustration, copy, and action into a consistent column. */
export function EmptyStateStage({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-6 px-6 py-12 text-center",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Title (semibold) + muted, width-capped message — shared copy block. */
export function EmptyStateCopy({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-lg font-semibold text-foreground">{title}</p>
      <p className="max-w-xs text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

type EmptyStateActionProps = Pick<EmptyStateProps, "actionLabel" | "onAction">;

/** Primary CTA. Renders nothing when no label is given. */
export function EmptyStateAction({
  actionLabel,
  onAction,
}: EmptyStateActionProps) {
  if (!actionLabel) return null;
  return (
    <Button variant="primary" onClick={onAction}>
      {actionLabel}
    </Button>
  );
}
