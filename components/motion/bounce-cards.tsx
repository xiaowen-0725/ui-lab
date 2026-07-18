// Ported from motion-anything (nexu-io, Apache-2.0); upstream: reactbits.dev "Bounce Cards", redistributed with permission.
"use client";

import { motion, useInView, useReducedMotion, type Transition } from "motion/react";
import { useRef, type ReactNode } from "react";
import { EASE_OUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

export interface BounceCardsProps {
  /** Card contents, rendered as an absolutely stacked deck that fans open. */
  children: ReactNode[];
  /** Stagger between each card's entrance, in ms. */
  stagger?: number;
  /** Horizontal offset between adjacent cards at rest, in px. */
  spacing?: number;
  /** Rotation step between adjacent cards at rest, in degrees. */
  rotation?: number;
  className?: string;
}

const CARD_WIDTH = 132;
const CARD_HEIGHT = 176;

// None of the shared spring tokens in lib/ease.ts overshoot enough to read as
// a "bounce" — upstream animates with cubic-bezier(.34,1.56,.64,1), a springy
// ease with ~56% overshoot. Low damping here reproduces that snap as the deck
// fans open, instead of copying the CSS keyframe directly.
const SPRING_FAN: Transition = {
  type: "spring",
  stiffness: 280,
  damping: 16,
  mass: 0.9,
};

export function BounceCards({
  children,
  stagger = 90,
  spacing = 46,
  rotation = 9,
  className,
}: BounceCardsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.3 });

  const count = children.length;
  const center = (count - 1) / 2;
  const maxOffset = center * spacing;
  const containerWidth = CARD_WIDTH + maxOffset * 2 + 32;

  return (
    <div
      ref={ref}
      style={{ width: containerWidth, height: CARD_HEIGHT + 32 }}
      className={cn("relative", className)}
    >
      {children.map((card, index) => {
        const offset = index - center;
        const x = offset * spacing;
        const rotate = offset * rotation;
        const delay = (index * stagger) / 1000;

        const rest = { opacity: 1, x, y: 0, rotate, scale: 1 };
        // Reduced motion: pin transform to its resting value so only opacity
        // animates — the fanned layout still appears, just without the leap.
        const hidden = reduce
          ? { opacity: 0, x, y: 0, rotate, scale: 1 }
          : { opacity: 0, x: 0, y: 20, rotate: 0, scale: 0.9 };

        return (
          <motion.div
            // biome-ignore lint/suspicious/noArrayIndexKey: fixed-length card deck, position is the slot identity.
            key={index}
            initial={hidden}
            animate={inView ? rest : hidden}
            transition={{
              default: { ...SPRING_FAN, delay },
              opacity: { duration: 0.5, ease: EASE_OUT, delay },
            }}
            style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
            className="absolute inset-0 m-auto overflow-hidden rounded-2xl shadow-2xl shadow-black/40"
          >
            {card}
          </motion.div>
        );
      })}
    </div>
  );
}
