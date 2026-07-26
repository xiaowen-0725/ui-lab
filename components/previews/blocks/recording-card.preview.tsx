"use client";

import { Sparkles } from "lucide-react";
import { RecordingCard } from "@/components/motion/recording-card";

/**
 * Two widths of the same card, side by side — the point of the component. Every
 * inner size is a share of the card's own width, so the narrow one is not a
 * scaled-down screenshot but a correctly proportioned smaller card.
 */
function FakeScreen() {
  return (
    // The webcam bubble overlaps the window's lower-left on purpose, so the
    // screen keeps its bottom-left clear rather than putting controls there.
    <div className="flex flex-col gap-[1.6cqw] p-[2.2cqw] pb-[9cqw]">
      <div className="ml-auto max-w-[70%] rounded-[1.2cqw] bg-white/10 px-[1.8cqw] py-[1.4cqw] text-[clamp(8px,1.5cqw,14px)] leading-snug text-white/85">
        Summarise what the team shipped this week and what is still blocked.
      </div>
      <div className="space-y-[0.9cqw]">
        {[100, 92, 74].map((width) => (
          <div
            key={width}
            className="h-[1.1cqw] min-h-[3px] rounded-full bg-white/15"
            style={{ width: `${width}%` }}
          />
        ))}
      </div>
      <div className="mt-[0.6cqw] flex items-center gap-[1.2cqw] rounded-[1.2cqw] border border-white/10 bg-white/[0.04] px-[1.8cqw] py-[1.3cqw]">
        <span className="text-[clamp(8px,1.4cqw,13px)] text-white/40">Write a message…</span>
      </div>
    </div>
  );
}

function Avatar() {
  return (
    <div className="grid h-full w-full place-items-center bg-gradient-to-br from-sky-300 to-indigo-500 text-[4cqw] font-semibold text-white">
      JW
    </div>
  );
}

export function RecordingCardPreview() {
  return (
    <div className="flex w-full flex-col items-center gap-6 p-6">
      <div className="grid w-full max-w-4xl items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
        <RecordingCard
          title="CEO weekly report"
          bubble={<Avatar />}
          skin={{ label: "Demo in UI Lab", icon: <Sparkles className="size-[1.6cqw]" /> }}
          expandable
        >
          <FakeScreen />
        </RecordingCard>

        <RecordingCard title="Same card, narrower" bubble={<Avatar />} defaultPlaying>
          <FakeScreen />
        </RecordingCard>
      </div>
      <p className="max-w-2xl text-center text-xs text-muted-foreground">
        Click the bubble to start: the timer runs and the “tap for sound” pill slides
        back behind it. The right-hand card is the same component at a smaller width —
        no breakpoints involved.
      </p>
    </div>
  );
}
