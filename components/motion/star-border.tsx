// Ported from motion-anything (nexu-io, Apache-2.0); upstream: reactbits.dev "Star Border", redistributed with permission.
// The two-layer comet head/tail, the mask-cut ring and the animated-angle
// approach are a clean-room reimplementation of techniques observed on
// unabyss.com; no upstream source was used.

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StarBorderProps {
  /** Content the light ring wraps. Needs no background of its own — the ring is cut to the border band. */
  children: ReactNode;
  className?: string;
  /** Color of the traveling light. Defaults to the current text color, so it follows whatever `text-*` class is set on the wrapper. */
  color?: string;
  /** Seconds for one full revolution around the border. */
  speed?: number;
  /** Border ring thickness in px. */
  thickness?: number;
  /**
   * Where the comet sits at time zero, in degrees. Vary it across instances so
   * several rings on one screen don't travel in lockstep.
   */
  startAngle?: number;
}

/**
 * Registering the angle as a custom property is what makes it animatable: the
 * browser can then interpolate `--uilab-comet-angle` and only the gradient is
 * repainted. The previous approach spun a huge element instead, which meant
 * compositing a layer many times the size of the button.
 *
 * Where `@property` is unsupported the angle simply never advances, leaving the
 * static ring — the same thing reduced motion asks for.
 */
const COMET_STYLES = `
@property --uilab-comet-angle{syntax:"<angle>";inherits:false;initial-value:0deg}
@keyframes uilab-comet-spin{to{--uilab-comet-angle:360deg}}
@media (prefers-reduced-motion:reduce){.uilab-comet-layer{animation:none!important}}
`;

/** Cuts a painted box down to just its padding band, leaving the middle clear. */
const RING_MASK =
  "linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0)";

function mix(color: string, percent: number): string {
  return `color-mix(in srgb, ${color} ${percent}%, transparent)`;
}

/**
 * A comet is a bright head with a long faint trail, so it takes two passes: a
 * wide soft tail and a narrow bright core, both anchored to the same angle.
 * One arc alone reads as a rotating smear.
 */
function cometGradient(color: string, layer: "tail" | "core"): string {
  const from = "calc(var(--uilab-comet-angle) + var(--uilab-comet-start))";

  // Stops run outward from 0deg and wrap back through 360deg, so the trail
  // follows the head rather than leading it.
  const stops =
    layer === "tail"
      ? `${mix(color, 30)} 0deg, ${mix(color, 14)} 12deg, ${mix(color, 4)} 30deg, transparent 60deg, transparent 240deg, ${mix(color, 4)} 270deg, ${mix(color, 14)} 320deg, ${mix(color, 30)} 360deg`
      : `${mix(color, 85)} 0deg, ${mix(color, 40)} 5deg, ${mix(color, 8)} 14deg, transparent 26deg, transparent 334deg, ${mix(color, 8)} 346deg, ${mix(color, 40)} 355deg, ${mix(color, 85)} 360deg`;

  return `conic-gradient(from ${from}, ${stops})`;
}

/**
 * A slow beam of light travels around an element's border — a quiet ambient
 * accent for a single CTA or "featured" card.
 *
 * Pure CSS, no dependency: two conic-gradient layers (comet tail + head) are
 * masked down to the border band, so the ring works over any background,
 * including a transparent or blurred card. Reduced motion freezes the comet in
 * place rather than hiding it.
 */
export function StarBorder({
  children,
  className,
  color = "currentColor",
  speed = 6,
  thickness = 1,
  startAngle = 0,
}: StarBorderProps) {
  const layer: CSSProperties = {
    padding: thickness,
    animationDuration: `${speed}s`,
    mask: RING_MASK,
    WebkitMask: RING_MASK,
    backgroundOrigin: "border-box",
    backgroundClip: "border-box",
  };

  return (
    <>
      <style>{COMET_STYLES}</style>
      <div
        className={cn("relative isolate inline-block rounded-2xl", className)}
        style={
          {
            padding: thickness,
            "--uilab-comet-start": `${startAngle}deg`,
          } as CSSProperties
        }
      >
        <span
          aria-hidden
          className="uilab-comet-layer pointer-events-none absolute inset-0 rounded-[inherit] animate-[uilab-comet-spin_6s_linear_infinite]"
          style={{ ...layer, background: cometGradient(color, "tail") }}
        />
        <span
          aria-hidden
          className="uilab-comet-layer pointer-events-none absolute inset-0 rounded-[inherit] animate-[uilab-comet-spin_6s_linear_infinite]"
          style={{ ...layer, background: cometGradient(color, "core") }}
        />
        <div className="relative z-[2]">{children}</div>
      </div>
    </>
  );
}
