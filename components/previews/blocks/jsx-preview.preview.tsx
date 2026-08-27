"use client";

// Live sample for Vercel AI Elements JSX Preview (Apache-2.0).

import { RotateCcw } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import {
  JSXPreview,
  JSXPreviewContent,
} from "@/components/agents/jsx-preview";

const JSX = `<div class="rounded-xl border border-border bg-card p-4">
  <h3 class="text-sm font-semibold">Pricing card</h3>
  <p class="mt-2 text-sm text-muted-foreground">$29 / month for the team plan.</p>
  <button class="mt-4 rounded-full bg-primary px-3 py-1.5 text-xs text-primary-foreground">Subscribe</button>
</div>`;

function JsxPreviewRun() {
  const reduce = useReducedMotion() ?? false;
  const [jsx, setJsx] = useState(reduce ? JSX : "");
  const [streaming, setStreaming] = useState(!reduce);

  useEffect(() => {
    if (reduce) {
      setJsx(JSX);
      setStreaming(false);
      return;
    }

    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const cursor = Math.min(
        JSX.length,
        Math.floor(((now - startedAt) / 1000) * 64),
      );
      setJsx(JSX.slice(0, cursor));
      if (cursor >= JSX.length) {
        setStreaming(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce]);

  return (
    <JSXPreview jsx={jsx} isStreaming={streaming}>
      <JSXPreviewContent />
    </JSXPreview>
  );
}

export function JsxPreviewPreview() {
  const [run, setRun] = useState(0);

  return (
    <div className="relative h-[220px] w-full max-w-lg">
      <JsxPreviewRun key={run} />
      <button
        type="button"
        onClick={() => setRun((current) => current + 1)}
        className="absolute bottom-0 left-0 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
      >
        <RotateCcw className="size-3" />
        Replay
      </button>
    </div>
  );
}
