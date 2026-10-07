"use client";

import { useId, useState } from "react";
import { Drawer } from "@/components/motion/drawer";

export function DrawerExample() {
  const fieldId = useId();
  const [open, setOpen] = useState(false);
  const [compact, setCompact] = useState(false);
  const [saved, setSaved] = useState(false);
  const [result, setResult] = useState("尚未保存偏好");

  return (
    <section className="mx-auto max-w-md space-y-4 rounded-xl border border-border bg-card p-6 text-foreground">
      <button type="button" onClick={() => { setCompact(saved); setOpen(true); }} className="rounded-lg border border-border px-3 py-2 text-sm">打开显示设置</button>
      <p role="status" className="text-sm text-muted-foreground">{open ? "设置抽屉已打开" : result}</p>
      <Drawer open={open} onOpenChange={setOpen} side="right" ariaLabel="显示设置">
        <form className="flex h-full flex-col gap-5 p-6 text-foreground" onSubmit={(event) => { event.preventDefault(); setSaved(compact); setResult(`本地偏好已保存：${compact ? "紧凑布局" : "舒适布局"}`); setOpen(false); }}>
          <h2 className="text-lg font-semibold">显示设置</h2>
          <label htmlFor={fieldId} className="flex items-center gap-2 text-sm"><input id={fieldId} type="checkbox" checked={compact} onChange={(event) => setCompact(event.target.checked)} />使用紧凑布局</label>
          <p className="text-sm text-muted-foreground">此偏好仅保存在当前示例中。</p>
          <div className="mt-auto flex gap-2">
            <button type="submit" className="rounded-lg border border-border px-3 py-2 text-sm">保存偏好</button>
            <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-border px-3 py-2 text-sm">取消</button>
          </div>
        </form>
      </Drawer>
    </section>
  );
}
