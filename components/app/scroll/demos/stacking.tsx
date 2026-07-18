"use client";

import { useReducedMotion, useScroll } from "motion/react";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { ScrollFrame } from "./scroll-frame";

const COPY = {
  zh: {
    layer: "层",
    cards: [
      ["01", "发出信号", "从一个毫不含糊的观点开始。"],
      ["02", "排成顺序", "让每张卡都在故事里有自己的位置。"],
      ["03", "逐层累积", "露出足够边缘，让人记得前面的层。"],
      ["04", "完成收束", "在结尾自然释放整个卡组。"],
    ],
  },
  en: {
    layer: "Layer",
    cards: [
      ["01", "Signal", "Start with one unmistakable idea."],
      ["02", "Sequence", "Give every card a place in the story."],
      ["03", "Accumulate", "Leave enough edge to remember the layers."],
      ["04", "Resolve", "Release the whole stack at the ending."],
    ],
  },
} as const;

export function StackingDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const copy = locale === "zh" ? COPY.zh : COPY.en;
  const reducedMotion = useReducedMotion();
  useScroll({ container: containerRef });

  return (
    <ScrollFrame containerRef={containerRef}>
      <div className="min-h-[1120px] px-5 pb-80 pt-20">
        {copy.cards.map(([number, title, body], index) => (
          <article
            key={number}
            className="sticky mb-12 flex h-44 flex-col justify-between rounded-3xl border border-border bg-background p-6 shadow-sm"
            style={{
              top: 52 + index * 20,
              transform: reducedMotion ? undefined : `scale(${1 - index * 0.018})`,
              transformOrigin: "top center",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs text-primary">{number}</span>
              <span className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">
                {copy.layer} {index + 1}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-foreground">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{body}</p>
            </div>
          </article>
        ))}
      </div>
    </ScrollFrame>
  );
}
