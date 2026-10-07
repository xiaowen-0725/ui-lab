"use client";

import { useState } from "react";
import { ActionSwapButton } from "@/components/motion/action-swap";

export function ActionSwapExample() {
  const [value, setValue] = useState("compact");
  return (
    <section className="space-y-3 rounded-xl border border-border p-6">
      <h2 className="font-medium">阅读密度</h2>
      <ActionSwapButton
        items={[{ id: "compact", label: "紧凑阅读" }, { id: "comfortable", label: "舒适阅读" }]}
        value={value}
        onValueChange={setValue}
      />
      <p role="status">当前布局：{value === "compact" ? "紧凑" : "舒适"}</p>
    </section>
  );
}
