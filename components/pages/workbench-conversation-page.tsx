"use client";

import { ArrowUp } from "lucide-react";
import { type ReactNode, useState } from "react";
import {
  Composer,
  ComposerTextarea,
  ComposerToolbar,
  ComposerIconButton,
} from "@/components/motion/agent-composer";
import {
  Thread,
  ThreadItem,
  ThreadMessage,
  ThreadUserMessage,
} from "@/components/motion/agent-thread";
import { cn } from "@/lib/utils";
import { type ApplicationPageState, PageState, type PageStateContent } from "./page-state";

export interface ConversationMessage {
  id: string;
  role: "user" | "assistant";
  content: ReactNode;
}
export interface ConversationPageContent extends PageStateContent {
  title: string;
  subtitle: string;
  message: string;
  send: string;
  placeholder: string;
}
export type ConversationPageAction = { type: "send"; text: string } | { type: "retry" };
export interface WorkbenchConversationPageProps {
  locale?: "zh" | "en";
  content?: Partial<ConversationPageContent>;
  data?: readonly ConversationMessage[];
  state?: ApplicationPageState;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onAction?: (action: ConversationPageAction) => void;
  className?: string;
}

/** Message data and agent execution remain entirely consumer-owned. */
export function WorkbenchConversationPage({
  locale = "zh",
  content,
  data = [],
  state = "ready",
  value,
  defaultValue = "",
  onChange,
  onAction,
  className,
}: WorkbenchConversationPageProps) {
  const [draft, setDraft] = useState(defaultValue);
  const text = value ?? draft;
  const c = {
    ...(locale === "zh"
      ? {
          title: "会话",
          subtitle: "与 Agent 一起推进工作",
          message: "消息",
          send: "发送消息",
          placeholder: "描述任务，或提出一个问题…",
          empty: "从一个想法开始新的会话",
        }
      : {
          title: "Conversation",
          subtitle: "Move work forward with your agent",
          message: "Message",
          send: "Send message",
          placeholder: "Describe a task or ask a question…",
          empty: "Start a conversation with an idea",
        }),
    ...content,
  };
  const update = (next: string) => {
    if (value === undefined) setDraft(next);
    onChange?.(next);
  };
  const send = () => {
    if (state === "loading" || !text.trim() || !onAction) return;
    onAction({ type: "send", text: text.trim() });
    update("");
  };
  const displayState = state === "ready" && data.length === 0 ? "empty" : state;
  return (
    <section
      lang={locale}
      aria-label={c.title}
      aria-busy={state === "loading"}
      className={cn(
        "flex h-full min-h-[32rem] min-w-0 flex-col bg-[var(--wb-surface)] text-foreground",
        className,
      )}
    >
      <header className="border-b border-[var(--wb-divider)] px-6 py-5">
        <h1 tabIndex={-1} className="text-lg font-semibold">
          {c.title}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{c.subtitle}</p>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto py-6">
        {displayState === "ready" ? (
          <Thread>
            {data.map((message) => (
              <ThreadItem key={message.id}>
                {message.role === "user" ? (
                  <ThreadUserMessage>{message.content}</ThreadUserMessage>
                ) : (
                  <ThreadMessage>
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  </ThreadMessage>
                )}
              </ThreadItem>
            ))}
          </Thread>
        ) : (
          <PageState
            state={displayState}
            locale={locale}
            content={c}
            onRetry={onAction ? () => onAction({ type: "retry" }) : undefined}
          />
        )}
      </div>
      <div className="mx-auto w-full max-w-3xl px-4 pb-5">
        <Composer>
          <ComposerTextarea
            value={text}
            onChange={update}
            onSubmit={send}
            aria-label={c.message}
            placeholder={c.placeholder}
          />
          <ComposerToolbar>
            <span className="px-2 text-xs text-muted-foreground">{c.subtitle}</span>
            <div className="ml-auto" />
            <ComposerIconButton
              aria-label={c.send}
              onClick={send}
              disabled={!onAction || !text.trim() || state === "loading"}
            >
              <ArrowUp className="h-4 w-4" />
            </ComposerIconButton>
          </ComposerToolbar>
        </Composer>
      </div>
    </section>
  );
}
