"use client";

import { useState } from "react";
import { AgentActivity, type AgentActivityItem } from "@/components/agents/agent-activity/index";

const activity: AgentActivityItem[] = [
  { id: "plan", type: "step", label: "确定表单说明结构", status: "complete" },
  { id: "search", type: "search", query: "表单设计参考", results: [{ id: "forms", title: "表单教程", domain: "w3.org", url: "https://www.w3.org/WAI/tutorials/forms/" }] },
  { id: "tool", type: "tool", action: "edit", target: "表单说明.md", additions: 3, deletions: 0 },
  { id: "text", type: "text", content: "演示结论：为每个输入项提供清楚的标签和说明。" },
];

export function AgentActivityMixedActivityExample() {
  const [count, setCount] = useState(2);
  const [open, setOpen] = useState(true);
  const complete = count === activity.length;
  return (
    <section className="w-full max-w-lg space-y-3">
      <AgentActivity items={activity.slice(0, count)} status={complete ? "complete" : "working"} activeLabel="整理混合活动记录…" summary="查看完整活动记录" open={open} onOpenChange={setOpen} collapseOnComplete={false} />
      <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => { setCount(complete ? 2 : count + 1); setOpen(true); }}>
        {complete ? "重新演示" : "追加下一条活动"}
      </button>
      <p role="status" className="text-sm text-muted-foreground">本地模拟：{count}/{activity.length} 条活动，详情已{open ? "展开" : "收起"}。</p>
    </section>
  );
}
