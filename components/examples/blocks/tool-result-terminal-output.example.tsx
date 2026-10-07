"use client";

import { useState } from "react";
import { ToolResult, ToolResultOutput } from "@/components/agents/tool-result";

const OUTPUT = "本地文件检查（示例输出）\n✓ 笔记目录存在\n✓ 3 篇笔记格式正确\n检查结束：0 个错误";

export function ToolResultTerminalOutputExample() {
  const [open, setOpen] = useState(true);
  const [runs, setRuns] = useState(1);
  const [copyable, setCopyable] = useState(true);
  const [feedback, setFeedback] = useState("展示预置终端输出，不执行系统命令。");

  return (
    <div className="w-full max-w-xl space-y-3">
      <ToolResult
        tool="终端"
        title="检查笔记格式"
        kind="terminal"
        status="success"
        meta={`本地演示第 ${runs} 次`}
        open={open}
        onOpenChange={setOpen}
        collapseOnComplete={false}
        copyText={copyable ? OUTPUT : undefined}
        onCopy={copyable ? async () => {
          try {
            await navigator.clipboard.writeText(OUTPUT);
            setFeedback("示例终端输出已复制。");
          } catch {
            setCopyable(false);
            setFeedback("当前环境无法写入剪贴板，请从展开的输出中手动复制。");
          }
        } : undefined}
        onRetry={() => {
          setRuns((count) => count + 1);
          setOpen(true);
          setFeedback("已重新展示本地检查结果，不执行系统命令。");
        }}
      >
        <ToolResultOutput language="text">{OUTPUT}</ToolResultOutput>
      </ToolResult>
      <p role="status" className="text-sm text-muted-foreground">{feedback}</p>
    </div>
  );
}
