"use client";

import { useState } from "react";
import { AgentActivity, type AgentActivityItem } from "@/components/agents/agent-activity/index";

const items: AgentActivityItem[] = [
  { id: "plan", type: "step", label: "整理周报要点", status: "complete" },
  { id: "read", type: "tool", action: "read", target: "周报草稿.md" },
  { id: "answer", type: "text", content: "已整理为进展、问题和下周计划三个部分。" },
];

export function AgentActivityExample() {
  const [open, setOpen] = useState(true);
  return (
    <section className="w-full max-w-lg space-y-3">
      <h2 className="font-medium">周报整理 · 本地活动记录</h2>
      <AgentActivity items={items} status="complete" summary="查看 3 条活动" open={open} onOpenChange={setOpen} />
      <p role="status" className="text-sm text-muted-foreground">活动详情已{open ? "展开" : "收起"}。</p>
    </section>
  );
}
