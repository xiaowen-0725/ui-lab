"use client";

import { useState } from "react";
import { ToolResult } from "@/components/agents/tool-result";

export function ToolResultExample() {
  const [open, setOpen] = useState(true);
  const [retried, setRetried] = useState(false);
  const [feedback, setFeedback] = useState("这是本地资料检索演示。");

  return (
    <div className="w-full max-w-xl space-y-3">
      <ToolResult
        tool="资料检索"
        title="查找无障碍设计笔记"
        kind="custom"
        status={retried ? "success" : "error"}
        meta={retried ? "找到 2 条本地示例记录" : "示例索引尚未加载"}
        open={open}
        collapseOnComplete={false}
        onOpenChange={(next) => {
          setOpen(next);
          setFeedback(next ? "已展开检索详情。" : "已收起检索详情。");
        }}
        onRetry={retried ? undefined : () => {
          setRetried(true);
          setOpen(true);
          setFeedback("本地重试完成，示例记录已显示。");
        }}
      >
        {retried ? (
          <ul className="list-inside list-disc p-3 text-sm">
            <li>键盘导航：为主要操作提供可见焦点。</li>
            <li>状态反馈：使用文字说明保存结果。</li>
          </ul>
        ) : (
          <p className="p-3 text-sm">点击重试按钮，加载本地示例记录。</p>
        )}
      </ToolResult>
      <p role="status" className="text-sm text-muted-foreground">{feedback}</p>
      <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => {
        setRetried(false);
        setOpen(true);
        setFeedback("已重置本地检索演示。");
      }}>重置演示</button>
    </div>
  );
}
