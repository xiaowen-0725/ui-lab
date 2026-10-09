"use client";

import { Link } from "@/i18n/navigation";
import { motion } from "motion/react";
import { useHydratedReducedMotion as useReducedMotion } from "@/lib/hooks/use-hydrated-reduced-motion";
import type { ComponentProps } from "react";
import { SPRING_PRESS } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";

const MotionLink = motion.create(Link);

export interface PressLinkProps extends ComponentProps<typeof MotionLink> {
  pressScale?: number;
}

/**
 * Link CTA with the same spring press as the library Button — interruptible,
 * settles with life. The CSS `.press` utility reads flat next to it.
 */
export function PressLink({ pressScale = 0.97, ...props }: PressLinkProps) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  return (
    <MotionLink
      whileTap={reduce ? undefined : { scale: pressScale }}
      whileHover={reduce || !canHover ? undefined : { scale: 1.02 }}
      transition={SPRING_PRESS}
      {...props}
    />
  );
}
