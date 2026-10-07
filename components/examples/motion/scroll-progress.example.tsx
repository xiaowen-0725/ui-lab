// biome-ignore-all lint/a11y/noNoninteractiveTabindex: the named scroll region must support keyboard scrolling.
"use client";

import { useMotionValue } from "motion/react";
import { useState } from "react";
import { ScrollProgress } from "@/components/motion/scroll-progress";

export function ScrollProgressExample() {
  const progress = useMotionValue(0);
  const [percent, setPercent] = useState(0);

  return (
    <section className="relative space-y-4 rounded-xl border border-border bg-background p-4 text-foreground">
      <ScrollProgress progress={progress} fixed={false} height={3} />
      <div className="flex items-center gap-3">
        <ScrollProgress variant="circle" progress={progress} />
        <p>阅读进度：{percent}%</p>
      </div>
      <section
        tabIndex={0}
        aria-label="可滚动的阅读内容"
        className="h-64 overflow-y-auto rounded-lg bg-muted p-4"
        onScroll={(event) => {
          const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
          const value =
            scrollHeight > clientHeight
              ? scrollTop / (scrollHeight - clientHeight)
              : 0;
          progress.set(value);
          setPercent(Math.round(value * 100));
        }}
      >
        {["开始阅读", "观察细节", "记录发现", "整理总结"].map((title) => (
          <section key={title} className="min-h-48 py-6">
            <h3 className="font-medium">{title}</h3>
            <p className="mt-3">滚动这段内容，顶部进度条和圆环会同步更新。</p>
          </section>
        ))}
      </section>
    </section>
  );
}
