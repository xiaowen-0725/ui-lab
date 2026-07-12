"use client";

import { RotateCcw } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { StreamingFunctionCall, StreamingJson } from "@/components/motion/streaming-json";

/** Tool-call arguments — kept in sync with `RESULT_JSON`'s `query` so the two demos read as one coherent call. */
const FUNCTION_CALL_ARGS = `{"query": "streaming ui patterns 2026", "max_results": 5, "recency": "1_month"}`;

/** ~12-line tool-result sample: strings, numbers, booleans, a nested object and an array of objects. */
const RESULT_JSON = `{
  "tool": "web_search",
  "query": "streaming ui patterns 2026",
  "cached": false,
  "took_ms": 812,
  "filters": {
    "recency": "1_month",
    "safe_search": true
  },
  "results": [
    { "title": "Designing streaming tool calls", "score": 0.93 },
    { "title": "Partial JSON rendering patterns", "score": 0.87 }
  ]
}`;

const TOTAL_LENGTH = Math.max(FUNCTION_CALL_ARGS.length, RESULT_JSON.length);

// Deterministic per-tick advance sizes (cycled, never random) — gives the
// reveal a bit of texture while staying reproducible from run to run.
const STEP_SIZES = [4, 6, 3, 7, 5];
const TICK_MS = 40;

/** Live demo: a streaming tool call followed by its streaming JSON result, auto-playing on mount and replayable. */
export function StreamingJsonPreview() {
  const reduce = useReducedMotion() ?? false;
  const [progress, setProgress] = useState(0);
  const stepRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const play = useCallback(() => {
    stop();
    stepRef.current = 0;
    setProgress(0);
    timerRef.current = setInterval(() => {
      setProgress((current) => {
        const step = STEP_SIZES[stepRef.current % STEP_SIZES.length];
        stepRef.current += 1;
        const next = current + step;
        if (next >= TOTAL_LENGTH) {
          stop();
          return TOTAL_LENGTH;
        }
        return next;
      });
    }, TICK_MS);
  }, [stop]);

  useEffect(() => {
    if (reduce) {
      stop();
      setProgress(TOTAL_LENGTH);
      return;
    }
    play();
    return stop;
  }, [reduce, play, stop]);

  const fnText = FUNCTION_CALL_ARGS.slice(0, Math.min(progress, FUNCTION_CALL_ARGS.length));
  const jsonText = RESULT_JSON.slice(0, Math.min(progress, RESULT_JSON.length));
  const fnStreaming = !reduce && progress < FUNCTION_CALL_ARGS.length;
  const jsonStreaming = !reduce && progress < RESULT_JSON.length;

  return (
    <div className="flex w-full items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-background p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">Tool call</p>
          <button
            type="button"
            onClick={play}
            className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Replay
          </button>
        </div>

        <StreamingFunctionCall
          name="web_search"
          text={fnText}
          streaming={fnStreaming}
          className="mb-3"
        />
        <StreamingJson text={jsonText} streaming={jsonStreaming} />
      </div>
    </div>
  );
}
