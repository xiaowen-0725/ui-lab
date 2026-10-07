"use client";

import { useEffect, useState } from "react";
import { AgentProgress } from "@/components/agents/loading-states/agent-progress";

export function AgentProgressExample() {
  const [running, setRunning] = useState(true);
  const [finished, setFinished] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => setSeconds((value) => value + 0.1), 100);
    return () => window.clearInterval(timer);
  }, [running]);

  return (
    <section className="space-y-4 rounded-xl border border-border p-5">
      <h2 className="font-medium">笔记整理进度演示</h2>
      {finished ? (
        <p role="status" className="text-sm">本地演示已结束，用时 {seconds.toFixed(1)} 秒。</p>
      ) : running ? (
        <AgentProgress label="正在整理示例笔记" elapsedSeconds={seconds} />
      ) : (
        <p role="status" className="text-sm">整理演示已暂停，用时 {seconds.toFixed(1)} 秒。</p>
      )}
      <div className="flex gap-2">
        <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => {
          if (finished) setSeconds(0);
          setFinished(false);
          setRunning((value) => finished || !value);
        }}>{finished ? "重新开始" : running ? "暂停" : "开始 / 继续"}</button>
        <button type="button" disabled={finished} className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50" onClick={() => {
          setRunning(false);
          setFinished(true);
        }}>结束演示</button>
      </div>
      <p className="text-sm text-muted-foreground">仅展示本地计时状态，没有调用 Agent 服务。</p>
    </section>
  );
}
