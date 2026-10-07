"use client";

import { useState } from "react";
import { CollapsibleSidebar, type CollapsibleSidebarGroup, type CollapsibleSidebarItem } from "@/components/motion/collapsible-sidebar";

const LABELS: Record<string, string> = { home: "学习首页", inbox: "待整理", reading: "阅读笔记", weekly: "每周回顾" };

export function CollapsibleSidebarExample() {
  const [collapsed, setCollapsed] = useState(false);
  const [activeId, setActiveId] = useState("home");
  const [feedback, setFeedback] = useState("欢迎来到本地学习空间。");
  const [draftCount, setDraftCount] = useState(0);
  const items: CollapsibleSidebarItem[] = [
    { id: "home", label: "学习首页", icon: <span aria-hidden="true">⌂</span> },
    { id: "inbox", label: "待整理", icon: <span aria-hidden="true">▤</span>, badge: draftCount,
      actionLabel: "添加待整理笔记", onAction: () => {
        setDraftCount((count) => count + 1);
        setFeedback("已添加一条本地待整理笔记。");
      } },
  ];
  const groups: CollapsibleSidebarGroup[] = [{
    id: "notes", label: "我的笔记", defaultOpen: true,
    onAdd: () => {
      setDraftCount((count) => count + 1);
      setFeedback("已在本地新建一条笔记草稿。");
    },
    onMore: () => setFeedback("笔记分组包含阅读笔记与每周回顾。"),
    items: [{ id: "reading", label: "阅读笔记", icon: <span aria-hidden="true">✎</span>, defaultOpen: true,
      children: [{ id: "weekly", label: "每周回顾", icon: <span aria-hidden="true">☷</span> }] }],
  }];

  return (
    <div className="flex h-[480px] w-full overflow-hidden rounded-xl border border-border">
      <CollapsibleSidebar workspaceName="学习空间" workspaceIcon={<span aria-hidden="true">学</span>}
        searchPlaceholder="搜索本地笔记" onSearch={() => setFeedback("搜索入口已触发；本地目录包含阅读笔记和每周回顾。")}
        items={items} groups={groups} activeId={activeId} onActiveChange={(id) => {
          setActiveId(id);
          setFeedback(`已切换到${LABELS[id]}。`);
        }}
        collapsed={collapsed} onCollapsedChange={(next) => {
          setCollapsed(next);
          setFeedback(next ? "侧栏已折叠。" : "侧栏已展开。");
        }}
      />
      <main className="min-w-0 flex-1 space-y-4 overflow-auto bg-background p-5">
        <h2 className="font-semibold">{LABELS[activeId]}</h2>
        <p className="text-sm text-muted-foreground">记录阅读收获，整理每周的学习进度。</p>
        <p role="status" className="text-sm">{feedback}</p>
        <p className="text-sm">本地草稿：{draftCount} 条</p>
      </main>
    </div>
  );
}
