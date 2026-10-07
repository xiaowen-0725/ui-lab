"use client";

import { useState } from "react";
import { AnimatedNumber } from "@/components/motion/animated-number";

export function AnimatedNumberExample() {
  const [progress, setProgress] = useState(35);
  return (
    <section className="space-y-3 rounded-xl border border-border p-6">
      <h2 className="font-medium">学习进度</h2>
      <AnimatedNumber value={progress} duration={0.5} startOnView={false} format={(value) => `${Math.round(value)}%`} className="text-4xl font-semibold" />
      <div className="flex gap-2">
        <button type="button" disabled={progress === 100} className="rounded-md border border-border px-3 py-2 disabled:opacity-50" onClick={() => setProgress((value) => Math.min(100, value + 15))}>完成下一节</button>
        <button type="button" className="rounded-md border border-border px-3 py-2" onClick={() => setProgress(35)}>重新演示</button>
      </div>
      <p role="status">已完成 {progress}%</p>
    </section>
  );
}
