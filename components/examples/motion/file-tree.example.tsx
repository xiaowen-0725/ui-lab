"use client";

import { useState } from "react";
import { FileTree, FileTreeFile, FileTreeFolder } from "@/components/motion/file-tree";

const labels: Record<string, string> = { notes: "设计笔记", sketch: "界面草图.md", review: "交互评审.md", readme: "使用说明.md" };

export function FileTreeExample() {
  const [selected, setSelected] = useState("sketch");
  const [expanded, setExpanded] = useState(["notes"]);

  return (
    <section className="mx-auto max-w-sm space-y-4 rounded-xl border border-border bg-card p-5 text-foreground">
      <h2 className="text-lg font-semibold">本地资料</h2>
      <FileTree ariaLabel="本地设计资料" value={selected} onValueChange={setSelected} expandedIds={expanded} onExpandedChange={setExpanded}>
        <FileTreeFolder value="notes" name={labels.notes}>
          <FileTreeFile value="sketch" name={labels.sketch} />
          <FileTreeFile value="review" name={labels.review} />
        </FileTreeFolder>
        <FileTreeFile value="readme" name={labels.readme} />
      </FileTree>
      <p role="status" className="text-sm text-muted-foreground">已选择：{labels[selected]}；已展开 {expanded.length} 个目录</p>
    </section>
  );
}
