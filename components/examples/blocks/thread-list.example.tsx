"use client";

import { useState } from "react";
import {
  ThreadList,
  ThreadListSection,
  ThreadListItem,
  ThreadListAction,
} from "@/components/motion/thread-list/index";

const initialThreads = [
  {
    id: "reading",
    title: "本周阅读计划",
    unread: false,
    content: "选择一本书，安排两次阅读时间。",
  },
  {
    id: "notes",
    title: "读书会笔记",
    unread: true,
    content: "下一次讨论主题：如何记录阅读中的问题？",
  },
  {
    id: "ideas",
    title: "灵感收集",
    unread: false,
    content: "把散落的想法整理成可实践的小目标。",
  },
];

export function ThreadListExample() {
  const [threads, setThreads] = useState(initialThreads);
  const [selected, setSelected] = useState("reading");
  const [message, setMessage] = useState("当前查看：本周阅读计划。");
  const current = threads.find((thread) => thread.id === selected);

  return (
    <section className="max-w-xl space-y-4 rounded-xl border border-border bg-background p-4 text-foreground">
      <ThreadList>
        <ThreadListSection title="最近的会话">
          {threads.map((thread) => (
            <ThreadListItem
              key={thread.id}
              active={selected === thread.id}
              unread={thread.unread}
              meta={thread.unread ? "未读" : "已读"}
              onSelect={() => {
                setSelected(thread.id);
                setThreads((currentThreads) =>
                  currentThreads.map((item) =>
                    item.id === thread.id ? { ...item, unread: false } : item,
                  ),
                );
                setMessage(`当前查看：${thread.title}。`);
              }}
              actions={
                <ThreadListAction
                  aria-label={`归档${thread.title}`}
                  onClick={() => {
                    const remaining = threads.filter(
                      (item) => item.id !== thread.id,
                    );
                    setThreads(remaining);
                    if (selected === thread.id)
                      setSelected(remaining[0]?.id ?? "");
                    setMessage(`已在本地归档：${thread.title}。`);
                  }}
                >
                  ×
                </ThreadListAction>
              }
            >
              {thread.title}
            </ThreadListItem>
          ))}
        </ThreadListSection>
      </ThreadList>
      <article className="rounded-lg bg-muted p-4">
        <h2 className="font-medium">{current?.title ?? "暂无会话"}</h2>
        <p className="mt-2">
          {current?.content ?? "可以恢复示例会话，重新体验选择与归档。"}
        </p>
      </article>
      <p role="status" className="text-sm">
        {message}
      </p>
      <button
        type="button"
        className="rounded-lg border border-border px-3 py-2"
        onClick={() => {
          setThreads(initialThreads);
          setSelected("reading");
          setMessage("已恢复本地示例会话。");
        }}
      >
        恢复示例会话
      </button>
    </section>
  );
}
