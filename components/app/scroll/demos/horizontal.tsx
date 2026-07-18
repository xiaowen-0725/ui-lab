"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { ScrollFrame } from "./scroll-frame";

const COPY = {
  zh: {
    stage: "阶段",
    steps: [
      ["01", "画框", "先划出一个有边界的视口。"],
      ["02", "钉住", "让画廊舞台保持原位。"],
      ["03", "映射", "把纵向进度转换成 x。"],
      ["04", "横移", "确保每张卡都能抵达。"],
      ["05", "释放", "最后回到正常文档流。"],
    ],
  },
  en: {
    stage: "Stage",
    steps: [
      ["01", "Frame", "Set one bounded viewport."],
      ["02", "Pin", "Hold the gallery stage."],
      ["03", "Map", "Turn vertical progress into x."],
      ["04", "Travel", "Keep every card reachable."],
      ["05", "Release", "Return to normal flow."],
    ],
  },
} as const;

export function HorizontalDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const copy = locale === "zh" ? COPY.zh : COPY.en;
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ container: containerRef });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-62%"]);

  return (
    <ScrollFrame containerRef={containerRef}>
      <div className="relative min-h-[1080px]">
        <div className="sticky top-0 flex h-[378px] items-center overflow-hidden pt-8">
          <div className={cn("w-full", reducedMotion && "overflow-x-auto overscroll-x-contain")}>
            <motion.div
              className="flex w-max gap-4 px-6"
              style={reducedMotion ? undefined : { x }}
            >
              {copy.steps.map(([number, title, body], index) => (
                <article
                  key={number}
                  className="flex h-64 w-64 shrink-0 flex-col justify-between rounded-3xl border border-border bg-background p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-primary">{number}</span>
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  <div>
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                      {copy.stage} {index + 1}
                    </span>
                    <h3 className="mt-3 text-xl font-semibold text-foreground">{title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{body}</p>
                  </div>
                </article>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </ScrollFrame>
  );
}
