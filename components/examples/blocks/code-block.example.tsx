"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/agents/code-block";

const CODE = 'export const readingPlan = {\n  title: "周末阅读",\n  chapters: 1,\n  note: "记录三个值得回顾的观点",\n};';

export function CodeBlockExample() {
  const [copyable, setCopyable] = useState(true);
  const [feedback, setFeedback] = useState("这段代码使用本地固定内容。");

  return (
    <div className="w-full max-w-xl space-y-3">
      <CodeBlock code={CODE} language="typescript" filename="reading-plan.ts" highlightLines={[2, 4]} copyable={copyable} onCopy={copyable ? async () => {
        try {
          await navigator.clipboard.writeText(CODE);
          setFeedback("阅读计划代码已复制到剪贴板。");
        } catch {
          setCopyable(false);
          setFeedback("当前环境无法写入剪贴板，请在代码区域手动选择并复制。");
        }
      } : undefined} />
      <p role="status" className="text-sm text-muted-foreground">{feedback}</p>
    </div>
  );
}
