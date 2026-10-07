"use client";

import { useState } from "react";
import { RecordingCard } from "@/components/motion/recording-card";

export function RecordingCardExample() {
  const [playing, setPlaying] = useState(false);
  return (
    <section className="max-w-2xl space-y-4">
      <h2 className="font-medium">任务看板录屏外观演示</h2>
      <RecordingCard title="阅读计划演示" hint="点击播放演示" skin={{ label: "本地演示" }} bubble={<span aria-hidden="true" className="grid size-full place-items-center bg-muted text-2xl text-foreground">{playing ? "Ⅱ" : "▶"}</span>} expandable onPlayingChange={setPlaying}>
        <div className="grid min-h-48 grid-cols-2 gap-4 p-6 text-white">
          <div><h3 className="text-sm font-medium">待阅读</h3><p className="mt-3 rounded-lg bg-white/10 p-3 text-sm">界面设计基础</p></div>
          <div><h3 className="text-sm font-medium">已完成</h3><p className="mt-3 rounded-lg bg-white/10 p-3 text-sm">键盘交互指南</p></div>
        </div>
      </RecordingCard>
      <p role="status">{playing ? "演示计时正在运行。" : "演示已暂停。"} 这是自包含的静态屏幕内容，没有录制或音视频服务。</p>
    </section>
  );
}
