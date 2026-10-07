"use client";

import { useState } from "react";
import { TextReveal } from "@/components/motion/text-reveal";

export function TextRevealExample() {
  const [replay, setReplay] = useState(0);

  return (
    <section className="mx-auto max-w-lg space-y-4 rounded-xl border border-border bg-card p-6 text-foreground">
      <TextReveal key={replay} text="今天也有新的灵感" as="h2" split="char" stagger={0.06} blur={6} whileInView className="text-2xl font-semibold" />
      <p className="text-sm text-muted-foreground">标题进入视野时逐字展开。</p>
      <button type="button" onClick={() => setReplay((value) => value + 1)} className="rounded-lg border border-border px-3 py-2 text-sm">再次展开</button>
      <p role="status" className="text-sm text-muted-foreground">已重播 {replay} 次</p>
    </section>
  );
}
