"use client";

import { useId } from "react";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { ScrollTo } from "@/components/motion/scroll-to";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function ScrollAnimationExample() {
  const endId = `reading-end-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  return (
    <SmoothScroll
      root={false}
      className="relative h-80 overflow-y-auto rounded-xl border border-border bg-background text-foreground"
    >
      <ScrollProgress fixed={false} height={3} />
      <nav
        aria-label="阅读导航"
        className="sticky top-0 z-10 bg-background p-4"
      >
        <ScrollTo
          to={`#${endId}`}
          offset={-64}
          className="rounded-lg border border-border px-3 py-2"
        >
          跳到阅读总结
        </ScrollTo>
      </nav>
      <article className="space-y-16 p-6">
        <h2 className="text-xl font-semibold">一段安静的阅读旅程</h2>
        <p>向下滚动，体验平滑滚动、进度指示与内容渐入。</p>
        <div className="rounded-xl bg-muted p-8">层次感让阅读更有节奏。</div>
        <ScrollReveal once={false}>
          <section className="min-h-48 rounded-xl border border-border p-6">
            <h3 className="font-medium">让内容适时出现</h3>
            <p className="mt-3">进入可视区域时，段落逐渐显现。</p>
          </section>
        </ScrollReveal>
        <section id={endId} className="min-h-64 scroll-mt-16">
          <h3 className="font-medium">阅读总结</h3>
          <p className="mt-3">动效帮助呈现内容结构，减少动效偏好由组件处理。</p>
          <ScrollTo
            to={0}
            className="mt-4 rounded-lg border border-border px-3 py-2"
          >
            返回开头
          </ScrollTo>
        </section>
      </article>
    </SmoothScroll>
  );
}
