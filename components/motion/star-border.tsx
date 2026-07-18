// Ported from motion-anything (nexu-io, Apache-2.0); upstream: reactbits.dev "Star Border", redistributed with permission.

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface StarBorderProps {
  /** Content the light ring wraps. Give it its own opaque background (button, card, …) — the wrapper only paints the ring. */
  children: ReactNode;
  className?: string;
  /** Color of the traveling light. Defaults to the current text color, so it follows whatever `text-*` class is set on the wrapper. */
  color?: string;
  /** Seconds for one full revolution around the border. */
  speed?: number;
  /** Border ring thickness in px. */
  thickness?: number;
}

/**
 * A slow beam of light travels around an element's border — a quiet ambient
 * accent for a single CTA or "featured" card. Pure CSS: a conic-gradient
 * layer spins behind the content and only shows through the padding-thin
 * ring, since the children's own background covers the rest.
 */
export function StarBorder({
  children,
  className,
  color = "currentColor",
  speed = 6,
  thickness = 1,
}: StarBorderProps) {
  return (
    <>
      <style>{`@keyframes uilab-star-border-spin{to{transform:rotate(1turn)}}`}</style>
      <div
        className={cn("relative isolate inline-block overflow-hidden rounded-2xl", className)}
        style={{ padding: thickness }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-[-1000%] animate-[uilab-star-border-spin_6s_linear_infinite] will-change-transform motion-reduce:animate-none"
          style={{
            animationDuration: `${speed}s`,
            background: `conic-gradient(from 0deg, transparent 0deg, ${color} 12deg, color-mix(in oklch, ${color} 35%, white) 18deg, ${color} 24deg, transparent 70deg, transparent 360deg)`,
          }}
        />
        <div className="relative z-[1]">{children}</div>
      </div>
    </>
  );
}
