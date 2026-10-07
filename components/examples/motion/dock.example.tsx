"use client";

import { useState } from "react";
import { Dock, DockItem, DockSeparator } from "@/components/motion/dock";

const views = ["概览", "文件", "笔记"];

export function DockExample() {
  const [active, setActive] = useState("概览");

  return (
    <section className="mx-auto max-w-md space-y-6 rounded-xl border border-border bg-background p-6 text-foreground">
      <h2 className="text-lg font-semibold">本地工作区</h2>
      <p role="status" className="text-sm">当前视图：{active}</p>
      <Dock size={56}>
        {views.map((view) => <DockItem key={view} active={active === view} aria-label={`切换到${view}`} onClick={() => setActive(view)}><span className="text-sm">{view}</span></DockItem>)}
        <DockSeparator />
        <DockItem active={active === "设置"} aria-label="打开设置" onClick={() => setActive("设置")}><span className="text-sm">设置</span></DockItem>
      </Dock>
      <p className="text-sm text-muted-foreground">{active === "文件" ? "文件：界面草图、组件清单" : active === "笔记" ? "笔记：今天练习留白与层次。" : active === "设置" ? "设置：所有切换均在本地演示。" : "今天有两份草图等待整理。"}</p>
    </section>
  );
}
