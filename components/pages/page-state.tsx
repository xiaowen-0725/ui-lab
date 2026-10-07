"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ApplicationPageState = "ready" | "loading" | "empty" | "error";
export interface PageStateContent {
  loading: string;
  empty: string;
  error: string;
  retry: string;
}
export interface PageStateProps {
  state: Exclude<ApplicationPageState, "ready">;
  locale?: "zh" | "en";
  content?: Partial<PageStateContent>;
  onRetry?: () => void;
  className?: string;
  children?: ReactNode;
}

export function PageState({
  state,
  locale = "zh",
  content,
  onRetry,
  className,
  children,
}: PageStateProps) {
  const c = {
    ...(locale === "zh"
      ? {
          loading: "正在加载…",
          empty: "这里还没有内容",
          error: "暂时无法加载，请重试",
          retry: "重试",
        }
      : {
          loading: "Loading…",
          empty: "Nothing here yet",
          error: "Unable to load. Please try again.",
          retry: "Retry",
        }),
    ...content,
  };
  return (
    <div
      className={cn(
        "flex min-h-48 flex-col items-center justify-center gap-4 px-6 py-12 text-center text-muted-foreground",
        className,
      )}
    >
      <p role={state === "error" ? "alert" : "status"}>{c[state]}</p>
      {state === "error" && onRetry ? (
        <button
          type="button"
          className="rounded-full border border-border px-4 py-2 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          onClick={onRetry}
        >
          {c.retry}
        </button>
      ) : null}
      {children}
    </div>
  );
}
