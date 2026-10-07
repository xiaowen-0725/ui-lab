"use client";

import { useId, useState } from "react";
import { Thread, ThreadActionBar, ThreadActionButton, ThreadCollapse, ThreadItem, ThreadMessage, ThreadSuggestions, ThreadTurnHeader, ThreadUserMessage } from "@/components/motion/agent-thread/index";

const initialTurns = [{ id: 1, question: "如何开始设计练习？", answer: "先选择一个小场景，列出标题、内容与操作，再画出第一张草图。" }];

export function AgentThreadExample() {
  const fieldId = useId();
  const [turns, setTurns] = useState(initialTurns);
  const [draft, setDraft] = useState("");
  const [expanded, setExpanded] = useState<Record<number, boolean>>({ 1: true });
  const [liked, setLiked] = useState<number[]>([]);
  const [result, setResult] = useState("可发送一条消息，查看固定模板的本地回复");

  return (
    <section className="mx-auto max-w-2xl space-y-4 rounded-xl border border-border bg-background p-4 text-foreground">
      <p className="text-sm text-muted-foreground">本地会话演示：回复来自固定模板。</p>
      <Thread>
        {turns.map((turn) => (
          <ThreadItem key={turn.id}>
            <ThreadUserMessage>{turn.question}</ThreadUserMessage>
            <div className="group/turn space-y-3 py-3">
              <ThreadTurnHeader open={expanded[turn.id] ?? false} onOpenChange={(open) => { setExpanded((values) => ({ ...values, [turn.id]: open })); setResult(`第 ${turn.id} 条回复的说明已${open ? "展开" : "收起"}`); }}>本地示例助手 · 查看回复说明</ThreadTurnHeader>
              <ThreadCollapse open={expanded[turn.id] ?? false}><p className="py-2 text-sm text-muted-foreground">此回复仅使用示例中的固定建议，没有调用模型或业务服务。</p></ThreadCollapse>
              <ThreadMessage><p>{turn.answer}</p></ThreadMessage>
              <ThreadActionBar className="opacity-100" timestamp="本地示例">
                <ThreadActionButton aria-label={liked.includes(turn.id) ? "取消赞同" : "赞同回复"} onClick={() => { const hasLiked = liked.includes(turn.id); setLiked((values) => hasLiked ? values.filter((id) => id !== turn.id) : [...values, turn.id]); setResult(`第 ${turn.id} 条回复已${hasLiked ? "取消赞同" : "赞同"}`); }}><span aria-hidden="true">{liked.includes(turn.id) ? "✓" : "赞"}</span></ThreadActionButton>
              </ThreadActionBar>
            </div>
          </ThreadItem>
        ))}
        <ThreadSuggestions suggestions={[{ value: "如何检查内容层级？", label: "检查内容层级" }, { value: "如何组织评审笔记？", label: "组织评审笔记" }]} onSelect={(value) => { setDraft(value); setResult(`已填入建议问题：${value}`); }} />
      </Thread>
      <form className="space-y-3" onSubmit={(event) => {
        event.preventDefault();
        const question = draft.trim();
        if (!question) return;
        setTurns((values) => [...values, { id: values.length + 1, question, answer: `收到你的问题：“${question}”。本地示例建议：先写下目标，再列出三个可执行的小步骤。` }]);
        setDraft("");
        setResult("消息已加入本地会话，示例回复已显示");
      }}>
        <label htmlFor={fieldId} className="block text-sm font-medium">继续讨论</label>
        <textarea id={fieldId} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="输入一个设计问题" className="w-full rounded-lg border border-border bg-background p-3 text-sm" />
        <button type="submit" disabled={!draft.trim()} className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50">发送本地消息</button>
      </form>
      <p role="status" className="text-sm text-muted-foreground">{result}</p>
    </section>
  );
}
