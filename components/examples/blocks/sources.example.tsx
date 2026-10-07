"use client";

import { useState } from "react";
import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/agents/sources";

const references = [
  { href: "https://www.w3.org/WAI/tutorials/forms/", title: "表单可访问性教程" },
  { href: "https://www.w3.org/WAI/tutorials/forms/labels/", title: "表单标签教程" },
];

export function SourcesExample() {
  const [open, setOpen] = useState(true);
  const [visited, setVisited] = useState("");
  return (
    <section className="w-full max-w-lg space-y-3">
      <p className="text-sm">表单设计参考资料：</p>
      <Sources open={open} onOpenChange={setOpen}>
        <SourcesTrigger count={references.length}>参考来源 · {references.length} · {open ? "收起" : "展开"}</SourcesTrigger>
        <SourcesContent>
          {references.map((reference) => <Source key={reference.href} href={reference.href} title={reference.title} onClick={() => setVisited(reference.title)} />)}
        </SourcesContent>
      </Sources>
      <p role="status" className="text-sm text-muted-foreground">来源列表已{open ? "展开" : "收起"}。{visited ? `已打开：${visited}` : "点击来源将在新标签页打开。"}</p>
    </section>
  );
}
