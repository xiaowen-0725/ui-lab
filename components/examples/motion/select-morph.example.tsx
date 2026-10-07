"use client";

import { useState } from "react";
import { MorphSelect, MorphSelectContent, MorphSelectItem, MorphSelectTrigger, MorphSelectValue } from "@/components/motion/select-morph";

const options = ["每日摘要", "每周摘要", "仅重要更新"];

export function SelectMorphExample() {
  const [value, setValue] = useState("每周摘要");
  return (
    <section className="w-full max-w-xs space-y-3">
      <h2 className="font-medium">通知频率</h2>
      <MorphSelect value={value} onValueChange={setValue}>
        <MorphSelectTrigger><span className="sr-only">通知频率：</span><MorphSelectValue placeholder="选择通知频率" /></MorphSelectTrigger>
        <MorphSelectContent>
          {options.map((option) => <MorphSelectItem key={option} value={option}>{option}</MorphSelectItem>)}
        </MorphSelectContent>
      </MorphSelect>
      <p role="status" className="text-sm text-muted-foreground">当前通知频率：{value}</p>
    </section>
  );
}
