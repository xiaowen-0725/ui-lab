"use client";

import { useId, useState } from "react";
import {
  useWorkbench, Workbench, WorkbenchHeader, WorkbenchMain,
  WorkbenchPanel, WorkbenchSidebar, WorkbenchSummaryCard, WorkbenchSummarySection,
} from "@/components/motion/agent-workbench/index";

function WorkbenchToolbar({ summaryOpen, onToggleSummary }: { summaryOpen: boolean; onToggleSummary: () => void }) {
  const { sidebarOpen, panelOpen, toggleSidebar, togglePanel } = useWorkbench();
  return (
    <WorkbenchHeader
      leading={<button type="button" aria-pressed={sidebarOpen} onClick={toggleSidebar} className="rounded-lg px-3 py-2 text-sm">任务列表</button>}
      trailing={<div className="flex gap-1 pr-2"><button type="button" aria-pressed={summaryOpen} onClick={onToggleSummary} className="rounded-lg px-2 py-2 text-sm">摘要</button><button type="button" aria-pressed={panelOpen} onClick={togglePanel} className="rounded-lg px-2 py-2 text-sm">资料</button></div>}
    >
      <span className="px-2 text-xs text-muted-foreground">周报工作台</span>
    </WorkbenchHeader>
  );
}

function TaskList({ onSelect }: { onSelect: (task: string) => void }) {
  const { setSidebarOpen } = useWorkbench();
  return (
    <nav aria-label="演示任务" className="space-y-2 p-4">
      <h2 className="font-medium">任务列表</h2>
      {["整理本周进展", "准备下周计划"].map((task) => <button key={task} type="button" className="block w-full rounded-lg border border-border p-2 text-left text-sm" onClick={() => { onSelect(task); setSidebarOpen(false); }}>{task}</button>)}
    </nav>
  );
}

export function AgentWorkbenchExample() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [task, setTask] = useState("整理本周进展");
  const [draft, setDraft] = useState("本周完成了表单说明与交互检查。");
  const [result, setResult] = useState("本地演示工作台，提交内容仅显示在页面中。");
  const inputId = useId();
  return (
    <section className="w-full space-y-3">
      <Workbench className="h-[520px] w-full rounded-xl border border-border bg-background" sidebarOpen={sidebarOpen} onSidebarOpenChange={setSidebarOpen} panelOpen={panelOpen} onPanelOpenChange={setPanelOpen}>
        <WorkbenchToolbar summaryOpen={summaryOpen} onToggleSummary={() => setSummaryOpen(!summaryOpen)} />
        <WorkbenchSidebar><TaskList onSelect={(next) => { setTask(next); setResult(`已选择任务：${next}`); }} /></WorkbenchSidebar>
        <WorkbenchMain>
          <div className="space-y-4 overflow-y-auto px-4 pb-4 pt-16">
            <h2 className="font-medium">{task}</h2>
            <p className="text-sm text-muted-foreground">打开任务列表或资料侧栏；桌面侧栏支持调整宽度。</p>
            <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); if (!draft.trim()) return; setResult(`已记录“${task}”：${draft.trim()}（本地演示）。`); setDraft(""); }}>
              <label htmlFor={inputId} className="block text-sm">任务补充说明</label>
              <textarea id={inputId} rows={4} value={draft} onChange={(event) => setDraft(event.target.value)} className="w-full rounded-xl border border-border bg-background p-3 text-sm" />
              <button type="submit" disabled={!draft.trim()} className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50">记录说明</button>
            </form>
            <p role="status" className="text-sm text-muted-foreground">{result}</p>
          </div>
          <WorkbenchSummaryCard open={summaryOpen}><WorkbenchSummarySection title="当前任务"><p className="px-2 text-sm">{task}</p><p className="px-2 pt-2 text-xs text-muted-foreground">操作范围：本地演示</p></WorkbenchSummarySection></WorkbenchSummaryCard>
        </WorkbenchMain>
        <WorkbenchPanel><div className="space-y-3 p-4"><h2 className="font-medium">演示资料</h2><p className="text-sm">周报结构：进展、问题、下周计划。</p><button type="button" className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => { setDraft("进展：\n问题：\n下周计划："); setResult("已将资料提纲填入草稿。"); setPanelOpen(false); }}>采用提纲</button></div></WorkbenchPanel>
      </Workbench>
      <p role="status" className="text-xs text-muted-foreground">任务列表已{sidebarOpen ? "打开" : "关闭"}，资料已{panelOpen ? "打开" : "关闭"}，摘要已{summaryOpen ? "打开" : "关闭"}。</p>
    </section>
  );
}
