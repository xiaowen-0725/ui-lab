"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_IN_OUT, EASE_OUT, SPRING_SWAP } from "@/lib/ease";
import {
  EmptyStateAction,
  EmptyStateCopy,
  EmptyStateStage,
  type EmptyStateProps,
} from "./shared";

const INBOX_DEFAULTS = {
  title: "Inbox zero",
  message: "You're all caught up. New replies will land here.",
  actionLabel: "Compose",
} as const;

// Sequence: the flap lifts first, the letter rises out shortly after (while the
// flap is still opening), then the badge springs in once the letter has landed.
const FLAP_DELAY = 0.05;
const LETTER_DELAY = 0.28;
const BADGE_DELAY = 0.58;
const IDLE_DELAY = LETTER_DELAY + 0.5;

export function EmptyStateInbox({
  title = INBOX_DEFAULTS.title,
  message = INBOX_DEFAULTS.message,
  actionLabel = INBOX_DEFAULTS.actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  const reduce = useReducedMotion();

  return (
    <EmptyStateStage className={className}>
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
        {/* Pocket: open-top envelope body. */}
        <path d="M34 58 V118 L42 126 H118 L126 118 V58" />

        {/* Letter: lifts out of the pocket, then floats gently forever. */}
        <motion.g
          initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: -18 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.5, ease: EASE_OUT, delay: LETTER_DELAY }
          }
        >
          <motion.g
            animate={reduce ? undefined : { y: [0, -2, 0, 2, 0] }}
            transition={
              reduce
                ? undefined
                : {
                    duration: 3.2,
                    ease: EASE_IN_OUT,
                    repeat: Infinity,
                    delay: IDLE_DELAY,
                  }
            }
          >
            <rect x="58" y="72" width="44" height="30" rx="3" />
            <line x1="66" y1="82" x2="94" y2="82" />
            <line x1="66" y1="90" x2="86" y2="90" />
          </motion.g>
        </motion.g>

        {/* Flap: swings open like a hinge anchored at the pocket's top edge. */}
        <motion.path
          d="M34 58 L80 30 L126 58"
          style={{ transformOrigin: "80px 58px" }}
          initial={reduce ? { scaleY: 1 } : { scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={
            reduce
              ? { duration: 0 }
              : { duration: 0.4, ease: EASE_OUT, delay: FLAP_DELAY }
          }
        />

        {/* Badge: checkmark springs in once the inbox has settled. */}
        <motion.g
          className="text-primary"
          style={{ transformOrigin: "128px 40px" }}
          initial={
            reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }
          }
          animate={{ opacity: 1, scale: 1 }}
          transition={
            reduce ? { duration: 0 } : { ...SPRING_SWAP, delay: BADGE_DELAY }
          }
        >
          <circle cx="128" cy="40" r="16" />
          <motion.path
            d="M120 40l5 5l11-11"
            initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={
              reduce
                ? { duration: 0 }
                : { duration: 0.3, ease: EASE_OUT, delay: BADGE_DELAY + 0.2 }
            }
          />
        </motion.g>
      </svg>
      <EmptyStateCopy title={title} message={message} />
      <EmptyStateAction actionLabel={actionLabel} onAction={onAction} />
    </EmptyStateStage>
  );
}
