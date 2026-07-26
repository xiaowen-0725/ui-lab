"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import {
  cloneElement,
  createContext,
  isValidElement,
  type ReactElement,
  type ReactNode,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { EASE_OUT, SPRING_LAYOUT, SPRING_SWAP } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

type Side = "top" | "bottom";

// Gap between trigger and bubble, in px. Matches tooltip.tsx.
const GAP = 8;
// Grace window after the pointer leaves the whole group before the bubble
// exits — long enough to cross the dead space between adjacent triggers
// without dismissing, short enough to still read as "left the toolbar".
const LEAVE_GRACE_MS = 150;

interface Anchor {
  /** Bubble center, px from the group's left edge. */
  x: number;
  /** Px from the group's near edge to the trigger's facing edge (minus gap). */
  edge: number;
}

interface ActiveState {
  id: string;
  content: ReactNode;
  className: string | undefined;
  anchor: Anchor;
}

interface ActivateArgs {
  id: string;
  content: ReactNode;
  className: string | undefined;
  node: HTMLElement;
}

interface MorphTooltipContextValue {
  activate: (args: ActivateArgs) => void;
  leave: () => void;
  canHover: boolean;
  surfaceId: string;
}

const MorphTooltipContext = createContext<MorphTooltipContextValue | null>(
  null,
);

function useMorphTooltipContext(component: string) {
  const ctx = useContext(MorphTooltipContext);
  if (!ctx)
    throw new Error(`${component} must be used within <MorphTooltipGroup>`);
  return ctx;
}

export interface MorphTooltipGroupProps {
  /** Which side of the triggers the shared bubble grows on. Default "top". */
  side?: Side;
  /** Delay before the bubble first appears, in ms. Default 120 (matches Tooltip). */
  delay?: number;
  className?: string;
  children: ReactNode;
}

// Bubble entrance mirrors Tooltip.tsx's feel: spring transform, faster
// tween-driven opacity/blur riding on top, offset from the trigger's side so
// it visibly grows out of it.
function buildBubbleVariants(side: Side): Variants {
  const y = side === "top" ? 8 : -8;
  return {
    initial: { opacity: 0, scale: 0.9, filter: "blur(5px)", y },
    animate: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        type: "spring",
        stiffness: 380,
        damping: 30,
        mass: 0.7,
        opacity: { duration: 0.14, ease: EASE_OUT },
        filter: { duration: 0.18, ease: EASE_OUT },
      },
    },
    exit: {
      opacity: 0,
      scale: 0.94,
      filter: "blur(3px)",
      y: y * 0.6,
      transition: { duration: 0.12, ease: EASE_OUT },
    },
  };
}

const REDUCED_BUBBLE_VARIANTS: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.14, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: EASE_OUT } },
};

// Content crossfade — label swaps as the bubble glides to a neighbour.
// Exit is faster than enter, per motion convention.
const CONTENT_VARIANTS: Variants = {
  initial: { opacity: 0, filter: "blur(4px)" },
  animate: { opacity: 1, filter: "blur(0px)", transition: SPRING_SWAP },
  exit: {
    opacity: 0,
    filter: "blur(4px)",
    transition: { duration: 0.1, ease: EASE_OUT },
  },
};

const REDUCED_CONTENT_VARIANTS: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.14, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.1, ease: EASE_OUT } },
};

/**
 * Container for a row of adjacent triggers (e.g. toolbar icon buttons) that
 * share one tooltip surface. The bubble springs in over the first trigger;
 * moving directly to a neighbour glides the same bubble across via layout
 * FLIP instead of exiting and re-entering. Wrap each trigger in `MorphTooltip`.
 */
export function MorphTooltipGroup({
  side = "top",
  delay = 120,
  className,
  children,
}: MorphTooltipGroupProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<ActiveState | null>(null);
  const showTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const surfaceId = useId();
  const reduce = useReducedMotion() ?? false;
  const canHover = useHoverCapable();

  // Trigger rect relative to the group container — the surface is absolutely
  // positioned within it, so viewport coords would need a portal + scroll
  // listeners (see Tooltip.tsx); a local, non-portaled surface avoids that.
  const measure = useCallback(
    (node: HTMLElement): Anchor | null => {
      const group = groupRef.current;
      if (!group) return null;
      const groupRect = group.getBoundingClientRect();
      const nodeRect = node.getBoundingClientRect();
      const x = nodeRect.left - groupRect.left + nodeRect.width / 2;
      const edge =
        side === "top"
          ? groupRect.bottom - nodeRect.top + GAP
          : nodeRect.bottom - groupRect.top + GAP;
      return { x, edge };
    },
    [side],
  );

  const activate = useCallback(
    ({ id, content, className: bubbleClassName, node }: ActivateArgs) => {
      if (leaveTimer.current) {
        clearTimeout(leaveTimer.current);
        leaveTimer.current = null;
      }
      const anchor = measure(node);
      if (!anchor) return;
      const isFirst = active === null;
      if (showTimer.current) {
        clearTimeout(showTimer.current);
        showTimer.current = null;
      }
      if (isFirst) {
        // Cold start — wait out the hover-intent delay before appearing.
        showTimer.current = setTimeout(() => {
          setActive({ id, content, className: bubbleClassName, anchor });
          showTimer.current = null;
        }, delay);
      } else {
        // Already warm — morph to the new trigger immediately, no delay.
        setActive({ id, content, className: bubbleClassName, anchor });
      }
    },
    [active, delay, measure],
  );

  const leave = useCallback(() => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    leaveTimer.current = setTimeout(() => {
      setActive(null);
      leaveTimer.current = null;
    }, LEAVE_GRACE_MS);
  }, []);

  const ctx = useMemo<MorphTooltipContextValue>(
    () => ({ activate, leave, canHover, surfaceId }),
    [activate, leave, canHover, surfaceId],
  );

  const bubbleVariants = reduce
    ? REDUCED_BUBBLE_VARIANTS
    : buildBubbleVariants(side);
  const contentVariants = reduce ? REDUCED_CONTENT_VARIANTS : CONTENT_VARIANTS;

  return (
    <MorphTooltipContext.Provider value={ctx}>
      <div
        ref={groupRef}
        className={cn("relative inline-flex items-center gap-1", className)}
      >
        {children}
        <AnimatePresence>
          {active ? (
            <motion.div
              key="surface"
              id={surfaceId}
              role="tooltip"
              layout={!reduce}
              variants={bubbleVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ layout: SPRING_LAYOUT }}
              style={
                side === "top"
                  ? {
                      position: "absolute",
                      left: active.anchor.x,
                      bottom: active.anchor.edge,
                      x: "-50%",
                      transformOrigin: "center bottom",
                    }
                  : {
                      position: "absolute",
                      left: active.anchor.x,
                      top: active.anchor.edge,
                      x: "-50%",
                      transformOrigin: "center top",
                    }
              }
              className={cn(
                "pointer-events-none z-30 whitespace-nowrap rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-medium text-foreground shadow-lg",
                active.className,
              )}
            >
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={active.id}
                  variants={contentVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="block"
                >
                  {active.content}
                </motion.span>
              </AnimatePresence>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </MorphTooltipContext.Provider>
  );
}

export interface MorphTooltipProps {
  content: ReactNode;
  children: ReactElement;
  /** Classes applied to the shared bubble while this trigger is the active one. */
  className?: string;
}

/**
 * Wraps a single trigger inside a `MorphTooltipGroup`. Hover or focus
 * activates the group's shared bubble over this trigger; the bubble itself
 * is rendered once by the group, not per-trigger.
 */
export function MorphTooltip({ content, children, className }: MorphTooltipProps) {
  const ctx = useMorphTooltipContext("MorphTooltip");
  const id = useId();
  const ref = useRef<HTMLSpanElement>(null);

  if (!isValidElement(children)) return children;

  const trigger = cloneElement(
    children as ReactElement<Record<string, unknown>>,
    {
      onMouseEnter: () => {
        if (!ctx.canHover) return;
        if (ref.current)
          ctx.activate({ id, content, className, node: ref.current });
      },
      onMouseLeave: () => ctx.leave(),
      onFocus: () => {
        if (ref.current)
          ctx.activate({ id, content, className, node: ref.current });
      },
      onBlur: () => ctx.leave(),
      "aria-describedby": ctx.surfaceId,
    },
  );

  return (
    <span ref={ref} className="relative inline-flex align-middle">
      {trigger}
    </span>
  );
}
