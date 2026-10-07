"use client";

import { useState } from "react";
import { CommandPalette, type CommandItem } from "@/components/motion/command-palette";

export function CommandPaletteExample() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("概览");
  const [noteCount, setNoteCount] = useState(0);
  const [result, setResult] = useState("尚未选择命令");
  const items: CommandItem[] = [
    { id: "overview", label: "打开概览", group: "视图", keywords: ["首页", "overview"], onSelect: () => { setView("概览"); setResult("已切换到本地概览"); } },
    { id: "notes", label: "打开笔记", group: "视图", keywords: ["notes"], onSelect: () => { setView("笔记"); setResult("已切换到本地笔记"); } },
    { id: "new-note", label: "新建示例笔记", group: "操作", keywords: ["新建", "create"], onSelect: () => { setNoteCount((count) => count + 1); setView("笔记"); setResult("已添加一条本地示例笔记"); } },
  ];

  return (
    <section className="mx-auto max-w-md space-y-4 rounded-xl border border-border bg-card p-6 text-foreground">
      <button type="button" onClick={() => setOpen(true)} className="rounded-lg border border-border px-3 py-2 text-sm">打开命令面板</button>
      <p className="text-sm text-muted-foreground">也可按 Ctrl / ⌘ + K，输入关键词后使用方向键和回车。</p>
      <CommandPalette open={open} onOpenChange={setOpen} items={items} placeholder="搜索本地命令…" emptyMessage="没有匹配命令" />
      <h2 className="text-lg font-semibold">{view}</h2>
      <p className="text-sm">本地示例笔记：{noteCount} 条</p>
      <p role="status" className="text-sm text-muted-foreground">{open ? "命令面板已打开" : result}</p>
    </section>
  );
}
