"use client";

// Ported from Vercel AI Elements (vercel/ai-elements, Apache-2.0).
// Adapted to ui-lab AgentCollapsible; no Radix / shadcn Badge.

import type { LucideIcon } from "lucide-react";
import { Brain, ChevronDown, Dot } from "lucide-react";
import {
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  AgentCollapsible,
  AgentCollapsibleContent,
  AgentCollapsibleTrigger,
} from "@/components/agents/agent-collapsible";
import { cn } from "@/lib/utils";

interface ChainOfThoughtContextValue {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ChainOfThoughtContext = createContext<ChainOfThoughtContextValue | null>(
  null,
);

function useChainOfThought() {
  const context = useContext(ChainOfThoughtContext);
  if (!context) {
    throw new Error(
      "ChainOfThought components must be used within ChainOfThought",
    );
  }
  return context;
}

export interface ChainOfThoughtProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ChainOfThought({
  className,
  open,
  defaultOpen = false,
  onOpenChange,
  children,
  ...props
}: ChainOfThoughtProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isOpen = open ?? uncontrolled;
  const setIsOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );

  const value = useMemo(() => ({ isOpen, setIsOpen }), [isOpen, setIsOpen]);

  return (
    <ChainOfThoughtContext.Provider value={value}>
      <AgentCollapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn("not-prose w-full space-y-4", className)}
        {...props}
      >
        {children}
      </AgentCollapsible>
    </ChainOfThoughtContext.Provider>
  );
}

export interface ChainOfThoughtHeaderProps
  extends HTMLAttributes<HTMLButtonElement> {}

export function ChainOfThoughtHeader({
  className,
  children,
  ...props
}: ChainOfThoughtHeaderProps) {
  const { isOpen } = useChainOfThought();

  return (
    <AgentCollapsibleTrigger
      className={cn(
        "flex w-full items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
      {...props}
    >
      <Brain className="size-4" />
      <span className="flex-1 text-left">{children ?? "Chain of Thought"}</span>
      <ChevronDown
        className={cn(
          "size-4 transition-transform",
          isOpen ? "rotate-180" : "rotate-0",
        )}
      />
    </AgentCollapsibleTrigger>
  );
}

export interface ChainOfThoughtStepProps extends HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon;
  label: ReactNode;
  description?: ReactNode;
  status?: "complete" | "active" | "pending";
}

const stepStatusStyles = {
  active: "text-foreground",
  complete: "text-muted-foreground",
  pending: "text-muted-foreground/50",
} as const;

export function ChainOfThoughtStep({
  className,
  icon: Icon = Dot,
  label,
  description,
  status = "complete",
  children,
  ...props
}: ChainOfThoughtStepProps) {
  return (
    <div
      className={cn("flex gap-2 text-sm", stepStatusStyles[status], className)}
      {...props}
    >
      <div className="relative mt-0.5">
        <Icon className="size-4" />
        <div className="absolute top-7 bottom-0 left-1/2 -mx-px w-px bg-border" />
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div>{label}</div>
        {description ? (
          <div className="text-xs text-muted-foreground">{description}</div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

export interface ChainOfThoughtSearchResultsProps
  extends HTMLAttributes<HTMLDivElement> {}

export function ChainOfThoughtSearchResults({
  className,
  ...props
}: ChainOfThoughtSearchResultsProps) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      {...props}
    />
  );
}

export interface ChainOfThoughtSearchResultProps
  extends HTMLAttributes<HTMLSpanElement> {}

export function ChainOfThoughtSearchResult({
  className,
  children,
  ...props
}: ChainOfThoughtSearchResultProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export interface ChainOfThoughtContentProps
  extends HTMLAttributes<HTMLDivElement> {}

export function ChainOfThoughtContent({
  className,
  children,
  ...props
}: ChainOfThoughtContentProps) {
  return (
    <AgentCollapsibleContent
      className={cn("mt-2 space-y-3", className)}
      {...props}
    >
      {children}
    </AgentCollapsibleContent>
  );
}

export interface ChainOfThoughtImageProps extends HTMLAttributes<HTMLDivElement> {
  caption?: string;
}

export function ChainOfThoughtImage({
  className,
  children,
  caption,
  ...props
}: ChainOfThoughtImageProps) {
  return (
    <div className={cn("mt-2 space-y-2", className)} {...props}>
      <div className="relative flex max-h-[22rem] items-center justify-center overflow-hidden rounded-lg bg-muted p-3">
        {children}
      </div>
      {caption ? <p className="text-xs text-muted-foreground">{caption}</p> : null}
    </div>
  );
}
