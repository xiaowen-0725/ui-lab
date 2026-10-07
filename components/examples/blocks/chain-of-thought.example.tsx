"use client";

import { useState } from "react";
import {
  ChainOfThought,
  ChainOfThoughtContent,
  ChainOfThoughtHeader,
  ChainOfThoughtSearchResult,
  ChainOfThoughtSearchResults,
  ChainOfThoughtStep,
} from "@/components/agents/chain-of-thought";

export function ChainOfThoughtExample() {
  const [open, setOpen] = useState(true);
  const [completed, setCompleted] = useState(false);
  return (
    <section className="max-w-xl space-y-4 rounded-xl border border-border p-6">
      <h2 className="font-medium">资料整理过程演示</h2>
      <ChainOfThought open={open} onOpenChange={setOpen}>
        <ChainOfThoughtHeader>查看整理步骤</ChainOfThoughtHeader>
        <ChainOfThoughtContent>
          <ChainOfThoughtStep label="收集已有资料" description="这里只展示预置的本地资料名称。" status="complete">
            <ChainOfThoughtSearchResults><ChainOfThoughtSearchResult>阅读笔记.md</ChainOfThoughtSearchResult><ChainOfThoughtSearchResult>设计摘要.md</ChainOfThoughtSearchResult></ChainOfThoughtSearchResults>
          </ChainOfThoughtStep>
          <ChainOfThoughtStep label="归纳阅读要点" description={completed ? "本地步骤已标记完成。" : "等待手动完成此演示步骤。"} status={completed ? "complete" : "active"} />
          <ChainOfThoughtStep label="展示整理结果" status={completed ? "complete" : "pending"}>{completed ? "要点：明确目标、记录疑问、定期回顾。" : "尚未完成整理。"}</ChainOfThoughtStep>
        </ChainOfThoughtContent>
      </ChainOfThought>
      <button type="button" onClick={() => setCompleted((value) => !value)} className="rounded-md border border-border px-3 py-2">{completed ? "重置步骤" : "标记整理完成"}</button>
      <p role="status">步骤{open ? "已展开" : "已收起"}；{completed ? "本地整理完成" : "等待本地操作"}。未运行 AI 推理。</p>
    </section>
  );
}
