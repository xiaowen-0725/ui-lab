"use client";

import { useId } from "react";
import { NotFoundMagnetic } from "@/components/motion/not-found/magnetic";

export function NotFoundMagneticExample() {
  const id = useId();

  return (
    <div className="space-y-6">
      <NotFoundMagnetic
        code="404"
        title="这份学习笔记暂时找不到了"
        description="链接可能已过期。返回学习首页，或从笔记目录继续浏览。"
        homeHref={`#${id}-home`}
        homeLabel="返回学习首页"
        browseHref={`#${id}-notes`}
        browseLabel="浏览笔记目录"
      />
      <section id={`${id}-home`} className="rounded-xl border border-border p-4">
        <h2 className="font-medium">学习首页</h2>
        <p className="mt-2 text-sm text-muted-foreground">本周目标：整理三篇阅读笔记。</p>
      </section>
      <section id={`${id}-notes`} className="rounded-xl border border-border p-4">
        <h2 className="font-medium">笔记目录</h2>
        <ul className="mt-2 list-inside list-disc text-sm">
          <li>阅读方法与摘录</li>
          <li>每周学习回顾</li>
        </ul>
      </section>
    </div>
  );
}
