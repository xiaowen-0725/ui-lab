"use client";

import { useState } from "react";
import { CylinderCarousel } from "@/components/motion/cylinder-carousel";

const TOPICS = ["阅读", "写作", "摄影", "绘画", "音乐", "运动", "旅行"];

export function CylinderCarouselExample() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState("阅读");

  return (
    <div className="w-full space-y-4 rounded-xl border border-border p-4">
      <h2 className="font-medium">选择今天的学习主题</h2>
      <p className="text-sm text-muted-foreground">拖动、滚轮或使用轮播的左右方向键浏览，再选择当前主题。</p>
      <CylinderCarousel itemSize={88} visibleItems={5} height={160} autoRotate={false} onIndexChange={setIndex}>
        {TOPICS.map((topic) => (
          <div key={topic} className="grid size-full place-items-center rounded-full border border-border bg-primary/10 font-medium text-foreground">
            {topic}
          </div>
        ))}
      </CylinderCarousel>
      <button type="button" onClick={() => setSelected(TOPICS[index])} className="rounded-lg border border-border px-3 py-2 focus-visible:outline focus-visible:outline-ring">
        选择当前主题：{TOPICS[index]}
      </button>
      <p role="status" className="text-sm">轮播位置：{TOPICS[index]}；已选择：{selected}</p>
    </div>
  );
}
