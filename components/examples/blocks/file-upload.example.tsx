"use client";

import { useState } from "react";
import { FileUpload, type FileUploadItem } from "@/components/motion/file-upload";

const initialFiles: FileUploadItem[] = [
  { id: "notes", name: "设计笔记.txt", size: 1200, type: "text/plain", status: "queued", progress: 0 },
  { id: "review", name: "评审记录.txt", size: 2400, type: "text/plain", status: "error", error: "本地演示失败，可点击重试", progress: 0 },
];

export function FileUploadExample() {
  const [items, setItems] = useState(initialFiles);
  const [result, setResult] = useState("两条示例文件元数据已加入队列");
  const pending = items.some((item) => item.status === "queued" || item.status === "uploading");

  return (
    <section className="mx-auto max-w-xl space-y-4 rounded-xl border border-border bg-card p-5 text-foreground">
      <p className="text-sm text-muted-foreground">本地文件队列演示：选择的文件留在浏览器中，完成按钮仅模拟处理状态。</p>
      <FileUpload value={items} onValueChange={setItems} title="拖放文本文件" description="最多 5 个文件，仅用于本地演示" browseLabel="选择文件" accept=".txt,.md,text/plain,text/markdown" maxFiles={5}
        onFilesAdded={(added) => setResult(`已在本地添加：${added.map((item) => item.name).join("、")}`)}
        onRemove={(item) => setResult(`已从本地队列移除：${item.name}`)}
        onRetry={(item) => { setItems((values) => values.map((entry) => entry.id === item.id ? { ...entry, status: "queued", progress: 0, error: undefined } : entry)); setResult(`已重新排队：${item.name}，可模拟完成`); }}
      />
      <div className="flex gap-2">
        <button type="button" disabled={!pending} onClick={() => { setItems((values) => values.map((item) => item.status === "queued" || item.status === "uploading" ? { ...item, status: "success", progress: 100 } : item)); setResult("待处理文件的本地状态已模拟为完成"); }} className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50">模拟完成待处理文件</button>
        <button type="button" onClick={() => { setItems(initialFiles); setResult("本地演示队列已重置"); }} className="rounded-lg border border-border px-3 py-2 text-sm">重置队列</button>
      </div>
      <p role="status" className="text-sm text-muted-foreground">{result}；当前 {items.length} 个文件</p>
    </section>
  );
}
