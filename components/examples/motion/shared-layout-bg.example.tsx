"use client";

import { useState } from "react";
import { SharedLayoutBg } from "@/components/motion/shared-layout-bg";

const TOPICS = [
  { id: "reading", title: "阅读笔记", description: "整理书摘与个人思考" },
  { id: "practice", title: "练习记录", description: "记录每次练习的收获" },
  { id: "review", title: "每周回顾", description: "总结进度并安排下一步" },
];

export function SharedLayoutBgExample() {
  const [selected, setSelected] = useState("阅读笔记");

  return (
    <div className="w-full max-w-md space-y-4 rounded-xl border border-border px-6 py-4">
      <SharedLayoutBg inset={8}>
        {TOPICS.map((topic) => (
          <button key={topic.id} type="button" className="w-full rounded-lg p-3 text-left focus-visible:outline focus-visible:outline-ring" onClick={() => setSelected(topic.title)}>
            <span className="block font-medium">{topic.title}</span>
            <span className="text-sm text-muted-foreground">{topic.description}</span>
          </button>
        ))}
      </SharedLayoutBg>
      <p role="status" className="text-sm text-muted-foreground">已选择：{selected}</p>
    </div>
  );
}
