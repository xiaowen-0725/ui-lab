"use client";

import { motion, useReducedMotion } from "motion/react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import useMeasure from "react-use-measure";
import { EASE_OUT, EASE_OUT_CSS, SPRING_PANEL } from "@/lib/ease";
import { cn } from "@/lib/utils";
import { ResizeHandle } from "./resize-handle";

/** Height of the overlay toolbar (`WorkbenchHeader`), in pixels. */
export const HEADER_HEIGHT = 46;
/** Sidebar width when `defaultSidebarWidth` is unset, and its reset target. */
export const SIDEBAR_DEFAULT_WIDTH = 275;
export const SIDEBAR_MIN_WIDTH = 240;
export const SIDEBAR_MAX_WIDTH = 520;
/** Panel width when `defaultPanelWidth` is unset, and its reset target. */
export const PANEL_DEFAULT_WIDTH = 384;
export const PANEL_MIN_WIDTH = 320;
/** Floor kept for the main column — sidebar/panel can never squeeze past it. */
export const MAIN_MIN_WIDTH = 320;

// Static ceiling used for the panel's aria-valuemax before the container has
// been measured (first paint only — react-use-measure reports 0 until its
// ResizeObserver fires).
const PANEL_MAX_FALLBACK = 960;

// Drag (or arrow-key nudge) a pane this far past its own minimum and it
// collapses instead of clamping at the minimum — the "drag past the edge to
// close" gesture native three-pane app shells use.
const COLLAPSE_MARGIN = 40;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

interface WorkbenchContextValue {
  sidebarOpen: boolean;
  panelOpen: boolean;
  toggleSidebar: () => void;
  togglePanel: () => void;
  setSidebarOpen: (open: boolean) => void;
  setPanelOpen: (open: boolean) => void;
  sidebarWidth: number;
  panelWidth: number;
  // Internal wiring for WorkbenchSidebar / WorkbenchPanel / WorkbenchHeader.
  // Not part of the public useWorkbench() contract.
  containerWidth: number;
  sidebarDefault: number;
  panelDefault: number;
  sidebarDragging: boolean;
  panelDragging: boolean;
  setSidebarDragging: (dragging: boolean) => void;
  setPanelDragging: (dragging: boolean) => void;
  resizeSidebar: (rawWidth: number) => void;
  resizePanel: (rawWidth: number) => void;
  resetSidebarWidth: () => void;
  resetPanelWidth: () => void;
}

const WorkbenchContext = createContext<WorkbenchContextValue | null>(null);

function useWorkbenchInternal(component: string): WorkbenchContextValue {
  const ctx = useContext(WorkbenchContext);
  if (!ctx) throw new Error(`${component} must be used inside <Workbench>`);
  return ctx;
}

/** Reads the workbench's open/close and width state. Must be used inside `<Workbench>`. */
export function useWorkbench() {
  const {
    sidebarOpen,
    panelOpen,
    toggleSidebar,
    togglePanel,
    setSidebarOpen,
    setPanelOpen,
    sidebarWidth,
    panelWidth,
  } = useWorkbenchInternal("useWorkbench");
  return {
    sidebarOpen,
    panelOpen,
    toggleSidebar,
    togglePanel,
    setSidebarOpen,
    setPanelOpen,
    sidebarWidth,
    panelWidth,
  };
}

export interface WorkbenchProps {
  sidebarOpen?: boolean;
  defaultSidebarOpen?: boolean;
  onSidebarOpenChange?: (open: boolean) => void;
  panelOpen?: boolean;
  defaultPanelOpen?: boolean;
  onPanelOpenChange?: (open: boolean) => void;
  /** Initial sidebar width, and its double-click/Enter reset target. Defaults to `SIDEBAR_DEFAULT_WIDTH`. */
  defaultSidebarWidth?: number;
  /** Initial panel width, and its double-click/Enter reset target. Defaults to `PANEL_DEFAULT_WIDTH`. */
  defaultPanelWidth?: number;
  className?: string;
  children?: ReactNode;
}

/**
 * Three-pane app shell root: a resizable sidebar, a flexible main column and
 * a resizable utility panel, laid out as a single flex row. Compose it with
 * `WorkbenchHeader` (an absolutely-positioned overlay), `WorkbenchSidebar`,
 * `WorkbenchMain` and `WorkbenchPanel` as children, in whatever DOM order —
 * only the header's position is order-independent by design.
 */
export function Workbench({
  sidebarOpen: sidebarOpenProp,
  defaultSidebarOpen = true,
  onSidebarOpenChange,
  panelOpen: panelOpenProp,
  defaultPanelOpen = false,
  onPanelOpenChange,
  defaultSidebarWidth,
  defaultPanelWidth,
  className,
  children,
}: WorkbenchProps) {
  const [containerRef, bounds] = useMeasure();
  const containerWidth = bounds.width;

  const sidebarDefault = defaultSidebarWidth ?? SIDEBAR_DEFAULT_WIDTH;
  const panelDefault = defaultPanelWidth ?? PANEL_DEFAULT_WIDTH;

  const [internalSidebarOpen, setInternalSidebarOpen] = useState(defaultSidebarOpen);
  const [internalPanelOpen, setInternalPanelOpen] = useState(defaultPanelOpen);
  const sidebarControlled = sidebarOpenProp !== undefined;
  const panelControlled = panelOpenProp !== undefined;
  const sidebarOpen = sidebarControlled ? sidebarOpenProp : internalSidebarOpen;
  const panelOpen = panelControlled ? panelOpenProp : internalPanelOpen;

  // Which side pane the user opened last — the other one yields when the
  // container can't fit both (see the auto-yield effect below).
  const lastOpenedRef = useRef<"sidebar" | "panel">("sidebar");

  const setSidebarOpen = useCallback(
    (open: boolean) => {
      if (open) lastOpenedRef.current = "sidebar";
      if (!sidebarControlled) setInternalSidebarOpen(open);
      onSidebarOpenChange?.(open);
    },
    [sidebarControlled, onSidebarOpenChange],
  );
  const setPanelOpen = useCallback(
    (open: boolean) => {
      if (open) lastOpenedRef.current = "panel";
      if (!panelControlled) setInternalPanelOpen(open);
      onPanelOpenChange?.(open);
    },
    [panelControlled, onPanelOpenChange],
  );
  const toggleSidebar = useCallback(
    () => setSidebarOpen(!sidebarOpen),
    [setSidebarOpen, sidebarOpen],
  );
  const togglePanel = useCallback(() => setPanelOpen(!panelOpen), [setPanelOpen, panelOpen]);

  const [sidebarWidth, setSidebarWidth] = useState(sidebarDefault);
  const [panelWidth, setPanelWidth] = useState(panelDefault);
  const [sidebarDragging, setSidebarDragging] = useState(false);
  const [panelDragging, setPanelDragging] = useState(false);

  const resizeSidebar = useCallback(
    (rawWidth: number) => {
      if (rawWidth < SIDEBAR_MIN_WIDTH - COLLAPSE_MARGIN) {
        setSidebarOpen(false);
        return;
      }
      const spaceLimit =
        containerWidth > 0 ? containerWidth - MAIN_MIN_WIDTH : SIDEBAR_MAX_WIDTH;
      const max = Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, spaceLimit));
      setSidebarWidth(clamp(rawWidth, SIDEBAR_MIN_WIDTH, max));
    },
    [setSidebarOpen, containerWidth],
  );

  const resizePanel = useCallback(
    (rawWidth: number) => {
      if (rawWidth < PANEL_MIN_WIDTH - COLLAPSE_MARGIN) {
        setPanelOpen(false);
        return;
      }
      const reserved = sidebarOpen ? sidebarWidth : 0;
      const max =
        containerWidth > 0
          ? Math.max(PANEL_MIN_WIDTH, containerWidth - reserved - MAIN_MIN_WIDTH)
          : PANEL_MAX_FALLBACK;
      setPanelWidth(clamp(rawWidth, PANEL_MIN_WIDTH, max));
    },
    [setPanelOpen, sidebarOpen, sidebarWidth, containerWidth],
  );

  const resetSidebarWidth = useCallback(() => setSidebarWidth(sidebarDefault), [sidebarDefault]);
  const resetPanelWidth = useCallback(() => setPanelWidth(panelDefault), [panelDefault]);

  // Re-clamp (never collapse) whenever the measured container shrinks, so a
  // narrower window can't leave the sidebar/panel wider than there's room for.
  useEffect(() => {
    if (containerWidth <= 0) return;
    setSidebarWidth((w) =>
      clamp(w, SIDEBAR_MIN_WIDTH, Math.max(SIDEBAR_MIN_WIDTH, containerWidth - MAIN_MIN_WIDTH)),
    );
  }, [containerWidth]);

  useEffect(() => {
    if (containerWidth <= 0) return;
    const reserved = sidebarOpen ? sidebarWidth : 0;
    setPanelWidth((w) =>
      clamp(w, PANEL_MIN_WIDTH, Math.max(PANEL_MIN_WIDTH, containerWidth - reserved - MAIN_MIN_WIDTH)),
    );
  }, [containerWidth, sidebarOpen, sidebarWidth]);

  // Both side panes plus the main floor can exceed a narrow container even at
  // their minimum widths. When they do, the pane opened less recently yields —
  // the narrow-window rule desktop three-pane shells use — so opening one side
  // swaps the other out instead of crushing the main column.
  useEffect(() => {
    if (containerWidth <= 0 || !sidebarOpen || !panelOpen) return;
    if (sidebarWidth + panelWidth + MAIN_MIN_WIDTH <= containerWidth) return;
    if (lastOpenedRef.current === "panel") setSidebarOpen(false);
    else setPanelOpen(false);
  }, [containerWidth, sidebarOpen, panelOpen, sidebarWidth, panelWidth, setSidebarOpen, setPanelOpen]);

  const value = useMemo<WorkbenchContextValue>(
    () => ({
      sidebarOpen,
      panelOpen,
      toggleSidebar,
      togglePanel,
      setSidebarOpen,
      setPanelOpen,
      sidebarWidth,
      panelWidth,
      containerWidth,
      sidebarDefault,
      panelDefault,
      sidebarDragging,
      panelDragging,
      setSidebarDragging,
      setPanelDragging,
      resizeSidebar,
      resizePanel,
      resetSidebarWidth,
      resetPanelWidth,
    }),
    [
      sidebarOpen,
      panelOpen,
      toggleSidebar,
      togglePanel,
      setSidebarOpen,
      setPanelOpen,
      sidebarWidth,
      panelWidth,
      containerWidth,
      sidebarDefault,
      panelDefault,
      sidebarDragging,
      panelDragging,
      resizeSidebar,
      resizePanel,
      resetSidebarWidth,
      resetPanelWidth,
    ],
  );

  return (
    <WorkbenchContext.Provider value={value}>
      <div
        ref={containerRef}
        className={cn("relative isolate flex h-full min-h-0 w-full overflow-hidden", className)}
      >
        {children}
      </div>
    </WorkbenchContext.Provider>
  );
}

export interface WorkbenchSidebarProps {
  className?: string;
  children?: ReactNode;
}

/** Translucent, resizable left pane. Drag its right-edge handle past the
 * minimum to collapse it; double-click the handle to reset its width. */
export function WorkbenchSidebar({ className, children }: WorkbenchSidebarProps) {
  const {
    sidebarOpen,
    sidebarWidth,
    sidebarDragging,
    containerWidth,
    resizeSidebar,
    resetSidebarWidth,
    setSidebarDragging,
  } = useWorkbenchInternal("WorkbenchSidebar");
  const reduce = useReducedMotion() ?? false;
  const ariaMax =
    containerWidth > 0
      ? Math.max(SIDEBAR_MIN_WIDTH, Math.min(SIDEBAR_MAX_WIDTH, containerWidth - MAIN_MIN_WIDTH))
      : SIDEBAR_MAX_WIDTH;

  return (
    <motion.aside
      inert={!sidebarOpen}
      animate={{ width: sidebarOpen ? sidebarWidth : 0, opacity: sidebarOpen ? 1 : 0 }}
      transition={{
        width: sidebarDragging || reduce ? { duration: 0 } : SPRING_PANEL,
        opacity: reduce ? { duration: 0.15, ease: EASE_OUT } : SPRING_PANEL,
      }}
      className={cn(
        // overflow stays visible so the resize handle can straddle the edge
        // (z-10 keeps that overhang hit-testable above the main column);
        // clipping happens one div down.
        "relative isolate z-10 shrink-0 overflow-visible bg-[var(--wb-surface-translucent)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        {/* Content is laid out at the pane's resting width so open/close only
            clips it instead of re-wrapping every line mid-animation. */}
        <div
          className="h-full overflow-y-auto pt-[46px] [mask-image:linear-gradient(to_bottom,transparent_0,black_16px,black_calc(100%-24px),transparent_100%)]"
          style={{ width: sidebarWidth }}
        >
          {children}
        </div>
      </div>
      {sidebarOpen ? (
        <ResizeHandle
          edge="right"
          value={sidebarWidth}
          min={SIDEBAR_MIN_WIDTH}
          max={ariaMax}
          onResize={resizeSidebar}
          onReset={resetSidebarWidth}
          onDraggingChange={setSidebarDragging}
          aria-label="Resize sidebar"
        />
      ) : null}
    </motion.aside>
  );
}

export interface WorkbenchMainProps {
  className?: string;
  children?: ReactNode;
}

/** Opaque, flexible main column — takes up whatever width the sidebar/panel leave behind. */
export function WorkbenchMain({ className, children }: WorkbenchMainProps) {
  return (
    <main
      className={cn(
        "relative flex min-h-0 min-w-0 flex-1 flex-col bg-[var(--wb-surface)]",
        className,
      )}
    >
      <div className="flex min-h-0 flex-1 flex-col pt-[46px]">{children}</div>
    </main>
  );
}

export interface WorkbenchPanelProps {
  className?: string;
  children?: ReactNode;
}

/** Opaque, resizable right pane, squeezed in-flow (not floated). Drag its
 * left-edge handle past the minimum to collapse it; double-click to reset. */
export function WorkbenchPanel({ className, children }: WorkbenchPanelProps) {
  const {
    panelOpen,
    panelWidth,
    panelDragging,
    sidebarOpen,
    sidebarWidth,
    containerWidth,
    resizePanel,
    resetPanelWidth,
    setPanelDragging,
  } = useWorkbenchInternal("WorkbenchPanel");
  const reduce = useReducedMotion() ?? false;
  const reserved = sidebarOpen ? sidebarWidth : 0;
  const ariaMax =
    containerWidth > 0
      ? Math.max(PANEL_MIN_WIDTH, containerWidth - reserved - MAIN_MIN_WIDTH)
      : PANEL_MAX_FALLBACK;

  return (
    <motion.aside
      inert={!panelOpen}
      animate={{ width: panelOpen ? panelWidth : 0, opacity: panelOpen ? 1 : 0 }}
      transition={{
        width: panelDragging || reduce ? { duration: 0 } : SPRING_PANEL,
        opacity: reduce ? { duration: 0.15, ease: EASE_OUT } : SPRING_PANEL,
      }}
      className={cn(
        "relative isolate z-10 shrink-0 overflow-visible border-[var(--wb-border-subtle)] border-l bg-[var(--wb-surface)]",
        className,
      )}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="h-full overflow-y-auto pt-[46px]" style={{ width: panelWidth }}>
          {children}
        </div>
      </div>
      {panelOpen ? (
        <ResizeHandle
          edge="left"
          value={panelWidth}
          min={PANEL_MIN_WIDTH}
          max={ariaMax}
          onResize={resizePanel}
          onReset={resetPanelWidth}
          onDraggingChange={setPanelDragging}
          aria-label="Resize panel"
        />
      ) : null}
    </motion.aside>
  );
}

export interface WorkbenchHeaderProps {
  /** Rendered above the sidebar; its wrapper width tracks `sidebarWidth` while open. */
  leading?: ReactNode;
  trailing?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/** Full-width, 46px overlay toolbar. Absolutely positioned so it sits above
 * the sidebar/main/panel row regardless of where it's placed in the DOM. */
export function WorkbenchHeader({ leading, trailing, children, className }: WorkbenchHeaderProps) {
  const { sidebarOpen, sidebarWidth, sidebarDragging } = useWorkbenchInternal("WorkbenchHeader");
  const reduce = useReducedMotion() ?? false;

  return (
    <header
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-30 flex h-[46px] items-center",
        className,
      )}
    >
      <div
        className="pointer-events-auto flex h-full shrink-0 items-center overflow-hidden"
        style={{
          width: sidebarOpen ? sidebarWidth : "auto",
          transitionProperty: "width",
          transitionDuration: sidebarDragging || reduce ? "0ms" : "300ms",
          transitionTimingFunction: EASE_OUT_CSS,
        }}
      >
        {leading}
      </div>
      <div className="pointer-events-auto min-w-0 flex-1">{children}</div>
      <div className="pointer-events-auto flex shrink-0 items-center">{trailing}</div>
    </header>
  );
}

export { WorkbenchSummaryCard, WorkbenchSummarySection } from "./summary-card";
