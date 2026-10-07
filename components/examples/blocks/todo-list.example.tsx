"use client";

import { useState } from "react";
import { TodoList, type TodoItem } from "@/components/agents/todo-list";

const initialItems: TodoItem[] = [
  {
    id: "collect",
    title: "收集阅读材料",
    status: "completed",
    detail: "已整理",
  },
  {
    id: "read",
    title: "阅读并记录问题",
    status: "in-progress",
    progress: 40,
    detail: "40%",
  },
  { id: "summary", title: "整理阅读总结", status: "pending" },
];

export function TodoListExample() {
  const [items, setItems] = useState(initialItems);
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState("点击推进一步，演示任务状态更新。");
  const complete = items.every((item) => item.status === "completed");

  return (
    <section className="max-w-lg space-y-4">
      <TodoList
        title="阅读任务清单"
        items={items}
        open={open}
        onOpenChange={setOpen}
        collapseOnComplete
      />
      <div className="flex gap-2">
        <button
          type="button"
          disabled={complete}
          className="rounded-lg border border-border px-3 py-2 disabled:opacity-50"
          onClick={() => {
            const nextIndex = items.findIndex(
              (item) => item.status !== "completed",
            );
            if (nextIndex < 0) return;
            setItems((current) =>
              current.map((item, index) =>
                index === nextIndex
                  ? {
                      ...item,
                      status: "completed",
                      progress: 100,
                      detail: "已完成",
                    }
                  : index === nextIndex + 1
                    ? {
                        ...item,
                        status: "in-progress",
                        progress: 0,
                        detail: "0%",
                      }
                    : item,
              ),
            );
            setMessage(`本地演示已完成：${items[nextIndex].title}。`);
          }}
        >
          推进一步
        </button>
        <button
          type="button"
          className="rounded-lg border border-border px-3 py-2"
          onClick={() => {
            setItems(initialItems);
            setOpen(true);
            setMessage("已恢复示例任务。");
          }}
        >
          重置任务
        </button>
      </div>
      <p role="status" className="text-sm">
        {complete ? "本地演示任务全部完成。" : message}
        清单已{open ? "展开" : "收起"}。
      </p>
    </section>
  );
}
