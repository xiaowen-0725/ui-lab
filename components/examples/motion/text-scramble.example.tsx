"use client";

import { useState } from "react";
import { TextScramble } from "@/components/motion/text-scramble";

const messages = ["灵感已就绪", "开始新练习", "发现新可能"];

export function TextScrambleExample() {
  const [index, setIndex] = useState(0);

  return (
    <section className="mx-auto max-w-md space-y-4 rounded-xl border border-border bg-card p-6 text-foreground">
      <h2 className="text-2xl font-semibold"><TextScramble text={messages[index]} trigger="hover" duration={600} /></h2>
      <p className="text-sm text-muted-foreground">悬停标题或切换提示，播放文字解密效果。</p>
      <button type="button" onClick={() => setIndex((value) => (value + 1) % messages.length)} className="rounded-lg border border-border px-3 py-2 text-sm">切换提示</button>
      <p role="status" className="text-sm text-muted-foreground">当前提示：{messages[index]}</p>
    </section>
  );
}
