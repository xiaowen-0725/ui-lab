"use client";

import { useState } from "react";
import {
  ArtifactAction,
  ArtifactContent,
  ArtifactHeader,
  ArtifactPanel,
  ArtifactVersionNav,
  type ArtifactView,
  ArtifactViewToggle,
} from "@/components/motion/artifact-panel/index";

const DRAFTS = [
  "今天读完一章，记录三个观点。",
  "今天读完一章，记录三个观点，并写下一条实践行动。",
];

export function ArtifactPanelExample() {
  const [view, setView] = useState<ArtifactView>("preview");
  const [versions, setVersions] = useState(DRAFTS);
  const [index, setIndex] = useState(2);
  const [feedback, setFeedback] = useState("查看本地草稿的内容与版本。");
  const text = versions[index - 1];
  const code = `export const readingPlan = ${JSON.stringify(text)};`;

  return (
    <div className="w-full max-w-2xl space-y-3">
      <div className="h-80">
        <ArtifactPanel>
          <ArtifactHeader title="阅读计划.ts" subtitle="本地草稿" actions={
            <>
              <ArtifactViewToggle value={view} onChange={setView} previewLabel="预览" codeLabel="代码" />
              <ArtifactAction aria-label="复制当前草稿代码" onClick={async () => {
                try {
                  await navigator.clipboard.writeText(code);
                  setFeedback(`第 ${index} 版代码已复制。`);
                } catch {
                  setView("code");
                  setFeedback("当前环境无法写入剪贴板，请从代码视图手动复制。");
                }
              }}><span aria-hidden="true">⧉</span></ArtifactAction>
            </>
          } />
          <ArtifactContent view={`${view}-${index}`}>
            {view === "preview" ? (
              <article className="space-y-3 p-6">
                <h2 className="text-lg font-semibold">今天的阅读计划</h2>
                <p className="text-sm text-muted-foreground">{text}</p>
              </article>
            ) : (
              <pre className="overflow-auto whitespace-pre-wrap p-4 text-sm"><code>{code}</code></pre>
            )}
          </ArtifactContent>
          <div className="border-t border-border p-3">
            <ArtifactVersionNav index={index} count={versions.length}
              onPrev={() => setIndex((current) => Math.max(1, current - 1))}
              onNext={() => setIndex((current) => Math.min(versions.length, current + 1))}
              restoreLabel="恢复为新草稿"
              onRestore={index < versions.length ? () => {
                setVersions((current) => [...current, text]);
                setIndex(versions.length + 1);
                setFeedback(`第 ${index} 版内容已恢复为新的本地草稿。`);
              } : undefined}
            />
          </div>
        </ArtifactPanel>
      </div>
      <p role="status" className="text-sm text-muted-foreground">{feedback}</p>
    </div>
  );
}
