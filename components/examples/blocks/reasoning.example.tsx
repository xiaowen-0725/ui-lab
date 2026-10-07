"use client";

import { useState } from "react";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/agents/reasoning";

export function ReasoningExample() {
  const [open, setOpen] = useState(true);

  return (
    <section className="mx-auto max-w-lg space-y-4 rounded-xl border border-border bg-card p-6 text-foreground">
      <h2 className="text-lg font-semibold">卡片布局建议</h2>
      <Reasoning open={open} onOpenChange={setOpen} isStreaming={false} duration={3}>
        <ReasoningTrigger getThinkingMessage={(_, duration) => `查看示例分析过程 · ${duration} 秒`} />
        <ReasoningContent><ol className="list-decimal space-y-2 pl-5"><li>标题是阅读起点，应保持清晰的字号层级。</li><li>说明文字保持短句，降低阅读负担。</li><li>主操作放在内容之后，形成自然的阅读顺序。</li></ol></ReasoningContent>
      </Reasoning>
      <p className="text-sm">建议采用标题、说明、操作的纵向布局。</p>
      <p role="status" className="text-sm text-muted-foreground">示例分析过程已{open ? "展开" : "收起"}；内容与耗时均为本地演示数据。</p>
    </section>
  );
}
