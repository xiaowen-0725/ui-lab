"use client";

// Live sample for Vercel AI Elements Chain of Thought (Apache-2.0).

import { FileSearch, Globe, Search } from "lucide-react";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "@/components/agents/chain-of-thought";

export function ChainOfThoughtPreview() {
  return (
    <div className="w-full max-w-lg rounded-xl border border-border bg-background p-4">
      <ChainOfThought defaultOpen>
        <ChainOfThoughtHeader>Inspecting the request</ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          <ChainOfThoughtStep
            icon={Search}
            label="Read the user goal"
            description="Separate the catalog contract from the live sample."
            status="complete"
          />
          <ChainOfThoughtStep
            icon={Globe}
            label="Check related sources"
            status="complete"
          >
            <ChainOfThoughtSearchResults>
              <ChainOfThoughtSearchResult>ui-lab catalog</ChainOfThoughtSearchResult>
              <ChainOfThoughtSearchResult>AI Elements</ChainOfThoughtSearchResult>
            </ChainOfThoughtSearchResults>
          </ChainOfThoughtStep>
          <ChainOfThoughtStep
            icon={FileSearch}
            label="Compose the disclosure"
            description="Keep steps compact and readable."
            status="active"
          />
        </ChainOfThoughtContent>
      </ChainOfThought>
    </div>
  );
}
