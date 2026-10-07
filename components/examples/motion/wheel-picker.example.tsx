"use client";

import { useState } from "react";
import { WheelPicker } from "@/components/motion/wheel-picker";

const times = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00"];

export function WheelPickerExample() {
  const [time, setTime] = useState("10:00");
  return (
    <section className="w-full max-w-xs space-y-3">
      <h2 className="font-medium">选择提醒时间</h2>
      <WheelPicker options={times} value={time} onValueChange={setTime} aria-label="提醒时间" />
      <p role="status" className="text-sm text-muted-foreground">当前选择：{time}。可滚动、拖动或使用方向键选择。</p>
    </section>
  );
}
