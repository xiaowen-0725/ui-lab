"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/motion/select";

const options = ["每日摘要", "每周摘要", "仅重要更新"];

export function SelectExample() {
  const [value, setValue] = useState("每周摘要");
  return (
    <section className="w-full max-w-xs space-y-3">
      <h2 className="font-medium">通知频率</h2>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger><span className="sr-only">通知频率：</span><SelectValue placeholder="选择通知频率" /></SelectTrigger>
        <SelectContent>
          {options.map((option) => <SelectItem key={option} value={option}>{option}</SelectItem>)}
        </SelectContent>
      </Select>
      <p role="status" className="text-sm text-muted-foreground">当前通知频率：{value}</p>
    </section>
  );
}
