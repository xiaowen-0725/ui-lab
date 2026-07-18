// Ported from motion-anything (nexu-io, Apache-2.0); upstream: reactbits.dev "Glare Hover", redistributed with permission.

"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
import { EASE_OUT_CSS } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export interface GlareHoverProps {
  /** Content the glare sweeps across. Give it its own opaque background (card, button, image, …) — the wrapper only paints the glare layer. */
  children: ReactNode;
  className?: string;
  /** Color of the light band. Defaults to a soft translucent white. */
  color?: string;
  /** Angle of the sweeping band, in degrees. */
  angle?: number;
  /** Duration of one sweep, in ms. */
  duration?: number;
  /** Play the sweep once on first hover instead of replaying on every hover. */
  playOnce?: boolean;
}

/**
 * A diagonal light band sweeps across an element's surface on hover — a
 * premium, tactile sheen for a card or button. Pure CSS: a skewed gradient
 * layer sits above the content and translates across on hover via a
 * transform transition.
 */
export function GlareHover({
  children,
  className,
  color = "rgba(255, 255, 255, 0.55)",
  angle = -30,
  duration = 550,
  playOnce = false,
}: GlareHoverProps) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  // Decorative hover sheen: skip entirely on touch (phantom hover sticks after tap).
  const enabled = canHover;

  const [hovered, setHovered] = useState(false);
  const [played, setPlayed] = useState(false);

  const active = enabled && (hovered || (playOnce && played));

  const handleEnter = () => {
    if (!enabled) return;
    setHovered(true);
    if (playOnce) setPlayed(true);
  };

  const handleLeave = () => {
    if (!enabled) return;
    setHovered(false);
  };

  return (
    <motion.div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className={cn("relative isolate overflow-hidden", className)}
    >
      {children}
      {enabled ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[-50%] will-change-[transform,opacity]"
          style={
            reduce
              ? {
                  background: color,
                  opacity: active ? 0.35 : 0,
                  transitionProperty: "opacity",
                  transitionDuration: `${duration}ms`,
                  transitionTimingFunction: EASE_OUT_CSS,
                }
              : {
                  background: `linear-gradient(${angle}deg, transparent 40%, ${color} 50%, transparent 60%)`,
                  transform: active ? "translateX(150%)" : "translateX(-150%)",
                  transitionProperty: "transform",
                  transitionDuration: `${duration}ms`,
                  transitionTimingFunction: EASE_OUT_CSS,
                }
          }
        />
      ) : null}
    </motion.div>
  );
}
