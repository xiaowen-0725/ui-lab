"use client";

import { useState } from "react";
import { ExpandingCard } from "@/components/motion/expanding-card";

export function ExpandingCardExample() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <div className="w-full max-w-md space-y-3">
      <ExpandingCard title="周末阅读计划" summary="留出一小时，读完一章并整理笔记。" expandHint="查看完整计划" open={open} onOpenChange={setOpen}>
        <ol className="list-inside list-decimal space-y-2 text-sm">
          <li>选择一本正在阅读的书。</li>
          <li>记录三个值得回顾的观点。</li>
          <li>写下一条可以实践的行动。</li>
        </ol>
        <button type="button" className="mt-5 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground" onClick={() => {
          setSaved(true);
          setOpen(false);
        }}>加入本地阅读清单</button>
      </ExpandingCard>
      <p role="status" className="text-sm text-muted-foreground">{saved ? "阅读计划已加入本次演示清单。" : open ? "计划详情已打开。" : "点击卡片查看计划详情。"}</p>
    </div>
  );
}
