"use client";

import type { LucideIcon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export type AnimatedIconVariant =
  | "draw"
  | "wiggle"
  | "spin"
  | "bounce"
  | "pop"
  | "pulse"
  | "nudge";

export interface AnimatedIconProps {
  /** Which hover animation to play. */
  variant: AnimatedIconVariant;
  /** Icon size in px. */
  size?: number;
  className?: string;
  /** Lucide icon component to animate. Ignored by the `draw` variant. */
  icon?: LucideIcon;
  /** SVG path `d` strings the `draw` variant renders. Defaults to a checkmark. */
  paths?: string[];
}

const DEFAULT_PATHS = ["M5 13l4 4L19 7"];

/**
 * Seven hover-played icon micro-interactions behind a single `variant` prop:
 * `draw` self-draws its stroke (pathLength 0 → 1) — ignores `icon`, uses `paths`;
 * `wiggle` rocks side to side; `spin` rotates a full turn; `bounce` springs
 * vertically; `pop` springs its scale up and back; `pulse` loops a gentle
 * scale while hovered; `nudge` springs a small step sideways. Reduced-motion
 * renders a static icon (or a static checkmark for `draw`) with no animation.
 */
export function AnimatedIcon({
  variant,
  size = 28,
  className,
  icon: Icon,
  paths = DEFAULT_PATHS,
}: AnimatedIconProps) {
  const reduce = useReducedMotion();

  if (variant === "draw") {
    if (reduce) {
      return (
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          width={size}
          height={size}
          className={cn("text-current", className)}
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {paths.map((d) => (
            <path key={d} d={d} pathLength={1} />
          ))}
        </svg>
      );
    }

    return (
      <motion.svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className={cn("text-current", className)}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial="rest"
        whileHover="hover"
      >
        {paths.map((d) => (
          <motion.path
            key={d}
            d={d}
            variants={{
              rest: { pathLength: 1 },
              hover: { pathLength: [0, 1] },
            }}
            transition={{ duration: 0.6 }}
          />
        ))}
      </motion.svg>
    );
  }

  if (!Icon) return null;

  if (reduce) {
    return <Icon size={size} className={cn("text-current", className)} />;
  }

  switch (variant) {
    case "wiggle":
      return (
        <motion.div
          style={{ display: "inline-flex" }}
          whileHover={{ rotate: [0, -14, 10, -6, 0] }}
          transition={{ duration: 0.6 }}
        >
          <Icon size={size} className={cn("text-current", className)} />
        </motion.div>
      );
    case "spin":
      return (
        <motion.div
          style={{ display: "inline-flex" }}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Icon size={size} className={cn("text-current", className)} />
        </motion.div>
      );
    case "bounce":
      return (
        <motion.div
          style={{ display: "inline-flex" }}
          whileHover={{ y: [0, 4, 0] }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
        >
          <Icon size={size} className={cn("text-current", className)} />
        </motion.div>
      );
    case "pop":
      return (
        <motion.div
          style={{ display: "inline-flex" }}
          whileHover={{ scale: [1, 1.25, 1] }}
          transition={{ type: "spring", stiffness: 400, damping: 12 }}
        >
          <Icon size={size} className={cn("text-current", className)} />
        </motion.div>
      );
    case "pulse":
      return (
        <motion.div
          style={{ display: "inline-flex" }}
          whileHover={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
        >
          <Icon size={size} className={cn("text-current", className)} />
        </motion.div>
      );
    case "nudge":
      return (
        <motion.div
          style={{ display: "inline-flex" }}
          whileHover={{ x: [0, 4, 0] }}
          transition={{ type: "spring", stiffness: 400, damping: 14 }}
        >
          <Icon size={size} className={cn("text-current", className)} />
        </motion.div>
      );
    default:
      return null;
  }
}
