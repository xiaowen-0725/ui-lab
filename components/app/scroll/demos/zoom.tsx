"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { ScrollFrame } from "./scroll-frame";

const COPY = {
  zh: {
    badge: "焦点对象",
    title: "让一个时刻成为中心。",
    body: "缩放只到 1。卡片平稳抵达，而不是向读者猛扑过来。",
  },
  en: {
    badge: "Focus object",
    title: "Let one moment become the center.",
    body: "Scale stops at one. The card arrives; it never lunges toward the reader.",
  },
} as const;

export function ZoomDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const copy = locale === "zh" ? COPY.zh : COPY.en;
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: targetRef,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

  return (
    <ScrollFrame containerRef={containerRef}>
      <div className="px-5 pb-72 pt-72">
        <motion.article
          ref={targetRef}
          className="relative mx-auto min-h-72 max-w-xl overflow-hidden rounded-3xl border border-primary/25 bg-primary/10 p-7"
          style={reducedMotion ? { opacity: 1, scale: 1 } : { opacity, scale }}
        >
          <div
            aria-hidden="true"
            className="grid-noise absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]"
          />
          <div className="relative">
            <span className="inline-flex rounded-full border border-primary/25 bg-background/70 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-primary">
              {copy.badge}
            </span>
            <h3 className="mt-20 max-w-sm font-display text-3xl font-semibold tracking-tight text-foreground">
              {copy.title}
            </h3>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {copy.body}
            </p>
          </div>
        </motion.article>
      </div>
    </ScrollFrame>
  );
}
