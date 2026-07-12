"use client";

import { MicOff, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { VoiceOrb, type VoiceOrbState } from "@/components/motion/voice-orb";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

const STATES: Array<{ id: VoiceOrbState; label: string }> = [
  { id: "idle", label: "Idle" },
  { id: "listening", label: "Listening" },
  { id: "thinking", label: "Thinking" },
  { id: "speaking", label: "Speaking" },
];

const STATUS_LABEL: Record<VoiceOrbState, string> = {
  idle: "Idle",
  listening: "Listening…",
  thinking: "Thinking…",
  speaking: "Speaking…",
};

const TRANSCRIPT =
  '"Summarize today\'s standup — pull out the blockers and who owns each one."';

/**
 * Voice mode is inherently a full-dark surface (phone assistants, live
 * voice calls) regardless of the site's light/dark theme, so this card
 * hardcodes its own dark palette instead of branching on `dark:` — the
 * only preview in the library that intentionally does this.
 */
export function VoiceOrbPreview() {
  const [state, setState] = useState<VoiceOrbState>("listening");

  return (
    <div
      className="relative flex h-[480px] w-full flex-col items-center overflow-hidden rounded-xl border border-white/10 px-6 py-6"
      style={{
        background:
          "radial-gradient(120% 90% at 50% -10%, #16204a 0%, #0a0e1f 55%, #030308 100%)",
      }}
    >
      <div className="flex w-full items-center justify-between">
        <span className="text-[11px] tracking-[0.2em] text-white/40">
          VOICE
        </span>
        <div className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur">
          {STATES.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={state === s.id}
              onClick={() => setState(s.id)}
              className={cn(
                "h-6 rounded-full px-2.5 text-xs transition-colors",
                state === s.id
                  ? "bg-white text-[#0a0e1f]"
                  : "text-white/50 hover:text-white/80",
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-5">
        <VoiceOrb state={state} size={180} />

        <div className="flex flex-col items-center gap-2 px-6 text-center">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={state}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: EASE_OUT }}
              className="text-sm text-white/90"
            >
              {STATUS_LABEL[state]}
            </motion.span>
          </AnimatePresence>

          <AnimatePresence initial={false}>
            {state === "listening" ? (
              <motion.p
                key="transcript"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15, ease: EASE_OUT }}
                className="min-h-[32px] max-w-xs text-[13px] italic leading-relaxed text-white/55"
              >
                {TRANSCRIPT}
              </motion.p>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-7 pb-1">
        <button
          type="button"
          aria-label="Mute microphone"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition-colors hover:bg-white/15"
        >
          <MicOff className="h-[18px] w-[18px]" />
        </button>
        <button
          type="button"
          aria-label="Exit voice mode"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          <X className="h-[18px] w-[18px]" />
        </button>
      </div>
    </div>
  );
}
