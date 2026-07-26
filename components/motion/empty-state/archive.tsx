"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { EASE_OUT, SPRING_PANEL } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import {
  EmptyStateAction,
  EmptyStateCopy,
  EmptyStateStage,
  type EmptyStateProps,
} from "./shared";

const ARCHIVE_DEFAULTS = {
  title: "Nothing archived yet",
  message: "Records you file away will show up here.",
  actionLabel: "Add record",
} as const;

// The top drawer slides along the same oblique "depth" axis used to draw the
// cabinet's lid and side face, so it reads as pulling out toward the viewer.
const DRAWER_OPEN = { x: -9, y: 5 };
const DRAWER_SHUT = { x: 0, y: 0 };

export function EmptyStateArchive({
  title = ARCHIVE_DEFAULTS.title,
  message = ARCHIVE_DEFAULTS.message,
  actionLabel = ARCHIVE_DEFAULTS.actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const [active, setActive] = useState(false);
  const open = active && !reduce;

  const handleEnter = () => {
    if (!canHover) return;
    setActive(true);
  };
  const handleLeave = () => {
    if (!canHover) return;
    setActive(false);
  };

  return (
    <EmptyStateStage className={className}>
      <button
        type="button"
        aria-label="Archive cabinet"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        className="inline-flex items-center justify-center rounded-3xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <svg
          viewBox="0 0 160 160"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-40 w-40 text-muted-foreground"
        >
          {/* Lid: top face of the cabinet, oblique projection. */}
          <path d="M40 50 L104 50 L124 38 L60 38 Z" />
          {/* Side: right face, sharing the lid's depth axis. */}
          <path d="M104 50 L104 126 L124 114 L124 38 Z" />

          {/* Papers: peek up above the lid while the top drawer is pulled open. */}
          <motion.g
            animate={
              open
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: reduce ? 0 : 10 }
            }
            transition={{ duration: 0.22, ease: EASE_OUT }}
          >
            <rect
              x="54"
              y="14"
              width="18"
              height="24"
              rx="2"
              transform="rotate(-6 63 26)"
            />
            <rect
              x="76"
              y="16"
              width="18"
              height="24"
              rx="2"
              transform="rotate(5 85 28)"
            />
          </motion.g>

          {/* Top drawer: slides along the depth axis on hover/focus. */}
          <motion.g
            animate={open ? DRAWER_OPEN : DRAWER_SHUT}
            transition={reduce ? { duration: 0 } : SPRING_PANEL}
          >
            <rect x="40" y="50" width="64" height="37" rx="2" />
            <line x1="62" y1="69" x2="82" y2="69" />
          </motion.g>

          {/* Bottom drawer: static. */}
          <rect x="40" y="89" width="64" height="37" rx="2" />
          <line x1="62" y1="107" x2="82" y2="107" />
        </svg>
      </button>
      <EmptyStateCopy title={title} message={message} />
      <EmptyStateAction actionLabel={actionLabel} onAction={onAction} />
    </EmptyStateStage>
  );
}
