"use client";

import { FileText, FolderClosed, LayoutGrid } from "lucide-react";
import { useState } from "react";
import { BloomMenu } from "@/components/motion/bloom-menu";

const ITEMS = [
  { label: "学习笔记", icon: FileText },
  { label: "学习看板", icon: LayoutGrid },
  { label: "资料文件夹", icon: FolderClosed },
];

export function BloomMenuExample() {
  const [created, setCreated] = useState<string[]>([]);

  return (
    <section className="flex min-h-96 flex-col items-center justify-center gap-8 p-6">
      <h2 className="font-medium">创建学习资料</h2>
      <div className="flex min-h-56 items-center justify-center">
        <BloomMenu items={ITEMS} onSelect={(label) => setCreated((items) => [...items, label])} />
      </div>
      <p role="status" className="text-sm text-muted-foreground">{created.length ? `已添加本地草稿：${created.join("、")}` : "点击 Create 打开菜单，选择一种资料类型。"}</p>
    </section>
  );
}
