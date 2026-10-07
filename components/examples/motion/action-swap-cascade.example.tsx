"use client";

import { useState } from "react";
import { ActionSwapCascadeButton } from "@/components/motion/action-swap-cascade";

export function ActionSwapCascadeExample() {
  const [value, setValue] = useState("summary");
  return (
    <section className="space-y-3 rounded-xl border border-border p-6">
      <h2 className="font-medium">内容视图</h2>
      <ActionSwapCascadeButton
        items={[{ id: "summary", label: "查看摘要" }, { id: "details", label: "查看详细内容" }]}
        value={value}
        onValueChange={setValue}
      />
      <p role="status">{value === "summary" ? "摘要：本周完成三项界面优化。" : "详情：改进表单反馈、键盘导航与移动端布局。"}</p>
    </section>
  );
}
