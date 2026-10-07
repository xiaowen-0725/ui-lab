"use client";

import { useId, useState } from "react";
import { EmptyStateInbox } from "@/components/motion/empty-state/inbox";

export function EmptyStateInboxExample() {
  const fieldId = useId();
  const [composing, setComposing] = useState(false);
  const [draft, setDraft] = useState("你好，一起讨论新的界面草图吧。");
  const [saved, setSaved] = useState("");

  return (
    <section className="mx-auto max-w-lg space-y-4 rounded-xl border border-border bg-card p-6 text-foreground">
      <EmptyStateInbox title="收件箱已清空" message="所有消息都已阅读，可以开始写一条新草稿。" actionLabel="撰写草稿" onAction={() => { setComposing(true); setSaved(""); }} />
      {composing ? (
        <form className="space-y-3" onSubmit={(event) => { event.preventDefault(); if (!draft.trim()) return; setSaved(draft.trim()); setComposing(false); }}>
          <label htmlFor={fieldId} className="block text-sm">草稿内容</label>
          <textarea id={fieldId} value={draft} onChange={(event) => setDraft(event.target.value)} className="w-full rounded-lg border border-border bg-background p-3" />
          <button type="submit" disabled={!draft.trim()} className="rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-50">保存本地草稿</button>
          <button type="button" onClick={() => setComposing(false)} className="ml-2 rounded-lg border border-border px-3 py-2 text-sm">取消</button>
        </form>
      ) : null}
      <p role="status" className="text-sm text-muted-foreground">{saved ? `本地草稿已保存：${saved}` : composing ? "草稿编辑器已打开" : "等待撰写草稿"}</p>
    </section>
  );
}
