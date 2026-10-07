"use client";

import { useId, useState } from "react";
import { BottomSheet } from "@/components/motion/bottom-sheet";

export function BottomSheetExample() {
  const fieldId = useId();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("每周阅读计划");
  const [message, setMessage] = useState("打开面板，编辑本地计划名称。");

  return (
    <section className="space-y-4">
      <button
        type="button"
        className="rounded-lg border border-border px-4 py-2"
        onClick={() => setOpen(true)}
      >
        编辑计划
      </button>
      <p role="status">{message}</p>
      <BottomSheet
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) setMessage("面板已关闭，未保存的编辑仍保留在输入框中。");
        }}
        title="编辑阅读计划"
        description="仅保存到当前示例，可以拖动面板或按 Escape 关闭。"
        snapPoints={["auto", 0.8]}
      >
        <form
          className="space-y-4 py-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (!draft.trim()) return;
            setMessage(`本地计划名称已保存：${draft.trim()}`);
            setOpen(false);
          }}
        >
          <label htmlFor={fieldId} className="block">
            计划名称
          </label>
          <input
            id={fieldId}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
            >
              保存名称
            </button>
            <button
              type="button"
              className="rounded-lg border border-border px-4 py-2"
              onClick={() => {
                setOpen(false);
                setMessage("已取消保存。");
              }}
            >
              取消
            </button>
          </div>
        </form>
      </BottomSheet>
    </section>
  );
}
