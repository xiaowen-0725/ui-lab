// biome-ignore-all lint/a11y/noNoninteractiveTabindex: the named scroll region must support keyboard scrolling.
"use client";

import { useRef } from "react";
import { Parallax } from "@/components/motion/parallax";

export function ParallaxExample() {
  const container = useRef<HTMLElement>(null);

  return (
    <section
      ref={container}
      tabIndex={0}
      aria-label="滚动查看视差层次"
      className="relative h-80 overflow-y-auto rounded-xl border border-border bg-background text-foreground"
    >
      <div className="space-y-24 p-6">
        <h2 className="text-xl font-semibold">向下滚动，观察不同层次</h2>
        <Parallax
          container={container}
          speed={-0.3}
          className="rounded-xl bg-muted p-10"
        >
          <h3 className="font-medium">远景：缓慢漂移的山峦</h3>
        </Parallax>
        <Parallax
          container={container}
          speed={0.4}
          className="rounded-xl border border-border p-10"
        >
          <h3 className="font-medium">近景：经过身旁的树影</h3>
        </Parallax>
        <p className="min-h-64">
          内容仍然可以正常阅读；减少动效模式会取消位移。
        </p>
      </div>
    </section>
  );
}
