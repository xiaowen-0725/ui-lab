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
  trigger?: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
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
  trigger,
  defaultOpen = false,
  open,
  onOpenChange,
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
        trigger={trigger}
        defaultOpen={defaultOpen}
        open={open}
        onOpenChange={onOpenChange}
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
          "inline-flex items-center gap-0.5 rounded-full border border-[#ececee] bg-[#f4f4f6] p-1",
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
                "relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-[#111113]/15",
                active ? "text-[#111113]" : "text-[#8a8a93] hover:text-[#111113]",
              )}
            >
              {active ? (
                <motion.span
                  layoutId={reduce ? undefined : "view-layout-pill"}
                  className="absolute inset-0 rounded-full bg-white shadow-sm"
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
  trigger,
  defaultOpen,
  open: openProp,
  onOpenChange,
  reduce,
  canHover,
  className,
}: {
  layouts: ViewLayoutOption[];
  value: string;
  onValueChange: (id: string) => void;
  trigger?: ReactNode;
  defaultOpen: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  reduce: boolean;
  canHover: boolean;
  className?: string;
}) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = openProp ?? internalOpen;
  const rootRef = useRef<HTMLDivElement>(null);
  const current = layouts.find((layout) => layout.id === value) ?? layouts[0];

  const setOpen = useCallback(
    (next: boolean) => {
      if (openProp === undefined) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [onOpenChange, openProp],
  );

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
  }, [open, setOpen]);

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <motion.button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={current?.label ?? "Switch layout"}
        onClick={() => setOpen(!open)}
        whileTap={reduce || !canHover ? undefined : { scale: 0.97 }}
        transition={SPRING_PRESS}
        className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-[13px] font-medium text-[#111113] outline-none hover:bg-[#f4f4f6] focus-visible:ring-2 focus-visible:ring-[#111113]/15"
      >
        {trigger ?? (
          <>
            <span className="inline-flex items-center gap-2">
              {current?.icon}
              {current?.label ?? "Layout"}
            </span>
            <ChevronDownIcon
              className={cn("size-3.5 text-[#8a8a93] transition-transform", open && "rotate-180")}
            />
          </>
        )}
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
            className="absolute top-[calc(100%+8px)] right-0 z-20 min-w-[220px] overflow-hidden rounded-[16px] border border-[#ececee] bg-white p-1.5 shadow-[0_16px_40px_rgba(17,17,19,0.12)]"
          >
            <p className="px-2.5 py-1.5 text-[10px] font-medium tracking-[0.14em] text-[#9a9aa3] uppercase">
              Switch layout:
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
                    className="relative flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left outline-none hover:bg-[#f7f7f8] focus-visible:ring-2 focus-visible:ring-[#111113]/15"
                  >
                    <span className="relative z-10 text-[#6f6f78]">{layout.icon}</span>
                    <span className="relative z-10 min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-[#111113]">{layout.label}</span>
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
