"use client";

import { TiltCard } from "@/components/motion/tilt-card";

export function TiltCardExample() {
  return (
    <div className="mx-auto max-w-sm p-4">
      <TiltCard max={8} glare className="border border-border bg-card p-6 text-foreground shadow-sm">
        <article className="space-y-4">
          <p className="text-sm text-muted-foreground">设计练习 · 01</p>
          <h2 className="text-2xl font-semibold">留白与层次</h2>
          <p className="text-sm leading-6">用一张卡片组织标题、说明与练习信息，让读者轻松找到重点。</p>
          <p className="text-xs text-muted-foreground">将指针移到卡片上，观察倾斜与高光。</p>
        </article>
      </TiltCard>
    </div>
  );
}
