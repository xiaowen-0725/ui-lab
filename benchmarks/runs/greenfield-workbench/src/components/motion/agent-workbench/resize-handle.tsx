"use client";

import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { cn } from "@/lib/utils";

export interface ResizeHandleProps {
  /** Which edge of the pane this handle sits on — sets both the hit-area
   * position and the sign of the pointer delta (dragging toward the pane
   * grows it, away from it shrinks it). */
  edge: "left" | "right";
  /** Current pane width, used for keyboard math and the aria value. */
  value: number;
  min: number;
  max: number;
  /** Raw (unclamped) next width — the caller owns clamping/collapse. */
  onResize: (nextValue: number) => void;
  /** Called on double-click or Enter — the caller owns what "default" means. */
  onReset: () => void;
  onDraggingChange?: (dragging: boolean) => void;
  className?: string;
  "aria-label"?: string;
}

const KEY_STEP = 16;

export function ResizeHandle({
  edge,
  value,
  min,
  max,
  onResize,
  onReset,
  onDraggingChange,
  className,
  "aria-label": ariaLabel,
}: ResizeHandleProps) {
  const [dragging, setDragging] = useState(false);
  // Captured at drag start so pointer math is relative to where the drag
  // began, not the (already-updating) live value.
  const dragStartRef = useRef({ pointerX: 0, width: value });
  const valueRef = useRef(value);
  valueRef.current = value;

  const setDraggingState = useCallback(
    (next: boolean) => {
      setDragging(next);
      onDraggingChange?.(next);
    },
    [onDraggingChange],
  );

  // A drag past the collapse threshold unmounts this handle mid-gesture (the
  // pane conditionally renders it), so no pointerup ever fires — clear the
  // parent's dragging flag on unmount or every later open/close animation
  // would keep the zeroed drag transition.
  const onDraggingChangeRef = useRef(onDraggingChange);
  onDraggingChangeRef.current = onDraggingChange;
  useEffect(() => () => onDraggingChangeRef.current?.(false), []);

  const onPointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.setPointerCapture(event.pointerId);
      dragStartRef.current = { pointerX: event.clientX, width: valueRef.current };
      setDraggingState(true);
    },
    [setDraggingState],
  );

  const onPointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!dragging) return;
      const delta = event.clientX - dragStartRef.current.pointerX;
      const signedDelta = edge === "right" ? delta : -delta;
      onResize(dragStartRef.current.width + signedDelta);
    },
    [dragging, edge, onResize],
  );

  const endDrag = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      event.currentTarget.releasePointerCapture?.(event.pointerId);
      setDraggingState(false);
    },
    [setDraggingState],
  );

  const onKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
        event.preventDefault();
        onReset();
        return;
      }
      // Arrows move the divider, not the width: on a left-edge handle the
      // divider sits left of the pane, so ArrowRight shrinks the pane.
      const dir = edge === "right" ? 1 : -1;
      const map: Record<string, number> = {
        ArrowLeft: value - KEY_STEP * dir,
        ArrowRight: value + KEY_STEP * dir,
        Home: min,
        End: max,
      };
      const next = map[event.key];
      if (next !== undefined) {
        event.preventDefault();
        onResize(next);
      }
    },
    [edge, value, min, max, onResize, onReset],
  );

  return (
    // biome-ignore lint/a11y/useSemanticElements: WAI-ARIA "window splitter" pattern — a focusable, draggable separator; <hr> can't take the child gradient line or own drag/keyboard handlers.
    <div
      role="separator"
      aria-orientation="vertical"
      aria-valuenow={Math.round(value)}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-label={ariaLabel}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
      onDoubleClick={onReset}
      className={cn(
        "group absolute inset-y-0 z-10 w-4 touch-none cursor-col-resize select-none outline-none",
        edge === "right" ? "right-0 translate-x-2" : "left-0 -translate-x-2",
        className,
      )}
    >
      <div
        className={cn(
          "mx-auto h-full w-px bg-gradient-to-b from-transparent via-[var(--wb-resize-handle)] to-transparent opacity-0 transition-opacity",
          "group-hover:opacity-100 group-focus-visible:opacity-100",
          dragging && "opacity-100",
        )}
      />
    </div>
  );
}
