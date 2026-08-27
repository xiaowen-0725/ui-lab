"use client";

// Ported from Vercel AI Elements (vercel/ai-elements, Apache-2.0).
// Adapted to ui-lab AgentCollapsible.

import { ChevronDown, Search } from "lucide-react";
import type { HTMLAttributes } from "react";
import {
  AgentCollapsible,
  AgentCollapsibleContent,
  AgentCollapsibleTrigger,
} from "@/components/agents/agent-collapsible";
import { cn } from "@/lib/utils";

export interface TaskItemFileProps extends HTMLAttributes<HTMLDivElement> {}

export function TaskItemFile({
  children,
  className,
  ...props
}: TaskItemFileProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-md border bg-secondary px-1.5 py-0.5 text-xs text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface TaskItemProps extends HTMLAttributes<HTMLDivElement> {}

export function TaskItem({ children, className, ...props }: TaskItemProps) {
  return (
    <div className={cn("text-sm text-muted-foreground", className)} {...props}>
      {children}
    </div>
  );
}

export interface TaskProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Task({
  defaultOpen = true,
  className,
  ...props
}: TaskProps) {
  return (
    <AgentCollapsible
      className={cn(className)}
      defaultOpen={defaultOpen}
      {...props}
    />
  );
}

export interface TaskTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  title: string;
}

export function TaskTrigger({
  children,
  className,
  title,
  ...props
}: TaskTriggerProps) {
  return (
    <AgentCollapsibleTrigger className={cn("group w-full", className)} {...props}>
      {children ?? (
        <span className="flex w-full cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <Search className="size-4" />
          <span className="text-sm">{title}</span>
          <ChevronDown className="size-4 transition-transform group-data-[state=open]:rotate-180" />
        </span>
      )}
    </AgentCollapsibleTrigger>
  );
}

export interface TaskContentProps extends HTMLAttributes<HTMLDivElement> {}

export function TaskContent({
  children,
  className,
  ...props
}: TaskContentProps) {
  return (
    <AgentCollapsibleContent className={cn(className)} {...props}>
      <div className="mt-4 space-y-2 border-l-2 border-muted pl-4">
        {children}
      </div>
    </AgentCollapsibleContent>
  );
}
