"use client";

// Ported from Vercel AI Elements (vercel/ai-elements, Apache-2.0).
// Adapted to ui-lab Button + AgentCollapsible; no shadcn ScrollArea.

import { ChevronDown, Paperclip } from "lucide-react";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import {
  AgentCollapsible,
  AgentCollapsibleContent,
  AgentCollapsibleTrigger,
} from "@/components/agents/agent-collapsible";
import { Button } from "@/components/motion/button";
import { cn } from "@/lib/utils";

export interface QueueMessagePart {
  type: string;
  text?: string;
  url?: string;
  filename?: string;
  mediaType?: string;
}

export interface QueueMessage {
  id: string;
  parts: QueueMessagePart[];
}

export interface QueueTodo {
  id: string;
  title: string;
  description?: string;
  status?: "pending" | "completed";
}

export interface QueueItemProps extends HTMLAttributes<HTMLLIElement> {}

export function QueueItem({ className, ...props }: QueueItemProps) {
  return (
    <li
      className={cn(
        "group flex flex-col gap-1 rounded-md px-3 py-1 text-sm transition-colors hover:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export interface QueueItemIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
  completed?: boolean;
}

export function QueueItemIndicator({
  completed = false,
  className,
  ...props
}: QueueItemIndicatorProps) {
  return (
    <span
      className={cn(
        "mt-0.5 inline-block size-2.5 rounded-full border",
        completed
          ? "border-muted-foreground/20 bg-muted-foreground/10"
          : "border-muted-foreground/50",
        className,
      )}
      {...props}
    />
  );
}

export interface QueueItemContentProps extends HTMLAttributes<HTMLSpanElement> {
  completed?: boolean;
}

export function QueueItemContent({
  completed = false,
  className,
  ...props
}: QueueItemContentProps) {
  return (
    <span
      className={cn(
        "line-clamp-1 grow break-words",
        completed
          ? "text-muted-foreground/50 line-through"
          : "text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export interface QueueItemDescriptionProps
  extends HTMLAttributes<HTMLDivElement> {
  completed?: boolean;
}

export function QueueItemDescription({
  completed = false,
  className,
  ...props
}: QueueItemDescriptionProps) {
  return (
    <div
      className={cn(
        "ml-6 text-xs",
        completed
          ? "text-muted-foreground/40 line-through"
          : "text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export interface QueueItemActionsProps extends HTMLAttributes<HTMLDivElement> {}

export function QueueItemActions({ className, ...props }: QueueItemActionsProps) {
  return <div className={cn("flex gap-1", className)} {...props} />;
}

export type QueueItemActionProps = Omit<
  ComponentProps<typeof Button>,
  "variant" | "size"
>;

export function QueueItemAction({ className, ...props }: QueueItemActionProps) {
  return (
    <Button
      className={cn(
        "size-auto rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted-foreground/10 hover:text-foreground group-hover:opacity-100",
        className,
      )}
      size="icon"
      type="button"
      variant="ghost"
      {...props}
    />
  );
}

export interface QueueItemAttachmentProps
  extends HTMLAttributes<HTMLDivElement> {}

export function QueueItemAttachment({
  className,
  ...props
}: QueueItemAttachmentProps) {
  return <div className={cn("mt-1 flex flex-wrap gap-2", className)} {...props} />;
}

export interface QueueItemImageProps
  extends HTMLAttributes<HTMLImageElement> {}

export function QueueItemImage({ className, ...props }: QueueItemImageProps) {
  return (
    // biome-ignore lint/performance/noImgElement: Registry preview stays framework-agnostic.
    <img
      alt=""
      className={cn("h-8 w-8 rounded border object-cover", className)}
      height={32}
      width={32}
      {...props}
    />
  );
}

export interface QueueItemFileProps extends HTMLAttributes<HTMLSpanElement> {}

export function QueueItemFile({
  children,
  className,
  ...props
}: QueueItemFileProps) {
  return (
    <span
      className={cn(
        "flex items-center gap-1 rounded border bg-muted px-2 py-1 text-xs",
        className,
      )}
      {...props}
    >
      <Paperclip size={12} />
      <span className="max-w-[100px] truncate">{children}</span>
    </span>
  );
}

export interface QueueListProps extends HTMLAttributes<HTMLDivElement> {}

export function QueueList({ children, className, ...props }: QueueListProps) {
  return (
    <div className={cn("mt-2 -mb-1 max-h-40 overflow-y-auto pr-1", className)} {...props}>
      <ul>{children}</ul>
    </div>
  );
}

export interface QueueSectionProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function QueueSection({
  className,
  defaultOpen = true,
  ...props
}: QueueSectionProps) {
  return (
    <AgentCollapsible className={cn(className)} defaultOpen={defaultOpen} {...props} />
  );
}

export interface QueueSectionTriggerProps
  extends HTMLAttributes<HTMLButtonElement> {}

export function QueueSectionTrigger({
  children,
  className,
  ...props
}: QueueSectionTriggerProps) {
  return (
    <AgentCollapsibleTrigger
      className={cn(
        "group flex w-full items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted",
        className,
      )}
      {...props}
    >
      {children}
    </AgentCollapsibleTrigger>
  );
}

export interface QueueSectionLabelProps extends HTMLAttributes<HTMLSpanElement> {
  count?: number;
  label: string;
  icon?: ReactNode;
}

export function QueueSectionLabel({
  count,
  label,
  icon,
  className,
  ...props
}: QueueSectionLabelProps) {
  return (
    <span className={cn("flex items-center gap-2", className)} {...props}>
      <ChevronDown className="size-4 transition-transform group-data-[state=closed]:-rotate-90" />
      {icon}
      <span>
        {count} {label}
      </span>
    </span>
  );
}

export interface QueueSectionContentProps
  extends HTMLAttributes<HTMLDivElement> {}

export function QueueSectionContent({
  className,
  ...props
}: QueueSectionContentProps) {
  return <AgentCollapsibleContent className={cn(className)} {...props} />;
}

export interface QueueProps extends HTMLAttributes<HTMLDivElement> {}

export function Queue({ className, ...props }: QueueProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-border bg-background px-3 pt-2 pb-2 shadow-xs",
        className,
      )}
      {...props}
    />
  );
}
