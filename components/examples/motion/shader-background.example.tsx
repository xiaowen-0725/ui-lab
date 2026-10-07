"use client";

import { useState } from "react";
import { ShaderBackground } from "@/components/motion/shader-background";

// These colors belong to this decorative illustration, not the host UI theme.
const illustrationColors = ["#dbeafe", "#2563eb", "#7c3aed", "#fbcfe8"];

export function ShaderBackgroundExample() {
  const [paused, setPaused] = useState(false);

  return (
    <section className="space-y-4">
      <div className="relative h-72 overflow-hidden rounded-xl bg-muted">
        <div aria-hidden="true" className="absolute inset-0">
          <ShaderBackground
            variant="mesh-gradient"
            colors={illustrationColors}
            distortion={0.6}
            swirl={0.3}
            speed={paused ? 0 : 0.3}
          />
        </div>
        <div className="relative m-6 max-w-sm rounded-xl bg-background/90 p-6 text-foreground">
          <h2 className="text-xl font-semibold">给灵感一点空间</h2>
          <p className="mt-3">
            以缓慢变化的渐变作为装饰背景，正文保留独立的可读表面。
          </p>
        </div>
      </div>
      <button
        type="button"
        aria-pressed={paused}
        className="rounded-lg border border-border px-3 py-2"
        onClick={() => setPaused((value) => !value)}
      >
        {paused ? "继续背景动效" : "暂停背景动效"}
      </button>
      <p role="status" className="text-sm text-muted-foreground">
        {paused ? "已暂停背景动效。" : "背景动效已启用；减少动效偏好优先。"}
      </p>
    </section>
  );
}
