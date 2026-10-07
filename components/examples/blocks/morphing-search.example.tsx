"use client";

import { useState } from "react";
import { MorphingSearch } from "@/components/motion/morphing-search";

const ITEMS = [
  { id: "reading", title: "阅读计划", description: "查看本周待阅读文章", keywords: ["计划", "文章"] },
  { id: "notes", title: "学习笔记", description: "整理已完成的阅读记录", keywords: ["记录", "学习"] },
  { id: "preferences", title: "阅读偏好", description: "调整字号与通知选项", keywords: ["设置", "字号"] },
];

export function MorphingSearchExample() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState("尚未选择");
  return (
    <section className="max-w-md space-y-4 p-6">
      <h2 className="font-medium">搜索本地阅读空间</h2>
      <MorphingSearch items={ITEMS} open={open} onOpenChange={setOpen} onQueryChange={setQuery} placeholder="搜索计划、笔记或偏好" emptyMessage="没有匹配的本地条目" onSelect={(item) => { setSelected(item.title); setOpen(false); }} />
      <p className="text-sm text-muted-foreground">关键词：{query || "未输入"}</p>
      <p role="status">已选择：{selected}</p>
    </section>
  );
}
