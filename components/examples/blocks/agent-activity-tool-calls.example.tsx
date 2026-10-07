"use client";

import { useState } from "react";
import { AgentActivity, type AgentActivityItem } from "@/components/agents/agent-activity/index";

const calls: AgentActivityItem[] = [
  { id: "read", type: "tool", action: "read", target: "演示草稿.md" },
  { id: "edit", type: "tool", action: "edit", target: "演示草稿.md", additions: 4, deletions: 1 },
  { id: "run", type: "tool", action: "run", target: "检查演示草稿格式" },
];

export function AgentActivityToolCallsExample() {
  const [count, setCount] = useState(1);
  const [open, setOpen] = useState(true);
  const complete = count === calls.length;
  return (
    <section className="w-full max-w-lg space-y-3">
      <AgentActivity items={calls.slice(0, count)} status={complete ? "complete" : "working"} activeLabel="展示工具调用记录…" summary="查看 3 条工具调用记录" open={open} onOpenChange={setOpen} collapseOnComplete={false} />
      <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => { setCount(complete ? 1 : count + 1); setOpen(true); }}>
        {complete ? "重新演示" : "追加下一条调用"}
      </button>
      <p role="status" className="text-sm text-muted-foreground">已展示 {count}/{calls.length} 条，详情已{open ? "展开" : "收起"}；未读取、修改文件或运行命令。</p>
    </section>
  );
}
