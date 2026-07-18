"use client";

import { useScroll } from "motion/react";
import { useLocale } from "next-intl";
import { useRef } from "react";
import { ScrollFrame } from "./scroll-frame";

const COPY = {
  zh: {
    eyebrow: "第二章",
    title: "留下来的标题。",
    body: "参考点保持原位，解释内容从它身旁经过。",
    notes: [
      ["01", "说清这一刻", "每个章节只承担一个明确任务。"],
      ["02", "留住参考点", "让视觉锚点一直留在视野中。"],
      ["03", "让细节经过", "补充说明仍在正常文档流里。"],
      ["04", "自然释放", "钉住效果随所属章节一起结束。"],
      ["05", "窄屏堆叠", "小屏回到单列，但标题仍在局部钉住。"],
    ],
  },
  en: {
    eyebrow: "Chapter two",
    title: "A title that stays.",
    body: "The reference holds while the explanation moves beside it.",
    notes: [
      ["01", "Name the moment", "Give every chapter one clear job."],
      ["02", "Hold the reference", "Keep the visual anchor in view."],
      ["03", "Let detail pass", "Supporting notes stay in normal flow."],
      ["04", "Release naturally", "The pin ends with its own section."],
      ["05", "Stack on mobile", "Small screens use one column while keeping the local pin."],
    ],
  },
} as const;

export function PinnedDemo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const locale = useLocale();
  const copy = locale === "zh" ? COPY.zh : COPY.en;
  // The effect is CSS sticky, but Motion is still scoped to this demo's
  // viewport so the isolation contract stays explicit and auditable.
  useScroll({ container: containerRef });

  return (
    <ScrollFrame containerRef={containerRef}>
      <div className="min-h-[900px] px-5 pb-28 pt-16">
        <div className="grid items-start gap-5 sm:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
          <div className="sticky top-12 self-start rounded-2xl border border-primary/25 bg-primary/10 p-5">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-primary">
              {copy.eyebrow}
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">
              {copy.title}
            </h3>
            <div className="mt-10 h-px bg-primary/25" />
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              {copy.body}
            </p>
          </div>

          <div className="space-y-4">
            {copy.notes.map(([number, title, body]) => (
              <article key={number} className="rounded-2xl border border-border bg-background p-5">
                <span className="font-mono text-[0.65rem] text-muted-foreground">{number}</span>
                <h4 className="mt-7 text-base font-semibold text-foreground">{title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </ScrollFrame>
  );
}
