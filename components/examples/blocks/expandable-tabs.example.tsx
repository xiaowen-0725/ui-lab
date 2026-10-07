"use client";

import { useState } from "react";
import { ExpandableTabs } from "@/components/motion/expandable-tabs";

export function ExpandableTabsExample() {
  const [value, setValue] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("选择一个选项卡查看内容。");
  const items = [
    { id: "notes", label: "笔记", icon: <span aria-hidden="true">✎</span>, content: (
      <div className="w-56 space-y-3 p-3">
        <h2 className="font-medium">阅读笔记</h2>
        <p className="text-sm text-muted-foreground">本周已整理三篇笔记。</p>
        <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => setFeedback("已在本地标记笔记为待回顾。")}>标记待回顾</button>
      </div>
    ) },
    { id: "plan", label: "计划", icon: <span aria-hidden="true">☷</span>, content: (
      <div className="w-56 space-y-3 p-3">
        <h2 className="font-medium">今天的计划</h2>
        <p className="text-sm text-muted-foreground">读完一章，写下一条行动。</p>
        <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => setFeedback("今天的计划已在本地标记完成。")}>标记完成</button>
      </div>
    ) },
  ];

  return (
    <div className="flex min-h-80 flex-col items-center justify-end gap-5 p-5">
      <ExpandableTabs items={items} value={value} onValueChange={(next) => {
        setValue(next);
        setFeedback(next ? `已打开${next === "notes" ? "笔记" : "计划"}面板。` : "面板已收起。");
      }} />
      <p role="status" className="text-sm text-muted-foreground">{feedback}</p>
    </div>
  );
}
