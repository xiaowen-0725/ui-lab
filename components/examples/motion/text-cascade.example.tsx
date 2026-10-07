"use client";

import { useState } from "react";
import { TextCascade } from "@/components/motion/text-cascade";

const stages = ["整理想法", "绘制草图", "检查细节"];

export function TextCascadeExample() {
  const [stage, setStage] = useState(0);

  return (
    <section className="mx-auto max-w-md space-y-4 rounded-xl border border-border bg-card p-6 text-foreground">
      <h2 className="text-sm text-muted-foreground">设计练习的当前阶段</h2>
      <TextCascade text={stages[stage]} className="text-2xl font-semibold" />
      <button type="button" onClick={() => setStage((value) => (value + 1) % stages.length)} className="rounded-lg border border-border px-3 py-2 text-sm">切换阶段</button>
      <p role="status" className="text-sm text-muted-foreground">第 {stage + 1} 阶段：{stages[stage]}</p>
    </section>
  );
}
