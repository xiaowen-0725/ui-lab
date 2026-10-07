"use client";

import { useId } from "react";
import { ScrollTo } from "@/components/motion/scroll-to";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

export function ScrollToExample() {
  const prefix = `guide-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const sections = [
    {
      id: "prepare",
      title: "准备材料",
      text: "准备纸笔，列出今天想解决的问题。",
    },
    {
      id: "practice",
      title: "动手练习",
      text: "从一个小目标开始，记录实践过程。",
    },
    {
      id: "summary",
      title: "回顾总结",
      text: "整理发现，确定下一次练习的方向。",
    },
  ];

  return (
    <SmoothScroll
      root={false}
      className="relative h-80 overflow-y-auto rounded-xl border border-border bg-background text-foreground"
    >
      <nav
        aria-label="练习指南章节"
        className="sticky top-0 z-10 flex flex-wrap gap-2 bg-background p-3"
      >
        {sections.map((section) => (
          <ScrollTo
            key={section.id}
            to={`#${prefix}-${section.id}`}
            offset={-64}
            className="rounded-lg border border-border px-3 py-2"
          >
            {section.title}
          </ScrollTo>
        ))}
      </nav>
      {sections.map((section) => (
        <section
          key={section.id}
          id={`${prefix}-${section.id}`}
          className="min-h-72 p-6"
        >
          <h2 className="text-lg font-semibold">{section.title}</h2>
          <p className="mt-3">{section.text}</p>
        </section>
      ))}
      <ScrollTo
        to={0}
        className="m-6 rounded-lg border border-border px-3 py-2"
      >
        返回目录
      </ScrollTo>
    </SmoothScroll>
  );
}
