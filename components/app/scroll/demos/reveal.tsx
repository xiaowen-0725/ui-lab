"use client";

import { motion, useReducedMotion, useScroll } from "motion/react";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { EASE_OUT } from "@/lib/ease";
import { ScrollFrame } from "./scroll-frame";

const COPY = {
  zh: [
    ["观察", "从读者肉眼能看到的事物开始。"],
    ["命名", "给这个行为贴上准确的手法名称。"],
    ["解释", "说明什么时候值得使用这种手法。"],
    ["约束", "定下动效、范围与无障碍边界。"],
    ["复制", "带走另一位构建者也能使用的话。"],
    ["应用", "复现思路，而不是照搬表面。"],
  ],
  en: [
    ["Observe", "Begin with the thing the reader can see."],
    ["Name", "Attach a precise pattern name to the behavior."],
    ["Explain", "Say when the technique earns its place."],
    ["Constrain", "Set motion, scope, and accessibility limits."],
    ["Copy", "Leave with language another builder can use."],
    ["Apply", "Recreate the idea without copying the surface."],
  ],
} as const;

export function RevealDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const copy = locale === "zh" ? COPY.zh : COPY.en;
  const reducedMotion = useReducedMotion();
  useScroll({ container: containerRef });

  return (
    <ScrollFrame containerRef={containerRef}>
      <div className="space-y-16 px-5 pb-28 pt-28">
        {copy.map(([title, body], index) => (
          <motion.article
            key={title}
            initial={reducedMotion ? false : "hidden"}
            whileInView={reducedMotion ? undefined : "visible"}
            viewport={{ root: containerRef, amount: 0.4, once: false }}
            variants={{
              hidden: {
                opacity: 0,
                y: 16,
                transition: { duration: 0.16, ease: EASE_OUT },
              },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.24, delay: index * 0.02, ease: EASE_OUT },
              },
            }}
            className="rounded-2xl border border-border bg-background p-6"
          >
            <span className="font-mono text-[0.65rem] text-primary">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-6 text-lg font-semibold text-foreground">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
          </motion.article>
        ))}
      </div>
    </ScrollFrame>
  );
}
