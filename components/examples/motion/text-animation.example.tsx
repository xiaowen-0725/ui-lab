"use client";

import { useState } from "react";
import { TextReveal } from "@/components/motion/text-reveal";

export function TextAnimationExample() {
  const [replay, setReplay] = useState(0);

  return (
    <section className="mx-auto max-w-xl space-y-4 rounded-xl border border-border bg-card p-6 text-foreground">
      <TextReveal
        key={replay}
        as="h2"
        text={["把想法变成界面", "从一个小组件开始"]}
        split="char"
        stagger={0.04}
        blur={6}
        className="text-2xl font-semibold leading-relaxed"
      />
      <p className="text-sm text-muted-foreground">用逐字入场呈现两行介绍标题。</p>
      <button type="button" onClick={() => setReplay((value) => value + 1)} className="rounded-lg border border-border px-3 py-2 text-sm">
        重播标题动效
      </button>
      <p role="status" className="text-sm text-muted-foreground">已重播 {replay} 次</p>
    </section>
  );
}
