"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MorphingModal } from "@/components/motion/morphing-modal";

export function MorphingModalExample() {
  const [viewId, setViewId] = useState<string | null>(null);
  const [name, setName] = useState("阅读计划");
  const [result, setResult] = useState("尚未保存。");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const open = viewId !== null;
  const focusDialog = useCallback((dialog: HTMLDivElement | null) => {
    if (!dialog) return;
    dialogRef.current = dialog;
    dialog.focus();
    // 源码切换视图时会暂时保留退出节点；其清理不能覆盖新视图的引用。
    return () => {
      if (dialogRef.current === dialog) dialogRef.current = null;
    };
  }, []);

  // The consumer supplies dialog semantics and keyboard/focus handling.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setViewId(null);
        return;
      }
      const dialog = dialogRef.current;
      if (event.key !== "Tab" || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled)")).filter((control) => control.tabIndex >= 0);
      const first = controls[0];
      const last = controls[controls.length - 1];
      const outside = !dialog.contains(document.activeElement);
      if (!first) {
        event.preventDefault();
        dialog.focus();
      } else if (event.shiftKey && (outside || document.activeElement === first || document.activeElement === dialog)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (outside || document.activeElement === last || document.activeElement === dialog)) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      triggerRef.current?.focus();
    };
  }, [open]);

  return (
    <section className="space-y-3 p-6">
      <button ref={triggerRef} type="button" onClick={() => setViewId("edit")} className="rounded-md border border-border px-3 py-2">编辑计划</button>
      <p role="status">{result}</p>
      <MorphingModal viewId={viewId} onClose={() => setViewId(null)} placement="center">
        <div ref={focusDialog} role="dialog" aria-modal="true" aria-label="编辑阅读计划" tabIndex={-1} className="space-y-4">
          {viewId === "review" ? (
            <>
              <h2 className="font-medium">确认计划名称</h2>
              <p>{name}</p>
              <button type="button" className="rounded-md border border-border px-3 py-2" onClick={() => setViewId("edit")}>返回编辑</button>
              <button type="button" className="rounded-md bg-primary px-3 py-2 text-primary-foreground" onClick={() => { setResult(`已在本地保存：${name}`); setViewId(null); }}>确认保存</button>
            </>
          ) : (
            <>
              <h2 className="font-medium">编辑计划</h2>
              <label className="block">计划名称<input value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-md border border-border bg-background p-2" /></label>
              <button type="button" disabled={!name.trim()} className="rounded-md border border-border px-3 py-2 disabled:opacity-50" onClick={() => setViewId("review")}>下一步</button>
            </>
          )}
          <button type="button" onClick={() => setViewId(null)} className="rounded-md border border-border px-3 py-2">关闭</button>
        </div>
      </MorphingModal>
    </section>
  );
}
