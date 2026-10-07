"use client";

import { useState } from "react";
import { ExpandableActionBar, type ExpandableActionBarItem } from "@/components/motion/expandable-action-bar";

// Text icons keep the example inside this item's dependency graph (no icon package).
const items: ExpandableActionBarItem[] = [
  { id: "read", label: "阅读", icon: <span aria-hidden="true">阅</span> },
  { id: "edit", label: "编辑", icon: <span aria-hidden="true">编</span> },
  { id: "review", label: "检查", icon: <span aria-hidden="true">检</span> },
];

export function ExpandableActionBarExample() {
  const [expanded, setExpanded] = useState(true);
  const [activeId, setActiveId] = useState("read");
  const [result, setResult] = useState("当前为阅读模式。");
  return (
    <section className="space-y-3">
      <h2 className="font-medium">草稿操作</h2>
      <ExpandableActionBar items={items} expanded={expanded} onExpandedChange={setExpanded} activeId={activeId} onAction={(item) => { setActiveId(item.id); setResult(`已切换到${item.label}模式（本地演示）。`); }} />
      <button type="button" aria-pressed={expanded} className="block rounded-lg border border-border px-3 py-2 text-sm" onClick={() => setExpanded(!expanded)}>{expanded ? "收起操作文字" : "展开操作文字"}</button>
      <p role="status" className="text-sm text-muted-foreground">{result} 操作栏已{expanded ? "展开" : "收起"}。</p>
    </section>
  );
}
