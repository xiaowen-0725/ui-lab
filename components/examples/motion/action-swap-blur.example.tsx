"use client";

import { useState } from "react";
import { ActionSwapBlurButton } from "@/components/motion/action-swap-blur";

export function ActionSwapBlurExample() {
  const [value, setValue] = useState("off");
  return (
    <section className="space-y-3 rounded-xl border border-border p-6">
      <h2 className="font-medium">专注模式</h2>
      <ActionSwapBlurButton
        items={[{ id: "off", label: "开启专注" }, { id: "on", label: "退出专注" }]}
        value={value}
        aria-pressed={value === "on"}
        onValueChange={setValue}
      />
      <p role="status">{value === "on" ? "已在本地隐藏次要信息。" : "显示完整阅读信息。"}</p>
      {value === "off" && <p className="text-sm text-muted-foreground">次要信息：这是一篇约需五分钟阅读的演示文章。</p>}
    </section>
  );
}
