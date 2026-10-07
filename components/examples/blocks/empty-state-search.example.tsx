"use client";

import { useId, useState } from "react";
import { EmptyStateSearch } from "@/components/motion/empty-state/search";

const records = ["界面草图", "交互评审", "组件清单"];

export function EmptyStateSearchExample() {
  const fieldId = useId();
  const [query, setQuery] = useState("不存在的记录");
  const matches = records.filter((record) => record.includes(query.trim()));

  return (
    <section className="mx-auto max-w-lg space-y-4 rounded-xl border border-border bg-card p-6 text-foreground">
      <label htmlFor={fieldId} className="block text-sm font-medium">搜索本地记录</label>
      <input id={fieldId} value={query} onChange={(event) => setQuery(event.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2" />
      {matches.length ? (
        <ul className="space-y-2">{matches.map((record) => <li key={record} className="rounded-lg bg-muted p-3 text-sm">{record}</li>)}</ul>
      ) : (
        <EmptyStateSearch title="没有匹配记录" message={`没有找到“${query}”，请修改关键词或清空搜索。`} actionLabel="清空搜索" onAction={() => setQuery("")} />
      )}
      <p role="status" className="text-sm text-muted-foreground">找到 {matches.length} 条本地记录</p>
    </section>
  );
}
