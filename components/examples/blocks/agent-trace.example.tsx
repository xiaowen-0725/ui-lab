"use client";

import { useState } from "react";
import { Trace, TraceGroup, TraceStep, TraceSubagent, TraceSummary } from "@/components/motion/agent-trace/index";

export function AgentTraceExample() {
  const [stage, setStage] = useState(0);
  const [rawOpen, setRawOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(true);
  const [result, setResult] = useState("等待推进本地演示");

  return (
    <section className="mx-auto max-w-xl space-y-4 rounded-xl border border-border bg-background p-5 text-foreground">
      <h2 className="text-lg font-semibold">整理设计资料的示例轨迹</h2>
      <p className="text-sm text-muted-foreground">按钮推进固定的本地步骤，轨迹不连接工具或模型服务。</p>
      <Trace>
        <TraceStep kind="plan" label="规划资料目录" detail="按草图、评审和说明分类。" />
        <TraceStep kind="tool" active={stage === 0} label={stage === 0 ? "等待整理本地示例" : "示例资料已整理"} detail="演示数据包含两份设计文档。" open={rawOpen} onOpenChange={(open) => { setRawOpen(open); setResult(open ? "已展开原始演示数据" : "已收起原始演示数据"); }}>
          <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">{JSON.stringify({ files: ["界面草图.md", "交互评审.md"], source: "本地演示数据" }, null, 2)}</pre>
        </TraceStep>
        {stage >= 1 ? (
          <TraceSubagent label="检查资料完整性" open={reviewOpen} onOpenChange={(open) => { setReviewOpen(open); setResult(open ? "已展开检查步骤" : "已收起检查步骤"); }}>
            <TraceStep kind="done" label="两份文档均有标题" />
            <TraceStep kind="reflection" label="补充下一步建议" detail="为每份草图添加交互说明。" />
          </TraceSubagent>
        ) : null}
        {stage >= 2 ? (
          <>
            <TraceGroup label="示例整理结果"><p className="text-sm">草图：1 份；评审：1 份</p></TraceGroup>
            <TraceStep kind="done" label="本地演示完成" />
            <TraceSummary>共展示 2 份演示文档</TraceSummary>
          </>
        ) : null}
      </Trace>
      <div className="flex gap-2">
        <button type="button" disabled={stage === 2} onClick={() => { setStage((value) => Math.min(value + 1, 2)); setResult(stage === 0 ? "本地整理步骤已完成，检查步骤已出现" : "本地演示完成，整理结果已显示"); }} className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50">推进一步</button>
        <button type="button" onClick={() => { setStage(0); setRawOpen(false); setReviewOpen(true); setResult("本地演示已重置"); }} className="rounded-lg border border-border px-3 py-2 text-sm">重置演示</button>
      </div>
      <p role="status" className="text-sm text-muted-foreground">{result}</p>
    </section>
  );
}
