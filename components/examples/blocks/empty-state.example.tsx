"use client";

import { useState } from "react";
import { EmptyStateInbox } from "@/components/motion/empty-state/index";

export function EmptyStateExample() {
  const [hasMessage, setHasMessage] = useState(false);

  return (
    <section className="mx-auto max-w-lg rounded-xl border border-border bg-card p-6 text-foreground">
      {hasMessage ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">消息列表</h2>
          <p role="status">本地示例消息：欢迎开始今天的设计练习。</p>
          <button type="button" onClick={() => setHasMessage(false)} className="rounded-lg border border-border px-3 py-2 text-sm">清空示例消息</button>
        </div>
      ) : (
        <EmptyStateInbox title="暂时没有消息" message="新消息会显示在这里，先添加一条本地示例。" actionLabel="添加示例消息" onAction={() => setHasMessage(true)} />
      )}
    </section>
  );
}
