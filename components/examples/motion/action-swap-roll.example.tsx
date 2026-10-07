"use client";

import { useState } from "react";
import { ActionSwapRollButton } from "@/components/motion/action-swap-roll";

export function ActionSwapRollExample() {
  const [value, setValue] = useState("week");
  return (
    <section className="space-y-3 rounded-xl border border-border p-6">
      <h2 className="font-medium">统计周期</h2>
      <ActionSwapRollButton
        items={[{ id: "week", label: "本周" }, { id: "month", label: "本月" }, { id: "year", label: "本年" }]}
        value={value}
        onValueChange={setValue}
      />
      <p role="status">演示完成量：{value === "week" ? 12 : value === "month" ? 48 : 520} 项</p>
    </section>
  );
}
