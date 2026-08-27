"use client";

// Live sample for Vercel AI Elements Sources (Apache-2.0).

import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/agents/sources";

export function SourcesPreview() {
  return (
    <div className="w-full max-w-sm text-sm">
      <p className="mb-3 leading-6 text-foreground">
        Tokens stay the shared language between design and code, so one named
        value can travel across platforms.
      </p>
      <Sources defaultOpen>
        <SourcesTrigger count={3} />
        <SourcesContent>
          <Source
            href="https://spec.design-tokens.dev"
            title="Design Tokens: The Deep Dive"
          />
          <Source
            href="https://ui.shadcn.com"
            title="shadcn/ui registry contract"
          />
          <Source
            href="https://ui-lab-ten.vercel.app/catalog.json"
            title="UI Lab catalog"
          />
        </SourcesContent>
      </Sources>
    </div>
  );
}
