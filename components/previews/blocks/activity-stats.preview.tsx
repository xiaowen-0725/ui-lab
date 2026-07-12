"use client";

import { useState } from "react";
import {
  ActivityHeatmap,
  StatsBar,
  StatsItem,
  StatsPeriodTabs,
} from "@/components/motion/activity-stats";
import { AnimatedNumber } from "@/components/motion/animated-number";

const WEEKS = 52;
const DENSE_WEEKS = 12;

/** Deterministic PRNG (Mulberry32) — same seed always produces the same
 * sequence, so the heatmap renders identically on every load and on the
 * server. Never swap this for `Math.random`/`Date.now`. */
function mulberry32(seed: number) {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Simulates a realistic usage curve — sparse in the older weeks, dense over the most recent `DENSE_WEEKS`. */
function generateActivity(seed: number): number[] {
  const rand = mulberry32(seed);
  const data: number[] = [];
  const rampWeeks = WEEKS - DENSE_WEEKS;
  for (let week = 0; week < WEEKS; week++) {
    const intensity =
      week >= rampWeeks
        ? 0.75 + 0.25 * ((week - rampWeeks) / DENSE_WEEKS)
        : 0.12 + 0.45 * (week / rampWeeks);
    for (let day = 0; day < 7; day++) {
      const skip = rand() > intensity + 0.15;
      data.push(skip ? 0 : Math.round(rand() * intensity * 100));
    }
  }
  return data;
}

// One fixed seed per period tab — switching tabs swaps in a visibly
// different (but still deterministic) dataset for the demo.
const DATASETS: Record<string, number[]> = {
  daily: generateActivity(7),
  weekly: generateActivity(23),
  total: generateActivity(91),
};

const MONTH_LABELS = [
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
];
const MONTHS = MONTH_LABELS.map((label, i) => ({
  label,
  week: Math.round((i * WEEKS) / MONTH_LABELS.length),
}));

const PERIODS = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "total", label: "Total" },
];

export function ActivityStatsPreview() {
  const [period, setPeriod] = useState("daily");
  const data = DATASETS[period];

  return (
    <div className="flex w-full items-center justify-center rounded-xl border border-border bg-neutral-100 px-4 py-10 dark:bg-neutral-900">
      <div className="flex w-full max-w-2xl flex-col gap-6">
        <StatsBar>
          <StatsItem
            value={<AnimatedNumber value={3.28} format={(n) => `${n.toFixed(2)}B`} />}
            label="tokens"
          />
          <StatsItem
            value={<AnimatedNumber value={350} format={(n) => `${Math.round(n)}M`} />}
            label="peak"
          />
          <StatsItem
            value={
              <AnimatedNumber
                value={204}
                format={(n) => `${Math.floor(n / 60)}h ${Math.round(n % 60)}m`}
              />
            }
            label="longest task"
          />
          <StatsItem
            value={<AnimatedNumber value={3} format={(n) => `${Math.round(n)}`} />}
            label="day streak"
          />
          <StatsItem
            value={<AnimatedNumber value={9} format={(n) => `${Math.round(n)}`} />}
            label="day best streak"
          />
        </StatsBar>
        <div>
          <div className="flex items-center justify-between gap-3 pb-3">
            <div className="text-sm font-medium">Token activity</div>
            <StatsPeriodTabs options={PERIODS} value={period} onChange={setPeriod} />
          </div>
          <ActivityHeatmap data={data} weeks={WEEKS} months={MONTHS} />
        </div>
      </div>
    </div>
  );
}
