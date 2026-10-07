"use client";

import { useState } from "react";
import { PromptBar } from "@/components/motion/prompt-bar";

export function PromptBarExample() {
  const [result, setResult] = useState("输入内容后提交；输入 / 可以选择整理方式。");
  return (
    <section className="max-w-2xl space-y-4 p-6">
      <h2 className="font-medium">阅读助手输入条</h2>
      <p className="text-sm text-muted-foreground">附件、联网开关与等待动画均为界面演示；消息只保存在本地显示。</p>
      <PromptBar
        skills={[{ id: "summary", label: "摘要", hint: "整理阅读要点" }, { id: "outline", label: "提纲", hint: "列出文章结构" }]}
        models={[{ id: "draft", label: "演示草稿" }, { id: "review", label: "演示校对" }]}
        defaultModelId="draft"
        credits={100}
        placeholder="描述需求，或输入 / 选择整理方式"
        onUpgrade={() => setResult("演示额度提示已点击，未打开付费流程。")}
        onSubmit={(payload) => setResult(`本地收到：${payload.text}；方式：${payload.skillId ?? "自由输入"}；模型：${payload.modelId}；附件：${payload.attachments.join("、") || "无"}；联网选项：${payload.webSearch ? "开启（未请求网络）" : "关闭"}。`)}
      />
      <p role="status" className="text-sm">{result}</p>
    </section>
  );
}
