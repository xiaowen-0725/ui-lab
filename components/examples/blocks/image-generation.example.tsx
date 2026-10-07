"use client";

import { useState } from "react";
import { ImageGeneration, type ImageGenerationStatus } from "@/components/agents/image-generation";

const STATUS_TEXT: Record<ImageGenerationStatus, string> = {
  queued: "等待演示",
  generating: "演示生成中",
  refining: "演示细化中",
  complete: "本地插画展示完成",
  error: "模拟生成失败",
};

export function ImageGenerationExample() {
  const [status, setStatus] = useState<ImageGenerationStatus>("complete");
  return (
    <section className="max-w-md space-y-4">
      <h2 className="font-medium">图像生成状态演示</h2>
      <p className="text-sm text-muted-foreground">下方是预置的内联 SVG 插画，切换状态不会调用图像服务。</p>
      <ImageGeneration status={status} statusText={STATUS_TEXT[status]} prompt="山间日出，几何插画" label="本地山间日出插画" aspectRatio="4 / 3" size="fluid" resolution="400 × 300" onRetry={() => setStatus("generating")}>
        <svg viewBox="0 0 400 300" role="img" aria-label="太阳从山峰后升起的几何插画" className="h-full w-full">
          <title>山间日出</title>
          <rect width="400" height="300" fill="#e8edf4" />
          <circle cx="285" cy="90" r="42" fill="#f2b66d" />
          <path d="M0 260 150 90 300 260Z" fill="#718c88" />
          <path d="M120 300 290 120 400 260V300Z" fill="#486563" />
          <path d="M115 130 150 90 190 137 151 123Z" fill="#ffffff" />
        </svg>
      </ImageGeneration>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(STATUS_TEXT) as ImageGenerationStatus[]).map((next) => <button key={next} type="button" aria-pressed={status === next} onClick={() => setStatus(next)} className="rounded-md border border-border px-3 py-2 text-sm">{STATUS_TEXT[next]}</button>)}
      </div>
      <p role="status">当前本地状态：{STATUS_TEXT[status]}</p>
    </section>
  );
}
