"use client";

import { useId, useState } from "react";
import { Queue, QueueItem, QueueItemAction, QueueItemActions, QueueItemContent, QueueItemDescription, QueueItemIndicator, QueueList, QueueSection, QueueSectionContent, QueueSectionLabel, QueueSectionTrigger, type QueueTodo } from "@/components/agents/queue";

const initialTodos: QueueTodo[] = [
  { id: "outline", title: "整理内容提纲", description: "确定标题、说明和主要操作", status: "completed" },
  { id: "sketch", title: "绘制第一张草图", description: "先表达结构，再处理装饰", status: "pending" },
  { id: "review", title: "检查操作反馈", description: "确认保存与取消的结果可见", status: "pending" },
];

export function QueueExample() {
  const fieldId = useId();
  const [todos, setTodos] = useState(initialTodos);
  const [draft, setDraft] = useState("");
  const [nextId, setNextId] = useState(1);
  const [open, setOpen] = useState(true);
  const [result, setResult] = useState("待办仅保存在当前示例中");
  const pending = todos.filter((todo) => todo.status !== "completed").length;

  return (
    <section className="mx-auto max-w-lg space-y-4 text-foreground">
      <Queue>
        <QueueSection open={open} onOpenChange={(value) => { setOpen(value); setResult(value ? "待办列表已展开" : "待办列表已收起"); }}>
          <QueueSectionTrigger><QueueSectionLabel count={pending} label="项待完成" /></QueueSectionTrigger>
          <QueueSectionContent>
            <QueueList>
              {todos.map((todo) => {
                const completed = todo.status === "completed";
                return (
                  <QueueItem key={todo.id}>
                    <div className="flex items-center gap-2">
                      <QueueItemIndicator completed={completed} aria-label={completed ? "已完成" : "待完成"} />
                      <QueueItemContent completed={completed}>{todo.title}</QueueItemContent>
                      <QueueItemActions><QueueItemAction className="opacity-100" aria-label={`${completed ? "恢复" : "完成"}：${todo.title}`} onClick={() => { setTodos((values) => values.map((item) => item.id === todo.id ? { ...item, status: completed ? "pending" : "completed" } : item)); setResult(`${todo.title}：已${completed ? "恢复为待完成" : "标记完成"}`); }}>{completed ? "恢复" : "完成"}</QueueItemAction></QueueItemActions>
                    </div>
                    <QueueItemDescription completed={completed}>{todo.description}</QueueItemDescription>
                  </QueueItem>
                );
              })}
            </QueueList>
          </QueueSectionContent>
        </QueueSection>
      </Queue>
      <form className="space-y-2" onSubmit={(event) => {
        event.preventDefault();
        const title = draft.trim();
        if (!title) return;
        setTodos((values) => [...values, { id: `local-${nextId}`, title, description: "手动添加的本地待办", status: "pending" }]);
        setNextId((value) => value + 1);
        setDraft("");
        setOpen(true);
        setResult(`已添加本地待办：${title}`);
      }}>
        <label htmlFor={fieldId} className="block text-sm">新增本地待办</label>
        <div className="flex gap-2"><input id={fieldId} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="例如：补充键盘操作说明" className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm" /><button type="submit" disabled={!draft.trim()} className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50">添加</button></div>
      </form>
      <p role="status" className="text-sm text-muted-foreground">{result}；剩余 {pending} 项</p>
    </section>
  );
}
