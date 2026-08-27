"use client";

// Live sample for Vercel AI Elements Suggestion (Apache-2.0).

import { useState } from "react";
import { Suggestion, Suggestions } from "@/components/agents/suggestion";

const PROMPTS = [
  "Summarize the last run",
  "Show the failing test",
  "Draft a follow-up",
  "Explain the registry formula",
];

export function SuggestionPreview() {
  const [selected, setSelected] = useState<string>();

  return (
    <div className="flex w-full max-w-lg flex-col gap-3">
      <Suggestions>
        {PROMPTS.map((prompt) => (
          <Suggestion
            key={prompt}
            suggestion={prompt}
            onClick={setSelected}
          />
        ))}
      </Suggestions>
      <p className="min-h-5 text-xs text-muted-foreground">
        {selected ? `Selected: ${selected}` : "Pick a follow-up prompt."}
      </p>
    </div>
  );
}
