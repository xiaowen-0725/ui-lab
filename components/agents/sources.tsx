"use client";

// Ported from Vercel AI Elements (vercel/ai-elements, Apache-2.0).
// Adapted to ui-lab AgentCollapsible.

import { Book, ChevronDown } from "lucide-react";
import type { AnchorHTMLAttributes, HTMLAttributes } from "react";
import {
  AgentCollapsible,
  AgentCollapsibleContent,
  AgentCollapsibleTrigger,
} from "@/components/agents/agent-collapsible";
import { cn } from "@/lib/utils";

export interface SourcesProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function Sources({ className, ...props }: SourcesProps) {
  return (
    <AgentCollapsible
      className={cn("not-prose mb-4 text-xs text-primary", className)}
      {...props}
    />
  );
}

export interface SourcesTriggerProps
  extends HTMLAttributes<HTMLButtonElement> {
  count: number;
}

export function SourcesTrigger({
  className,
  count,
  children,
  ...props
}: SourcesTriggerProps) {
  return (
    <AgentCollapsibleTrigger
      className={cn("flex items-center gap-2", className)}
      {...props}
    >
      {children ?? (
        <>
          <span className="font-medium">Used {count} sources</span>
          <ChevronDown className="size-4" />
        </>
      )}
    </AgentCollapsibleTrigger>
  );
}

export interface SourcesContentProps extends HTMLAttributes<HTMLDivElement> {}

export function SourcesContent({ className, ...props }: SourcesContentProps) {
  return (
    <AgentCollapsibleContent
      className={cn("mt-3 flex w-fit flex-col gap-2", className)}
      {...props}
    />
  );
}

export interface SourceProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  title?: string;
}

export function Source({ href, title, children, className, ...props }: SourceProps) {
  return (
    <a
      className={cn("flex items-center gap-2 text-foreground", className)}
      href={href}
      rel="noreferrer"
      target="_blank"
      {...props}
    >
      {children ?? (
        <>
          <Book className="size-4" />
          <span className="block font-medium">{title}</span>
        </>
      )}
    </a>
  );
}
