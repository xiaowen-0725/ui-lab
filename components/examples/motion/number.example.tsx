"use client";

import { useState } from "react";
import { AnimatedNumber } from "@/components/motion/animated-number";

export function NumberExample() {
  const [completed, setCompleted] = useState(128);
  return (
    <section className="space-y-3 rounded-xl border border-border p-6">
      <h2 className="font-medium">本地任务计数</h2>
      <p className="text-3xl"><AnimatedNumber value={completed} startOnView={false} format={(value) => `${Math.round(value)} 项`} /></p>
      <button type="button" className="rounded-md border border-border px-3 py-2" onClick={() => setCompleted((value) => value + 1)}>完成一项</button>
      <p role="status" className="text-sm text-muted-foreground">当前累计 {completed} 项</p>
    </section>
  );
}
