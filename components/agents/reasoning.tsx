"use client";

// Ported from Vercel AI Elements (vercel/ai-elements, Apache-2.0).
// Adapted to ui-lab AgentCollapsible + ThinkingShimmer; no Streamdown runtime.

import { Brain, ChevronDown } from "lucide-react";
import {
  type HTMLAttributes,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AgentCollapsible,
  AgentCollapsibleContent,
  AgentCollapsibleTrigger,
} from "@/components/agents/agent-collapsible";
import { ThinkingShimmer } from "@/components/agents/loading-states/thinking-shimmer";
import { cn } from "@/lib/utils";

interface ReasoningContextValue {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration: number | undefined;
}

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

export function useReasoning() {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning");
  }
  return context;
}

export interface ReasoningProps extends HTMLAttributes<HTMLDivElement> {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
}

const AUTO_CLOSE_DELAY = 1000;
const MS_IN_S = 1000;

export function Reasoning({
  className,
  isStreaming = false,
  open,
  defaultOpen,
  onOpenChange,
  duration: durationProp,
  children,
  ...props
}: ReasoningProps) {
  const resolvedDefaultOpen = defaultOpen ?? isStreaming;
  const isExplicitlyClosed = defaultOpen === false;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(resolvedDefaultOpen);
  const isOpen = open ?? uncontrolledOpen;
  const [duration, setDuration] = useState<number | undefined>(durationProp);
  const hasEverStreamedRef = useRef(isStreaming);
  const [hasAutoClosed, setHasAutoClosed] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  const setIsOpen = useCallback(
    (next: boolean) => {
      if (open === undefined) setUncontrolledOpen(next);
      onOpenChange?.(next);
    },
    [open, onOpenChange],
  );

  useEffect(() => {
    if (durationProp !== undefined) setDuration(durationProp);
  }, [durationProp]);

  useEffect(() => {
    if (isStreaming) {
      hasEverStreamedRef.current = true;
      if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
      }
    } else if (startTimeRef.current !== null) {
      setDuration(Math.ceil((Date.now() - startTimeRef.current) / MS_IN_S));
      startTimeRef.current = null;
    }
  }, [isStreaming]);

  useEffect(() => {
    if (isStreaming && !isOpen && !isExplicitlyClosed) {
      setIsOpen(true);
    }
  }, [isStreaming, isOpen, setIsOpen, isExplicitlyClosed]);

  useEffect(() => {
    if (hasEverStreamedRef.current && !isStreaming && isOpen && !hasAutoClosed) {
      const timer = window.setTimeout(() => {
        setIsOpen(false);
        setHasAutoClosed(true);
      }, AUTO_CLOSE_DELAY);
      return () => window.clearTimeout(timer);
    }
  }, [isStreaming, isOpen, setIsOpen, hasAutoClosed]);

  const contextValue = useMemo(
    () => ({ duration, isOpen, isStreaming, setIsOpen }),
    [duration, isOpen, isStreaming, setIsOpen],
  );

  return (
    <ReasoningContext.Provider value={contextValue}>
      <AgentCollapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className={cn("not-prose mb-4", className)}
        {...props}
      >
        {children}
      </AgentCollapsible>
    </ReasoningContext.Provider>
  );
}

export interface ReasoningTriggerProps
  extends HTMLAttributes<HTMLButtonElement> {
  getThinkingMessage?: (isStreaming: boolean, duration?: number) => ReactNode;
}

function defaultGetThinkingMessage(isStreaming: boolean, duration?: number) {
  if (isStreaming || duration === 0) {
    return <ThinkingShimmer duration={1}>Thinking…</ThinkingShimmer>;
  }
  if (duration === undefined) {
    return <span>Thought for a few seconds</span>;
  }
  return <span>Thought for {duration} seconds</span>;
}

export function ReasoningTrigger({
  className,
  children,
  getThinkingMessage = defaultGetThinkingMessage,
  ...props
}: ReasoningTriggerProps) {
  const { isStreaming, isOpen, duration } = useReasoning();

  return (
    <AgentCollapsibleTrigger
      className={cn(
        "flex w-full items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground",
        className,
      )}
      {...props}
    >
      {children ?? (
        <>
          <Brain className="size-4" />
          {getThinkingMessage(isStreaming, duration)}
          <ChevronDown
            className={cn(
              "size-4 transition-transform",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          />
        </>
      )}
    </AgentCollapsibleTrigger>
  );
}

export interface ReasoningContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function ReasoningContent({
  className,
  children,
  ...props
}: ReasoningContentProps) {
  return (
    <AgentCollapsibleContent
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    >
      {typeof children === "string" ? (
        <p className="whitespace-pre-wrap">{children}</p>
      ) : (
        children
      )}
    </AgentCollapsibleContent>
  );
}
