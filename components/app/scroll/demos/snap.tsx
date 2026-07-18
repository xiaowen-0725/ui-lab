"use client";

import { useScroll } from "motion/react";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { ScrollFrame } from "./scroll-frame";

const COPY = {
  zh: [
    ["01", "抵达", "一次手势，落在一个完整观点上。"],
    ["02", "聚焦", "画框先落稳，阅读再开始。"],
    ["03", "前进", "底层依然由原生滚动完成。"],
    ["04", "收尾", "最后一屏也准确落位。"],
  ],
  en: [
    ["01", "Arrive", "One gesture, one complete thought."],
    ["02", "Focus", "The frame settles before reading begins."],
    ["03", "Advance", "Native scrolling still does the work."],
    ["04", "Finish", "The last panel lands cleanly."],
  ],
} as const;

export function SnapDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const panels = locale === "zh" ? COPY.zh : COPY.en;
  // Scroll snapping is native CSS. This scoped Motion observer is deliberately
  // kept so every demo exposes the same isolation boundary for verification.
  useScroll({ container: containerRef });

  return (
    <ScrollFrame containerRef={containerRef} className="snap-y snap-mandatory">
      {panels.map(([number, title, body], index) => (
        <section
          key={number}
          className="flex h-full min-h-full snap-start snap-always items-end p-6"
        >
          <div className="relative w-full overflow-hidden rounded-3xl border border-border bg-background p-7">
            <span
              aria-hidden="true"
              className="absolute -right-4 -top-10 font-display text-[8rem] font-semibold leading-none text-primary/10"
            >
              {number}
            </span>
            <span className="font-mono text-xs text-primary">{number} / 04</span>
            <h3 className="relative mt-24 font-display text-3xl font-semibold text-foreground">
              {title}
            </h3>
            <p className="relative mt-3 text-sm text-muted-foreground">{body}</p>
            <div className="relative mt-8 flex gap-1.5">
              {panels.map((panel, dotIndex) => (
                <span
                  key={panel[0]}
                  className={
                    dotIndex === index
                      ? "h-1.5 w-8 rounded-full bg-primary"
                      : "h-1.5 w-1.5 rounded-full bg-border"
                  }
                />
              ))}
            </div>
          </div>
        </section>
      ))}
    </ScrollFrame>
  );
}
