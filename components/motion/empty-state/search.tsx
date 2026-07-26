"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_IN_OUT, EASE_OUT } from "@/lib/ease";
import {
  EmptyStateAction,
  EmptyStateCopy,
  EmptyStateStage,
  type EmptyStateProps,
} from "./shared";

const SEARCH_DEFAULTS = {
  title: "No matches",
  message: "Try fewer filters or a different phrase.",
  actionLabel: "Clear filters",
} as const;

// Result rows the glass sweeps over; each flickers on its own staggered delay.
const ROW_Y = [112, 126, 140] as const;

export function EmptyStateSearch({
  title = SEARCH_DEFAULTS.title,
  message = SEARCH_DEFAULTS.message,
  actionLabel = SEARCH_DEFAULTS.actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const reduce = useReducedMotion();

  return (
    <EmptyStateStage className={className}>
      <motion.svg
        viewBox="0 0 160 160"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="h-40 w-40 text-muted-foreground"
        initial={reduce ? { opacity: 1 } : { opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.4, ease: EASE_OUT }
        }
      >
        {/* Result rows: dashed lines that flicker in sequence, as if scanned and skipped. */}
        {ROW_Y.map((y, i) => (
          <motion.line
            key={y}
            x1={36}
            y1={y}
            x2={124}
            y2={y}
            strokeDasharray="4 6"
            animate={reduce ? undefined : { opacity: [1, 0.3, 1] }}
            transition={
              reduce
                ? undefined
                : {
                    duration: 1.8,
                    ease: EASE_IN_OUT,
                    repeat: Infinity,
                    delay: 0.5 + i * 0.35,
                  }
            }
          />
        ))}

        {/* Glass: slow scan sweep, as if searching but never landing on a match. */}
        <motion.g
          style={{ transformOrigin: "68px 62px" }}
          animate={
            reduce
              ? undefined
              : { x: [0, 8, 0, -8, 0], rotate: [0, 4, 0, -4, 0] }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: 5.4,
                  ease: EASE_IN_OUT,
                  repeat: Infinity,
                  delay: 0.4,
                }
          }
        >
          <circle cx="68" cy="62" r="30" />
          <line x1="90" y1="84" x2="114" y2="108" />
        </motion.g>
      </motion.svg>
      <EmptyStateCopy title={title} message={message} />
      <EmptyStateAction actionLabel={actionLabel} onAction={onAction} />
    </EmptyStateStage>
  );
}
