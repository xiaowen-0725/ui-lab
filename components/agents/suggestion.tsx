"use client";

// Ported from Vercel AI Elements (vercel/ai-elements, Apache-2.0).
// Adapted to ui-lab Button; no shadcn ScrollArea.

import type { ComponentProps, HTMLAttributes } from "react";
import { useCallback } from "react";
import { Button } from "@/components/motion/button";
import { cn } from "@/lib/utils";

export interface SuggestionsProps extends HTMLAttributes<HTMLDivElement> {}

export function Suggestions({
  className,
  children,
  ...props
}: SuggestionsProps) {
  return (
    <div
      className="w-full overflow-x-auto whitespace-nowrap [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      {...props}
    >
      <div className={cn("flex w-max flex-nowrap items-center gap-2", className)}>
        {children}
      </div>
    </div>
  );
}

export type SuggestionProps = Omit<ComponentProps<typeof Button>, "onClick"> & {
  suggestion: string;
  onClick?: (suggestion: string) => void;
};

export function Suggestion({
  suggestion,
  onClick,
  className,
  variant = "outline",
  size = "sm",
  children,
  ...props
}: SuggestionProps) {
  const handleClick = useCallback(() => {
    onClick?.(suggestion);
  }, [onClick, suggestion]);

  return (
    <Button
      className={cn("cursor-pointer rounded-full px-4", className)}
      onClick={handleClick}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {children || suggestion}
    </Button>
  );
}
