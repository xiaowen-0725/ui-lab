"use client";

import { Bell } from "lucide-react";
import { useState } from "react";
import { AnimatedIcon } from "@/components/motion/animated-icon";

export function AnimatedIconExample() {
  const [enabled, setEnabled] = useState(false);
  return (
    <section className="space-y-3">
      <button type="button" aria-pressed={enabled} onClick={() => setEnabled(!enabled)} className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-3 text-sm">
        <span aria-hidden="true"><AnimatedIcon variant="wiggle" icon={Bell} size={24} /></span>
        {enabled ? "关闭提醒" : "开启提醒"}
      </button>
      <p role="status" className="text-sm text-muted-foreground">本地提醒已{enabled ? "开启" : "关闭"}；悬停图标可查看摆动反馈。</p>
    </section>
  );
}
