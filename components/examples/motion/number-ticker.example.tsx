"use client";

import { useState } from "react";
import { NumberTicker } from "@/components/motion/number-ticker";

export function NumberTickerExample() {
  const [count, setCount] = useState(99);
  return (
    <section className="space-y-3 rounded-xl border border-border p-6">
      <h2 className="font-medium">演示访问计数</h2>
      <NumberTicker value={count} pad={4} suffix=" 次" startOnView={false} className="text-4xl font-semibold" />
      <div className="flex gap-2">
        <button type="button" className="rounded-md border border-border px-3 py-2" onClick={() => setCount((value) => value + 1)}>增加一次</button>
        <button type="button" className="rounded-md border border-border px-3 py-2" onClick={() => setCount(99)}>重置</button>
      </div>
      <p role="status">本地计数：{count}</p>
    </section>
  );
}
