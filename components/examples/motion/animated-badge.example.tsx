"use client";

import { useState } from "react";
import { AnimatedBadge, type AnimatedBadgeStatus } from "@/components/motion/animated-badge";

const phases: { status: AnimatedBadgeStatus; label: string }[] = [
  { status: "neutral", label: "待检查" },
  { status: "loading", label: "检查中" },
  { status: "success", label: "检查完成" },
];

export function AnimatedBadgeExample() {
  const [phase, setPhase] = useState(0);
  const current = phases[phase];
  return (
    <section className="space-y-3">
      <h2 className="font-medium">草稿状态 · 本地演示</h2>
      <div role="status"><AnimatedBadge status={current.status} contentKey={phase}>{current.label}</AnimatedBadge></div>
      <button type="button" className="block rounded-lg border border-border px-3 py-2 text-sm" onClick={() => setPhase((phase + 1) % phases.length)}>
        {phase === phases.length - 1 ? "重置状态" : "切换到下一状态"}
      </button>
    </section>
  );
}
