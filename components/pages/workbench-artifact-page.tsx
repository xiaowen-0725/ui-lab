"use client";

import { Download, FileCode2 } from "lucide-react";
import { type ReactNode, useState } from "react";
import {
  ArtifactPanel,
  ArtifactHeader,
  ArtifactContent,
  ArtifactAction,
  ArtifactViewToggle,
  type ArtifactView,
} from "@/components/motion/artifact-panel";
import { cn } from "@/lib/utils";
import { type ApplicationPageState, PageState, type PageStateContent } from "./page-state";

export interface WorkbenchArtifact {
  id: string;
  title: string;
  description?: string;
  preview?: ReactNode;
  code?: string;
}
export interface ArtifactPageContent extends PageStateContent {
  title: string;
  subtitle: string;
  preview: string;
  code: string;
  download: string;
  noPreview: string;
  noCode: string;
}
export type ArtifactPageAction =
  | { type: "download"; artifact: WorkbenchArtifact }
  | { type: "retry" };
export interface WorkbenchArtifactPageProps {
  locale?: "zh" | "en";
  content?: Partial<ArtifactPageContent>;
  data?: readonly WorkbenchArtifact[];
  state?: ApplicationPageState;
  value?: string;
  defaultValue?: string;
  onChange?: (id: string) => void;
  view?: ArtifactView;
  defaultView?: ArtifactView;
  onViewChange?: (view: ArtifactView) => void;
  onAction?: (action: ArtifactPageAction) => void;
  className?: string;
}

export function WorkbenchArtifactPage({
  locale = "zh",
  content,
  data = [],
  state = "ready",
  value,
  defaultValue,
  onChange,
  view: viewProp,
  defaultView = "preview",
  onViewChange,
  onAction,
  className,
}: WorkbenchArtifactPageProps) {
  const [selected, setSelected] = useState(defaultValue);
  const [localView, setLocalView] = useState(defaultView);
  const view = viewProp ?? localView;
  const id = value ?? selected;
  // A stale uncontrolled selection falls back to the first current item.
  const artifact =
    data.find((item) => item.id === id) ?? (value === undefined ? data[0] : undefined);
  const c = {
    ...(locale === "zh"
      ? {
          title: "制品",
          subtitle: "查看、检查与导出工作成果",
          preview: "预览",
          code: "源码",
          download: "下载制品",
          noPreview: "暂无预览",
          noCode: "暂无源码",
          empty: "还没有制品，或当前制品已不可用",
        }
      : {
          title: "Artifacts",
          subtitle: "Review, inspect and export your work",
          preview: "Preview",
          code: "Code",
          download: "Download artifact",
          noPreview: "No preview available",
          noCode: "No code available",
          empty: "No artifacts yet, or the selected artifact is unavailable",
        }),
    ...content,
  };
  const displayState = state === "ready" && !artifact ? "empty" : state;
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
      {displayState === "ready" && artifact ? (
        <div className="grid min-h-0 flex-1 gap-5 p-4 lg:grid-cols-[12rem_minmax(0,1fr)]">
          <nav aria-label={c.title} className="flex gap-2 overflow-x-auto lg:flex-col">
            {data.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-current={artifact.id === item.id ? "true" : undefined}
                onClick={() => {
                  if (value === undefined) setSelected(item.id);
                  onChange?.(item.id);
                }}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-3 py-3 text-left text-sm focus-visible:outline-2 focus-visible:outline-ring",
                  artifact.id === item.id
                    ? "bg-[var(--wb-inset)] text-foreground"
                    : "text-muted-foreground hover:bg-[var(--wb-hover)]",
                )}
              >
                <FileCode2 className="h-4 w-4 shrink-0" />
                <span className="break-words">{item.title}</span>
              </button>
            ))}
          </nav>
          <ArtifactPanel className="min-h-80">
            <ArtifactHeader
              title={artifact.title}
              subtitle={artifact.description}
              actions={
                <>
                  <ArtifactViewToggle
                    value={view}
                    onChange={(next) => {
                      if (viewProp === undefined) setLocalView(next);
                      onViewChange?.(next);
                    }}
                    previewLabel={c.preview}
                    codeLabel={c.code}
                  />
                  {onAction ? (
                    <ArtifactAction
                      aria-label={c.download}
                      onClick={() => onAction({ type: "download", artifact })}
                    >
                      <Download className="h-4 w-4" />
                    </ArtifactAction>
                  ) : null}
                </>
              }
            />
            <ArtifactContent className="p-5">
              {view === "preview" ? (
                (artifact.preview ?? <p className="text-sm text-muted-foreground">{c.noPreview}</p>)
              ) : artifact.code !== undefined ? (
                <pre className="overflow-x-auto whitespace-pre font-mono text-sm">
                  <code>{artifact.code}</code>
                </pre>
              ) : (
                <p className="text-sm text-muted-foreground">{c.noCode}</p>
              )}
            </ArtifactContent>
          </ArtifactPanel>
        </div>
      ) : (
        <PageState
          state={displayState === "ready" ? "empty" : displayState}
          locale={locale}
          content={c}
          onRetry={onAction ? () => onAction({ type: "retry" }) : undefined}
        />
      )}
    </section>
  );
}
