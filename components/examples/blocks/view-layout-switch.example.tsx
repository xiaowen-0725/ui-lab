"use client";

import { useState } from "react";
import { ViewLayoutSwitch, type ViewLayoutOption } from "@/components/motion/view-layout-switch";

const layouts: ViewLayoutOption[] = [{ id: "list", label: "列表", description: "逐项阅读资料" }, { id: "grid", label: "网格", description: "并排浏览资料卡片" }];
const records = [{ title: "界面草图", description: "表达主要内容与操作" }, { title: "交互评审", description: "检查状态变化与反馈" }, { title: "组件清单", description: "记录可以复用的界面元素" }];

export function ViewLayoutSwitchExample() {
  const [layout, setLayout] = useState("list");

  return (
    <section className="mx-auto max-w-xl space-y-4 rounded-xl border border-border bg-card p-5 text-foreground">
      <h2 className="text-lg font-semibold">设计资料</h2>
      <ViewLayoutSwitch layouts={layouts} value={layout} onValueChange={setLayout} variant="tabs" />
      <ul className={layout === "grid" ? "grid grid-cols-1 gap-3 sm:grid-cols-2" : "space-y-3"}>
        {records.map((record) => <li key={record.title} className="rounded-lg border border-border bg-background p-4"><h3 className="text-sm font-medium">{record.title}</h3><p className="mt-1 text-sm text-muted-foreground">{record.description}</p></li>)}
      </ul>
      <p role="status" className="text-sm text-muted-foreground">已切换到{layout === "grid" ? "网格" : "列表"}视图，共 {records.length} 条本地资料</p>
    </section>
  );
}
