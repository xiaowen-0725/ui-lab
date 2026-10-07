"use client";

import { useState } from "react";
import { Plan, PlanAction, PlanContent, PlanDescription, PlanFooter, PlanHeader, PlanTitle, PlanTrigger } from "@/components/agents/plan";

export function PlanExample() {
  const [open, setOpen] = useState(true);
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="w-full max-w-lg space-y-3">
      <Plan open={open} onOpenChange={setOpen}>
        <PlanHeader>
          <div className="space-y-1">
            <PlanTitle>整理阅读笔记的计划</PlanTitle>
            <PlanDescription>先确认范围，再按三个步骤整理本地示例资料。</PlanDescription>
          </div>
          <PlanAction><PlanTrigger aria-label={open ? "收起计划" : "展开计划"} /></PlanAction>
        </PlanHeader>
        <PlanContent>
          <ol className="list-inside list-decimal space-y-2">
            <li>挑选三篇本周阅读笔记。</li>
            <li>为每篇笔记补充摘要和标签。</li>
            <li>汇总一条下周可以实践的行动。</li>
          </ol>
        </PlanContent>
        <PlanFooter>
          <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => setAccepted(false)}>重置选择</button>
          <button type="button" className="rounded-lg bg-primary px-3 py-2 text-sm text-primary-foreground" onClick={() => setAccepted(true)}>采用此计划</button>
        </PlanFooter>
      </Plan>
      <p role="status" className="text-sm text-muted-foreground">{accepted ? "本地已选择这份计划；尚未执行任何任务。" : "计划等待确认。"}</p>
    </div>
  );
}
