"use client";

import { useState } from "react";
import {
  VoiceOrb,
  type VoiceOrbState,
} from "@/components/motion/voice-orb/index";

const states: { value: VoiceOrbState; label: string }[] = [
  { value: "idle", label: "待机" },
  { value: "listening", label: "聆听" },
  { value: "thinking", label: "思考" },
  { value: "speaking", label: "回应" },
];

export function VoiceOrbExample() {
  const [state, setState] = useState<VoiceOrbState>("idle");

  return (
    <section className="space-y-6 rounded-xl border border-border bg-background p-8 text-foreground">
      <VoiceOrb state={state} size={144} />
      <fieldset className="flex flex-wrap gap-2">
        <legend className="sr-only">演示语音状态</legend>
        {states.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={state === item.value}
            className="rounded-lg border border-border px-3 py-2"
            onClick={() => setState(item.value)}
          >
            {item.label}
          </button>
        ))}
      </fieldset>
      <p role="status">
        当前演示状态：{states.find((item) => item.value === state)?.label}
      </p>
      <p className="text-sm text-muted-foreground">
        仅切换视觉状态，不采集麦克风，也不调用语音服务。
      </p>
    </section>
  );
}
