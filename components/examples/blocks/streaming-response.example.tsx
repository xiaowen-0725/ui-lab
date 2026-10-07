"use client";

import { useEffect, useState } from "react";
import { StreamingResponse, type StreamingResponseFeedback } from "@/components/agents/streaming-response";

const chunks = ["这是本地流式回复演示。", "先明确界面的目标，", "再把内容分成标题、说明和操作，", "最后检查每个操作是否有清楚的反馈。"];

export function StreamingResponseExample() {
  const [visible, setVisible] = useState(1);
  const [feedback, setFeedback] = useState<StreamingResponseFeedback>(null);
  const [result, setResult] = useState("可评价回复或重播");
  const complete = visible >= chunks.length;

  useEffect(() => {
    if (visible >= chunks.length) return;
    const timer = window.setTimeout(() => setVisible((value) => value + 1), 500);
    return () => window.clearTimeout(timer);
  }, [visible]);

  return (
    <section className="mx-auto max-w-xl space-y-4 rounded-xl border border-border bg-card p-6 text-foreground">
      <p className="text-xs text-muted-foreground">固定文本分段显示，不调用模型或接口。</p>
      <StreamingResponse status={complete ? "complete" : "streaming"} feedback={feedback}
        onFeedbackChange={(value) => { setFeedback(value); setResult(value === "up" ? "已在本地标记为有帮助" : value === "down" ? "已在本地标记为需要改进" : "已取消本地反馈"); }}
        onRetry={() => { setVisible(1); setFeedback(null); setResult("本地文本已重播"); }}
      >
        <p>{chunks.slice(0, visible).join("")}{complete ? null : <span aria-hidden="true">▍</span>}</p>
      </StreamingResponse>
      <p role="status" className="text-sm text-muted-foreground">{complete ? `回复演示已完成。${result}` : "本地文本正在逐段显示"}</p>
    </section>
  );
}
