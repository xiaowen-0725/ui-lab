"use client";

import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/motion/radio";

export function RadioExample() {
  const [format, setFormat] = useState("简要摘要");
  return (
    <fieldset className="w-full max-w-sm space-y-3">
      <legend className="mb-3 font-medium">报告格式</legend>
      <RadioGroup value={format} onValueChange={setFormat}>
        <RadioGroupItem value="简要摘要" label="简要摘要 · 一页以内" />
        <RadioGroupItem value="详细报告" label="详细报告 · 包含数据说明" />
        <RadioGroupItem value="演示文稿" label="演示文稿 · 暂未开放" disabled />
      </RadioGroup>
      <p role="status" className="text-sm text-muted-foreground">已选择：{format}</p>
    </fieldset>
  );
}
