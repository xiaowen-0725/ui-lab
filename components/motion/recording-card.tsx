"use client";

// The container-query scaling, the hint pill that retracts behind the webcam
// bubble, and the aspect-locked theatre expand are a clean-room reimplementation
// of techniques observed on unabyss.com; no upstream source was used.

import { Maximize2, Volume2, X } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { type CSSProperties, type ReactNode, useEffect, useId, useRef, useState } from "react";
import { EASE_OUT_CSS } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface RecordingCardProps {
  /** What is on the recorded screen — any node; it sits inside the window mock. */
  children: ReactNode;
  /** Window title in the mock's toolbar. */
  title?: string;
  /**
   * The webcam circle: an `<img>`, a `<video>`, initials — anything. Omit for a
   * plain screen recording. It deliberately overlaps the window's lower-left
   * corner, the way a real recording bubble sits over the screen — so keep that
   * corner of `children` free of anything that must stay readable.
   */
  bubble?: ReactNode;
  /** Badge in the corner, e.g. which app the recording is in. */
  skin?: { label: string; icon?: ReactNode };
  /** Label on the pill that retracts behind the bubble once playing. */
  hint?: string;
  /** Any CSS `background` value behind the window. Defaults to a soft spectrum wash. */
  wallpaper?: string;
  /** Start already playing (timer running, hint retracted). */
  defaultPlaying?: boolean;
  onPlayingChange?: (playing: boolean) => void;
  /** Offer the aspect-locked theatre view. */
  expandable?: boolean;
  className?: string;
}

const DEFAULT_WALLPAPER =
  "linear-gradient(135deg, #1b1033 0%, #3f1d5c 22%, #8c3b6d 44%, #d1665a 66%, #e8a44f 84%, #f2d69b 100%)";

/**
 * Chrome text is kept legible with `clamp()` rather than pure `cqw`: the
 * composition should scale with the card, but a timer that shrinks to 5px at
 * small widths is just noise.
 */
const CARD_STYLES = `
.uilab-rec{container-type:inline-size}
.uilab-rec__hint{clip-path:inset(-30cqw -30cqw -30cqw 0)}
.uilab-rec__mono{font-size:clamp(9px,1.1cqw,13px)}
.uilab-rec__badge{font-size:clamp(9px,1.4cqw,14px)}
.uilab-rec__hintlabel{font-size:clamp(10px,1.95cqw,18px)}
@keyframes uilab-rec-blink{0%,100%{opacity:1}50%{opacity:.25}}
.uilab-rec__dot{animation:uilab-rec-blink 1.4s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.uilab-rec__dot{animation:none}}
/* Theatre view: width is capped three ways, then height is derived so the frame
   stays exactly 16:9 on whole pixels. */
.uilab-rec--theatre{position:fixed;inset:0;margin:auto;z-index:60;--rec-w:min(88vw,150vh,1280px);width:var(--rec-w);height:round(up,calc(var(--rec-w) * 9 / 16),1px)}
/* Container units scale everything proportionally, but proportion alone is not
   good design at both extremes: a bubble that is 18% of a 320px thumbnail is
   right, and 18% of a 1280px theatre is absurd. So the theatre restates the
   chrome as a smaller share of a much larger card. Two-class selectors, so they
   win over the utility classes without !important. */
.uilab-rec--theatre .uilab-rec__frame{padding:5cqw 5cqw 6cqw}
.uilab-rec--theatre .uilab-rec__bubble{width:11cqw;height:11cqw;border-width:.34cqw;left:2.6cqw;bottom:2.6cqw}
.uilab-rec--theatre .uilab-rec__hint{left:8.4cqw;bottom:2.6cqw}
.uilab-rec--theatre .uilab-rec__hintlabel{padding-left:6.2cqw;padding-right:1.4cqw;padding-top:.8cqw;padding-bottom:.8cqw;gap:.7cqw;font-size:clamp(11px,1.1cqw,16px)}
.uilab-rec--theatre .uilab-rec__badge{right:2.6cqw;bottom:2.6cqw}
`;

export function formatElapsed(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/** Minimal window chrome. Option A: the shell owns a simple mock and leaves the screen to `children`. */
function WindowMock({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[1.4cqw] border border-white/10 bg-neutral-950/90 shadow-[0_1.6cqw_4cqw_-1.4cqw_rgb(0_0_0/0.55)] backdrop-blur-sm">
      <header className="flex items-center gap-[1.4cqw] border-b border-white/8 px-[1.8cqw] py-[1.2cqw]">
        <span aria-hidden className="flex gap-[0.7cqw]">
          {["#FF5F57", "#FEBC2E", "#28C840"].map((fill) => (
            <i
              key={fill}
              className="block size-[1.2cqw] min-h-[4px] min-w-[4px] rounded-full"
              style={{ background: fill }}
            />
          ))}
        </span>
        {title ? (
          <span className="uilab-rec__mono truncate font-medium text-white/70">{title}</span>
        ) : null}
      </header>
      <div className="min-h-[8cqw]">{children}</div>
    </div>
  );
}

/**
 * Presents any content as a screen recording: wallpaper and scrim behind a
 * window mock, a webcam bubble in the corner, a running timer, and a
 * "tap for sound" pill that slides back behind the bubble once playing.
 *
 * The whole composition is sized in container-query units, so one card scales
 * from a grid thumbnail to a full-width hero with no breakpoints and no
 * transform hacks — every inner size, radius and gap is a share of the card's
 * own width.
 */
export function RecordingCard({
  children,
  title,
  bubble,
  skin,
  hint = "Tap for sound",
  wallpaper = DEFAULT_WALLPAPER,
  defaultPlaying = false,
  onPlayingChange,
  expandable = false,
  className,
}: RecordingCardProps) {
  const [playing, setPlaying] = useState(defaultPlaying);
  const [expanded, setExpanded] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const reducedMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const labelId = useId();

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setElapsed((value) => value + 1), 1000);
    return () => clearInterval(id);
  }, [playing]);

  // Escape leaves the theatre, and focus goes back to the control that opened it.
  useEffect(() => {
    if (!expanded) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.stopPropagation();
        setExpanded(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [expanded]);

  useEffect(() => {
    if (!expanded) triggerRef.current?.focus();
  }, [expanded]);

  function togglePlaying() {
    const next = !playing;
    setPlaying(next);
    onPlayingChange?.(next);
  }

  const pillTransition = reducedMotion
    ? { transition: "opacity 200ms linear" }
    : { transition: `transform 500ms ${EASE_OUT_CSS}, opacity 300ms linear` };

  return (
    <>
      <style>{CARD_STYLES}</style>
      {expanded ? (
        <button
          type="button"
          aria-label="Close theatre view"
          onClick={() => setExpanded(false)}
          className="fixed inset-0 z-50 h-full w-full cursor-default bg-neutral-950/80 backdrop-blur-sm"
        />
      ) : null}

      <div
        className={cn(
          "uilab-rec relative isolate overflow-hidden rounded-[0.8cqw] border border-white/10",
          expanded && "uilab-rec--theatre",
          className,
        )}
      >
        <div
          aria-hidden
          className="absolute inset-0 scale-[1.04]"
          style={{ background: wallpaper }}
        />
        {/* Two scrims: a radial to sink the corners, a linear to keep the top from
            competing with the window's own contrast. */}
        <div
          aria-hidden
          className="absolute -inset-px"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 0%, rgb(0 0 0 / 0.10), rgb(0 0 0 / 0.42) 70%), linear-gradient(rgb(0 0 0 / 0.15), rgb(0 0 0 / 0.35))",
          }}
        />

        <div className="uilab-rec__frame relative z-[1] px-[8.5cqw] pb-[12cqw] pt-[8cqw]">
          <WindowMock title={title}>{children}</WindowMock>
        </div>

        {/* Recording timer */}
        <span
          aria-hidden
          className="uilab-rec__mono absolute left-[2.6cqw] top-[2.6cqw] z-[4] inline-flex items-center gap-[0.8cqw] rounded-full border border-white/20 bg-neutral-950/60 px-[1.4cqw] py-[0.7cqw] font-mono tabular-nums leading-none text-white backdrop-blur-sm"
        >
          <i
            className={cn(
              "block size-[0.9cqw] min-h-[4px] min-w-[4px] rounded-full bg-[#f0433a] shadow-[0_0_4px_rgb(240_67_58/0.7)]",
              playing && "uilab-rec__dot",
            )}
          />
          {formatElapsed(elapsed)}
        </span>

        {expandable ? (
          <button
            ref={triggerRef}
            type="button"
            aria-label={expanded ? "Exit theatre view" : "Expand to theatre view"}
            onClick={() => setExpanded((value) => !value)}
            className="absolute right-[2.6cqw] top-[2.6cqw] z-[5] grid size-[3cqw] min-h-[24px] min-w-[24px] place-items-center rounded-full border border-white/20 bg-neutral-950/30 text-white opacity-50 backdrop-blur-sm transition-opacity duration-200 hover:bg-neutral-950/80 hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {expanded ? (
              <X className="size-[55%]" />
            ) : (
              <Maximize2 className="size-[55%]" />
            )}
          </button>
        ) : null}

        {/* The pill is clipped on its left edge only, so when it slides left it
            disappears *behind* the bubble instead of past the card's edge. */}
        {bubble && hint ? (
          <span
            aria-hidden
            className="uilab-rec__hint pointer-events-none absolute bottom-[4cqw] left-[13cqw] z-[2]"
          >
            <span
              className="uilab-rec__hintlabel inline-flex items-center gap-[1cqw] rounded-r-full border border-white/70 bg-white/95 py-[1.3cqw] pl-[10cqw] pr-[2.2cqw] font-medium leading-none whitespace-nowrap text-neutral-950"
              style={
                {
                  ...pillTransition,
                  transform: playing ? "translateX(-120%)" : "translateX(0)",
                  opacity: playing && reducedMotion ? 0 : 1,
                } as CSSProperties
              }
            >
              <Volume2 className="size-[2.5cqw] min-h-[10px] min-w-[10px]" />
              {hint}
            </span>
          </span>
        ) : null}

        {/* Webcam bubble doubles as the play control. */}
        {bubble ? (
          <button
            type="button"
            id={labelId}
            onClick={togglePlaying}
            aria-pressed={playing}
            aria-label={playing ? "Pause recording" : "Play recording with sound"}
            className="uilab-rec__bubble absolute bottom-[4cqw] left-[4cqw] z-[3] size-[18cqw] overflow-hidden rounded-full border-[0.6cqw] border-white/90 bg-white/90 shadow-[0_1.2cqw_3cqw_-0.8cqw_rgb(0_0_0/0.7)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
          >
            {bubble}
          </button>
        ) : null}

        {skin ? (
          <span
            className={cn(
              "uilab-rec__badge absolute bottom-[4cqw] z-[4] inline-flex items-center gap-[1cqw] rounded-full border border-white/20 bg-neutral-950/60 px-[1.7cqw] py-[0.9cqw] font-medium leading-none whitespace-nowrap text-white backdrop-blur-sm",
              bubble ? "right-[4cqw]" : "left-1/2 -translate-x-1/2",
            )}
          >
            {skin.icon}
            {skin.label}
          </span>
        ) : null}
      </div>
    </>
  );
}
