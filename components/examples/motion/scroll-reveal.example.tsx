// biome-ignore-all lint/a11y/noNoninteractiveTabindex: the named scroll region must support keyboard scrolling.
"use client";

import { useRef } from "react";
import { ScrollReveal } from "@/components/motion/scroll-reveal";

export function ScrollRevealExample() {
  const root = useRef<HTMLElement>(null);

  return (
    <section
      ref={root}
      tabIndex={0}
      aria-label="滚动查看渐入内容"
      className="h-80 overflow-y-auto rounded-xl border border-border bg-background p-6 text-foreground"
    >
      <h2 className="mb-12 text-xl font-semibold">滚动发现阅读要点</h2>
      {["先明确阅读目标", "再记录关键线索", "最后形成自己的总结"].map(
        (title) => (
          <ScrollReveal
            key={title}
            root={root}
            once={false}
            blur={4}
            duration={0.25}
            className="mb-12 rounded-xl bg-muted p-6"
          >
            <h3 className="font-medium">{title}</h3>
            <p className="mt-3 min-h-24">
              段落进入当前滚动区域时显现，离开后可再次体验。
            </p>
          </ScrollReveal>
        ),
      )}
    </section>
  );
}
