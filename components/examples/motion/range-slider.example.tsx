"use client";

import { useState } from "react";
import { RangeSlider } from "@/components/motion/range-slider";

export function RangeSliderExample() {
  const [volume, setVolume] = useState(40);
  return (
    <section className="max-w-md space-y-4 rounded-xl border border-border p-6">
      <h2 className="font-medium">预览音量</h2>
      <RangeSlider value={volume} onValueChange={setVolume} min={0} max={100} step={10} aria-label="预览音量" />
      <p role="status">当前设置：{volume}%（仅调整本地设置）</p>
      <button type="button" className="rounded-md border border-border px-3 py-2" onClick={() => setVolume(40)}>恢复默认值</button>
    </section>
  );
}
