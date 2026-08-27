"use client";

// Ported from Vercel AI Elements (vercel/ai-elements, Apache-2.0).
// Adapted to ui-lab AgentCollapsible + ThinkingShimmer; no shadcn Card.

import { ChevronsUpDown } from "lucide-react";
import {
  type HTMLAttributes,
  createContext,
  useContext,
  useMemo,
} from "react";
import {
  AgentCollapsible,
  AgentCollapsibleContent,
  AgentCollapsibleTrigger,
} from "@/components/agents/agent-collapsible";
import { ThinkingShimmer } from "@/components/agents/loading-states/thinking-shimmer";
import { cn } from "@/lib/utils";

interface PlanContextValue {
  isStreaming: boolean;
}

const PlanContext = createContext<PlanContextValue | null>(null);

function usePlan() {
  const context = useContext(PlanContext);
  if (!context) {
    throw new Error("Plan components must be used within Plan");
  }
  return context;
}

export interface PlanProps extends HTMLAttributes<HTMLDivElement> {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Plan({
  className,
  isStreaming = false,
  open,
  defaultOpen = true,
  onOpenChange,
  children,
  ...props
}: PlanProps) {
  const contextValue = useMemo(() => ({ isStreaming }), [isStreaming]);

  return (
    <PlanContext.Provider value={contextValue}>
      <AgentCollapsible
        open={open}
        defaultOpen={defaultOpen}
        onOpenChange={onOpenChange}
        data-slot="plan"
        className={cn(
          "rounded-xl border border-border bg-card text-card-foreground shadow-none",
          className,
        )}
        {...props}
      >
        {children}
      </AgentCollapsible>
    </PlanContext.Provider>
  );
}

export interface PlanHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export function PlanHeader({ className, ...props }: PlanHeaderProps) {
  return (
    <div
      className={cn("flex items-start justify-between gap-3 p-4", className)}
      data-slot="plan-header"
      {...props}
    />
  );
}

export interface PlanTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  children: string;
}

export function PlanTitle({ children, className, ...props }: PlanTitleProps) {
  const { isStreaming } = usePlan();

  return (
    <h3
      data-slot="plan-title"
      className={cn("text-sm font-semibold", className)}
      {...props}
    >
      {isStreaming ? <ThinkingShimmer>{children}</ThinkingShimmer> : children}
    </h3>
  );
}

export interface PlanDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: string;
}

export function PlanDescription({
  className,
  children,
  ...props
}: PlanDescriptionProps) {
  const { isStreaming } = usePlan();

  return (
    <p
      className={cn("text-balance text-sm text-muted-foreground", className)}
      data-slot="plan-description"
      {...props}
    >
      {isStreaming ? <ThinkingShimmer>{children}</ThinkingShimmer> : children}
    </p>
  );
}

export interface PlanActionProps extends HTMLAttributes<HTMLDivElement> {}

export function PlanAction(props: PlanActionProps) {
  return <div data-slot="plan-action" {...props} />;
}

export interface PlanContentProps extends HTMLAttributes<HTMLDivElement> {}

export function PlanContent({ className, ...props }: PlanContentProps) {
  return (
    <AgentCollapsibleContent>
      <div
        data-slot="plan-content"
        className={cn("px-4 pb-4 text-sm", className)}
        {...props}
      />
    </AgentCollapsibleContent>
  );
}

export interface PlanFooterProps extends HTMLAttributes<HTMLDivElement> {}

export function PlanFooter({ className, ...props }: PlanFooterProps) {
  return (
    <div
      data-slot="plan-footer"
      className={cn("flex items-center justify-end gap-2 px-4 pb-4", className)}
      {...props}
    />
  );
}

export interface PlanTriggerProps extends HTMLAttributes<HTMLButtonElement> {}

export function PlanTrigger({ className, ...props }: PlanTriggerProps) {
  return (
    <AgentCollapsibleTrigger
      className={cn(
        "grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
        className,
      )}
      data-slot="plan-trigger"
      {...props}
    >
      <ChevronsUpDown className="size-4" />
      <span className="sr-only">Toggle plan</span>
    </AgentCollapsibleTrigger>
  );
}
