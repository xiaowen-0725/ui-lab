"use client";

import { useState } from "react";
import { WebGLBackground } from "@/components/motion/webgl-background";

export function WebglBackgroundExample() {
  const [variant, setVariant] = useState<"aurora" | "silk">("aurora");
  return (
    <section className="space-y-4">
      <div className="relative isolate h-72 overflow-hidden rounded-xl bg-background">
        <div aria-hidden="true" className="absolute inset-0"><WebGLBackground variant={variant} /></div>
        <div className="relative flex h-full flex-col items-center justify-center gap-3 p-6">
          <div className="rounded-xl bg-background/90 p-6 text-center text-foreground">
            <h2 className="text-2xl font-semibold">让灵感浮现</h2>
            <p className="mt-2">将动态背景放在内容层下方。</p>
          </div>
        </div>
      </div>
      <button type="button" onClick={() => setVariant((value) => value === "aurora" ? "silk" : "aurora")} className="rounded-md border border-border px-3 py-2">切换背景</button>
      <p role="status">当前背景：{variant === "aurora" ? "极光" : "丝绸"}</p>
    </section>
  );
}
