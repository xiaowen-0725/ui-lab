"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE_OUT, SPRING_PANEL } from "@/lib/ease";
import { cn } from "@/lib/utils";

export type VoiceOrbState = "idle" | "listening" | "thinking" | "speaking";

export interface VoiceOrbProps {
  /** Conversational state — drives breathing rhythm, hue drift, echo rings and the thinking sheen. */
  state?: VoiceOrbState;
  /** Orb diameter in pixels. */
  size?: number;
  className?: string;
}

// Brand blue (#339CFF — the library's accent, used elsewhere for focus rings)
// carried as an rgb triplet so the glow shadow can share it at low alpha.
const GLOW_RGB = "51, 156, 255";

const ORB_BACKGROUND =
  "radial-gradient(circle at 30% 26%, #d9ecff 0%, #339CFF 38%, #1c5aa8 68%, #0a2540 100%)";

const ORB_SHADOW = [
  `0 0 64px rgba(${GLOW_RGB}, 0.45)`,
  `0 0 130px rgba(${GLOW_RGB}, 0.22)`,
  "inset 0 -20px 42px rgba(4, 12, 26, 0.4)",
  "inset 0 16px 28px rgba(255, 255, 255, 0.2)",
].join(", ");

/**
 * Per-state breathing rhythm — the ball's own continuous `animate` target.
 * These durations/eases are bespoke to the breathing/echo feel rather than UI
 * transitions, so they live as named constants instead of `lib/ease.ts`
 * tokens (which are tuned for <300ms UI moves and panel entrances): idle is
 * a slow, low-lit drift; listening/speaking sync the scale with a hue or
 * brightness pulse; thinking calms the breathing so the rotating sheen below
 * carries the motion instead.
 */
const BREATH: Record<
  VoiceOrbState,
  { scale: number[]; filter: string | string[]; duration: number }
> = {
  idle: {
    scale: [1, 1.03, 1],
    filter: "brightness(0.85)",
    duration: 5,
  },
  listening: {
    scale: [1, 1.06, 1],
    filter: [
      "hue-rotate(0deg) brightness(1)",
      "hue-rotate(15deg) brightness(1.05)",
      "hue-rotate(0deg) brightness(1)",
    ],
    duration: 2.4,
  },
  thinking: {
    scale: [1, 1.02, 1],
    filter: ["brightness(0.95)", "brightness(1.05)", "brightness(0.95)"],
    duration: 3.2,
  },
  speaking: {
    scale: [1, 1.09, 1.02, 1.12, 1],
    filter: ["brightness(1)", "brightness(1.15)", "brightness(1)"],
    duration: 1.6,
  },
};

/** Expanding echo-ring, cloned twice with a stagger — a decelerating ripple radiating off the ball's edge. */
function EchoRing({ duration, delay }: { duration: number; delay: number }) {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-0 rounded-full border border-[#339CFF]/40"
      initial={{ scale: 1, opacity: 0.5 }}
      animate={{ scale: 1.6, opacity: 0 }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeOut" }}
    />
  );
}

/**
 * Central voice-mode orb — a single continuous ball that never unmounts
 * across `idle` / `listening` / `thinking` / `speaking`; only the breathing
 * `animate` target changes, so the motion carries through state switches
 * instead of resetting. Echo rings (listening/speaking) and the thinking
 * sheen are the only pieces that mount/unmount — they spring in with
 * `SPRING_PANEL` and fade out with `EASE_OUT`, quicker out than in, matching
 * the library's exit convention. Fully static under `useReducedMotion()`: no
 * breathing, no rings, no rotation — just the plain gradient ball.
 *
 * Purely decorative (`aria-hidden`); pair it with your own status text for
 * the accessible state announcement.
 */
export function VoiceOrb({
  state = "idle",
  size = 160,
  className,
}: VoiceOrbProps) {
  const reduce = useReducedMotion() ?? false;
  const breath = BREATH[state];
  const showRings = state === "listening" || state === "speaking";
  const showSheen = state === "thinking";
  // Speaking answers back faster than listening picks up — the echo halves in length.
  const echoDuration = state === "speaking" ? 1.2 : 2;

  return (
    <div
      aria-hidden
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <AnimatePresence>
        {!reduce && showRings ? (
          <motion.span
            key="rings"
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.15, ease: EASE_OUT },
            }}
            transition={SPRING_PANEL}
          >
            <EchoRing duration={echoDuration} delay={0} />
            <EchoRing duration={echoDuration} delay={echoDuration / 2} />
          </motion.span>
        ) : null}
      </AnimatePresence>

      <motion.div
        className="relative rounded-full"
        style={{
          width: "100%",
          height: "100%",
          background: ORB_BACKGROUND,
          boxShadow: ORB_SHADOW,
        }}
        animate={
          reduce ? undefined : { scale: breath.scale, filter: breath.filter }
        }
        transition={
          reduce
            ? undefined
            : { duration: breath.duration, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <AnimatePresence>
          {!reduce && showSheen ? (
            <motion.span
              key="sheen"
              aria-hidden
              className="absolute inset-0 overflow-hidden rounded-full mix-blend-overlay"
              style={{
                background:
                  "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.5) 50deg, transparent 130deg, transparent 360deg)",
              }}
              initial={{ opacity: 0, scale: 0.85, rotate: 0 }}
              animate={{ opacity: 1, scale: 1, rotate: 360 }}
              exit={{
                opacity: 0,
                scale: 0.9,
                transition: { duration: 0.15, ease: EASE_OUT },
              }}
              transition={{
                opacity: SPRING_PANEL,
                scale: SPRING_PANEL,
                rotate: { duration: 6, repeat: Infinity, ease: "linear" },
              }}
            />
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
