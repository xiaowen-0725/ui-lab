"use client";

import {
  Activity,
  Blocks,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  FileText,
  Gauge,
  Image as ImageIcon,
  LayoutDashboard,
  ListChecks,
  MessageSquareText,
  MessagesSquare,
  PanelLeft,
  PanelRight,
  Plus,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  SquarePen,
} from "lucide-react";
import { MotionConfig } from "motion/react";
import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Composer,
  ComposerAccessChip,
  ComposerIconButton,
  ComposerSendButton,
  ComposerTextarea,
  ComposerToolbar,
} from "@/components/motion/agent-composer";
import {
  AgentInbox,
  InboxItem,
} from "@/components/motion/agent-inbox";
import {
  Thread,
  ThreadApprovalCard,
  ThreadCardButton,
  ThreadDiffCard,
  ThreadDiffRow,
  ThreadErrorState,
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
} from "@/components/motion/agent-workbench";
import {
  ArtifactAction,
  ArtifactContent,
  ArtifactHeader,
  ArtifactPanel,
} from "@/components/motion/artifact-panel";
import {
  SettingsGroup,
  SettingsRow,
  SettingsSelectButton,
} from "@/components/motion/settings-panel";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/motion/tabs";
import {
  ThreadList,
  ThreadListItem,
  ThreadListSection,
} from "@/components/motion/thread-list";
import type { ParkingPreviewScenario } from "@/lib/system-presets/parking-preview";
import {
  DEFAULT_PARKING_PREVIEW_CONFIGURATION,
  type ParkingPreviewCapability,
  type ParkingPreviewConfiguration,
} from "@/lib/system-presets/parking-preview-config";
import { CODEX_DESKTOP_THEME_KIT } from "@/lib/theme-kits/codex-desktop";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    __UILAB_PREVIEW_READY__?: boolean;
  }
}

type PreviewStyle = CSSProperties & Record<`--${string}`, string>;

const ICON_BUTTON =
  "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-[var(--wb-hover)] hover:text-foreground";

const previewSystemCopy = {
  zh: {
    toggleTaskNavigation: "切换任务导航",
    back: "后退",
    forward: "前进",
    search: "搜索",
    toggleDetailPanel: "切换详情面板",
    taskHistory: "任务历史",
    newTask: "新建任务",
    parkingOperations: "停车运营",
    scheduled: "计划任务",
    pendingApprovals: "待审批",
    sessions: "会话",
    currentTasks: "当前任务",
    recent: "最近",
    current: "当前",
    taskMessage: "任务消息",
    addContext: "添加上下文",
    controlledAccess: "受控访问",
    defaultComposerPlaceholder: "描述下一步停车运营核验…",
    fixedStreamingSnapshot: "固定流式快照",
    worked: "处理了 2 分 4 秒",
    working: "处理中…",
    thought: "思考了 8 秒",
    thinking: "正在思考…",
    thinkingSummary: "已按停车记录、设备状态和授权范围完成交叉核验。",
    resultSummary: "核验了 3 项结果",
    reviewResults: "查看详情",
    approvalTitle: "需要人工批准",
    allow: "允许",
    deny: "拒绝",
    retry: "重试",
    verifyArtifact: "核验产物",
    overview: "运营概览",
    confirmations: "待确认",
    runtime: "运行时",
    bindings: "绑定",
    connectorRuntime: "连接器运行时",
    currentRuntime: "当前运行时",
    connectorDescription: "停车服务数据连接",
    executionAuthorization: "执行授权",
    authorizationMode: "执行授权模式",
    humanConfirmation: "人工确认",
    connectors: "连接器",
    connectorSettings: "连接器设置",
    reducedMotion: "减少动态效果",
    reducedMotionDescription: "截图与辅助功能使用固定状态。",
    on: "开启",
    off: "关闭",
    excludedCapability: "本订单未包含此能力",
  },
  en: {
    toggleTaskNavigation: "Toggle task navigation",
    back: "Back",
    forward: "Forward",
    search: "Search",
    toggleDetailPanel: "Toggle detail panel",
    taskHistory: "Task history",
    newTask: "New task",
    parkingOperations: "Parking operations",
    scheduled: "Scheduled",
    pendingApprovals: "Pending approvals",
    sessions: "Sessions",
    currentTasks: "Current tasks",
    recent: "Recent",
    current: "Current",
    taskMessage: "Task message",
    addContext: "Add context",
    controlledAccess: "Controlled access",
    defaultComposerPlaceholder: "Describe the next parking operations check…",
    fixedStreamingSnapshot: "Fixed streaming snapshot",
    worked: "Worked for 2m 4s",
    working: "Working…",
    thought: "Thought for 8s",
    thinking: "Thinking…",
    thinkingSummary:
      "Cross-checked parking records, device status, and authorization scope.",
    resultSummary: "Verified 3 results",
    reviewResults: "Review",
    approvalTitle: "Human approval required",
    allow: "Allow",
    deny: "Deny",
    retry: "Retry",
    verifyArtifact: "Verify artifact",
    overview: "Operations overview",
    confirmations: "Confirmations",
    runtime: "Runtime",
    bindings: "Bindings",
    connectorRuntime: "Connector runtime",
    currentRuntime: "Current runtime",
    connectorDescription: "Parking service data connection",
    executionAuthorization: "Execution authorization",
    authorizationMode: "Authorization mode",
    humanConfirmation: "Human confirmation",
    connectors: "Connectors",
    connectorSettings: "Connector settings",
    reducedMotion: "Reduced motion",
    reducedMotionDescription: "Captures and assistive technology use a fixed state.",
    on: "On",
    off: "Off",
    excludedCapability: "This capability is not included in the order",
  },
} as const;

function systemCopy(activeLocale: string) {
  return activeLocale.toLowerCase().startsWith("en")
    ? previewSystemCopy.en
    : previewSystemCopy.zh;
}

function themeStyle(theme: "light" | "dark"): PreviewStyle {
  const tokenSet =
    theme === "dark"
      ? CODEX_DESKTOP_THEME_KIT.dark
      : CODEX_DESKTOP_THEME_KIT.light;
  if (!tokenSet) {
    throw new Error(`Codex Desktop Theme Kit has no ${theme} mode.`);
  }

  const tokens = {
    ...tokenSet.shadcn,
    ...tokenSet.wb,
    ...tokenSet.charts,
    ...tokenSet.extra,
    ...CODEX_DESKTOP_THEME_KIT.statics,
  };
  const variables = Object.fromEntries(
    Object.entries(tokens).map(([key, value]) => [`--${key}`, value]),
  ) as Record<`--${string}`, string>;

  return {
    ...variables,
    colorScheme: theme,
    color: "var(--foreground)",
    backgroundColor: "var(--wb-surface)",
    fontFamily: CODEX_DESKTOP_THEME_KIT.fonts.body,
  };
}

function useCaptureReadiness(
  caseId: string,
  viewport: ParkingPreviewScenario["referenceCase"]["viewport"],
) {
  const [ready, setReady] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (caseId.length === 0) return;

    let active = true;
    let scheduledFrame: number | undefined;

    setReady(false);
    window.__UILAB_PREVIEW_READY__ = false;

    const expectedLayout = {
      wide: "desktop",
      collapse: "tablet",
      narrow: "mobile",
    }[viewport];
    const layoutMatches = () =>
      previewRef.current
        ?.querySelector<HTMLElement>("[data-layout-mode]")
        ?.getAttribute("data-layout-mode") === expectedLayout;
    const waitForStableLayout = () => {
      if (!active) return;
      if (!layoutMatches()) {
        scheduledFrame = window.requestAnimationFrame(waitForStableLayout);
        return;
      }
      scheduledFrame = window.requestAnimationFrame(() => {
        if (!active) return;
        if (!layoutMatches()) {
          waitForStableLayout();
          return;
        }
        scheduledFrame = window.requestAnimationFrame(() => {
          if (!active) return;
          if (!layoutMatches()) {
            waitForStableLayout();
            return;
          }
          setReady(true);
          window.__UILAB_PREVIEW_READY__ = true;
        });
      });
    };

    const fontsReady = document.fonts?.ready ?? Promise.resolve();
    void fontsReady.then(waitForStableLayout);

    return () => {
      active = false;
      if (scheduledFrame !== undefined) {
        window.cancelAnimationFrame(scheduledFrame);
      }
      window.__UILAB_PREVIEW_READY__ = false;
    };
  }, [caseId, viewport]);

  return { previewRef, ready };
}

function PreviewToolbar({
  scenario,
  hasPanel,
  configuration,
}: {
  scenario: ParkingPreviewScenario;
  hasPanel: boolean;
  configuration: ParkingPreviewConfiguration;
}) {
  const { togglePanel, toggleSidebar } = useWorkbench();
  const { fixture, referenceCase } = scenario;
  const copy = systemCopy(configuration.activeLocale);

  const title = referenceCase.surfaces.includes("board")
    ? fixture.board.title
    : referenceCase.surfaces.includes("connectors")
      ? fixture.settings.overlay
      : referenceCase.surfaces.includes("settings")
        ? fixture.settings.overlay
        : fixture.taskHistory.current;

  return (
    <WorkbenchHeader
      leading={
        <div className="flex h-full items-center gap-1 border-[var(--wb-border-subtle)] border-r px-2">
          {configuration.platformChrome === "native" ? (
            <>
              <span
                aria-hidden
                data-testid="parking-native-window-controls"
                className="mr-1 flex items-center gap-1.5 px-0.5"
              >
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              </span>
              <button type="button" aria-label={copy.back} className={ICON_BUTTON}>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button type="button" aria-label={copy.forward} className={ICON_BUTTON}>
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          ) : null}
          <button
            type="button"
            aria-label={copy.toggleTaskNavigation}
            className={ICON_BUTTON}
            onClick={toggleSidebar}
          >
            <PanelLeft className="h-4 w-4" />
          </button>
          {configuration.logoReference ? (
            <span
              role="img"
              aria-label={`Logo reference: ${configuration.logoReference}`}
              title={configuration.logoReference}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[var(--wb-control-hairline)] text-muted-foreground"
            >
              <ImageIcon aria-hidden className="h-3.5 w-3.5" />
            </span>
          ) : null}
          <span
            className="hidden text-xs font-semibold sm:inline"
          >
            {configuration.productName}
          </span>
        </div>
      }
      trailing={
        <div className="flex h-full items-center gap-1 px-2">
          <button
            type="button"
            aria-label={copy.search}
            className={ICON_BUTTON}
          >
            <Search className="h-4 w-4" />
          </button>
          {hasPanel ? (
            <button
              type="button"
              aria-label={copy.toggleDetailPanel}
              className={ICON_BUTTON}
              onClick={togglePanel}
            >
              <PanelRight className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      }
    >
      <div className="flex h-full min-w-0 items-center px-3">
        <span className="truncate text-sm font-medium">{title}</span>
        <span
          title={`${referenceCase.viewport} · ${configuration.platformChrome}`}
          className="ml-2 rounded-full bg-[var(--wb-inset)] px-2 py-0.5 text-[11px] text-muted-foreground"
        >
          {referenceCase.viewport}
        </span>
        <span className="ml-1 rounded-full border border-[var(--wb-control-hairline)] px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
          {configuration.activeLocale.toUpperCase()}
        </span>
      </div>
    </WorkbenchHeader>
  );
}

function TaskHistory({
  scenario,
  configuration,
}: {
  scenario: ParkingPreviewScenario;
  configuration: ParkingPreviewConfiguration;
}) {
  const { fixture } = scenario;
  const copy = systemCopy(configuration.activeLocale);

  return (
    <nav aria-label={copy.taskHistory} className="px-2 py-3">
      <div className="flex items-center justify-between px-2 pb-2">
        <span className="text-sm font-semibold">
          {configuration.productNameOverride ??
          configuration.productName !==
            DEFAULT_PARKING_PREVIEW_CONFIGURATION.productName
            ? configuration.productName
            : copy.parkingOperations}
        </span>
        <button type="button" aria-label={copy.newTask} className={ICON_BUTTON}>
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <div data-sidebar-section="workspace" className="mb-4">
        <ul className="flex flex-col gap-0.5">
          {[
            { label: copy.newTask, icon: SquarePen },
            { label: copy.scheduled, icon: CalendarClock },
            { label: copy.pendingApprovals, icon: ClipboardCheck },
            { label: copy.sessions, icon: MessagesSquare },
          ].map(({ label, icon: Icon }) => (
            <li key={label}>
              <button
                type="button"
                className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-[13px] text-muted-foreground transition-colors hover:bg-[var(--wb-hover-subtle)] hover:text-foreground"
              >
                <Icon aria-hidden className="h-4 w-4 shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div data-sidebar-section="tasks">
        <ThreadList>
          <ThreadListSection title={copy.currentTasks}>
            <ThreadListItem
              active
              icon={<MessageSquareText className="h-4 w-4" />}
              meta={copy.current}
            >
              {fixture.taskHistory.current}
            </ThreadListItem>
          </ThreadListSection>
          <ThreadListSection title={copy.recent}>
            {fixture.taskHistory.history.map((title, index) => (
              <ThreadListItem
                key={title}
                icon={<ListChecks className="h-4 w-4" />}
                meta={`0${index + 1}`}
              >
                {title}
              </ThreadListItem>
            ))}
          </ThreadListSection>
        </ThreadList>
      </div>
    </nav>
  );
}

function PreviewComposer({
  configuration,
}: {
  configuration: ParkingPreviewConfiguration;
}) {
  const [draft, setDraft] = useState("");
  const copy = systemCopy(configuration.activeLocale);
  const composerPlaceholder =
    configuration.composerPlaceholder ===
      DEFAULT_PARKING_PREVIEW_CONFIGURATION.composerPlaceholder &&
    configuration.activeLocale.toLowerCase().startsWith("en")
      ? copy.defaultComposerPlaceholder
      : configuration.composerPlaceholder;

  return (
    <div className="mx-auto w-full max-w-3xl shrink-0 px-4 pb-4">
      <Composer>
        <ComposerTextarea
          value={draft}
          onChange={setDraft}
          aria-label={copy.taskMessage}
          placeholder={composerPlaceholder}
        />
        <ComposerToolbar>
          <ComposerIconButton aria-label={copy.addContext}>
            <Plus className="h-4 w-4" />
          </ComposerIconButton>
          <ComposerAccessChip icon={<ShieldCheck className="h-4 w-4" />}>
            {copy.controlledAccess}
          </ComposerAccessChip>
          <div className="ml-auto" />
          <ComposerSendButton disabled={draft.trim().length === 0} />
        </ComposerToolbar>
      </Composer>
    </div>
  );
}

function TaskSurface({
  scenario,
  configuration,
}: {
  scenario: ParkingPreviewScenario;
  configuration: ParkingPreviewConfiguration;
}) {
  const { fixture, referenceCase } = scenario;
  const streaming = referenceCase.states.includes("streaming");
  const approval = referenceCase.states.includes("approval");
  const error = referenceCase.states.includes("error");
  const empty = referenceCase.states.includes("empty");
  const copy = systemCopy(configuration.activeLocale);

  if (empty) {
    return (
      <section
        data-preview-surface="task"
        data-preview-state="empty"
        className="flex min-h-0 flex-1 flex-col"
      >
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--wb-inset)] text-muted-foreground">
            <MessageSquareText className="h-5 w-5" />
          </span>
          <h1 className="text-base font-semibold">{fixture.empty.title}</h1>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            {fixture.empty.description}
          </p>
        </div>
        <PreviewComposer configuration={configuration} />
      </section>
    );
  }

  return (
    <section
      data-preview-surface="task"
      data-preview-state={referenceCase.states.join(" ")}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="min-h-0 flex-1 overflow-y-auto py-4">
        <Thread className="text-sm">
          <ThreadUserMessage>{fixture.conversation.user}</ThreadUserMessage>
          <div
            data-testid="parking-task-flow"
            className="group/turn flex flex-col py-1"
          >
            <ThreadTurnHeader
              working={streaming}
              className="my-1 text-xs"
            >
              {streaming ? copy.working : copy.worked}
            </ThreadTurnHeader>
            <ThreadThinking
              thinking={streaming}
              label={streaming ? copy.thinking : copy.thought}
              className="text-xs"
            >
              {copy.thinkingSummary}
            </ThreadThinking>

            <div
              data-testid={streaming ? "parking-static-streaming-state" : undefined}
              data-state={streaming ? "streaming" : "complete"}
              className="my-1 border-[var(--wb-divider)] border-y-[0.5px] py-1.5"
            >
              {streaming ? (
                <div className="mb-0.5 text-[11px] font-medium text-muted-foreground">
                  {copy.fixedStreamingSnapshot}
                </div>
              ) : null}
              {fixture.conversation.toolStreaming.map((label, index) => (
                <ThreadToolCall
                  key={label}
                  status={
                    streaming &&
                    index === fixture.conversation.toolStreaming.length - 1
                      ? "running"
                      : "done"
                  }
                  icon={<Activity className="h-4 w-4" />}
                  elapsed={`${index + 1}s`}
                  className="text-[13px]"
                >
                  {label}
                </ThreadToolCall>
              ))}
            </div>

            <ThreadMessage streaming={streaming} className="py-1">
              <p>{fixture.conversation.assistant}</p>
              {!streaming ? <p>{fixture.artifact.summary}</p> : null}
            </ThreadMessage>

            {approval ? (
              <ThreadApprovalCard
                icon={<ShieldCheck className="h-5 w-5" />}
                title={copy.approvalTitle}
                description={fixture.conversation.approval}
                command={`approval:${fixture.ids.approval}`}
                approveLabel={copy.allow}
                denyLabel={copy.deny}
              />
            ) : null}

            {error ? (
              <ThreadErrorState
                message={fixture.conversation.recoverableError}
                onRetry={() => {}}
                retryLabel={copy.retry}
              />
            ) : null}

            {!streaming && !approval && !error ? (
              <div data-testid="parking-result-summary">
                <ThreadDiffCard
                  icon={<ClipboardCheck className="h-5 w-5" />}
                  title={copy.resultSummary}
                  added={fixture.conversation.toolStreaming.length}
                  removed={0}
                  actions={
                    <ThreadCardButton>{copy.reviewResults}</ThreadCardButton>
                  }
                  className="mt-1"
                >
                  {fixture.conversation.toolStreaming.map((label) => (
                    <ThreadDiffRow key={label} added={1} removed={0}>
                      <span data-parking-result-row="true">{label}</span>
                    </ThreadDiffRow>
                  ))}
                </ThreadDiffCard>
              </div>
            ) : null}
          </div>
        </Thread>
      </div>
      <PreviewComposer configuration={configuration} />
    </section>
  );
}

function ArtifactSurface({
  scenario,
  configuration,
}: {
  scenario: ParkingPreviewScenario;
  configuration: ParkingPreviewConfiguration;
}) {
  const { fixture, referenceCase } = scenario;
  const copy = systemCopy(configuration.activeLocale);

  return (
    <section
      data-preview-surface="artifact"
      className="h-full min-h-[320px] p-3"
    >
      <ArtifactPanel>
        <ArtifactHeader
          icon={<FileText className="h-4 w-4" />}
          title={fixture.artifact.title}
          subtitle={fixture.ids.artifact}
          actions={
            <ArtifactAction aria-label={copy.verifyArtifact}>
              <CheckCircle2 className="h-4 w-4" />
            </ArtifactAction>
          }
        />
        <ArtifactContent className="p-4">
          <p className="text-sm leading-6">{fixture.artifact.summary}</p>
          {referenceCase.states.includes("approval") ? (
            <ThreadApprovalCard
              className="mt-4"
              icon={<ShieldCheck className="h-5 w-5" />}
              title={copy.approvalTitle}
              description={fixture.conversation.approval}
              command={`approval:${fixture.ids.approval}`}
              approveLabel={copy.allow}
              denyLabel={copy.deny}
            />
          ) : null}
          <div className="mt-4 flex flex-col gap-2">
            {fixture.conversation.toolStreaming.map((source, index) => (
              <div
                key={source}
                className="flex items-center gap-2 rounded-lg bg-[var(--wb-inset-faint)] px-3 py-2 text-sm"
              >
                <span className="font-mono text-xs text-muted-foreground">
                  0{index + 1}
                </span>
                <span>{source}</span>
                <CheckCircle2 className="ml-auto h-4 w-4 text-[var(--wb-success)]" />
              </div>
            ))}
          </div>
          {referenceCase.states.includes("error") ? (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-[var(--wb-danger-surface)]/30 px-3 py-2 text-sm">
              <CircleAlert className="mt-0.5 h-4 w-4 text-[var(--wb-danger)]" />
              <span>{fixture.conversation.recoverableError}</span>
            </div>
          ) : null}
        </ArtifactContent>
      </ArtifactPanel>
    </section>
  );
}

function BoardSurface({
  scenario,
  configuration,
}: {
  scenario: ParkingPreviewScenario;
  configuration: ParkingPreviewConfiguration;
}) {
  const { fixture, referenceCase } = scenario;
  const copy = systemCopy(configuration.activeLocale);
  const focusTargetRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (referenceCase.keyboardFocus) focusTargetRef.current?.focus();
  }, [referenceCase.keyboardFocus]);

  return (
    <section
      data-preview-surface="board"
      className="min-h-0 flex-1 overflow-y-auto px-5 py-4"
    >
      <div className="mx-auto max-w-4xl">
        <button
          ref={focusTargetRef}
          type="button"
          data-testid="parking-board-focus-target"
          data-keyboard-focus={String(referenceCase.keyboardFocus)}
          className={cn(
            "mb-4 flex h-9 items-center gap-2 rounded-lg px-2 text-sm font-semibold outline-none",
            referenceCase.keyboardFocus &&
              "ring-2 ring-[var(--wb-accent)] ring-offset-2 ring-offset-[var(--wb-surface)]",
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          {fixture.board.title}
        </button>
        <Tabs defaultValue="overview" variant="underline">
          <TabsList>
            <TabsTrigger value="overview">{copy.overview}</TabsTrigger>
            <TabsTrigger value="confirmations">{copy.confirmations}</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="pt-4">
            <AgentInbox title={fixture.board.title} count={fixture.board.widgets.length}>
              {fixture.board.widgets.map((widget, index) => (
                <InboxItem
                  key={widget}
                  icon={
                    index === 0 ? (
                      <Gauge className="h-4 w-4" />
                    ) : index === 1 ? (
                      <Activity className="h-4 w-4" />
                    ) : (
                      <ListChecks className="h-4 w-4" />
                    )
                  }
                  source="Parking Ops"
                  title={widget}
                  description={`来自 ${fixture.ids.board} 的固定核验视图`}
                  risk={index === 2 ? "medium" : "low"}
                  status="approved"
                  resolution="已载入"
                />
              ))}
            </AgentInbox>
          </TabsContent>
          <TabsContent value="confirmations" className="pt-4">
            <p className="text-sm text-muted-foreground">
              {fixture.artifact.summary}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function ConnectorsSurface({
  scenario,
  configuration,
}: {
  scenario: ParkingPreviewScenario;
  configuration: ParkingPreviewConfiguration;
}) {
  const { fixture } = scenario;
  const copy = systemCopy(configuration.activeLocale);

  return (
    <section
      data-preview-surface="connectors"
      className="min-h-0 flex-1 overflow-y-auto px-5 py-4"
    >
      <div className="mx-auto max-w-3xl">
        <Tabs defaultValue="runtime" variant="underline">
          <TabsList>
            <TabsTrigger value="runtime">{copy.runtime}</TabsTrigger>
            <TabsTrigger value="bindings">{copy.bindings}</TabsTrigger>
          </TabsList>
          <TabsContent value="runtime" className="pt-4">
            <SettingsGroup title={copy.connectorRuntime}>
              <SettingsRow label={copy.currentRuntime} description={copy.connectorDescription}>
                <SettingsSelectButton
                  aria-label={copy.currentRuntime}
                  icon={<Blocks className="h-3.5 w-3.5" />}
                >
                  {fixture.connectors.runtime}
                </SettingsSelectButton>
              </SettingsRow>
              {fixture.connectors.states.map((state) => (
                <SettingsRow
                  key={state}
                  label={state}
                  description={`fixture:${fixture.id}`}
                >
                  <span className="rounded-full bg-[var(--wb-inset)] px-2 py-1 font-mono text-xs">
                    {state}
                  </span>
                </SettingsRow>
              ))}
            </SettingsGroup>
          </TabsContent>
          <TabsContent value="bindings" className="pt-4">
            <p className="text-sm text-muted-foreground">
              {fixture.settings.overlay}
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function SettingsSurface({
  scenario,
  configuration,
  overlay = false,
}: {
  scenario: ParkingPreviewScenario;
  configuration: ParkingPreviewConfiguration;
  overlay?: boolean;
}) {
  const { fixture, referenceCase } = scenario;
  const copy = systemCopy(configuration.activeLocale);

  return (
    <section
      data-preview-surface="settings"
      data-settings-overlay={String(overlay)}
      className={cn(
        "min-h-0 overflow-y-auto",
        overlay ? "h-full p-3" : "flex-1 px-5 py-4",
      )}
    >
      <div className={cn("mx-auto", overlay ? "max-w-none" : "max-w-3xl")}>
        <SettingsGroup
          title={fixture.settings.overlay}
          actions={<Settings2 className="h-4 w-4 text-muted-foreground" />}
        >
          <SettingsRow
            label={copy.executionAuthorization}
            description={fixture.conversation.approval}
          >
            <SettingsSelectButton
              aria-label={copy.authorizationMode}
              icon={<ShieldCheck className="h-3.5 w-3.5" />}
            >
              {copy.humanConfirmation}
            </SettingsSelectButton>
          </SettingsRow>
          <SettingsRow
            label={copy.connectors}
            description={`运行时：${fixture.connectors.runtime} · ${fixture.connectors.states.join(" · ")}`}
          >
            <SettingsSelectButton
              aria-label={copy.connectorSettings}
              icon={<Blocks className="h-3.5 w-3.5" />}
            >
              {fixture.connectors.states[0]}
            </SettingsSelectButton>
          </SettingsRow>
          <SettingsRow
            label={copy.reducedMotion}
            description={copy.reducedMotionDescription}
          >
            <span className="flex items-center gap-1.5 rounded-full bg-[var(--wb-inset)] px-2 py-1 text-xs">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              {referenceCase.reducedMotion || fixture.settings.reducedMotion
                ? copy.on
                : copy.off}
            </span>
          </SettingsRow>
        </SettingsGroup>
      </div>
    </section>
  );
}

function ExcludedCapability({ capability }: { capability: ParkingPreviewCapability }) {
  return (
    <section
      data-preview-state="capability-excluded"
      data-excluded-capability={capability}
      className="flex min-h-0 flex-1 items-center justify-center p-6 text-center"
    >
      <div className="max-w-sm rounded-xl border border-[var(--wb-border)] bg-[var(--wb-inset-faint)] p-5">
        <CircleAlert className="mx-auto h-5 w-5 text-muted-foreground" />
        <h1 className="mt-2 text-sm font-semibold">本订单未包含此能力</h1>
        <p className="mt-1 text-xs text-muted-foreground">{capability}</p>
      </div>
    </section>
  );
}

function hasCapability(
  configuration: ParkingPreviewConfiguration,
  capability: ParkingPreviewCapability,
) {
  return configuration.capabilitySlugs.includes(capability);
}

function MainSurface({
  scenario,
  configuration,
}: {
  scenario: ParkingPreviewScenario;
  configuration: ParkingPreviewConfiguration;
}) {
  const { surfaces } = scenario.referenceCase;

  if (surfaces.includes("board")) {
    return hasCapability(configuration, "board") ? (
      <BoardSurface scenario={scenario} configuration={configuration} />
    ) : (
      <ExcludedCapability capability="board" />
    );
  }
  if (surfaces.includes("connectors")) {
    return hasCapability(configuration, "connectors") ? (
      <ConnectorsSurface scenario={scenario} configuration={configuration} />
    ) : (
      <ExcludedCapability capability="connectors" />
    );
  }
  if (surfaces.length === 1 && surfaces.includes("settings")) {
    return hasCapability(configuration, "settings") ? (
      <SettingsSurface scenario={scenario} configuration={configuration} />
    ) : (
      <ExcludedCapability capability="settings" />
    );
  }
  return hasCapability(configuration, "tasks") ? (
    <TaskSurface scenario={scenario} configuration={configuration} />
  ) : (
    <ExcludedCapability capability="tasks" />
  );
}

function PanelSurface({
  scenario,
  configuration,
}: {
  scenario: ParkingPreviewScenario;
  configuration: ParkingPreviewConfiguration;
}) {
  const { surfaces } = scenario.referenceCase;

  if (surfaces.includes("artifact")) {
    return hasCapability(configuration, "artifact") ? (
      <ArtifactSurface scenario={scenario} configuration={configuration} />
    ) : (
      <ExcludedCapability capability="artifact" />
    );
  }
  if (surfaces.includes("settings")) {
    return hasCapability(configuration, "settings") ? (
      <SettingsSurface
        scenario={scenario}
        configuration={configuration}
        overlay
      />
    ) : (
      <ExcludedCapability capability="settings" />
    );
  }
  return null;
}

export function ParkingWorkbenchPreview({
  scenario,
  configuration = DEFAULT_PARKING_PREVIEW_CONFIGURATION,
  className,
}: {
  scenario: ParkingPreviewScenario;
  configuration?: ParkingPreviewConfiguration;
  className?: string;
}) {
  const { previewRef, ready } = useCaptureReadiness(
    scenario.caseId,
    scenario.referenceCase.viewport,
  );
  const theme = scenario.referenceCase.theme;
  const hasPanel =
    scenario.referenceCase.surfaces.includes("artifact") ||
    (scenario.referenceCase.surfaces.includes("connectors") &&
      scenario.referenceCase.surfaces.includes("settings"));
  const rootStyle = useMemo(
    () => ({
      ...themeStyle(theme),
      ...(configuration.semanticStateColors.success
        ? { "--wb-success": configuration.semanticStateColors.success }
        : {}),
      ...(configuration.semanticStateColors.warning
        ? { "--wb-warning": configuration.semanticStateColors.warning }
        : {}),
      ...(configuration.semanticStateColors.danger
        ? { "--wb-danger": configuration.semanticStateColors.danger }
        : {}),
      ...(configuration.semanticStateColors.destructive
        ? { "--wb-danger-strong": configuration.semanticStateColors.destructive }
        : {}),
      ...(configuration.semanticStateColors.info
        ? { "--wb-accent": configuration.semanticStateColors.info }
        : {}),
      width: `${scenario.viewportSize.width}px`,
      height: `${scenario.viewportSize.height}px`,
    }),
    [configuration.semanticStateColors, scenario.viewportSize.height, scenario.viewportSize.width, theme],
  );

  return (
    <MotionConfig reducedMotion="always">
      <div
        ref={previewRef}
        data-testid="parking-workbench-preview"
        data-case-id={scenario.caseId}
        data-fixture-id={scenario.fixture.id}
        data-preview-ready={String(ready)}
        data-theme={theme}
        data-states={scenario.referenceCase.states.join(" ")}
        data-surfaces={scenario.referenceCase.surfaces.join(" ")}
        data-reduced-motion={String(scenario.referenceCase.reducedMotion)}
        data-preview-size={scenario.referenceCase.size}
        data-fixture-selectors={scenario.selectors.join(" ")}
        data-preview-locale={configuration.activeLocale}
        data-platform-chrome={configuration.platformChrome}
        data-logo-reference={configuration.logoReference || undefined}
        style={rootStyle}
        className={cn(
          "relative isolate overflow-hidden bg-[var(--wb-surface)] text-foreground",
          "[&_*]:!animate-none [&_*]:!transition-none",
          theme === "dark" && "dark",
          className,
        )}
      >
        <div hidden aria-hidden>
          {scenario.selectors.map((selector) => (
            <span key={selector} data-fixture-selector={selector} />
          ))}
        </div>
        <Workbench
          key={scenario.caseId}
          defaultSidebarOpen={scenario.referenceCase.viewport === "wide"}
          defaultPanelOpen={hasPanel}
          className="h-full"
        >
          <PreviewToolbar
            scenario={scenario}
            hasPanel={hasPanel}
            configuration={configuration}
          />
          <WorkbenchSidebar>
            <TaskHistory scenario={scenario} configuration={configuration} />
          </WorkbenchSidebar>
          <WorkbenchMain>
            <MainSurface scenario={scenario} configuration={configuration} />
          </WorkbenchMain>
          <WorkbenchPanel>
            <PanelSurface scenario={scenario} configuration={configuration} />
          </WorkbenchPanel>
        </Workbench>
      </div>
    </MotionConfig>
  );
}
