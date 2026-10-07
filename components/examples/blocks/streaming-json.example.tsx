"use client";

import { useEffect, useState } from "react";
import { StreamingFunctionCall, StreamingJson } from "@/components/motion/streaming-json/index";

const DEMO_JSON = JSON.stringify({ title: "阅读计划", tasks: ["阅读文档", "整理笔记"], completed: false }, null, 2);

export function StreamingJsonExample() {
  const [length, setLength] = useState(12);
  const [streaming, setStreaming] = useState(false);
  useEffect(() => {
    if (!streaming) return;
    if (length >= DEMO_JSON.length) {
      setStreaming(false);
      return;
    }
    const timer = window.setTimeout(() => setLength((value) => Math.min(DEMO_JSON.length, value + 6)), 80);
    return () => window.clearTimeout(timer);
  }, [length, streaming]);

  return (
    <section className="max-w-xl space-y-4">
      <h2 className="font-medium">本地结构化输出演示</h2>
      <StreamingJson text={DEMO_JSON.slice(0, length)} streaming={streaming} />
      <StreamingFunctionCall name="create_reading_plan" text={DEMO_JSON.slice(0, length)} streaming={streaming || length < DEMO_JSON.length} />
      <div className="flex gap-2">
        <button type="button" disabled={streaming} className="rounded-md border border-border px-3 py-2 disabled:opacity-50" onClick={() => { setLength(0); setStreaming(true); }}>播放本地数据流</button>
        <button type="button" disabled={!streaming} className="rounded-md border border-border px-3 py-2 disabled:opacity-50" onClick={() => setStreaming(false)}>暂停</button>
      </div>
      <p role="status">{streaming ? "正在逐段显示本地 JSON。" : length === DEMO_JSON.length ? "本地数据展示完成，未调用工具。" : "当前是尚未闭合的 JSON 片段。"}</p>
    </section>
  );
}
