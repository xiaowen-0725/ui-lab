"use client";

import { useState } from "react";
import { MorphTooltip, MorphTooltipGroup } from "@/components/motion/tooltip-morph";

export function TooltipMorphExample() {
  const [alignment, setAlignment] = useState("left");
  return (
    <section className="space-y-4 p-8">
      <h2 className="font-medium">文本对齐工具栏</h2>
      <MorphTooltipGroup className="flex gap-2">
        {[{ id: "left", label: "左对齐" }, { id: "center", label: "居中对齐" }, { id: "right", label: "右对齐" }].map((item) => (
          <MorphTooltip key={item.id} content={`将段落设为${item.label}`}>
            <button type="button" aria-pressed={alignment === item.id} onClick={() => setAlignment(item.id)} className="rounded-md border border-border px-3 py-2">{item.label}</button>
          </MorphTooltip>
        ))}
      </MorphTooltipGroup>
      <p role="status" className={alignment === "left" ? "text-left" : alignment === "center" ? "text-center" : "text-right"}>这一段文字会跟随所选对齐方式。</p>
    </section>
  );
}
