"use client";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  Clock,
  Copy,
  Diff,
  FileText,
  Folder,
  GitBranch,
  GitCommitHorizontal,
  GitPullRequest,
  Globe,
  Image,
  Laptop,
  ListChecks,
  ListTodo,
  MessageCircle,
  Mic,
  PanelLeft,
  PanelRight,
  Plus,
  Search,
  SquarePen,
  SquareTerminal,
  Zap,
} from "lucide-react";
import { type ComponentType, useState } from "react";
import {
  Composer,
  ComposerAccessChip,
  ComposerEffortSlider,
  ComposerIconButton,
  ComposerModelPicker,
  ComposerSendButton,
  ComposerTextarea,
  ComposerToolbar,
} from "@/components/motion/agent-composer";
import {
  Thread,
  ThreadActionBar,
  ThreadActionButton,
  ThreadCardButton,
  ThreadCollapse,
  ThreadCommandRow,
  ThreadDiffCard,
  ThreadDiffRow,
  ThreadInlineCode,
  ThreadMessage,
  ThreadThinking,
  ThreadToolCall,
  ThreadTurnHeader,
  ThreadUserMessage,
} from "@/components/motion/agent-thread";
import {
  useWorkbench,
  Workbench,
  WorkbenchHeader,
  WorkbenchMain,
  WorkbenchPanel,
  WorkbenchSidebar,
  WorkbenchSummaryCard,
  WorkbenchSummarySection,
} from "@/components/motion/agent-workbench";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: SquarePen, label: "New task" },
  { icon: Clock, label: "Scheduled" },
  { icon: GitPullRequest, label: "Pull requests" },
  { icon: MessageCircle, label: "Chats" },
];

const PINNED_TASKS = [
  "Refactor auth middleware",
  "Fix flaky CI on macOS runners",
  "Update onboarding docs",
  "Investigate memory leak in worker pool",
];

const PROJECTS = [
  { name: "web-app", children: ["main", "feature/cache-keys"] },
  { name: "infra-scripts", children: ["deploy.sh"] },
];

const TOOL_ROWS: { icon: ComponentType<{ className?: string }>; label: string; shortcut?: string }[] = [
  { icon: ListTodo, label: "Side tasks", shortcut: "⌥⌘S" },
  { icon: Globe, label: "Browser", shortcut: "⌘T" },
  { icon: SquareTerminal, label: "Terminal" },
];

const SUGGESTED_FILES: { icon: ComponentType<{ className?: string }>; name: string }[] = [
  { icon: FileText, name: "useCacheKey.ts" },
  { icon: FileText, name: "webpack.config.js" },
  { icon: FileText, name: "ci.yml" },
  { icon: Image, name: "screenshot.png" },
  { icon: FileText, name: "README.md" },
];

const ICON_BUTTON =
  "flex h-7 w-7 items-center justify-center rounded-lg text-foreground/70 hover:bg-black/5 dark:hover:bg-white/10";

interface ToolbarProps {
  onToggleSummary: () => void;
}

function Toolbar({ onToggleSummary }: ToolbarProps) {
  const { toggleSidebar, togglePanel } = useWorkbench();

  return (
    <WorkbenchHeader
      leading={
        <div className="flex items-center gap-1.5 pl-3">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </span>
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
            className={cn(ICON_BUTTON, "ml-1")}
          >
            <PanelLeft className="h-4 w-4" />
          </button>
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </div>
      }
      trailing={
        <div className="flex items-center gap-0.5 pr-3">
          <button
            type="button"
            onClick={onToggleSummary}
            aria-label="Toggle summary"
            className={ICON_BUTTON}
          >
            <ListChecks className="h-4 w-4" />
          </button>
          <button type="button" onClick={togglePanel} aria-label="Toggle panel" className={ICON_BUTTON}>
            <PanelRight className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="flex h-full items-center gap-1.5 pl-3 text-xs text-muted-foreground">
        <span>Investigate build cache misses</span>
        <span>···</span>
      </div>
    </WorkbenchHeader>
  );
}

function SidebarContent() {
  return (
    <div className="flex flex-col gap-5 px-3 pb-4">
      <div className="flex items-center justify-between px-1 pt-1">
        <span className="text-sm font-bold text-foreground">Workbench</span>
        <Search className="h-4 w-4 text-muted-foreground" />
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex h-[30px] items-center gap-2 rounded-full px-2.5 text-sm text-foreground/80 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </div>
        ))}
      </nav>

      <div className="flex flex-col gap-0.5">
        <span className="px-2.5 text-[11px] font-medium text-muted-foreground">Pinned</span>
        {PINNED_TASKS.map((title) => (
          <div
            key={title}
            className="truncate rounded-lg px-2.5 py-1.5 text-sm text-foreground/70 hover:bg-black/5 dark:hover:bg-white/10"
          >
            {title}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-0.5">
        <span className="px-2.5 text-[11px] font-medium text-muted-foreground">Projects</span>
        {PROJECTS.map((project) => (
          <div key={project.name}>
            <div className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-foreground/80 hover:bg-black/5 dark:hover:bg-white/10">
              <Folder className="h-4 w-4" />
              <span>{project.name}</span>
            </div>
            <div className="flex flex-col gap-0.5 pl-8">
              {project.children.map((child) => (
                <span key={child} className="truncate py-0.5 text-xs text-muted-foreground">
                  {child}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2 px-2.5 py-1.5">
        <span className="h-6 w-6 shrink-0 rounded-full bg-gradient-to-br from-violet to-accent" />
        <span className="text-sm text-foreground/80">Acme Workspace</span>
      </div>
    </div>
  );
}

const EFFORT_LABELS = ["Minimal", "Low", "Standard", "High", "Max"];

/** Main column composed from the agent-thread and agent-composer blocks — the full app shape. */
function MainContent() {
  const [draft, setDraft] = useState("");
  const [effort, setEffort] = useState(3); // "High"
  const [logOpen, setLogOpen] = useState(true);

  return (
    <>
      <div className="flex-1 overflow-y-auto pt-[54px] pb-4">
        <Thread>
          <ThreadUserMessage>Read the handoff doc and prep the release.</ThreadUserMessage>

          <div className="group/turn flex flex-col">
            <ThreadTurnHeader open={logOpen} onOpenChange={setLogOpen}>
              Worked for 2m 4s
            </ThreadTurnHeader>
            <ThreadCollapse open={logOpen}>
              <ThreadThinking label="Thought for 8s">
                Validating the build first keeps the riskier deploy steps behind a checkpoint.
              </ThreadThinking>
              <ThreadToolCall icon={<Globe className="h-4 w-4" />}>
                Searched the web · 2 searches
              </ThreadToolCall>
            </ThreadCollapse>
            <ThreadMessage>
              <p>
                Pulled the handoff notes at <ThreadInlineCode>efd14fb</ThreadInlineCode> and staged
                the release diff below.
              </p>
            </ThreadMessage>
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
            >
              <ThreadDiffRow path="backend/pom.xml" added={23} removed={0} />
              <ThreadDiffRow path="CHANGELOG.md" added={2} removed={0} />
            </ThreadDiffCard>
            <ThreadCommandRow icon={<SquareTerminal className="h-4 w-4" />} running>
              Running <span className="font-mono text-[13px]">./mvnw -q verify</span>
            </ThreadCommandRow>
            <ThreadActionBar timestamp="Thu 22:09">
              <ThreadActionButton aria-label="Copy">
                <Copy className="h-3.5 w-3.5" />
              </ThreadActionButton>
            </ThreadActionBar>
          </div>
        </Thread>
      </div>

      <div className="px-4 pb-4">
        <Composer>
          <ComposerTextarea
            value={draft}
            onChange={setDraft}
            placeholder="Describe your next change…"
            aria-label="Message"
          />
          <ComposerToolbar>
            <ComposerIconButton aria-label="Add files and more">
              <Plus className="h-4 w-4" />
            </ComposerIconButton>
            <ComposerAccessChip icon={<CircleAlert className="h-4 w-4" />}>
              Full access
            </ComposerAccessChip>
            <div className="ml-auto" />
            <ComposerModelPicker label={`5.6 · ${EFFORT_LABELS[effort]}`}>
              <div className="flex items-center justify-between px-2 pt-1 text-muted-foreground text-xs">
                <span>Reasoning effort</span>
                <Zap className="h-3.5 w-3.5" />
              </div>
              <div className="px-2 pt-1 pb-2">
                <ComposerEffortSlider
                  value={effort}
                  onChange={setEffort}
                  labels={EFFORT_LABELS}
                  aria-label="Reasoning effort"
                />
              </div>
            </ComposerModelPicker>
            <ComposerIconButton aria-label="Dictate">
              <Mic className="h-4 w-4" />
            </ComposerIconButton>
            <ComposerSendButton disabled={draft.trim().length === 0} />
          </ComposerToolbar>
        </Composer>
      </div>
    </>
  );
}

function PanelContent() {
  return (
    <div className="flex flex-col gap-4 px-3 py-3">
      <div className="flex flex-col gap-0.5">
        {TOOL_ROWS.map(({ icon: Icon, label, shortcut }) => (
          <div
            key={label}
            className="flex h-9 items-center justify-between rounded-lg px-2.5 hover:bg-black/5 dark:hover:bg-white/10"
          >
            <div className="flex items-center gap-2 text-sm text-foreground/80">
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </div>
            {shortcut ? (
              <kbd className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {shortcut}
              </kbd>
            ) : null}
          </div>
        ))}
      </div>

      <div className="flex flex-col">
        <span className="px-2.5 pb-1 text-[11px] font-medium text-muted-foreground">Suggested</span>
        {SUGGESTED_FILES.map(({ icon: Icon, name }, index) => (
          <div
            key={name}
            className={cn(
              "flex items-center gap-2 border-black/5 px-2.5 py-2 text-sm text-foreground/80 dark:border-white/10",
              index < SUGGESTED_FILES.length - 1 && "border-b",
            )}
          >
            <Icon className="h-4 w-4 text-muted-foreground" />
            <span className="truncate font-mono text-xs">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const SUMMARY_ROW_BASE = "flex h-7 w-full items-center gap-2 rounded-lg px-1.5 text-sm";
const SUMMARY_ROW = cn(SUMMARY_ROW_BASE, "hover:bg-black/5 dark:hover:bg-white/10");

function SummaryContent() {
  return (
    <WorkbenchSummarySection
      title="Environment"
      action={
        <button
          type="button"
          aria-label="Add"
          className="flex h-5 w-5 items-center justify-center rounded-md text-muted-foreground hover:bg-black/5 dark:hover:bg-white/10"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      }
    >
      <button type="button" className={SUMMARY_ROW}>
        <Diff className="h-4 w-4 text-muted-foreground" />
        <span>Changes</span>
        <span className="ml-auto rounded-full bg-black/5 px-1.5 text-[10px] dark:bg-white/10">2</span>
      </button>
      <button type="button" className={SUMMARY_ROW}>
        <Laptop className="h-4 w-4 text-muted-foreground" />
        <span>Local</span>
        <ChevronDown className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
      </button>
      <button type="button" className={SUMMARY_ROW}>
        <GitBranch className="h-4 w-4 text-muted-foreground" />
        <span>main</span>
        <ChevronDown className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
      </button>
      <button type="button" className={SUMMARY_ROW}>
        <GitCommitHorizontal className="h-4 w-4 text-muted-foreground" />
        <span>Commit or push</span>
      </button>
      <div aria-disabled className={cn(SUMMARY_ROW_BASE, "text-muted-foreground/60")}>
        <GitPullRequest className="h-4 w-4 text-muted-foreground" />
        <span>Can&apos;t fetch pull request status</span>
      </div>
    </WorkbenchSummarySection>
  );
}

/** Desktop-wallpaper backdrop behind the (transparent) workbench shell. */
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

export function AgentWorkbenchPreview() {
  const [summaryOpen, setSummaryOpen] = useState(true);

  return (
    <div className="relative h-[560px] w-full overflow-hidden rounded-xl border border-border">
      <Backdrop />
      <div className="relative h-full w-full">
        <Workbench defaultPanelOpen className="h-full">
          <Toolbar onToggleSummary={() => setSummaryOpen((open) => !open)} />
          <WorkbenchSidebar>
            <SidebarContent />
          </WorkbenchSidebar>
          <WorkbenchMain>
            <MainContent />
            <WorkbenchSummaryCard open={summaryOpen}>
              <SummaryContent />
            </WorkbenchSummaryCard>
          </WorkbenchMain>
          <WorkbenchPanel>
            <PanelContent />
          </WorkbenchPanel>
        </Workbench>
      </div>
    </div>
  );
}
