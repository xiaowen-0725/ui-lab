"use client";

import { useState } from "react";
import { ActivityHeatmap, StatsBar, StatsItem, StatsPeriodTabs } from "@/components/motion/activity-stats/index";

const PERIODS = [
  { value: "month", label: "近四周" },
  { value: "quarter", label: "近十二周" },
];
// 固定演示数据：按周列排列，每周七天，服务端与客户端得到同一组数值。
const MONTH = Array.from({ length: 28 }, (_, index) => (index * 3 + 2) % 8);
const QUARTER = Array.from({ length: 84 }, (_, index) => (index * 5 + 1) % 10);

export function ActivityStatsExample() {
  const [period, setPeriod] = useState("month");
  const data = period === "month" ? MONTH : QUARTER;
  const weeks = period === "month" ? 4 : 12;
  const total = data.reduce((sum, count) => sum + count, 0);

  return (
    <section className="w-full max-w-lg space-y-5 rounded-xl border border-border p-5">
      <h2 className="font-medium">学习记录统计</h2>
      <StatsBar>
        <StatsItem value={total} label="记录总数" />
        <StatsItem value={data.filter((count) => count > 0).length} label="活跃天数" />
        <StatsItem value={Math.max(...data)} label="单日最多" />
      </StatsBar>
      <StatsPeriodTabs options={PERIODS} value={period} onChange={setPeriod} />
      <ActivityHeatmap data={data} weeks={weeks}
        months={period === "month" ? [{ label: "九月", week: 0 }] : [{ label: "七月", week: 0 }, { label: "八月", week: 4 }, { label: "九月", week: 8 }]}
        cellTitle={(index, count) => `第 ${index + 1} 天：${count} 条学习记录`}
      />
      <p role="status" className="text-sm text-muted-foreground">当前展示{period === "month" ? "近四周" : "近十二周"}的本地演示数据，共 {total} 条记录。</p>
    </section>
  );
}
