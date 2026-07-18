"use client";

import { motion, useScroll } from "motion/react";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { ScrollFrame } from "./scroll-frame";

const COPY = {
  zh: {
    eyebrow: "阅读笔记 · 约 6 分钟",
    title: "进度属于读者。",
    body: "为一条漫长但有终点的路径，留下一枚安静信号。",
    paragraphs: [
      "当读者已经进入一段有明确终点的内容时，进度提示最有价值。",
      "进度条与文章属于同一个视口，它的意义不应受页面上下方的外壳影响。",
      "用 scaleX 更新可以留在合成层，避免每一帧都重新测量宽度。",
      "这段运动传达的是位置，所以在减少装饰性动效时仍然有用。",
      "读到最后一行时，进度条应与局部滚动容器同时准确抵达终点。",
    ],
  },
  en: {
    eyebrow: "Reading note · 06 min",
    title: "Progress belongs to the reader.",
    body: "A quiet signal for a long, bounded path.",
    paragraphs: [
      "A progress indicator is useful when the reader has committed to a finite piece of content.",
      "The bar belongs to the same viewport as the article. Its meaning should never depend on page chrome above or below it.",
      "Animating scaleX keeps the update on the compositor and avoids measuring a new width on every frame.",
      "Because this motion communicates position, it remains useful when decorative motion has been reduced.",
      "At the final line, the bar reaches its endpoint at exactly the same moment as the local scroller.",
    ],
  },
} as const;

export function ProgressDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const copy = locale === "zh" ? COPY.zh : COPY.en;
  const { scrollYProgress } = useScroll({ container: containerRef });

  return (
    <ScrollFrame containerRef={containerRef}>
      <motion.div
        aria-hidden="true"
        className="sticky top-0 z-30 h-1 origin-left bg-primary"
        style={{ scaleX: scrollYProgress }}
      />
      <article className="mx-auto max-w-xl px-6 pb-32 pt-24">
        <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">
          {copy.eyebrow}
        </span>
        <h3 className="mt-4 font-display text-3xl font-semibold tracking-tight text-foreground">
          {copy.title}
        </h3>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {copy.body}
        </p>
        <div className="mt-16 space-y-14">
          {copy.paragraphs.map((paragraph, index) => (
            <section key={paragraph}>
              <span className="font-mono text-[0.65rem] text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-base leading-8 text-foreground/85">{paragraph}</p>
            </section>
          ))}
        </div>
      </article>
    </ScrollFrame>
  );
}
