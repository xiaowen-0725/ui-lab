"use client";

import { useState } from "react";
import { Tooltip } from "@/components/motion/tooltip";

export function TooltipExample() {
  const [saved, setSaved] = useState(false);
  return (
    <section className="space-y-3 p-8">
      <h2 className="font-medium">文章收藏</h2>
      <Tooltip content={saved ? "点击取消本地收藏" : "将文章加入本地收藏列表"}>
        <button type="button" aria-pressed={saved} className="rounded-md border border-border px-3 py-2" onClick={() => setSaved((value) => !value)}>{saved ? "已收藏" : "收藏文章"}</button>
      </Tooltip>
      <p role="status">{saved ? "文章已加入本地列表。" : "文章尚未收藏。"}</p>
    </section>
  );
}
