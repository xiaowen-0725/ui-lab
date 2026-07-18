"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { ScrollFrame } from "./scroll-frame";

const COPY = {
  zh: {
    eyebrow: "现场笔记 04",
    title: "轻轻画出远近。",
    body: "阅读层正常滚动，只有装饰背景在它身后缓慢漂移。",
    cards: ["更安静的地平线", "景深不抢注意力", "文案始终可读"],
  },
  en: {
    eyebrow: "Field notes 04",
    title: "Distance, drawn gently.",
    body: "The reading layer moves normally. Only the decorative field drifts behind it.",
    cards: ["A quieter horizon", "Depth without distraction", "Copy stays readable"],
  },
} as const;

export function ParallaxDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const copy = locale === "zh" ? COPY.zh : COPY.en;
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ container: containerRef });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <ScrollFrame containerRef={containerRef}>
      <div className="relative min-h-[860px] overflow-hidden">
        <motion.div
          aria-hidden="true"
          className="grid-noise absolute -inset-x-20 -top-32 h-[620px] bg-[radial-gradient(circle_at_50%_35%,color-mix(in_oklch,var(--primary)_32%,transparent),transparent_58%)] opacity-90"
          style={reducedMotion ? undefined : { y: backgroundY }}
        >
          <div className="absolute left-[18%] top-44 h-36 w-36 rounded-full border border-primary/25 bg-primary/10" />
          <div className="absolute right-[12%] top-24 h-52 w-52 rounded-full border border-border bg-background/20" />
        </motion.div>

        <div className="relative z-10 px-6 pb-28 pt-36">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            {copy.eyebrow}
          </p>
          <h3 className="mt-3 max-w-md font-display text-4xl font-semibold tracking-tight text-foreground">
            {copy.title}
          </h3>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {copy.body}
          </p>

          <div className="mt-40 grid gap-4 sm:grid-cols-3">
            {copy.cards.map((label, index) => (
              <article
                key={label}
                className="rounded-2xl border border-border bg-background/90 p-4 shadow-sm"
              >
                <span className="font-mono text-[0.65rem] text-muted-foreground">
                  0{index + 1}
                </span>
                <p className="mt-8 text-sm font-medium text-foreground">{label}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </ScrollFrame>
  );
}
