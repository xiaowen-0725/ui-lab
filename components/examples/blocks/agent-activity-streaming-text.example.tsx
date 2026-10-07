"use client";

import { useState } from "react";
import { AgentActivity } from "@/components/agents/agent-activity/index";

const fragments = ["先确定周报的读者。", " 再将进展按任务分组。", " 最后补充阻塞和下一步安排。"];

export function AgentActivityStreamingTextExample() {
  const [count, setCount] = useState(1);
  const [open, setOpen] = useState(true);
  const complete = count === fragments.length;
  return (
    <section className="w-full max-w-lg space-y-3">
      <h2 className="font-medium">逐段接收文本 · 本地模拟</h2>
      <AgentActivity
        items={[{ id: "text", type: "text", content: fragments.slice(0, count).join("") }]}
        status={complete ? "complete" : "working"}
        activeLabel="正在接收演示文本…"
        summary="文本接收完成，查看内容"
        open={open}
        onOpenChange={setOpen}
        collapseOnComplete={false}
      />
      <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => { setCount(complete ? 1 : count + 1); setOpen(true); }}>
        {complete ? "重新演示" : "接收下一段"}
      </button>
      <p role="status" className="text-sm text-muted-foreground">已接收 {count}/{fragments.length} 段；详情已{open ? "展开" : "收起"}。</p>
    </section>
  );
}
