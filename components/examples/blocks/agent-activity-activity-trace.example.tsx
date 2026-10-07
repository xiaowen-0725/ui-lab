"use client";

import { useState } from "react";
import { AgentActivity, type AgentActivityItem } from "@/components/agents/agent-activity/index";

const items: AgentActivityItem[] = [
  { id: "think", type: "trace", kind: "thinking", label: "整理需求", detail: "准备会议纪要" },
  { id: "read", type: "trace", kind: "read", label: "读取资料", detail: "演示会议记录.txt" },
  { id: "write", type: "trace", kind: "write", label: "整理草稿", detail: "演示纪要.md" },
  { id: "message", type: "trace", kind: "message", label: "输出结果", detail: "已归纳为三个议题" },
];

export function AgentActivityActivityTraceExample() {
  const [open, setOpen] = useState(true);
  return (
    <section className="w-full max-w-lg space-y-3">
      <h2 className="font-medium">会议纪要活动轨迹 · 静态演示</h2>
      <AgentActivity items={items} status="complete" summary="查看 4 条轨迹" open={open} onOpenChange={setOpen} />
      <p role="status" className="text-sm text-muted-foreground">活动轨迹已{open ? "展开" : "收起"}。</p>
    </section>
  );
}
