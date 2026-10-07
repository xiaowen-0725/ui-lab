"use client";

import { useState } from "react";
import { AgentActivity, type AgentActivityItem } from "@/components/agents/agent-activity/index";

const steps = ["确认演示需求", "比较两种布局", "整理选择理由"];

export function AgentActivityReasoningStepsExample() {
  const [completed, setCompleted] = useState(0);
  const [open, setOpen] = useState(true);
  const complete = completed === steps.length;
  const items: AgentActivityItem[] = steps.map((label, index) => ({
    id: `step-${index}`, type: "step", label,
    status: index < completed ? "complete" : index === completed ? "active" : "pending",
  }));
  return (
    <section className="w-full max-w-lg space-y-3">
      <AgentActivity items={items} status={complete ? "complete" : "working"} activeLabel="正在整理方案…" summary="方案步骤已完成" open={open} onOpenChange={setOpen} collapseOnComplete={false} />
      <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => { setCompleted(complete ? 0 : completed + 1); setOpen(true); }}>
        {complete ? "重新演示" : "完成当前步骤"}
      </button>
      <p role="status" className="text-sm text-muted-foreground">本地演示：已完成 {completed}/{steps.length} 步，详情已{open ? "展开" : "收起"}。</p>
    </section>
  );
}
