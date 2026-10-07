"use client";

import { useState } from "react";
import {
  AvailabilityScheduler,
  defaultWeek,
  type DayKey,
  type WeekAvailability,
} from "@/components/motion/availability-scheduler/index";

const dayNames: Record<DayKey, string> = {
  mon: "周一",
  tue: "周二",
  wed: "周三",
  thu: "周四",
  fri: "周五",
  sat: "周六",
  sun: "周日",
};

export function AvailabilitySchedulerExample() {
  const [week, setWeek] = useState<WeekAvailability>(defaultWeek);
  const [message, setMessage] = useState(
    "工作日默认 09:00–17:00 可用；可以增减时段、复制或关闭某一天。",
  );

  return (
    <section className="max-w-xl space-y-4">
      <h2 className="text-lg font-semibold">编辑每周可用时间</h2>
      <AvailabilityScheduler
        value={week}
        onChange={(next) => {
          setWeek(next);
          setMessage("可用时间已更新到本地演示状态。");
        }}
        step={30}
      />
      <div className="rounded-lg bg-muted p-4">
        <h3 className="mb-2 font-medium">当前时间安排</h3>
        <ul className="space-y-1 text-sm">
          {(Object.keys(dayNames) as DayKey[]).map((day) => (
            <li key={day}>
              {dayNames[day]}：
              {week[day].enabled
                ? week[day].ranges
                    .map((range) => `${range.start}–${range.end}`)
                    .join("、") || "尚未添加时段"
                : "不可用"}
            </li>
          ))}
        </ul>
      </div>
      <p role="status" className="text-sm">
        {message}
      </p>
      <button
        type="button"
        className="rounded-lg border border-border px-3 py-2"
        onClick={() => {
          setWeek(defaultWeek());
          setMessage("已恢复默认时间安排。");
        }}
      >
        恢复默认安排
      </button>
    </section>
  );
}
