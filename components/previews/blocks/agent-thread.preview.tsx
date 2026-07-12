"use client";

import {
  ChevronDown,
  Copy,
  FileText,
  Globe,
  Info,
  MessageCircleQuestion,
  Plus,
  Share2,
  ShieldAlert,
  SquarePen,
  SquareTerminal,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import {
  Composer,
  ComposerIconButton,
  ComposerSendButton,
  ComposerTextarea,
  ComposerToolbar,
} from "@/components/motion/agent-composer";
import {
  Thread,
  ThreadActionBar,
  ThreadActionButton,
  ThreadApprovalCard,
  ThreadBranchSwitcher,
  ThreadCardButton,
  ThreadCodeBlock,
  ThreadCollapse,
  ThreadCommandRow,
  ThreadDiffCard,
  ThreadDiffRow,
  ThreadElicitation,
  ThreadErrorState,
  ThreadFileCard,
  ThreadInlineCode,
  ThreadItem,
  ThreadMessage,
  ThreadScrollPill,
  ThreadSuggestions,
  ThreadSystemBanner,
  ThreadThinking,
  ThreadToolCall,
  ThreadTurnHeader,
  ThreadUserMessage,
} from "@/components/motion/agent-thread";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

/** Desktop-wallpaper backdrop behind the (transparent) thread + composer. */
function Backdrop() {
  return (
    <>
      <div
        className="absolute inset-0 dark:hidden"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.25), transparent 55%), " +
            "radial-gradient(ellipse at 80% 15%, rgba(236, 72, 153, 0.18), transparent 50%), " +
            "radial-gradient(ellipse at 50% 100%, rgba(45, 212, 191, 0.2), transparent 55%), " +
            "linear-gradient(180deg, #eef1f5, #e4e8ef)",
        }}
      />
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          background:
            "radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.28), transparent 55%), " +
            "radial-gradient(ellipse at 80% 15%, rgba(217, 70, 160, 0.22), transparent 50%), " +
            "radial-gradient(ellipse at 50% 100%, rgba(20, 184, 166, 0.22), transparent 55%), " +
            "linear-gradient(180deg, #17181d, #0e0f12)",
        }}
      />
    </>
  );
}

/** Mid-turn: shimmering header + thinking, a live search, streaming prose and a running command. */
function StreamingScene() {
  const [seconds, setSeconds] = useState(8);

  useEffect(() => {
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <Thread>
      <ThreadItem>
        <ThreadUserMessage>Read the handoff doc and prep the release.</ThreadUserMessage>
      </ThreadItem>

      <ThreadItem>
        <div className="group/turn flex flex-col">
          <ThreadTurnHeader working>{`Working… · ${seconds}s`}</ThreadTurnHeader>
          <ThreadThinking thinking label="Thinking…" />
          <ThreadToolCall
            status="running"
            icon={<Globe className="h-4 w-4" />}
            detail={<span className="font-mono text-[13px]">release checklist</span>}
          >
            Searching the web
          </ThreadToolCall>
          <ThreadToolCall status="done" icon={<FileText className="h-4 w-4" />}>
            Read <span className="font-mono text-[13px]">backend/pom.xml</span>
          </ThreadToolCall>
          <ThreadMessage streaming className="py-1">
            The smoke suite is green so far — pulling the checklist together and drafting the
            launch steps
          </ThreadMessage>
          <ThreadCommandRow icon={<SquareTerminal className="h-4 w-4" />} running>
            Running <span className="font-mono text-[13px]">./mvnw -q verify</span>
          </ThreadCommandRow>
        </div>
      </ThreadItem>
    </Thread>
  );
}

/** Finished turns: thought summary, settled tool calls (including a failure), artifacts and actions. */
function DoneScene() {
  const [turn1Open, setTurn1Open] = useState(true);
  const [turn2Open, setTurn2Open] = useState(true);

  return (
    <Thread>
      <ThreadItem>
        <ThreadUserMessage>Read the handoff doc and prep the release.</ThreadUserMessage>
      </ThreadItem>

      <ThreadItem>
        <div className="group/turn flex flex-col">
          <ThreadTurnHeader open={turn1Open} onOpenChange={setTurn1Open}>
            Worked for 2m 4s
          </ThreadTurnHeader>

          <ThreadCollapse open={turn1Open}>
            <ThreadThinking label="Thought for 8s">
              The release prep needs the smoke suite green before anything ships. Validating the
              build first keeps the riskier deploy steps behind a checkpoint.
            </ThreadThinking>
            <ThreadToolCall icon={<Globe className="h-4 w-4" />}>
              Searched the web · 2 searches
            </ThreadToolCall>
            <ThreadToolCall icon={<FileText className="h-4 w-4" />}>
              Read <span className="font-mono text-[13px]">LAUNCH-STEPS.md</span>
            </ThreadToolCall>
            <ThreadToolCall status="error" icon={<SquareTerminal className="h-4 w-4" />}>
              Command failed <span className="font-mono text-[13px]">./mvnw deploy</span>
            </ThreadToolCall>
          </ThreadCollapse>

          <ThreadMessage>
            <p>
              Pulled the latest handoff notes at <ThreadInlineCode>efd14fb</ThreadInlineCode> and
              walked through the release checklist before touching anything.
            </p>
            <ul>
              <li>Confirmed the smoke-test suite is green on main</li>
              <li>
                Ran <ThreadInlineCode>./mvnw validate</ThreadInlineCode> to catch config drift early
              </li>
              <li>Drafted the launch steps doc for the on-call reviewer</li>
            </ul>
            <ThreadCodeBlock label="bash">./mvnw -q -Dtest=SmokeTest test</ThreadCodeBlock>
            <p>
              Everything passed, so I moved on to writing up the handoff and staging the diff
              below.
            </p>
          </ThreadMessage>

          <ThreadFileCard
            icon={<FileText className="h-6 w-6" />}
            title="LAUNCH-STEPS.md"
            subtitle="Document · MD"
            action={
              <ThreadCardButton>
                Open <ChevronDown className="h-3.5 w-3.5" />
              </ThreadCardButton>
            }
          />

          <ThreadDiffCard
            icon={<SquarePen className="h-5 w-5" />}
            title="Edited 3 files"
            added={29}
            removed={5}
            actions={
              <>
                <ThreadCardButton variant="ghost">Undo</ThreadCardButton>
                <ThreadCardButton>Review</ThreadCardButton>
              </>
            }
            moreLabel="Show 2 more files"
            moreCount={2}
            hiddenRows={
              <>
                <ThreadDiffRow
                  path="backend/src/main/resources/application.yml"
                  added={4}
                  removed={1}
                />
                <ThreadDiffRow path="CHANGELOG.md" added={2} removed={0} />
              </>
            }
          >
            <ThreadDiffRow path="backend/pom.xml" added={23} removed={0} />
          </ThreadDiffCard>

          <ThreadCommandRow icon={<SquareTerminal className="h-4 w-4" />}>
            Ran <span className="font-mono text-[13px]">./mvnw -q verify</span>
          </ThreadCommandRow>

          <ThreadActionBar timestamp="Thu 22:09">
            <ThreadActionButton aria-label="Copy">
              <Copy className="h-3.5 w-3.5" />
            </ThreadActionButton>
            <ThreadActionButton aria-label="Good response">
              <ThumbsUp className="h-3.5 w-3.5" />
            </ThreadActionButton>
            <ThreadActionButton aria-label="Bad response">
              <ThumbsDown className="h-3.5 w-3.5" />
            </ThreadActionButton>
            <ThreadActionButton aria-label="Share">
              <Share2 className="h-3.5 w-3.5" />
            </ThreadActionButton>
          </ThreadActionBar>
        </div>
      </ThreadItem>

      <ThreadItem>
        <ThreadUserMessage>What branch are we on?</ThreadUserMessage>
      </ThreadItem>

      <ThreadItem>
        <div className="group/turn flex flex-col">
          <ThreadTurnHeader open={turn2Open} onOpenChange={setTurn2Open}>
            Worked for 24s
          </ThreadTurnHeader>
          <ThreadCollapse open={turn2Open}>
            <ThreadToolCall icon={<FileText className="h-4 w-4" />}>
              Read <span className="font-mono text-[13px]">.git/HEAD</span>
            </ThreadToolCall>
          </ThreadCollapse>
          <ThreadMessage>
            <p>
              You&apos;re on <ThreadInlineCode>main</ThreadInlineCode>, up to date with origin.
            </p>
          </ThreadMessage>
          <ThreadActionBar timestamp="Thu 22:11">
            <ThreadActionButton aria-label="Copy">
              <Copy className="h-3.5 w-3.5" />
            </ThreadActionButton>
          </ThreadActionBar>
        </div>
      </ThreadItem>
    </Thread>
  );
}

/** Approval gate: the agent pauses on a sensitive command until the user approves or denies. */
function ApprovalScene() {
  const [decision, setDecision] = useState<"pending" | "approved" | "denied">("pending");

  return (
    <Thread>
      <ThreadItem>
        <ThreadUserMessage>Clean install the dependencies.</ThreadUserMessage>
      </ThreadItem>

      <ThreadItem>
        <div className="group/turn flex flex-col">
          <ThreadTurnHeader working>Working… · 4s</ThreadTurnHeader>
          <ThreadMessage>
            <p>
              A clean install means wiping the existing packages first — that step needs your
              sign-off before I run it.
            </p>
          </ThreadMessage>
          <ThreadApprovalCard
            icon={<ShieldAlert className="h-5 w-5" />}
            title="Approval required"
            description="This command can modify files outside the workspace."
            command="rm -rf node_modules && bun install"
            status={decision}
            resolution={
              decision === "approved" ? "Approved" : decision === "denied" ? "Denied" : undefined
            }
            onApprove={() => setDecision("approved")}
            onDeny={() => setDecision("denied")}
          />
          {decision === "approved" ? (
            <ThreadCommandRow icon={<SquareTerminal className="h-4 w-4" />} running>
              Running{" "}
              <span className="font-mono text-[13px]">{"rm -rf node_modules && bun install"}</span>
            </ThreadCommandRow>
          ) : null}
        </div>
      </ThreadItem>
    </Thread>
  );
}

/** State-row gallery: branch switching, a system notice, a blocking
 * clarification picker, an error/retry row and suggested follow-ups. */
function StatesScene() {
  const [branchIndex, setBranchIndex] = useState(2);
  const branchCount = 3;
  const [envChoice, setEnvChoice] = useState<string | null>(null);

  const envOptions = [
    { value: "staging", label: "Staging", description: "Safe to break, resets nightly" },
    { value: "production", label: "Production", description: "Live traffic — needs approval" },
    { value: "local", label: "Local", description: "Your machine only" },
  ];

  const suggestions = [
    { value: "logs", label: "Show me the logs" },
    { value: "retry", label: "Retry the search" },
    { value: "skip", label: "Skip this step" },
  ];

  return (
    <Thread>
      <ThreadItem>
        <div className="flex flex-col items-end gap-1">
          <ThreadUserMessage>Target the staging environment for this run.</ThreadUserMessage>
          <ThreadBranchSwitcher
            index={branchIndex}
            count={branchCount}
            onPrev={() => setBranchIndex((i) => Math.max(1, i - 1))}
            onNext={() => setBranchIndex((i) => Math.min(branchCount, i + 1))}
          />
        </div>
      </ThreadItem>

      <ThreadSystemBanner icon={<Info className="h-3 w-3" />}>
        Model switched to 5.6
      </ThreadSystemBanner>

      <ThreadItem>
        <ThreadElicitation
          icon={<MessageCircleQuestion className="h-5 w-5" />}
          prompt="Which environment should I target?"
          options={envOptions}
          value={envChoice}
          onSelect={setEnvChoice}
        />
      </ThreadItem>

      <ThreadItem>
        <ThreadErrorState message="Network error while calling the search tool." onRetry={() => {}} />
      </ThreadItem>

      <ThreadItem>
        <ThreadSuggestions suggestions={suggestions} onSelect={() => {}} />
      </ThreadItem>
    </Thread>
  );
}

type Scene = "streaming" | "done" | "approval" | "states";

const SCENES: Array<{ id: Scene; label: string }> = [
  { id: "streaming", label: "Streaming" },
  { id: "done", label: "Done" },
  { id: "approval", label: "Approval" },
  { id: "states", label: "States" },
];

export function AgentThreadPreview() {
  const reduce = useReducedMotion() ?? false;
  const [scene, setScene] = useState<Scene>("streaming");
  const [reply, setReply] = useState("");
  const [pillOpen, setPillOpen] = useState(false);

  useEffect(() => {
    if (scene !== "states") {
      setPillOpen(false);
      return;
    }
    const id = setTimeout(() => setPillOpen(true), 1200);
    return () => clearTimeout(id);
  }, [scene]);

  const sceneMotion = {
    initial: reduce ? { opacity: 0 } : { opacity: 0, y: 4 },
    animate: reduce ? { opacity: 1 } : { opacity: 1, y: 0 },
    exit: reduce ? { opacity: 0 } : { opacity: 0, y: 4 },
    transition: { duration: 0.15, ease: EASE_OUT },
  } as const;

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-xl border border-border">
      <Backdrop />
      <div className="absolute top-3 right-3 z-10 flex gap-1 rounded-full border border-border bg-white/80 p-1 backdrop-blur dark:bg-neutral-900/80">
        {SCENES.map((s) => (
          <button
            key={s.id}
            type="button"
            aria-pressed={scene === s.id}
            onClick={() => setScene(s.id)}
            className={cn(
              "h-6 rounded-full px-2.5 text-xs transition-colors",
              scene === s.id
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="relative flex h-full flex-col">
        <div className="relative flex-1 overflow-y-auto py-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={scene} {...sceneMotion}>
              {scene === "streaming" ? (
                <StreamingScene />
              ) : scene === "done" ? (
                <DoneScene />
              ) : scene === "approval" ? (
                <ApprovalScene />
              ) : (
                <StatesScene />
              )}
            </motion.div>
          </AnimatePresence>
          <ThreadScrollPill open={pillOpen} count={2} onClick={() => setPillOpen(false)} />
        </div>

        <div className="px-6 pb-6">
          <Composer>
            <ComposerTextarea
              value={reply}
              onChange={setReply}
              placeholder="Reply…"
              aria-label="Reply"
            />
            <ComposerToolbar>
              <ComposerIconButton aria-label="Add">
                <Plus className="h-4 w-4" />
              </ComposerIconButton>
              <div className="ml-auto" />
              <ComposerSendButton disabled={reply.trim().length === 0} />
            </ComposerToolbar>
          </Composer>
        </div>
      </div>
    </div>
  );
}
