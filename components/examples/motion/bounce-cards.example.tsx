"use client";

import { BounceCards } from "@/components/motion/bounce-cards";

const CARDS = [
  { title: "收集", description: "保存值得回看的片段" },
  { title: "整理", description: "把零散想法归入主题" },
  { title: "回顾", description: "让每周的进步看得见" },
];

export function BounceCardsExample() {
  return (
    <section className="flex min-h-80 flex-col items-center justify-center gap-6 overflow-hidden p-6">
      <h2 className="font-medium">学习笔记的三个步骤</h2>
      <BounceCards spacing={58} rotation={8}>
        {CARDS.map((card) => (
          <article key={card.title} className="flex size-full flex-col justify-end gap-3 border border-border bg-card p-4 text-card-foreground">
            <h3 className="text-lg font-semibold">{card.title}</h3>
            <p className="text-sm text-muted-foreground">{card.description}</p>
          </article>
        ))}
      </BounceCards>
    </section>
  );
}
