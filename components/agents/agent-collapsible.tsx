"use client";

import {
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
} from "react";
import { AgentDisclosure } from "@/components/agents/agent-disclosure";
import { cn } from "@/lib/utils";

type CollapsibleContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  triggerId: string;
  contentId: string;
};

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsible(component: string) {
  const context = useContext(CollapsibleContext);
  if (!context) {
    throw new Error(`${component} must be used within AgentCollapsible`);
  }
  return context;
}

export interface AgentCollapsibleProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function AgentCollapsible({
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...props
}: AgentCollapsibleProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isOpen = open ?? uncontrolled;
  const triggerId = useId();
  const contentId = useId();

  const setOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setUncontrolled(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );

  return (
    <CollapsibleContext.Provider
      value={{ open: isOpen, setOpen, triggerId, contentId }}
    >
      <div
        data-state={isOpen ? "open" : "closed"}
        className={className}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

export interface AgentCollapsibleTriggerProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {}

export function AgentCollapsibleTrigger({
  className,
  children,
  onClick,
  ...props
}: AgentCollapsibleTriggerProps) {
  const { open, setOpen, triggerId, contentId } = useCollapsible(
    "AgentCollapsibleTrigger",
  );

  return (
    <button
      type="button"
      id={triggerId}
      aria-expanded={open}
      aria-controls={contentId}
      data-state={open ? "open" : "closed"}
      className={cn("outline-none", className)}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) setOpen(!open);
      }}
      {...props}
    >
      {children}
    </button>
  );
}

export interface AgentCollapsibleContentProps
  extends HTMLAttributes<HTMLDivElement> {}

export function AgentCollapsibleContent({
  className,
  children,
  id,
}: AgentCollapsibleContentProps) {
  const { open, contentId } = useCollapsible("AgentCollapsibleContent");

  return (
    <AgentDisclosure
      id={id ?? contentId}
      open={open}
      className={cn(className)}
    >
      {children}
    </AgentDisclosure>
  );
}

export { useCollapsible as useAgentCollapsible };
