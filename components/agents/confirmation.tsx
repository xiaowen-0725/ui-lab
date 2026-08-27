"use client";

// Ported from Vercel AI Elements (vercel/ai-elements, Apache-2.0).
// Local confirmation states — no `ai` SDK runtime.

import {
  type ComponentProps,
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useContext,
  useMemo,
} from "react";
import { Button } from "@/components/motion/button";
import { cn } from "@/lib/utils";

export type ConfirmationApproval =
  | {
      id: string;
      approved?: never;
      reason?: never;
    }
  | {
      id: string;
      approved: boolean;
      reason?: string;
    }
  | undefined;

export type ConfirmationState =
  | "input-streaming"
  | "input-available"
  | "approval-requested"
  | "approval-responded"
  | "output-denied"
  | "output-available";

interface ConfirmationContextValue {
  approval: ConfirmationApproval;
  state: ConfirmationState;
}

const ConfirmationContext = createContext<ConfirmationContextValue | null>(null);

function useConfirmation() {
  const context = useContext(ConfirmationContext);
  if (!context) {
    throw new Error("Confirmation components must be used within Confirmation");
  }
  return context;
}

export interface ConfirmationProps extends HTMLAttributes<HTMLDivElement> {
  approval?: ConfirmationApproval;
  state: ConfirmationState;
}

export function Confirmation({
  className,
  approval,
  state,
  ...props
}: ConfirmationProps) {
  const contextValue = useMemo(() => ({ approval, state }), [approval, state]);

  if (!approval || state === "input-streaming" || state === "input-available") {
    return null;
  }

  return (
    <ConfirmationContext.Provider value={contextValue}>
      <div
        role="status"
        className={cn(
          "flex flex-col gap-2 rounded-xl border border-border bg-card p-3 text-sm text-card-foreground",
          className,
        )}
        {...props}
      />
    </ConfirmationContext.Provider>
  );
}

export interface ConfirmationTitleProps extends HTMLAttributes<HTMLParagraphElement> {}

export function ConfirmationTitle({
  className,
  ...props
}: ConfirmationTitleProps) {
  return <p className={cn("inline", className)} {...props} />;
}

export interface ConfirmationRequestProps {
  children?: ReactNode;
}

export function ConfirmationRequest({ children }: ConfirmationRequestProps) {
  const { state } = useConfirmation();
  if (state !== "approval-requested") return null;
  return children;
}

export interface ConfirmationAcceptedProps {
  children?: ReactNode;
}

export function ConfirmationAccepted({ children }: ConfirmationAcceptedProps) {
  const { approval, state } = useConfirmation();
  if (
    !approval?.approved ||
    (state !== "approval-responded" &&
      state !== "output-denied" &&
      state !== "output-available")
  ) {
    return null;
  }
  return children;
}

export interface ConfirmationRejectedProps {
  children?: ReactNode;
}

export function ConfirmationRejected({ children }: ConfirmationRejectedProps) {
  const { approval, state } = useConfirmation();
  if (
    approval?.approved !== false ||
    (state !== "approval-responded" &&
      state !== "output-denied" &&
      state !== "output-available")
  ) {
    return null;
  }
  return children;
}

export interface ConfirmationActionsProps extends HTMLAttributes<HTMLDivElement> {}

export function ConfirmationActions({
  className,
  ...props
}: ConfirmationActionsProps) {
  const { state } = useConfirmation();
  if (state !== "approval-requested") return null;

  return (
    <div
      className={cn("flex items-center justify-end gap-2 self-end", className)}
      {...props}
    />
  );
}

export type ConfirmationActionProps = ComponentProps<typeof Button>;

export function ConfirmationAction({
  className,
  size = "sm",
  ...props
}: ConfirmationActionProps) {
  return <Button className={cn("h-8 px-3 text-sm", className)} size={size} type="button" {...props} />;
}
