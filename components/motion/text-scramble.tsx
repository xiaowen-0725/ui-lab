"use client";

// Ported from motion-anything (nexu-io, Apache-2.0); upstream effect: reactbits.dev "Decrypted Text", redistributed with permission.

import { useInView, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export interface TextScrambleProps {
  /** The real text. Changing it plays a scramble decode from the old value to the new one. */
  text: string;
  /** "view" decodes once on scroll into view (default). "hover" replays on pointer hover; touch devices fall back to "view". */
  trigger?: "view" | "hover";
  /** Total decode time in ms. */
  duration?: number;
  /** Glyphs shown while a character is still unresolved. */
  charset?: string;
  className?: string;
}

const DEFAULT_CHARSET = "!<>-_\\/[]{}=+*^?#";

export function TextScramble({
  text,
  trigger = "view",
  duration = 700,
  charset = DEFAULT_CHARSET,
  className,
}: TextScrambleProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const inView = useInView(ref, { once: true, amount: 0.4 });

  // Touch devices get phantom hover states that stick after tap — degrade to view.
  const effectiveTrigger = trigger === "hover" && !canHover ? "view" : trigger;

  const [display, setDisplay] = useState(text);
  const prevTextRef = useRef(text);
  const enteredRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const scrambleTo = useCallback(
    (from: string, to: string) => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      if (reduce) {
        setDisplay(to);
        return;
      }
      const len = Math.max(from.length, to.length);
      if (len === 0) {
        setDisplay("");
        return;
      }
      const totalFrames = Math.max(1, Math.round((duration / 1000) * 60));
      let frame = 0;
      const tick = () => {
        const revealed = (frame / totalFrames) * len;
        let out = "";
        for (let i = 0; i < len; i++) {
          const targetChar = to[i] ?? "";
          if (i < revealed) {
            out += targetChar;
          } else if (targetChar === " ") {
            out += " ";
          } else {
            out += charset[Math.floor(Math.random() * charset.length)];
          }
        }
        setDisplay(out);
        if (revealed >= len) {
          setDisplay(to);
          rafRef.current = null;
          return;
        }
        frame += 1;
        rafRef.current = requestAnimationFrame(tick);
      };
      tick();
    },
    [charset, duration, reduce],
  );

  // Entrance: decode once when the element scrolls into view.
  useEffect(() => {
    if (effectiveTrigger !== "view" || reduce) return;
    if (!inView || enteredRef.current) return;
    enteredRef.current = true;
    scrambleTo(prevTextRef.current, text);
  }, [effectiveTrigger, inView, reduce, scrambleTo, text]);

  // Replay a scramble whenever the text prop itself changes, from the old value to the new one.
  useEffect(() => {
    if (prevTextRef.current === text) return;
    const from = prevTextRef.current;
    prevTextRef.current = text;
    if (effectiveTrigger === "view" && !enteredRef.current) {
      // Not on screen yet — swap silently, the entrance effect will decode it in later.
      setDisplay(text);
      return;
    }
    scrambleTo(from, text);
  }, [text, effectiveTrigger, scrambleTo]);

  useEffect(() => {
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const hoverHandlers =
    effectiveTrigger === "hover" ? { onMouseEnter: () => scrambleTo(text, text) } : {};

  return (
    <span
      ref={ref}
      {...hoverHandlers}
      className={cn("relative inline-block whitespace-nowrap align-baseline", className)}
    >
      <span className="sr-only">{text}</span>
      {/* Invisible sizer: reserves box width from the final text so the scramble never jitters the layout. */}
      <span aria-hidden="true" className="invisible">
        {text}
      </span>
      <span aria-hidden="true" className="absolute inset-0 whitespace-nowrap">
        {display}
      </span>
    </span>
  );
}
