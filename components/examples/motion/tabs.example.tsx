"use client";

import { useState } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/motion/tabs";

export function TabsExample() {
  const [value, setValue] = useState("overview");
  const panels = [
    {
      value: "overview",
      title: "概览",
      content: "本周阅读两篇文章，并整理一份笔记。",
    },
    { value: "notes", title: "笔记", content: "好问题帮助我们发现新的线索。" },
    {
      value: "plan",
      title: "计划",
      content: "周末回顾笔记，选择下周的阅读主题。",
    },
  ];

  return (
    <section className="max-w-lg rounded-xl border border-border bg-background p-4 text-foreground">
      <Tabs value={value} onValueChange={setValue} variant="segment">
        <TabsList>
          {panels.map((panel) => (
            <TabsTrigger key={panel.value} value={panel.value}>
              {panel.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {panels.map((panel) => (
          <TabsContent key={panel.value} value={panel.value}>
            <h2 className="font-semibold">{panel.title}</h2>
            <p className="mt-2">{panel.content}</p>
          </TabsContent>
        ))}
      </Tabs>
      <p role="status" className="mt-4 text-sm text-muted-foreground">
        当前查看：{panels.find((panel) => panel.value === value)?.title}
      </p>
    </section>
  );
}
