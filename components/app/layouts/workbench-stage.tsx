"use client";

import {
  CheckCircle2,
  Copy,
  FileText,
  FolderGit2,
  GitBranch,
  Globe,
  Laptop,
  MessageSquare,
  PanelLeft,
  PanelRight,
  Paperclip,
  Pin,
  Plus,
  Search,
  ShieldCheck,
  SquarePen,
  SquareTerminal,
  Trash2,
  Zap,
} from "lucide-react";
import { AnimatePresence, useReducedMotion } from "motion/react";
import { useLocale } from "next-intl";
import {
  type CSSProperties,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Composer,
  ComposerAccessChip,
  ComposerAttachmentChip,
  ComposerAttachments,
  ComposerChip,
  ComposerContextBar,
  ComposerEffortSlider,
  ComposerMenuButton,
  ComposerMenuItem,
  ComposerMenuSection,
  ComposerModelPicker,
  ComposerSendButton,
  ComposerTextarea,
  ComposerToolbar,
} from "@/components/motion/agent-composer";
import {
  Thread,
  ThreadActionBar,
  ThreadActionButton,
  ThreadApprovalCard,
  ThreadCardButton,
  ThreadCollapse,
  ThreadCommandRow,
  ThreadDiffCard,
  ThreadDiffRow,
  ThreadFileCard,
  ThreadInlineCode,
  ThreadItem,
  ThreadMessage,
  ThreadShimmerText,
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
} from "@/components/motion/agent-workbench";
import {
  ArtifactAction,
  ArtifactContent,
  ArtifactHeader,
  ArtifactPanel,
  ArtifactVersionNav,
  type ArtifactView,
  ArtifactViewToggle,
} from "@/components/motion/artifact-panel";
import {
  ThreadList,
  ThreadListAction,
  ThreadListItem,
  ThreadListSection,
} from "@/components/motion/thread-list";
import type { Locale } from "@/i18n/routing";
import type { DesignSystemEntry } from "@/lib/layouts";
import { cn } from "@/lib/utils";
import type { AnatomyId } from "./anatomy-map";

interface WorkbenchStageProps {
  entry: DesignSystemEntry;
  activeAnatomy: AnatomyId | null;
  className?: string;
}

interface SubmittedMessage {
  id: number;
  prompt: string;
  status: "processing" | "done";
}

interface Attachment {
  id: string;
  name: string;
  meta: string;
}

const COPY = {
  zh: {
    stageLabel: "可交互 Agent 工作台",
    taskTitle: "准备组件实验室发布",
    toggleSidebar: "切换会话侧栏",
    togglePanel: "切换产物区",
    searchThreads: "搜索会话",
    workspace: "设计系统工作区",
    pinned: "置顶",
    recent: "最近",
    newThread: "新建会话",
    pinThread: "置顶会话",
    deleteThread: "删除会话",
    threads: [
      { id: "release", title: "准备组件实验室发布", meta: "现在", unread: true },
      { id: "tokens", title: "统一工作台颜色 token", meta: "18 分" },
      { id: "composer", title: "补齐输入台附件交互", meta: "2 小时" },
      { id: "docs", title: "更新 Agent 使用文档", meta: "昨天" },
    ],
    userPrompt: "阅读交接文档，检查组件注册表，并准备这次发布。",
    workedFor: "工作了 2 分 04 秒",
    thoughtLabel: "思考了 8 秒",
    thought:
      "先验证注册表与类型检查，可以把风险更高的发布步骤留在一个明确的审批点之后。",
    searched: "搜索了发布说明",
    searchDetail: "3 个结果",
    responseLead: "已读取交接文档并完成发布前检查。",
    responseBody: "注册表完整，类型检查通过；我把发布说明和变更摘要整理在下面。",
    fileTitle: "RELEASE-NOTES.md",
    fileSubtitle: "发布说明 · Markdown",
    open: "打开",
    diffTitle: "修改了 3 个文件",
    undo: "撤销",
    review: "审阅",
    showMore: "再显示 1 个文件",
    commandVerb: "已运行",
    approvalTitle: "发布审批已确认",
    approvalDescription: "允许创建版本标签并推送构建产物。",
    approved: "已批准",
    copied: "复制回复",
    timestamp: "刚刚",
    processing: "正在处理…",
    cannedReply: "收到。我已记录这项后续工作，并把它加入当前发布清单。",
    project: "ui-components",
    local: "本地",
    branch: "main",
    attachment: "handoff.md",
    attachmentMeta: "12 KB",
    placeholder: "描述下一项工作…",
    messageLabel: "发消息",
    addFiles: "添加文件或上下文",
    addSection: "添加",
    attachHandoff: "附加交接文档",
    attachChecklist: "附加检查清单",
    access: "先询问",
    model: "Workbench 5.6",
    effortTitle: "推理力度",
    effortLabel: "选择推理力度",
    effort: ["极简", "低", "标准", "高", "最高"],
    send: "发送",
    artifactSubtitle: "发布说明",
    preview: "预览",
    code: "源码",
    copyMarkdown: "复制 Markdown",
    restore: "恢复此版本",
    updatedNow: "刚刚更新",
    artifactEyebrow: "组件实验室 · 0.6.0",
    artifactTitle: "设计系统工作台展示",
    highlightsTitle: "本次新增",
    checksTitle: "发布检查",
    artifactVersions: [
      {
        label: "草稿",
        intro: "设计系统页面已从版式复刻切换为完整 Agent 工作台。",
        highlights: ["新增可切换设计系统皮肤", "使用真实 Thread 与 Composer 组件"],
        checks: ["数据模型已接通"],
      },
      {
        label: "候选版",
        intro: "设计系统工作台已经具备完整任务线程、输入发送与可展开产物卡片。",
        highlights: [
          "三栏工作台支持拖拽与折叠",
          "消息发送约 2 秒后原地落定",
          "线框解剖图联动组件文档",
        ],
        checks: ["TypeScript 通过", "Biome lint 通过"],
      },
      {
        label: "准备发布",
        intro: "沉浸式 Agent 工作台展示已完成，六套皮肤共享同一套任务结构与交互。",
        highlights: [
          "完整 Agent 线程与上下文输入台",
          "产物预览 / Markdown 源码双视图",
          "五区块解剖图与 locale-aware 文档跳转",
        ],
        checks: ["TypeScript 通过", "Biome lint 通过", "Registry 校验通过"],
      },
    ],
  },
  en: {
    stageLabel: "Interactive Agent workbench",
    taskTitle: "Prepare the UI Lab release",
    toggleSidebar: "Toggle thread sidebar",
    togglePanel: "Toggle artifacts",
    searchThreads: "Search threads",
    workspace: "Design-system workspace",
    pinned: "Pinned",
    recent: "Recent",
    newThread: "New thread",
    pinThread: "Pin thread",
    deleteThread: "Delete thread",
    threads: [
      { id: "release", title: "Prepare the UI Lab release", meta: "now", unread: true },
      { id: "tokens", title: "Unify workbench color tokens", meta: "18m" },
      { id: "composer", title: "Finish composer attachments", meta: "2h" },
      { id: "docs", title: "Update Agent usage docs", meta: "yesterday" },
    ],
    userPrompt: "Read the handoff, check the component registry, and prepare this release.",
    workedFor: "Worked for 2m 04s",
    thoughtLabel: "Thought for 8s",
    thought:
      "Validating the registry and typecheck first keeps the riskier release step behind an explicit approval point.",
    searched: "Searched release notes",
    searchDetail: "3 results",
    responseLead: "I read the handoff and completed the pre-release checks.",
    responseBody: "The registry is complete and typecheck is green; I staged the release notes and change summary below.",
    fileTitle: "RELEASE-NOTES.md",
    fileSubtitle: "Release notes · Markdown",
    open: "Open",
    diffTitle: "Edited 3 files",
    undo: "Undo",
    review: "Review",
    showMore: "Show 1 more file",
    commandVerb: "Ran",
    approvalTitle: "Release approval resolved",
    approvalDescription: "Creating the version tag and publishing build artifacts was approved.",
    approved: "Approved",
    copied: "Copy response",
    timestamp: "just now",
    processing: "Processing…",
    cannedReply: "Got it. I recorded that follow-up and added it to the current release checklist.",
    project: "ui-components",
    local: "Local",
    branch: "main",
    attachment: "handoff.md",
    attachmentMeta: "12 KB",
    placeholder: "Describe the next task…",
    messageLabel: "Message",
    addFiles: "Add files or context",
    addSection: "Add",
    attachHandoff: "Attach handoff document",
    attachChecklist: "Attach release checklist",
    access: "Ask first",
    model: "Workbench 5.6",
    effortTitle: "Reasoning effort",
    effortLabel: "Select reasoning effort",
    effort: ["Minimal", "Low", "Standard", "High", "Max"],
    send: "Send",
    artifactSubtitle: "Release notes",
    preview: "Preview",
    code: "Code",
    copyMarkdown: "Copy Markdown",
    restore: "Restore this version",
    updatedNow: "Updated just now",
    artifactEyebrow: "UI Lab · 0.6.0",
    artifactTitle: "Design system workbench showcase",
    highlightsTitle: "What's new",
    checksTitle: "Release checks",
    artifactVersions: [
      {
        label: "Draft",
        intro: "The Design Systems page has moved from layout replicas to a complete Agent workbench.",
        highlights: ["Added switchable design-system skins", "Composed real Thread and Composer blocks"],
        checks: ["Data model wired"],
      },
      {
        label: "Release candidate",
        intro: "The design-system workbench now carries a complete task thread, simulated sending, and expandable artifact cards.",
        highlights: [
          "Resizable and collapsible three-pane workbench",
          "Messages settle in place after about two seconds",
          "Wireframe anatomy links to component docs",
        ],
        checks: ["TypeScript passed", "Biome lint passed"],
      },
      {
        label: "Ready to ship",
        intro: "The immersive Agent workbench showcase is complete, with one task structure and interaction model shared by all six skins.",
        highlights: [
          "Complete Agent thread and context-aware composer",
          "Artifact preview and raw Markdown views",
          "Five-part anatomy with locale-aware docs links",
        ],
        checks: ["TypeScript passed", "Biome lint passed", "Registry validation passed"],
      },
    ],
  },
} as const;

type StageCopy = (typeof COPY)[Locale];
type ArtifactReleaseCopy = StageCopy["artifactVersions"][number];

function buildArtifactMarkdown(copy: StageCopy, content: ArtifactReleaseCopy) {
  const highlights = content.highlights.map((item) => `- ${item}`).join("\n");
  const checks = content.checks.map((item) => `- ${item}`).join("\n");

  return `# ${copy.artifactTitle}

> ${content.label}

${content.intro}

## ${copy.highlightsTitle}

${highlights}

## ${copy.checksTitle}

${checks}`;
}

function highlightClass(active: AnatomyId | null, target: AnatomyId) {
  return cn(
    "transition-[background-color,box-shadow] duration-200",
    active === target &&
      "bg-[var(--wb-hover-subtle)] ring-2 ring-inset ring-[var(--wb-accent)]",
  );
}

function skinStyle(entry: DesignSystemEntry): CSSProperties {
  const fonts = entry.skin.fonts;
  const fontVars = {
    ...(fonts?.body ? { "--font-sans": fonts.body } : {}),
    ...(fonts?.display ? { "--font-display": fonts.display } : {}),
    ...(fonts?.mono ? { "--font-mono": fonts.mono } : {}),
  };

  return {
    ...entry.skin.vars,
    ...entry.skin.siteVars,
    ...fontVars,
    colorScheme: entry.skin.scheme === "auto" ? undefined : entry.skin.scheme,
    fontFamily: fonts?.body,
  } as CSSProperties;
}

function StageToolbar({ copy }: { copy: StageCopy }) {
  const { toggleSidebar, togglePanel } = useWorkbench();
  const iconButton =
    "flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-[var(--wb-hover)] hover:text-foreground";

  return (
    <WorkbenchHeader
      leading={
        <div className="flex items-center gap-2 pl-3">
          <button
            type="button"
            onClick={toggleSidebar}
            aria-label={copy.toggleSidebar}
            className={iconButton}
          >
            <PanelLeft className="h-4 w-4" />
          </button>
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-foreground text-[10px] font-bold text-background">
            G
          </span>
        </div>
      }
      trailing={
        <div className="flex items-center pr-3">
          <button
            type="button"
            onClick={togglePanel}
            aria-label={copy.togglePanel}
            className={iconButton}
          >
            <PanelRight className="h-4 w-4" />
          </button>
        </div>
      }
    >
      <div className="flex h-full min-w-0 items-center px-3">
        <span className="truncate text-xs font-medium text-secondary-foreground">
          {copy.taskTitle}
        </span>
      </div>
    </WorkbenchHeader>
  );
}

function CollapsedPaneHighlight({ active }: { active: AnatomyId | null }) {
  const { sidebarOpen, panelOpen } = useWorkbench();

  if (active === "sidebar" && !sidebarOpen) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 top-[46px] z-20 w-[22%] bg-[var(--wb-hover-subtle)] ring-2 ring-inset ring-[var(--wb-accent)]"
      />
    );
  }

  if (active === "panel" && !panelOpen) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 top-[46px] z-20 w-[24%] bg-[var(--wb-hover-subtle)] ring-2 ring-inset ring-[var(--wb-accent)]"
      />
    );
  }

  return null;
}

function SidebarContent({ copy, activeAnatomy }: { copy: StageCopy; activeAnatomy: AnatomyId | null }) {
  const [activeThread, setActiveThread] = useState("release");

  return (
    <div
      data-anatomy="sidebar"
      className={cn("flex min-h-full flex-col px-2 pb-4", highlightClass(activeAnatomy, "sidebar"))}
    >
      <div className="flex items-center justify-between px-2 pb-2 pt-3">
        <span className="text-sm font-semibold text-foreground">{copy.workspace}</span>
        <button
          type="button"
          aria-label={copy.searchThreads}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-[var(--wb-hover)] hover:text-foreground"
        >
          <Search className="h-4 w-4" />
        </button>
      </div>

      <ThreadList>
        <ThreadListSection title={copy.pinned}>
          <ThreadListItem
            active={activeThread === copy.threads[0].id}
            unread={copy.threads[0].unread}
            icon={<MessageSquare className="h-4 w-4" />}
            onSelect={() => setActiveThread(copy.threads[0].id)}
          >
            {copy.threads[0].title}
          </ThreadListItem>
        </ThreadListSection>

        <ThreadListSection
          title={copy.recent}
          action={
            <ThreadListAction aria-label={copy.newThread} onClick={() => {}}>
              <Plus className="h-3 w-3" />
            </ThreadListAction>
          }
        >
          {copy.threads.slice(1).map((thread) => (
            <ThreadListItem
              key={thread.id}
              active={activeThread === thread.id}
              meta={thread.meta}
              onSelect={() => setActiveThread(thread.id)}
              actions={
                <>
                  <ThreadListAction aria-label={copy.pinThread} onClick={() => {}}>
                    <Pin className="h-3 w-3" />
                  </ThreadListAction>
                  <ThreadListAction aria-label={copy.deleteThread} onClick={() => {}}>
                    <Trash2 className="h-3 w-3" />
                  </ThreadListAction>
                </>
              }
            >
              {thread.title}
            </ThreadListItem>
          ))}
        </ThreadListSection>
      </ThreadList>

      <div className="mt-auto flex items-center gap-2 px-2 pt-5 text-xs text-muted-foreground">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-foreground font-semibold text-background">
          UI
        </span>
        <span className="truncate">UI Lab</span>
      </div>
    </div>
  );
}

function ReleaseArtifactPanel({
  copy,
  activeAnatomy,
}: {
  copy: StageCopy;
  activeAnatomy: AnatomyId | null;
}) {
  const [view, setView] = useState<ArtifactView>("preview");
  const latestVersion = copy.artifactVersions.length;
  const [version, setVersion] = useState<number>(latestVersion);
  const content = copy.artifactVersions[version - 1];
  const markdown = buildArtifactMarkdown(copy, content);

  return (
    <div
      data-anatomy="panel"
      className={cn("h-full p-3", highlightClass(activeAnatomy, "panel"))}
    >
      <ArtifactPanel>
        <ArtifactHeader
          icon={<FileText className="h-4 w-4" />}
          title={copy.fileTitle}
          subtitle={`${copy.artifactSubtitle} · ${content.label}`}
          actions={
            <>
              <ArtifactViewToggle
                value={view}
                onChange={setView}
                previewLabel={copy.preview}
                codeLabel={copy.code}
              />
              <ArtifactAction
                aria-label={copy.copyMarkdown}
                onClick={() => navigator.clipboard.writeText(markdown)}
              >
                <Copy className="h-3.5 w-3.5" />
              </ArtifactAction>
            </>
          }
        />

        <ArtifactContent view={`${view}-${version}`}>
          {view === "preview" ? (
            <article className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  {copy.artifactEyebrow}
                </span>
                <span className="rounded-full bg-[var(--wb-inset-strong)] px-2 py-0.5 text-[10px] text-muted-foreground">
                  {content.label}
                </span>
              </div>
              <h2 className="mt-4 font-display [font-family:var(--font-display)] text-xl font-semibold tracking-tight text-foreground">
                {copy.artifactTitle}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{content.intro}</p>

              <div className="mt-6 border-[var(--wb-divider)] border-t pt-5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary-foreground">
                  {copy.highlightsTitle}
                </h3>
                <div className="mt-3 flex flex-col gap-2.5">
                  {content.highlights.map((highlight) => (
                    <div key={highlight} className="flex items-start gap-2 text-sm text-foreground/85">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--wb-accent)]" />
                      <span className="leading-5">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-[var(--wb-inset-subtle)] p-3.5">
                <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary-foreground">
                  {copy.checksTitle}
                </h3>
                <div className="mt-3 flex flex-col gap-2">
                  {content.checks.map((check) => (
                    <div key={check} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3.5 w-3.5 text-[var(--wb-success)]" />
                      <span>{check}</span>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ) : (
            <pre className="m-0 min-h-full whitespace-pre-wrap p-4 font-mono [font-family:var(--font-mono)] text-[12px] leading-5 text-foreground/85">
              <code>{markdown}</code>
            </pre>
          )}
        </ArtifactContent>

        <div className="flex h-10 shrink-0 items-center justify-between border-[var(--wb-divider)] border-t-[0.5px] px-3">
          <ArtifactVersionNav
            index={version}
            count={copy.artifactVersions.length}
            onPrev={() => setVersion((current) => (current > 1 ? current - 1 : current))}
            onNext={() =>
              setVersion((current) =>
                current < latestVersion ? current + 1 : current,
              )
            }
            onRestore={version < latestVersion ? () => setVersion(latestVersion) : undefined}
            restoreLabel={copy.restore}
          />
          <span
            className="text-[10px]"
            style={{ color: "var(--faint-foreground, var(--muted-foreground))" }}
          >
            {copy.updatedNow}
          </span>
        </div>
      </ArtifactPanel>
    </div>
  );
}

/** A real, resizable three-pane workbench with a finished scenario and repeatable simulated sends. */
export function WorkbenchStage({ entry, activeAnatomy, className }: WorkbenchStageProps) {
  const locale = useLocale() as Locale;
  const copy = COPY[locale];
  const reduce = useReducedMotion() ?? false;
  const [draft, setDraft] = useState("");
  const [effort, setEffort] = useState(3);
  const [modelOpen, setModelOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [turnOpen, setTurnOpen] = useState(true);
  const [thoughtOpen, setThoughtOpen] = useState(true);
  const [messages, setMessages] = useState<SubmittedMessage[]>([]);
  const [attachments, setAttachments] = useState<Attachment[]>([
    { id: "handoff", name: copy.attachment, meta: copy.attachmentMeta },
  ]);
  const messageIdRef = useRef(0);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const threadEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      for (const timer of timersRef.current.values()) clearTimeout(timer);
      timersRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    const frame = requestAnimationFrame(() => {
      threadEndRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "end" });
    });
    return () => cancelAnimationFrame(frame);
  }, [messages, reduce]);

  const handleSend = () => {
    const prompt = draft.trim();
    if (!prompt) return;

    messageIdRef.current += 1;
    const id = messageIdRef.current;
    setMessages((current) => [...current, { id, prompt, status: "processing" }]);
    setDraft("");

    const timer = setTimeout(() => {
      setMessages((current) =>
        current.map((message) =>
          message.id === id ? { ...message, status: "done" } : message,
        ),
      );
      timersRef.current.delete(id);
    }, 2000);
    timersRef.current.set(id, timer);
  };

  const addAttachment = (attachment: Attachment) => {
    setAttachments((current) =>
      current.some((item) => item.id === attachment.id) ? current : [...current, attachment],
    );
    setAddOpen(false);
  };

  return (
    <section aria-label={copy.stageLabel} className={cn("min-w-0", className)}>
      <div
        data-workbench-scheme={entry.skin.scheme}
        style={skinStyle(entry)}
        className={cn(
          "overflow-hidden rounded-3xl border border-border bg-background text-foreground shadow-sm",
          entry.skin.scheme === "dark" && "dark",
        )}
      >
        <div className="flex h-10 items-center gap-2 border-b border-border bg-card/50 px-4">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </span>
          <span className="mx-auto max-w-[60%] truncate rounded-md bg-background/70 px-4 py-0.5 font-mono [font-family:var(--font-mono)] text-[11px] text-muted-foreground">
            ui-lab://workbench
          </span>
          <span className="w-[42px]" aria-hidden="true" />
        </div>

        <div className="h-[720px] min-h-0 bg-background text-foreground">
          <Workbench
            defaultSidebarOpen
            panelOpen={panelOpen}
            onPanelOpenChange={setPanelOpen}
            defaultSidebarWidth={250}
            defaultPanelWidth={340}
          >
            <div
              data-anatomy="header"
              className={cn(
                "pointer-events-none absolute inset-x-0 top-0 z-30 h-[46px]",
                highlightClass(activeAnatomy, "header"),
              )}
            >
              <StageToolbar copy={copy} />
            </div>

            <CollapsedPaneHighlight active={activeAnatomy} />

            <WorkbenchSidebar>
              <SidebarContent copy={copy} activeAnatomy={activeAnatomy} />
            </WorkbenchSidebar>

            <WorkbenchMain>
              <div
                data-anatomy="thread"
                className={cn(
                  "min-h-0 flex-1 overflow-y-auto py-5",
                  highlightClass(activeAnatomy, "thread"),
                )}
              >
                <Thread>
                  <ThreadUserMessage>{copy.userPrompt}</ThreadUserMessage>

                  <div className="group/turn flex flex-col pb-2">
                    <ThreadTurnHeader open={turnOpen} onOpenChange={setTurnOpen}>
                      {copy.workedFor}
                    </ThreadTurnHeader>
                    <ThreadCollapse open={turnOpen}>
                      <ThreadThinking
                        label={copy.thoughtLabel}
                        open={thoughtOpen}
                        onOpenChange={setThoughtOpen}
                      >
                        {copy.thought}
                      </ThreadThinking>
                      <ThreadToolCall
                        icon={<Globe className="h-4 w-4" />}
                        detail={
                          <span className="font-mono [font-family:var(--font-mono)] text-[12px]">
                            {copy.searchDetail}
                          </span>
                        }
                        elapsed="0.4s"
                      >
                        {copy.searched}
                      </ThreadToolCall>
                    </ThreadCollapse>

                    <ThreadMessage>
                      <p>{copy.responseLead}</p>
                      <p>{copy.responseBody}</p>
                    </ThreadMessage>

                    <ThreadFileCard
                      icon={<FileText className="h-6 w-6" />}
                      title={copy.fileTitle}
                      subtitle={copy.fileSubtitle}
                      action={
                        <ThreadCardButton onClick={() => setPanelOpen(true)}>
                          {copy.open}
                        </ThreadCardButton>
                      }
                    />

                    <ThreadDiffCard
                      icon={<SquarePen className="h-5 w-5" />}
                      title={copy.diffTitle}
                      added={34}
                      removed={7}
                      actions={
                        <>
                          <ThreadCardButton variant="ghost">{copy.undo}</ThreadCardButton>
                          <ThreadCardButton>{copy.review}</ThreadCardButton>
                        </>
                      }
                      moreLabel={copy.showMore}
                      moreCount={1}
                      hiddenRows={
                        <ThreadDiffRow
                          path="messages/en.json"
                          added={8}
                          removed={2}
                          className="font-mono [font-family:var(--font-mono)]"
                        />
                      }
                    >
                      <ThreadDiffRow
                        path="components/app/layouts/workbench-stage.tsx"
                        added={24}
                        removed={3}
                        className="font-mono [font-family:var(--font-mono)]"
                      />
                      <ThreadDiffRow
                        path="messages/zh.json"
                        added={2}
                        removed={2}
                        className="font-mono [font-family:var(--font-mono)]"
                      />
                    </ThreadDiffCard>

                    <ThreadCommandRow
                      icon={<SquareTerminal className="h-4 w-4" />}
                      className="font-mono [font-family:var(--font-mono)]"
                    >
                      {copy.commandVerb}{" "}
                      <ThreadInlineCode className="[font-family:var(--font-mono)]">
                        bun run check
                      </ThreadInlineCode>
                    </ThreadCommandRow>

                    <ThreadApprovalCard
                      icon={<ShieldCheck className="h-5 w-5" />}
                      title={copy.approvalTitle}
                      description={copy.approvalDescription}
                      command="git tag v0.6.0"
                      status="approved"
                      resolution={
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {copy.approved}
                        </span>
                      }
                    />

                    <ThreadActionBar timestamp={copy.timestamp}>
                      <ThreadActionButton aria-label={copy.copied}>
                        <Copy className="h-3.5 w-3.5" />
                      </ThreadActionButton>
                    </ThreadActionBar>
                  </div>

                  {messages.map((message) => (
                    <ThreadItem key={message.id}>
                      <ThreadUserMessage>{message.prompt}</ThreadUserMessage>
                      {message.status === "processing" ? (
                        <div className="py-2 text-sm">
                          <ThreadShimmerText>{copy.processing}</ThreadShimmerText>
                        </div>
                      ) : (
                        <div className="group/turn flex flex-col">
                          <ThreadMessage>{copy.cannedReply}</ThreadMessage>
                          <ThreadActionBar timestamp={copy.timestamp}>
                            <ThreadActionButton aria-label={copy.copied}>
                              <Copy className="h-3.5 w-3.5" />
                            </ThreadActionButton>
                          </ThreadActionBar>
                        </div>
                      )}
                    </ThreadItem>
                  ))}
                  <div ref={threadEndRef} />
                </Thread>
              </div>

              <div
                data-anatomy="composer"
                className={cn(
                  "shrink-0 px-4 pb-4 pt-2",
                  highlightClass(activeAnatomy, "composer"),
                )}
              >
                <div className="mx-auto max-w-3xl">
                  <ComposerContextBar className="overflow-x-auto">
                    <ComposerChip icon={<FolderGit2 className="h-4 w-4" />}>
                      {copy.project}
                    </ComposerChip>
                    <ComposerChip icon={<Laptop className="h-4 w-4" />}>{copy.local}</ComposerChip>
                    <ComposerChip icon={<GitBranch className="h-4 w-4" />}>
                      {copy.branch}
                    </ComposerChip>
                  </ComposerContextBar>
                  <Composer>
                    {attachments.length > 0 ? (
                      <ComposerAttachments>
                        <AnimatePresence>
                          {attachments.map((attachment) => (
                            <ComposerAttachmentChip
                              key={attachment.id}
                              icon={<FileText className="h-3.5 w-3.5" />}
                              name={attachment.name}
                              meta={attachment.meta}
                              onRemove={() =>
                                setAttachments((current) =>
                                  current.filter((item) => item.id !== attachment.id),
                                )
                              }
                            />
                          ))}
                        </AnimatePresence>
                      </ComposerAttachments>
                    ) : null}
                    <ComposerTextarea
                      value={draft}
                      onChange={setDraft}
                      onSubmit={handleSend}
                      placeholder={copy.placeholder}
                      aria-label={copy.messageLabel}
                    />
                    <ComposerToolbar>
                      <ComposerMenuButton
                        icon={<Plus className="h-4 w-4" />}
                        aria-label={copy.addFiles}
                        open={addOpen}
                        onOpenChange={setAddOpen}
                      >
                        <ComposerMenuSection title={copy.addSection}>
                          <ComposerMenuItem
                            icon={<Paperclip className="h-4 w-4" />}
                            onSelect={() =>
                              addAttachment({
                                id: "handoff",
                                name: copy.attachment,
                                meta: copy.attachmentMeta,
                              })
                            }
                          >
                            {copy.attachHandoff}
                          </ComposerMenuItem>
                          <ComposerMenuItem
                            icon={<FileText className="h-4 w-4" />}
                            onSelect={() =>
                              addAttachment({
                                id: "checklist",
                                name: "release-checklist.md",
                                meta: "8 KB",
                              })
                            }
                          >
                            {copy.attachChecklist}
                          </ComposerMenuItem>
                        </ComposerMenuSection>
                      </ComposerMenuButton>
                      <ComposerAccessChip icon={<ShieldCheck className="h-4 w-4" />} tone="default">
                        {copy.access}
                      </ComposerAccessChip>
                      <div className="ml-auto" />
                      <ComposerModelPicker
                        label={`${copy.model} · ${copy.effort[effort]}`}
                        open={modelOpen}
                        onOpenChange={setModelOpen}
                      >
                        <div className="flex items-center justify-between px-2 pt-1 text-xs text-muted-foreground">
                          <span>{copy.effortTitle}</span>
                          <Zap className="h-3.5 w-3.5" />
                        </div>
                        <div className="px-2 pb-2 pt-1">
                          <ComposerEffortSlider
                            value={effort}
                            onChange={setEffort}
                            labels={[...copy.effort]}
                            aria-label={copy.effortLabel}
                          />
                        </div>
                      </ComposerModelPicker>
                      <ComposerSendButton
                        disabled={draft.trim().length === 0}
                        onClick={handleSend}
                        aria-label={copy.send}
                      />
                    </ComposerToolbar>
                  </Composer>
                </div>
              </div>
            </WorkbenchMain>

            <WorkbenchPanel>
              <ReleaseArtifactPanel copy={copy} activeAnatomy={activeAnatomy} />
            </WorkbenchPanel>
          </Workbench>
        </div>
      </div>
    </section>
  );
}
