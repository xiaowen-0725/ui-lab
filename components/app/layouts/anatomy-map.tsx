"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export type AnatomyId = "header" | "sidebar" | "thread" | "composer" | "panel";

interface AnatomyMapProps {
  activeId: AnatomyId | null;
  onActiveChange: (id: AnatomyId | null) => void;
  className?: string;
}

const COPY = {
  zh: {
    header: { label: "顶栏", detail: "窗口与全局控制" },
    sidebar: { label: "会话侧栏", detail: "分组、选中、悬停操作" },
    thread: { label: "Agent 会话流", detail: "消息、工作日志、工具与产物" },
    composer: { label: "输入台", detail: "上下文、附件、模型与发送" },
    panel: { label: "产物区", detail: "预览 / 源码与版本恢复" },
    user: "用户气泡",
    turn: "回合头",
    tool: "工具 / 文件 / 变更卡",
    optional: "默认关闭",
    jump: "打开组件文档",
  },
  en: {
    header: { label: "Header", detail: "Window and global controls" },
    sidebar: { label: "Thread sidebar", detail: "Groups, selection, hover actions" },
    thread: { label: "Agent thread", detail: "Messages, work log, tools, artifacts" },
    composer: { label: "Composer", detail: "Context, files, model, and send" },
    panel: { label: "Artifacts", detail: "Preview, source, and version restore" },
    user: "User bubble",
    turn: "Turn header",
    tool: "Tool / file / diff cards",
    optional: "Closed by default",
    jump: "Open component docs",
  },
} as const;

const DOC_HREF: Record<AnatomyId, string> = {
  header: "/components/blocks/agent-workbench",
  sidebar: "/components/blocks/thread-list",
  thread: "/components/blocks/agent-thread",
  composer: "/components/blocks/agent-composer",
  panel: "/components/blocks/artifact-panel",
};

interface AnatomyLinkProps {
  id: AnatomyId;
  label: string;
  detail: string;
  jumpLabel: string;
  active: boolean;
  onActiveChange: (id: AnatomyId | null) => void;
  className?: string;
  children?: ReactNode;
}

function AnatomyLink({
  id,
  label,
  detail,
  jumpLabel,
  active,
  onActiveChange,
  className,
  children,
}: AnatomyLinkProps) {
  return (
    <Link
      href={DOC_HREF[id]}
      data-anatomy-map={id}
      onMouseEnter={() => onActiveChange(id)}
      onMouseLeave={() => onActiveChange(null)}
      onFocus={() => onActiveChange(id)}
      onBlur={() => onActiveChange(null)}
      className={cn(
        "group relative flex min-h-0 flex-col overflow-hidden rounded-xl border p-3 text-left outline-none transition-[border-color,background-color,box-shadow] duration-200",
        active
          ? "border-(--color-border-strong) bg-card ring-2 ring-accent/30"
          : "border-border bg-card/35 hover:border-(--color-border-strong) hover:bg-card/70",
        className,
      )}
      aria-label={`${label}: ${jumpLabel}`}
    >
      <span className="flex items-start justify-between gap-2">
        <span>
          <span className="block text-xs font-semibold text-foreground">{label}</span>
          <span className="mt-0.5 hidden text-[10px] leading-tight text-muted-foreground sm:block">
            {detail}
          </span>
        </span>
        <ArrowUpRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors duration-200 group-hover:text-foreground" />
      </span>
      {children}
    </Link>
  );
}

/** Clickable wireframe of the live workbench; hover/focus highlights its real counterpart above. */
export function AnatomyMap({ activeId, onActiveChange, className }: AnatomyMapProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("layouts");
  const copy = COPY[locale];

  return (
    <section
      className={cn("rounded-3xl border border-border bg-card/20 p-5 md:p-7", className)}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
            {t("anatomyEyebrow")}
          </p>
          <h2 className="mt-2 text-xl font-semibold text-foreground">{t("anatomyTitle")}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {t("anatomyIntro")}
          </p>
        </div>
        <p className="shrink-0 text-xs text-muted-foreground/80">{t("anatomyHint")}</p>
      </div>

      <div className="mt-5 rounded-2xl border border-border bg-background/60 p-2.5 shadow-inner sm:p-3">
        <div className="grid h-[360px] grid-cols-[0.9fr_2fr_0.9fr] grid-rows-[3.25rem_minmax(0,1fr)] gap-2">
          <AnatomyLink
            id="header"
            label={copy.header.label}
            detail={copy.header.detail}
            jumpLabel={copy.jump}
            active={activeId === "header"}
            onActiveChange={onActiveChange}
            className="col-span-3 row-start-1 justify-center py-2"
          >
            <span className="absolute bottom-2 left-1/3 right-1/3 h-1 rounded-full bg-border" />
          </AnatomyLink>

          <AnatomyLink
            id="sidebar"
            label={copy.sidebar.label}
            detail={copy.sidebar.detail}
            jumpLabel={copy.jump}
            active={activeId === "sidebar"}
            onActiveChange={onActiveChange}
            className="row-start-2"
          >
            <span className="mt-5 flex flex-col gap-2">
              {[0, 1, 2, 3].map((item) => (
                <span
                  key={item}
                  className={cn(
                    "h-5 rounded-md border border-border/70",
                    item === 1 ? "bg-foreground/10" : "bg-background/60",
                  )}
                />
              ))}
            </span>
          </AnatomyLink>

          <div className="col-start-2 row-start-2 flex min-h-0 flex-col gap-2">
            <AnatomyLink
              id="thread"
              label={copy.thread.label}
              detail={copy.thread.detail}
              jumpLabel={copy.jump}
              active={activeId === "thread"}
              onActiveChange={onActiveChange}
              className="min-h-0 flex-1"
            >
              <span className="mt-3 ml-auto h-6 w-2/5 rounded-full bg-foreground/10 px-2 text-[9px] leading-6 text-muted-foreground">
                {copy.user}
              </span>
              <span className="mt-3 h-2 w-1/3 rounded-full bg-border" />
              <span className="mt-1 text-[9px] text-muted-foreground">{copy.turn}</span>
              <span className="mt-3 grid grid-cols-2 gap-2">
                <span className="h-10 rounded-lg border border-border bg-background/70" />
                <span className="h-10 rounded-lg border border-border bg-background/70" />
              </span>
              <span className="mt-1 text-[9px] text-muted-foreground">{copy.tool}</span>
            </AnatomyLink>

            <AnatomyLink
              id="composer"
              label={copy.composer.label}
              detail={copy.composer.detail}
              jumpLabel={copy.jump}
              active={activeId === "composer"}
              onActiveChange={onActiveChange}
              className="h-[30%] min-h-[5.75rem]"
            >
              <span className="mt-auto flex items-center gap-2 rounded-lg border border-border bg-background/70 p-2">
                <span className="h-2 flex-1 rounded-full bg-border" />
                <span className="h-5 w-5 rounded-full bg-foreground/70" />
              </span>
            </AnatomyLink>
          </div>

          <AnatomyLink
            id="panel"
            label={copy.panel.label}
            detail={copy.panel.detail}
            jumpLabel={copy.jump}
            active={activeId === "panel"}
            onActiveChange={onActiveChange}
            className="col-start-3 row-start-2 border-dashed"
          >
            <span className="mt-4 rounded-full border border-dashed border-border px-2 py-1 text-center text-[9px] text-muted-foreground">
              {copy.optional}
            </span>
            <span className="mt-4 flex min-h-0 flex-1 flex-col rounded-lg border border-border bg-background/70 p-2">
              <span className="h-2 w-3/4 rounded-full bg-border" />
              <span className="mt-3 h-9 rounded-md bg-foreground/[0.06]" />
              <span className="mt-2 h-2 w-full rounded-full bg-border/80" />
              <span className="mt-1.5 h-2 w-4/5 rounded-full bg-border/60" />
              <span className="mt-auto flex items-center justify-center gap-1 border-border border-t pt-2">
                <span className="h-2 w-2 rounded-full border border-border" />
                <span className="h-1.5 w-6 rounded-full bg-border" />
                <span className="h-2 w-2 rounded-full border border-border" />
              </span>
            </span>
          </AnatomyLink>
        </div>
      </div>
    </section>
  );
}
