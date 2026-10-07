"use client";

import { useState } from "react";
import {
  SmoothScroll,
  useSmoothScroll,
} from "@/components/motion/smooth-scroll";

function ReadingNavigation() {
  const { scrollTo } = useSmoothScroll();
  const [message, setMessage] = useState("向下滚动阅读，或返回开头。");

  return (
    <div className="sticky bottom-0 bg-background p-3">
      <button
        type="button"
        className="rounded-lg border border-border px-3 py-2"
        onClick={() => {
          scrollTo(0);
          setMessage("已请求滚动到开头。");
        }}
      >
        返回开头
      </button>
      <p role="status" className="mt-2 text-sm text-muted-foreground">
        {message}
      </p>
    </div>
  );
}

export function SmoothScrollExample() {
  return (
    <SmoothScroll
      root={false}
      className="relative h-80 overflow-y-auto rounded-xl border border-border bg-background text-foreground"
    >
      <article className="space-y-6 p-6">
        <h2 className="text-xl font-semibold">周末阅读计划</h2>
        {[
          "准备一本喜欢的书",
          "留出一段安静时间",
          "记录值得回味的句子",
          "整理今天的阅读笔记",
        ].map((title) => (
          <section key={title} className="min-h-40 rounded-xl bg-muted p-6">
            <h3 className="font-medium">{title}</h3>
            <p className="mt-3">慢慢阅读，让思绪跟随滚动展开。</p>
          </section>
        ))}
      </article>
      <ReadingNavigation />
    </SmoothScroll>
  );
}
