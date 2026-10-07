"use client";

import {
  AnimatePresence,
  motion,
  type PanInfo,
  useDragControls,
  useReducedMotion,
} from "motion/react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";
import { Modal } from "@/components/ui/modal";
import { EASE_DRAWER } from "@/lib/ease";
import { cn } from "@/lib/utils";

// Vaul-style glide: a long, fully-damped tween reads smoother than a spring on
// open — no settle/overshoot, just one clean decel. Same curve drives the
// backdrop fade so the surface and scrim move as one.
const DRAWER = { duration: 0.5, ease: EASE_DRAWER } as const;

export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Heights (0-1 = fraction of viewport, or "auto"). First entry is default. */
  snapPoints?: (number | "auto")[];
  defaultSnap?: number;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  /** Min drag distance (px) past current snap to dismiss. */
  dismissThreshold?: number;
}

export function BottomSheet({
  open,
  onOpenChange,
  snapPoints = [0.5, 0.92],
  defaultSnap = 0,
  title,
  description,
  children,
  className,
  dismissThreshold = 120,
}: BottomSheetProps) {
  const [snap, setSnap] = useState(defaultSnap);
  const dragControls = useDragControls();
  const sheetRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const heightRef = useRef(0);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    if (open) setSnap(defaultSnap);
  }, [open, defaultSnap]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    // Strong downward fling or large drag → dismiss.
    if (velocity > 600 || offset > dismissThreshold) {
      const smaller = snapPoints.map((_, i) => i).filter((i) => i < snap);
      if (smaller.length && velocity < 800 && offset < dismissThreshold * 1.6) {
        setSnap(smaller[smaller.length - 1]);
      } else {
        onOpenChange(false);
      }
      return;
    }

    // Strong upward fling → next snap.
    if (velocity < -500) {
      setSnap(Math.min(snapPoints.length - 1, snap + 1));
      return;
    }

    // Otherwise snap to nearest by current offset.
    if (offset > 80 && snap > 0) setSnap(snap - 1);
    else if (offset < -80 && snap < snapPoints.length - 1) setSnap(snap + 1);
  };

  const snapValue = snapPoints[snap];
  const heightStyle =
    snapValue === "auto"
      ? { maxHeight: "92vh" }
      : { height: `${snapValue * 100}vh` };

  return (
    <AnimatePresence>
      {open ? (
        <Modal
          contentRef={sheetRef}
          onDismiss={() => onOpenChange(false)}
          labelledBy={title ? titleId : undefined}
          describedBy={description ? descriptionId : undefined}
          className="pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={DRAWER}
            onClick={() => onOpenChange(false)}
            // A dim scrim with a light blur. backdrop-blur is GPU-expensive and
            // re-rasterizes every frame the sheet drags over it; a small radius
            // plus more opacity keeps the glass look without the jank.
            className="pointer-events-auto absolute inset-0 bg-background/40 backdrop-blur-sm"
          />
          <motion.div
            ref={sheetRef}
            tabIndex={-1}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.02, bottom: 0.4 }}
            dragMomentum={false}
            onDragEnd={onDragEnd}
            initial={reduce ? { y: 0, opacity: 0 } : { y: "100%" }}
            animate={reduce ? { y: 0, opacity: 1 } : { y: 0 }}
            exit={reduce ? { y: 0, opacity: 0 } : { y: "100%" }}
            transition={reduce ? { duration: 0.18, ease: EASE_DRAWER } : DRAWER}
            onAnimationComplete={() => {
              if (sheetRef.current)
                heightRef.current = sheetRef.current.offsetHeight;
            }}
            style={heightStyle}
            className={cn(
              "pointer-events-auto absolute bottom-0 left-0 right-0 mx-auto flex max-w-2xl flex-col overflow-hidden rounded-t-3xl will-change-transform",
              "border border-border bg-background shadow-xl",
              className,
            )}
          >
            <div
              onPointerDown={(e) => dragControls.start(e)}
              className="flex cursor-grab touch-none flex-col items-center px-4 pb-2 pt-3 active:cursor-grabbing"
            >
              <div className="h-1.5 w-10 rounded-full bg-muted-foreground/40" />
              {title || description ? (
                <div className="mt-3 w-full">
                  {title ? (
                    <h2 id={titleId} className="text-base font-semibold text-foreground">
                      {title}
                    </h2>
                  ) : null}
                  {description ? (
                    <p id={descriptionId} className="mt-0.5 text-sm text-muted-foreground">
                      {description}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
            {/* overscroll-contain stops boundary scrolls from chaining to the page. */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6">{children}</div>
          </motion.div>
        </Modal>
      ) : null}
    </AnimatePresence>
  );
}
