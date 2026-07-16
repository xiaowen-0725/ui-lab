"use client";

import { FileSearch, ListChecks, RotateCcw, Search, Wrench } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { type ComponentType, useEffect, useState } from "react";
import {
  Trace,
  TraceCostBadge,
  TraceGroup,
  TraceStep,
  TraceSubagent,
  TraceSummary,
} from "@/components/motion/agent-trace";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 7;
/** Fixed reveal delays (ms) for steps 1..7 — a 600ms cadence, no timers based on Date.now/Math.random. */
const REVEAL_DELAYS = [0, 600, 1200, 1800, 2400, 3000, 3600];
/** How long the live "Writing summary…" step stays active before settling in place. */
const WRITING_DURATION = 2400;

const RAW_JSON = `{
  "query": "release checklist",
  "matches": 3,
  "files": [
    "CHANGELOG.md",
    "docs/release.md",
    "docs/checklist.md"
  ]
}`;

interface GroupRowProps {
  icon: ComponentType<{ className?: string }>;
  label: string;
  meta: string;
  slow?: boolean;
}

/** Simplified row inside a `TraceGroup` — 14px icon, label, right-floating meta. */
function GroupRow({ icon: Icon, label, meta, slow }: GroupRowProps) {
  return (
    <div className="flex items-center gap-2 py-0.5 text-sm text-foreground/80">
      <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
      <span className="min-w-0 truncate">{label}</span>
      <span
        className={cn(
          "ml-auto shrink-0 text-xs tabular-nums text-muted-foreground",
          slow && "text-[#e25507] dark:text-[#ff8549]",
        )}
      >
        {meta}
      </span>
    </div>
  );
}

/**
 * Scripted playback of an agent execution trace — plan, tool call with an
 * expandable raw-JSON result, a nested sub-agent delegation, a parallel
 * tool group, a live step that settles in place once "done", a final
 * "Task complete" step and a trailing run-summary row. Steps mount on a
 * fixed 600ms cadence; "Replay" restarts the script. `useReducedMotion()`
 * skips the staged reveal and renders every step (plus the summary) in its
 * settled end state instead.
 */
export function AgentTracePreview() {
  const reduce = useReducedMotion() ?? false;
  const [playKey, setPlayKey] = useState(0);
  const [visibleCount, setVisibleCount] = useState(reduce ? TOTAL_STEPS : 0);
  const [writingDone, setWritingDone] = useState(reduce);
  const [subagentOpen, setSubagentOpen] = useState(true);

  // biome-ignore lint/correctness/useExhaustiveDependencies: `playKey` is a deliberate restart trigger for the "Replay" button — its value is never read, only its identity change re-runs the script from the top.
  useEffect(() => {
    setSubagentOpen(true);

    if (reduce) {
      setVisibleCount(TOTAL_STEPS);
      setWritingDone(true);
      return;
    }

    setVisibleCount(0);
    setWritingDone(false);

    const timers = REVEAL_DELAYS.map((delay, index) =>
      setTimeout(() => setVisibleCount(index + 1), delay),
    );

    return () => {
      for (const id of timers) clearTimeout(id);
    };
  }, [reduce, playKey]);

  useEffect(() => {
    if (reduce || visibleCount < 5) return;

    const id = setTimeout(() => setWritingDone(true), WRITING_DURATION);
    return () => clearTimeout(id);
  }, [reduce, visibleCount]);

  return (
    <div className="relative mx-auto w-full max-w-xl rounded-xl border border-border bg-background p-5">
      <button
        type="button"
        onClick={() => setPlayKey((key) => key + 1)}
        className="absolute top-3 right-3 flex h-7 items-center gap-1.5 rounded-lg px-2 text-muted-foreground text-xs transition-colors hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Replay
      </button>

      <Trace className="pt-1">
        {visibleCount >= 1 ? <TraceStep kind="plan" label="Plan the release checklist" /> : null}

        {visibleCount >= 2 ? (
          <TraceStep
            kind="tool"
            icon={<Search className="h-[13px] w-[13px]" />}
            label="Search docs"
            detail="3 files matched"
            meta={
              <span className="flex items-center gap-1.5">
                <span>0.4s</span>
                <TraceCostBadge tokens={1240} cost={0.003} />
              </span>
            }
          >
            <div className="whitespace-pre-wrap rounded-lg bg-black/[0.04] p-2 font-mono text-xs dark:bg-white/5">
              {RAW_JSON}
            </div>
          </TraceStep>
        ) : null}

        {visibleCount >= 3 ? (
          <TraceSubagent
            label="Delegate: verify build"
            open={subagentOpen}
            onOpenChange={setSubagentOpen}
          >
            <TraceStep kind="tool" label="Run unit tests" meta="1.8s" />
            <TraceStep kind="done" label="All green" />
          </TraceSubagent>
        ) : null}

        {visibleCount >= 4 ? (
          <TraceGroup label="Running 3 tools in parallel">
            <GroupRow icon={FileSearch} label="Fetch schema" meta="0.6s" />
            <GroupRow icon={Wrench} label="Lint" meta="2.4s" slow />
            <GroupRow icon={ListChecks} label="Typecheck" meta="1.1s" />
          </TraceGroup>
        ) : null}

        {visibleCount >= 5 ? (
          <TraceStep
            kind={writingDone ? "done" : "tool"}
            active={!writingDone}
            label={writingDone ? "Wrote summary" : "Writing summary…"}
          />
        ) : null}

        {visibleCount >= 6 ? <TraceStep kind="done" label="Task complete" /> : null}

        {visibleCount >= 7 ? (
          <TraceSummary duration="12.8s" tokens={48200} cost={0.089} />
        ) : null}
      </Trace>
    </div>
  );
}
