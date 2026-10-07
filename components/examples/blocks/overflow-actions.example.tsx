"use client";

import { useState } from "react";
import { OverflowActions } from "@/components/motion/overflow-actions";

export function OverflowActionsExample() {
  const [expanded, setExpanded] = useState(false);
  const [message, setMessage] = useState("选择笔记操作，或展开更多操作。");

  return (
    <section className="space-y-4">
      <h2 className="font-semibold">阅读笔记</h2>
      <OverflowActions
        primaryActions={[
          { id: "edit", label: "编辑" },
          { id: "duplicate", label: "复制" },
        ]}
        overflowActions={[
          { id: "pin", label: "置顶" },
          { id: "archive", label: "归档" },
        ]}
        expanded={expanded}
        onExpandedChange={setExpanded}
        onAction={(item) => setMessage(`本地操作反馈：${item.label}。`)}
        collapseOnAction
        openLabel="展开更多笔记操作"
        closeLabel="收起更多笔记操作"
      />
      <p role="status">
        {message}更多操作{expanded ? "已展开" : "已收起"}。
      </p>
      <p className="text-sm text-muted-foreground">
        这里只演示操作回调，不修改真实笔记。
      </p>
    </section>
  );
}
