"use client";

import { useState } from "react";
import { Skeleton } from "@/components/motion/skeleton";

export function SkeletonExample() {
  const [loaded, setLoaded] = useState(false);

  return (
    <section className="mx-auto max-w-sm space-y-4 rounded-xl border border-border bg-card p-6 text-foreground">
      <div aria-busy={!loaded} className="min-h-32">
        {loaded ? (
          <article className="space-y-3"><h2 className="text-lg font-semibold">界面练习笔记</h2><p className="text-sm leading-6">先明确内容层级，再选择字号和间距。每张卡片只表达一个重点。</p></article>
        ) : (
          <div className="space-y-3"><Skeleton className="h-6 w-2/3" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-5/6" /><Skeleton className="h-4 w-3/4" /></div>
        )}
      </div>
      <button type="button" onClick={() => setLoaded((value) => !value)} className="rounded-lg border border-border px-3 py-2 text-sm">{loaded ? "再次显示骨架" : "显示本地示例内容"}</button>
      <p role="status" className="text-sm text-muted-foreground">{loaded ? "本地示例内容已显示" : "正在展示加载占位"}</p>
    </section>
  );
}
