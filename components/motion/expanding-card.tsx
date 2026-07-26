"use client";

import { ArrowUpRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { EASE_OUT, SPRING_LAYOUT } from "@/lib/ease";
import { cn } from "@/lib/utils";

// Shared-layout "card expands into a modal" pattern (App Store style): the
// collapsed card *is* the trigger button, and shares a layoutId with the
// expanded panel portalled to <body>. Motion FLIPs between the two boxes —
// grow on open, shrink back on close — so it reads as one surface morphing
// rather than a card that opens a separate dialog.
//
// The trigger stays mounted (just hidden) the whole time it's open, instead
// of unmounting via AnimatePresence like a typical trigger/panel swap. That
// keeps its place in the document flow so a surrounding grid of cards never
// reflows while the modal is up — only its paint toggles.

export interface ExpandingCardProps {
  /** Shown in both the collapsed card and the expanded modal; morphs continuously between them. */
  title: ReactNode;
  /** Shown in both states, under the title. */
  summary?: ReactNode;
  /** Expanded-only content — fades in once the card has landed. */
  children: ReactNode;
  /** Collapsed-state affordance text. */
  expandHint?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Collapsed card. */
  className?: string;
  /** Expanded modal surface. */
  modalClassName?: string;
}

// Both surfaces set radius via inline `style` (never a Tailwind class) —
// Motion only interpolates `borderRadius`/`boxShadow` during a layout
// animation when they arrive as animatable style values, not static CSS.
const CLOSED_RADIUS = 24;
const OPEN_RADIUS = 32;

// Shared layoutId morph = a FLIP between the card's box and the modal's box.
// SPRING_LAYOUT, not SPRING_PANEL: ease.ts scopes SPRING_LAYOUT to exactly
// this ("shared-layout glides... panels morphing between positions"), while
// SPRING_PANEL is tuned for overlays that materialize in place with no box
// to carry across.
const MORPH = SPRING_LAYOUT;

export function ExpandingCard({
  title,
  summary,
  children,
  expandHint = "Expand",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  modalClassName,
}: ExpandingCardProps) {
  const uid = useId();
  const surfaceId = `${uid}-surface`;
  const titleId = `${uid}-title`;
  const summaryId = `${uid}-summary`;

  const reduce = useReducedMotion();
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const wasOpenRef = useRef(false);

  const controlled = openProp !== undefined;
  const open = controlled ? openProp : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  useEffect(() => setMounted(true), []);

  // Lock page scroll while the modal is open (same effect shape as MorphingModal).
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Escape closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // Move focus into the panel on open — mirrors CommandPalette's autofocus.
  useEffect(() => {
    if (!open || !mounted) return;
    const raf = requestAnimationFrame(() => closeButtonRef.current?.focus());
    return () => cancelAnimationFrame(raf);
  }, [open, mounted]);

  // Return focus to the trigger once the modal has actually closed.
  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      return;
    }
    if (wasOpenRef.current) {
      wasOpenRef.current = false;
      triggerRef.current?.focus();
    }
  }, [open]);

  return (
    <>
      <motion.button
        ref={triggerRef}
        type="button"
        layoutId={reduce ? undefined : surfaceId}
        transition={reduce ? undefined : MORPH}
        style={{ borderRadius: CLOSED_RADIUS }}
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-hidden={open ? true : undefined}
        className={cn(
          "group relative flex w-full flex-col gap-2 border border-border bg-card p-5 text-left shadow-sm outline-none transition-colors",
          "hover:border-(--color-border-strong) focus-visible:ring-2 focus-visible:ring-foreground/20",
          open && "invisible",
          className,
        )}
      >
        <motion.h3
          layoutId={reduce ? undefined : titleId}
          transition={reduce ? undefined : MORPH}
          className="text-base font-semibold text-foreground"
        >
          {title}
        </motion.h3>
        {summary ? (
          <motion.p
            layoutId={reduce ? undefined : summaryId}
            transition={reduce ? undefined : MORPH}
            className="text-sm text-muted-foreground"
          >
            {summary}
          </motion.p>
        ) : null}
        <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors group-hover:text-foreground">
          {expandHint}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </motion.button>

      {mounted
        ? createPortal(
            <div
              aria-hidden={!open}
              className={cn(
                "fixed inset-0 z-[90]",
                open ? "pointer-events-auto" : "pointer-events-none",
              )}
            >
              <motion.div
                initial={false}
                animate={{ opacity: open ? 1 : 0 }}
                // Exit faster than enter (AGENTS.md motion rule) — mirrors
                // CommandPalette's backdrop timing.
                transition={{ duration: open ? 0.2 : 0.14, ease: EASE_OUT }}
                onClick={() => setOpen(false)}
                className={cn(
                  "absolute inset-0 bg-background/10 [backdrop-filter:blur(14px)_saturate(140%)] [-webkit-backdrop-filter:blur(14px)_saturate(140%)]",
                  open ? "pointer-events-auto" : "pointer-events-none",
                )}
              />
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-4">
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      key="panel"
                      layoutId={reduce ? undefined : surfaceId}
                      role="dialog"
                      aria-modal="true"
                      aria-labelledby={titleId}
                      initial={reduce ? { opacity: 0 } : undefined}
                      animate={reduce ? { opacity: 1 } : undefined}
                      exit={
                        reduce
                          ? {
                              opacity: 0,
                              transition: { duration: 0.14, ease: EASE_OUT },
                            }
                          : undefined
                      }
                      transition={
                        reduce ? { duration: 0.16, ease: EASE_OUT } : MORPH
                      }
                      style={{ borderRadius: OPEN_RADIUS }}
                      className={cn(
                        "pointer-events-auto relative flex max-h-[85vh] w-full max-w-lg flex-col gap-2 overflow-y-auto border border-border bg-card p-6 text-left shadow-2xl will-change-transform sm:p-8",
                        modalClassName,
                      )}
                    >
                      <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={() => setOpen(false)}
                        aria-label="Close"
                        className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/20"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <motion.h3
                        id={titleId}
                        layoutId={reduce ? undefined : titleId}
                        transition={reduce ? undefined : MORPH}
                        className="pr-10 text-xl font-semibold text-foreground sm:text-2xl"
                      >
                        {title}
                      </motion.h3>
                      {summary ? (
                        <motion.p
                          layoutId={reduce ? undefined : summaryId}
                          transition={reduce ? undefined : MORPH}
                          className="text-sm text-muted-foreground"
                        >
                          {summary}
                        </motion.p>
                      ) : null}

                      <motion.div
                        initial={
                          reduce ? { opacity: 0 } : { opacity: 0, y: 10 }
                        }
                        animate={{ opacity: 1, y: 0 }}
                        exit={{
                          opacity: 0,
                          y: reduce ? 0 : 6,
                          transition: { duration: 0.12, ease: EASE_OUT },
                        }}
                        transition={{
                          duration: 0.24,
                          ease: EASE_OUT,
                          delay: reduce ? 0 : 0.1,
                        }}
                        className="mt-3 border-t border-border pt-4"
                      >
                        {children}
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
