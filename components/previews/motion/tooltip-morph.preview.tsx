"use client";

import { Code2, ListChecks, MessageSquare, Sparkles } from "lucide-react";
import {
  MorphTooltip,
  MorphTooltipGroup,
} from "@/components/motion/tooltip-morph";

const TOOLS = [
  { id: "draft", icon: Sparkles, label: "Draft with AI" },
  { id: "review", icon: ListChecks, label: "Review queued" },
  { id: "source", icon: Code2, label: "View source" },
  { id: "note", icon: MessageSquare, label: "Leave a note" },
] as const;

export function TooltipMorphPreview() {
  return (
    <div className="flex flex-col items-center gap-4">
      <MorphTooltipGroup
        side="top"
        className="rounded-full border border-border bg-card p-1.5 shadow-sm"
      >
        {TOOLS.map(({ id, icon: Icon, label }) => (
          <MorphTooltip key={id} content={label}>
            <button
              type="button"
              aria-label={label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:bg-muted focus-visible:text-foreground"
            >
              <Icon className="h-4 w-4" />
            </button>
          </MorphTooltip>
        ))}
      </MorphTooltipGroup>
      <p className="text-xs text-muted-foreground">
        Hover across the toolbar
      </p>
    </div>
  );
}
