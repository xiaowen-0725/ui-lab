import {
  Activity,
  Bot,
  FileCode2,
  FolderOpen,
  LoaderCircle,
  Menu,
  Moon,
  PanelRight,
  Plus,
  ShieldCheck,
  Sun,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Composer,
  ComposerAccessChip,
  ComposerIconButton,
  ComposerSendButton,
  ComposerTextarea,
  ComposerToolbar,
} from "@/components/motion/agent-composer";
import {
  Thread,
  ThreadApprovalCard,
  ThreadErrorState,
  ThreadMessage,
  ThreadThinking,
  ThreadToolCall,
  ThreadUserMessage,
} from "@/components/motion/agent-thread";
import {
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
import { ThreadList, ThreadListItem, ThreadListSection } from "@/components/motion/thread-list";
import fixture from "@/fixtures/parking-high-density-v1.json";

type Scenario = "default" | "loading" | "empty" | "error" | "streaming" | "approval";
type Theme = "light" | "dark";

const scenarios: { value: Scenario; label: string }[] = [
  { value: "default", label: "默认" },
  { value: "loading", label: "加载中" },
  { value: "empty", label: "空状态" },
  { value: "error", label: "错误" },
  { value: "streaming", label: "流式执行" },
  { value: "approval", label: "待审批" },
];

function readQuery(): { scenario: Scenario; theme: Theme; reduced: boolean } {
  const query = new URLSearchParams(window.location.search);
  const state = query.get("state");
  return {
    scenario: scenarios.some((item) => item.value === state) ? (state as Scenario) : "default",
    theme: query.get("theme") === "dark" ? "dark" : "light",
    reduced: query.get("reduced") === "1",
  };
}

function updateQuery(values: Partial<{ state: Scenario; theme: Theme; reduced: boolean }>) {
  const next = new URLSearchParams(window.location.search);
  if (values.state) next.set("state", values.state);
  if (values.theme) next.set("theme", values.theme);
  if (values.reduced !== undefined) next.set("reduced", values.reduced ? "1" : "0");
  window.history.replaceState({}, "", `${window.location.pathname}?${next.toString()}`);
}

function StatusControls({
  scenario,
  theme,
  reduced,
  onScenario,
  onTheme,
  onReduced,
}: {
  scenario: Scenario;
  theme: Theme;
  reduced: boolean;
  onScenario: (value: Scenario) => void;
  onTheme: (value: Theme) => void;
  onReduced: (value: boolean) => void;
}) {
  return (
    <fieldset className="m-0 flex min-w-0 items-center gap-1 border-0 p-0" aria-label="基准控制">
      <label className="sr-only" htmlFor="benchmark-state">场景</label>
      <select
        id="benchmark-state"
        aria-label="场景"
        value={scenario}
        onChange={(event) => onScenario(event.target.value as Scenario)}
        className="h-7 max-w-24 rounded-md border border-[var(--wb-border)] bg-transparent px-1.5 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {scenarios.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
      </select>
      <button type="button" aria-label="切换明暗主题" onClick={() => onTheme(theme === "light" ? "dark" : "light")} className="control-button">
        {theme === "light" ? <Moon /> : <Sun />}
      </button>
      <button type="button" aria-pressed={reduced} onClick={() => onReduced(!reduced)} className="control-button text-[11px]" title="切换减少动效标记">
        减动
      </button>
    </fieldset>
  );
}

function Navigation() {
  return (
    <nav aria-label="任务历史" className="px-2 pb-4">
      <ThreadList>
        <ThreadListSection title="停车运营" action={<button type="button" aria-label="新建任务" className="control-button"><Plus /></button>}>
          <ThreadListItem active icon={<Bot className="h-4 w-4" />} meta="进行中">{fixture.taskHistory.current}</ThreadListItem>
        </ThreadListSection>
        <ThreadListSection title="最近任务">
          {fixture.taskHistory.history.map((task) => (
            <ThreadListItem key={task} icon={<Activity className="h-4 w-4" />}>{task}</ThreadListItem>
          ))}
        </ThreadListSection>
      </ThreadList>
    </nav>
  );
}

function Artifact() {
  const [view, setView] = useState<ArtifactView>("preview");
  return (
    <ArtifactPanel className="m-3 h-[calc(100%-24px)]">
      <ArtifactHeader
        icon={<FileCode2 className="h-4 w-4" />}
        title={fixture.artifact.title}
        subtitle="parking-high-density-v1"
        actions={<><ArtifactViewToggle value={view} onChange={setView} previewLabel="预览" codeLabel="数据" /><ArtifactAction aria-label="关闭产物"><PanelRight className="h-4 w-4" /></ArtifactAction></>}
      />
      <ArtifactContent view={view} className="p-4">
        {view === "preview" ? (
          <section aria-label="异常核验结果" className="space-y-3">
            <p className="text-sm text-muted-foreground">{fixture.artifact.summary}</p>
            {["车牌粤B·7A21", "访客授权 09:12", "设备 P-03 离线"].map((item, index) => (
              <div key={item} className="rounded-xl bg-[var(--wb-card)] p-3 shadow-[var(--shadow-hairline)]">
                <div className="flex items-center justify-between text-sm"><span>{item}</span><span className="font-mono text-xs text-muted-foreground">#{index + 1}</span></div>
                <p className="mt-1 text-xs text-muted-foreground">已关联停车记录、支付状态与授权范围，等待人工确认。</p>
              </div>
            ))}
          </section>
        ) : <pre className="overflow-auto rounded-xl bg-[var(--wb-code-block)] p-3 font-mono text-xs">{JSON.stringify(fixture.artifact, null, 2)}</pre>}
      </ArtifactContent>
      <div className="flex h-10 items-center justify-end border-t border-[var(--wb-divider)] px-3"><ArtifactVersionNav index={1} count={1} /></div>
    </ArtifactPanel>
  );
}

function ThreadSurface({ scenario, onScenario }: { scenario: Scenario; onScenario: (next: Scenario) => void }) {
  const [draft, setDraft] = useState("");
  const isEmpty = scenario === "empty";
  const isLoading = scenario === "loading";
  const isStreaming = scenario === "streaming";
  const isApproval = scenario === "approval";
  const isError = scenario === "error";
  return (
    <div className="flex h-full min-h-0 flex-col pt-[46px]">
      <main className="min-h-0 flex-1 overflow-y-auto" aria-live={isLoading ? "polite" : undefined}>
        {isEmpty ? (
          <div className="mx-auto flex h-full max-w-md flex-col items-center justify-center gap-3 px-6 text-center">
            <FolderOpen className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-base font-medium">{fixture.empty.title}</h1>
            <p className="text-sm text-muted-foreground">{fixture.empty.description}</p>
            <button type="button" onClick={() => onScenario("default")} className="primary-button">创建核验任务</button>
          </div>
        ) : (
          <Thread className="pb-8">
            <ThreadUserMessage>{fixture.conversation.user}</ThreadUserMessage>
            <div className="group/turn py-2">
              <ThreadThinking thinking={isLoading} label={isLoading ? "正在读取停车运营数据…" : "已完成多源记录核验"}>按停车记录、支付记录、设备在线状态和访问授权四个维度交叉比对。</ThreadThinking>
              {isLoading ? <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground"><LoaderCircle className="h-4 w-4 animate-spin" />正在准备任务上下文</div> : <>
                <ThreadMessage streaming={isStreaming}><p>{fixture.conversation.assistant}</p><p>发现 <strong>3 条</strong>需要人工确认的记录，已生成受控处理建议。</p></ThreadMessage>
                <div className="my-3 rounded-xl bg-[var(--wb-card)] p-3 shadow-[var(--shadow-hairline)]">
                  {fixture.conversation.toolStreaming.map((item, index) => <ThreadToolCall key={item} icon={<Activity className="h-4 w-4" />} status={isStreaming && index === 2 ? "running" : "done"} elapsed={`${index + 1}.2s`}>{item}</ThreadToolCall>)}
                </div>
                {isApproval ? <ThreadApprovalCard icon={<ShieldCheck className="h-5 w-5" />} title="需要执行授权" description={fixture.conversation.approval} command="visitor.write.precheck --scope=parking" approveLabel="允许检查" denyLabel="暂不允许" onApprove={() => onScenario("default")} onDeny={() => onScenario("default")} /> : null}
                {isError ? <ThreadErrorState message="连接器恢复入口" detail={fixture.conversation.recoverableError} retryLabel="重新连接" onRetry={() => onScenario("default")} /> : null}
              </>}
            </div>
          </Thread>
        )}
      </main>
      <div className="shrink-0 px-4 pb-4">
        <Composer>
          <ComposerTextarea value={draft} onChange={setDraft} onSubmit={() => { setDraft(""); onScenario("streaming"); }} aria-label="向停车运营智能体发送消息" placeholder="输入新的停车运营核验任务…" />
          <ComposerToolbar className="px-3 pb-2.5">
            <ComposerAccessChip>受控执行</ComposerAccessChip>
            <span className="ml-auto" />
            <ComposerIconButton aria-label="附加上下文"><Plus className="h-4 w-4" /></ComposerIconButton>
            <ComposerSendButton disabled={!draft.trim()} aria-label="发送任务" />
          </ComposerToolbar>
        </Composer>
      </div>
    </div>
  );
}

export function App() {
  const initial = useMemo(readQuery, []);
  const [scenario, setScenario] = useState<Scenario>(initial.scenario);
  const [theme, setTheme] = useState<Theme>(initial.theme);
  const [reduced, setReduced] = useState(initial.reduced);
  const [sidebarOpen, setSidebarOpen] = useState(() => window.innerWidth >= 1200);
  const [panelOpen, setPanelOpen] = useState(() => window.innerWidth >= 768);

  useEffect(() => { updateQuery({ state: scenario, theme, reduced }); }, [scenario, theme, reduced]);

  return (
    <div className={theme === "dark" ? "dark" : ""} data-reduced-mode={reduced || undefined} data-testid="workbench-app">
      <Workbench sidebarOpen={sidebarOpen} onSidebarOpenChange={setSidebarOpen} panelOpen={panelOpen} onPanelOpenChange={setPanelOpen} tabletBreakpoint={768} className="h-dvh bg-background text-foreground">
        <WorkbenchHeader
          leading={<><button type="button" aria-label="切换任务导航" onClick={() => setSidebarOpen((value) => !value)} className="control-button"><Menu /></button><span className="hidden text-sm font-medium sm:inline">停车运营智能体</span></>}
          trailing={<StatusControls scenario={scenario} theme={theme} reduced={reduced} onScenario={setScenario} onTheme={setTheme} onReduced={setReduced} />}
        />
        <WorkbenchSidebar><Navigation /></WorkbenchSidebar>
        <WorkbenchMain><ThreadSurface scenario={scenario} onScenario={setScenario} /></WorkbenchMain>
        <WorkbenchPanel><Artifact /></WorkbenchPanel>
        <button type="button" aria-label="切换产物面板" onClick={() => setPanelOpen((value) => !value)} className="artifact-toggle control-button"><PanelRight /></button>
      </Workbench>
    </div>
  );
}
