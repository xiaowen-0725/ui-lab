"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import {
  CalendarViewIcon,
  ChevronDownIcon,
  DashboardViewIcon,
  FullPageIcon,
  GanttViewIcon,
  KanbanViewIcon,
  ListViewIcon,
  MinimizeIcon,
  PopUpIcon,
  SelectedCheckIcon,
  SideDrawerIcon,
} from "@/components/motion/startup-visuals-icons";
import { EASE_OUT, SPRING_LAYOUT, SPRING_PANEL, SPRING_PRESS } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export type ViewLayoutOption = {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
};

export interface ViewLayoutSwitchProps {
  layouts?: ViewLayoutOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  variant?: "tabs" | "menu";
  className?: string;
}

export const DEFAULT_VIEW_LAYOUTS: ViewLayoutOption[] = [
  { id: "list", label: "List", description: "Compact rows", icon: <ListViewIcon /> },
  { id: "kanban", label: "Kanban", description: "Board columns", icon: <KanbanViewIcon /> },
  { id: "gantt", label: "Gantt", description: "Timeline bars", icon: <GanttViewIcon /> },
  { id: "calendar", label: "Calendar", description: "Month grid", icon: <CalendarViewIcon /> },
  { id: "dashboard", label: "Dashboard", description: "Widget mosaic", icon: <DashboardViewIcon /> },
];

export const DEFAULT_SURFACE_LAYOUTS: ViewLayoutOption[] = [
  { id: "side-drawer", label: "Side Drawer", description: "Docked inspector", icon: <SideDrawerIcon /> },
  { id: "full-page", label: "Full Page", description: "Fill the workspace", icon: <FullPageIcon /> },
  { id: "pop-up", label: "Pop Up", description: "Centered overlay", icon: <PopUpIcon /> },
  { id: "minimize", label: "Minimize", description: "Collapse the surface", icon: <MinimizeIcon /> },
];

export function ViewLayoutSwitch({
  layouts = DEFAULT_VIEW_LAYOUTS,
  value: valueProp,
  defaultValue,
  onValueChange,
  variant = "tabs",
  className,
}: ViewLayoutSwitchProps) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const layoutId = useId();
  const [internalValue, setInternalValue] = useState(defaultValue ?? layouts[0]?.id ?? "");
  const value = valueProp ?? internalValue;

  const setValue = useCallback(
    (id: string) => {
      if (valueProp === undefined) setInternalValue(id);
      onValueChange?.(id);
    },
    [onValueChange, valueProp],
  );

  if (variant === "menu") {
    return (
      <LayoutMenu
        layouts={layouts}
        value={value}
        onValueChange={setValue}
        reduce={!!reduce}
        canHover={canHover}
        className={className}
      />
    );
  }

  return (
    <LayoutGroup id={layoutId}>
      <div
        role="tablist"
        aria-label="Switch layout"
        className={cn(
          "inline-flex items-center gap-0.5 rounded-xl border border-border bg-muted/60 p-1",
          className,
        )}
      >
        {layouts.map((layout) => {
          const active = layout.id === value;
          return (
            <button
              key={layout.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setValue(layout.id)}
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {active ? (
                <motion.span
                  layoutId={reduce ? undefined : "view-layout-pill"}
                  className="absolute inset-0 rounded-lg bg-card shadow-sm"
                  transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                />
              ) : null}
              <span className="relative z-10 inline-flex items-center gap-1.5">
                {layout.icon}
                {layout.label}
              </span>
            </button>
          );
        })}
      </div>
    </LayoutGroup>
  );
}

function LayoutMenu({
  layouts,
  value,
  onValueChange,
  reduce,
  canHover,
  className,
}: {
  layouts: ViewLayoutOption[];
  value: string;
  onValueChange: (id: string) => void;
  reduce: boolean;
  canHover: boolean;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const current = layouts.find((layout) => layout.id === value) ?? layouts[0];

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <motion.button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((currentOpen) => !currentOpen)}
        whileTap={reduce || !canHover ? undefined : { scale: 0.97 }}
        transition={SPRING_PRESS}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
      >
        <span className="inline-flex items-center gap-2">
          {current?.icon}
          {current?.label ?? "Layout"}
        </span>
        <ChevronDownIcon className={cn("size-3.5 text-muted-foreground transition-transform", open && "rotate-180")} />
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            role="listbox"
            aria-label="Switch layout"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={
              reduce
                ? { opacity: 0, transition: { duration: 0.12, ease: EASE_OUT } }
                : { opacity: 0, y: 4, scale: 0.98, transition: { duration: 0.14, ease: EASE_OUT } }
            }
            transition={SPRING_PANEL}
            className="absolute top-[calc(100%+8px)] right-0 z-20 min-w-56 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-xl"
          >
            <p className="px-2.5 py-1.5 text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
              Switch layout
            </p>
            <LayoutGroup>
              {layouts.map((layout) => {
                const selected = layout.id === value;
                return (
                  <button
                    key={layout.id}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onValueChange(layout.id);
                      setOpen(false);
                    }}
                    className="relative flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left outline-none focus-visible:ring-2 focus-visible:ring-foreground/20"
                  >
                    {selected ? (
                      <motion.span
                        layoutId={reduce ? undefined : "view-layout-menu-active"}
                        className="absolute inset-0 rounded-lg bg-muted"
                        transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
                      />
                    ) : null}
                    <span className="relative z-10 text-muted-foreground">{layout.icon}</span>
                    <span className="relative z-10 min-w-0 flex-1">
                      <span className="block text-sm font-medium text-foreground">{layout.label}</span>
                      {layout.description ? (
                        <span className="block text-xs text-muted-foreground">{layout.description}</span>
                      ) : null}
                    </span>
                    {selected ? <SelectedCheckIcon className="relative z-10 size-4" /> : null}
                  </button>
                );
              })}
            </LayoutGroup>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
