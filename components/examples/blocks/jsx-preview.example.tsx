"use client";

import { useId, useState } from "react";
import { JSXPreview, JSXPreviewContent } from "@/components/agents/jsx-preview";

const initialJsx =
  '<article className="rounded-lg border border-border p-4"><h2 className="font-semibold">阅读提醒</h2><p>给自己留出二十分钟，读完今天的一节。</p></article>';

export function JsxPreviewExample() {
  const editorId = useId();
  const [draft, setDraft] = useState(initialJsx);
  const [jsx, setJsx] = useState(initialJsx);
  const [message, setMessage] = useState(
    "下方展示示例片段；可以修改文字再更新预览。",
  );

  return (
    <section className="max-w-xl space-y-4">
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          setJsx(draft);
          setMessage("已更新本地片段预览。");
        }}
      >
        <label htmlFor={editorId} className="block font-medium">
          编辑展示片段
        </label>
        <textarea
          id={editorId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          rows={5}
          className="w-full rounded-lg border border-border bg-background p-3 font-mono text-sm"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg border border-border px-3 py-2"
          >
            更新预览
          </button>
          <button
            type="button"
            className="rounded-lg border border-border px-3 py-2"
            onClick={() => {
              setDraft(initialJsx);
              setJsx(initialJsx);
              setMessage("已恢复初始片段。");
            }}
          >
            重置片段
          </button>
        </div>
      </form>
      <p className="text-sm text-muted-foreground">
        此组件展示允许的标签和属性。这里演示静态内容，不执行脚本或表达式。
      </p>
      <JSXPreview jsx={jsx} className="rounded-xl bg-muted p-4">
        <JSXPreviewContent />
      </JSXPreview>
      <p role="status" className="text-sm">
        {message}
      </p>
    </section>
  );
}
