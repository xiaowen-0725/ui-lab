"use client";

import { useState } from "react";
import { PromptInput } from "@/components/agents/prompt-input";

const models = [{ value: "quick", label: "快速模式（演示）" }, { value: "careful", label: "详细模式（演示）" }];
const actions = [{ value: "outline", label: "插入提纲", description: "添加周报的常用结构" }];

export function PromptInputExample() {
  const [value, setValue] = useState("请帮我整理本周进展。");
  const [model, setModel] = useState("quick");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("本地提示输入演示：发送后可停止或手动结束演示。");
  return (
    <section className="w-full max-w-xl space-y-3">
      <PromptInput
        value={value} onValueChange={setValue} model={model}
        onModelChange={(next) => { setModel(next); setResult(`已选择${models.find((option) => option.value === next)?.label}。`); }}
        models={models} actions={actions}
        onAction={() => { setValue("请按进展、问题、下周计划三个部分整理周报。"); setResult("已在输入框插入周报提纲。"); }}
        placeholder="输入要整理的内容…" aria-label="演示提示内容"
        loading={loading}
        onSubmit={(prompt, selectedModel) => { setResult(`已接收：${prompt}；模式：${models.find((option) => option.value === selectedModel)?.label}（本地演示，未调用模型）。`); setValue(""); setLoading(true); }}
        onStop={() => { setLoading(false); setResult("本地演示已停止，可继续输入。"); }}
      />
      {loading ? <button type="button" className="rounded-lg border border-border px-3 py-2 text-sm" onClick={() => { setLoading(false); setResult("演示处理已结束，可发送下一条提示。"); }}>结束演示处理</button> : null}
      <p role="status" className="text-sm text-muted-foreground">{result}</p>
    </section>
  );
}
