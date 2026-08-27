"use client";

// Live sample for Vercel AI Elements Reasoning (Apache-2.0).

import { RotateCcw } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/agents/reasoning";

const TEXT =
  "The request is a composition problem, not a new runtime. Keep the disclosure open while tokens arrive, then collapse to a timed summary.";

function ReasoningRun() {
  const reduce = useReducedMotion() ?? false;
  const [stream, setStream] = useState("");
  const [streaming, setStreaming] = useState(true);

  useEffect(() => {
    if (reduce) {
      setStream(TEXT);
      setStreaming(false);
      return;
    }

    const startedAt = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const cursor = Math.min(
        TEXT.length,
        Math.floor(((now - startedAt) / 1000) * 48),
      );
      setStream(TEXT.slice(0, cursor));
      if (cursor >= TEXT.length) {
        setStreaming(false);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduce]);

  return (
    <Reasoning isStreaming={streaming} defaultOpen>
      <ReasoningTrigger />
      <ReasoningContent>{stream}</ReasoningContent>
    </Reasoning>
  );
}

export function ReasoningPreview() {
  const [run, setRun] = useState(0);

  return (
    <div className="relative h-[240px] w-full max-w-lg">
      <ReasoningRun key={run} />
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
