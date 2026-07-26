"use client";

import { Check, ChevronRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  createContext,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EASE_OUT, SPRING_LAYOUT, SPRING_PANEL } from "@/lib/ease";
import { cn } from "@/lib/utils";

// Submenus close on a short grace delay so the pointer can cut the corner
// between the trigger row and the panel without the panel vanishing.
const SUB_CLOSE_GRACE_MS = 150;
// Space (px) required below the trigger before the panel flips upward.
const FLIP_MARGIN = 16;

type Placement = "bottom" | "top";
type Align = "start" | "center" | "end";

interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  /** Close the whole menu; optionally hand focus back to the trigger. */
  close: (focusTrigger?: boolean) => void;
  reduce: boolean;
  triggerId: string;
  menuId: string;
}

const MenuContext = createContext<MenuContextValue | null>(null);

function useMenuContext(component: string) {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error(`${component} must be used within <DropdownMenu>`);
  return ctx;
}

// Each panel (root content and every submenu) owns one gliding focus surface.
// Hover and keyboard focus write the same `activeKey`, so there is a single
// highlight that slides between rows instead of per-row backgrounds.
interface PanelContextValue {
  surfaceId: string;
  activeKey: string | null;
  setActiveKey: (key: string | null) => void;
}

const PanelContext = createContext<PanelContextValue | null>(null);

function usePanelContext(component: string) {
  const ctx = useContext(PanelContext);
  if (!ctx)
    throw new Error(`${component} must be used within a dropdown panel`);
  return ctx;
}

/** Enabled menu items belonging to this panel only (submenu items excluded). */
function panelItems(panel: HTMLElement) {
  return Array.from(
    panel.querySelectorAll<HTMLButtonElement>("[data-menu-item]"),
  ).filter(
    (el) => el.closest("[data-menu-panel]") === panel && !el.disabled,
  );
}

// Shared roving-focus keyboard handling for the root panel and submenus.
// Real focus moves between item buttons; Enter/Space stay native button
// activation, so only navigation keys are handled here.
function handlePanelKeys(event: ReactKeyboardEvent<HTMLDivElement>) {
  const { key } = event;
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(key)) return;
  const panel = event.currentTarget;
  const items = panelItems(panel);
  if (items.length === 0) return;
  event.preventDefault();
  event.stopPropagation();
  const current = items.indexOf(document.activeElement as HTMLButtonElement);
  let next = 0;
  if (key === "Home") next = 0;
  else if (key === "End") next = items.length - 1;
  else if (key === "ArrowDown")
    next = current < 0 ? 0 : (current + 1) % items.length;
  else next = current < 0 ? items.length - 1 : (current - 1 + items.length) % items.length;
  items[next]?.focus();
}

export interface DropdownMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children: ReactNode;
}

export function DropdownMenu({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
}: DropdownMenuProps) {
  const reduce = useReducedMotion() ?? false;
  const baseId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);

  const controlled = openProp !== undefined;
  const open = controlled ? openProp : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  const triggerId = `${baseId}-trigger`;

  const close = useCallback(
    (focusTrigger = false) => {
      setOpen(false);
      if (focusTrigger) document.getElementById(triggerId)?.focus();
    },
    [setOpen, triggerId],
  );

  // Outside pointer closes; Escape closes and restores trigger focus.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node))
        close();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open, close]);

  const ctx = useMemo<MenuContextValue>(
    () => ({
      open,
      setOpen,
      close,
      reduce,
      triggerId,
      menuId: `${baseId}-menu`,
    }),
    [open, setOpen, close, reduce, triggerId, baseId],
  );

  return (
    <MenuContext.Provider value={ctx}>
      {/* h-fit defends against flex parents with default align-items: stretch —
          a stretched root would anchor the top-full panel far below the trigger. */}
      <div
        ref={rootRef}
        className={cn("relative inline-block h-fit", className)}
      >
        {children}
      </div>
    </MenuContext.Provider>
  );
}

export interface DropdownMenuTriggerProps {
  className?: string;
  children: ReactNode;
}

export function DropdownMenuTrigger({
  className,
  children,
}: DropdownMenuTriggerProps) {
  const ctx = useMenuContext("DropdownMenuTrigger");
  return (
    <button
      type="button"
      id={ctx.triggerId}
      aria-haspopup="menu"
      aria-expanded={ctx.open}
      aria-controls={ctx.menuId}
      onClick={() => ctx.setOpen(!ctx.open)}
      className={cn(
        "flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors",
        "hover:border-(--color-border-strong) focus-visible:ring-2 focus-visible:ring-foreground/20",
        className,
      )}
    >
      {children}
    </button>
  );
}

export interface DropdownMenuContentProps {
  align?: Align;
  className?: string;
  children: ReactNode;
}

export function DropdownMenuContent({
  align = "start",
  className,
  children,
}: DropdownMenuContentProps) {
  const ctx = useMenuContext("DropdownMenuContent");
  const panelRef = useRef<HTMLDivElement>(null);
  const surfaceId = useId();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [placement, setPlacement] = useState<Placement>("bottom");
  const open = ctx.open;

  // On open, flip upward when there isn't room below and there's more above
  // (same viewport check as Select).
  useLayoutEffect(() => {
    if (!open) return;
    const trigger = document.getElementById(ctx.triggerId);
    const panel = panelRef.current;
    if (!trigger || !panel) return;
    const rect = trigger.getBoundingClientRect();
    const h = panel.offsetHeight;
    const below = window.innerHeight - rect.bottom;
    setPlacement(below < h + FLIP_MARGIN && rect.top > below ? "top" : "bottom");
  }, [open, ctx.triggerId]);

  // Focus the panel on open so navigation keys work immediately; clear the
  // gliding surface whenever the menu closes. Skip the focus grab when nothing
  // on the page holds focus yet (e.g. a `defaultOpen` menu on first paint) so
  // an open-by-default demo never steals focus on load.
  useEffect(() => {
    if (open) {
      const raf = requestAnimationFrame(() => {
        if (document.activeElement === document.body) return;
        panelRef.current?.focus();
      });
      return () => cancelAnimationFrame(raf);
    }
    setActiveKey(null);
  }, [open]);

  const panelCtx = useMemo<PanelContextValue>(
    () => ({ surfaceId, activeKey, setActiveKey }),
    [surfaceId, activeKey],
  );

  const isTop = placement === "top";
  const originY = isTop ? "bottom" : "top";
  const originX =
    align === "center" ? "center" : align === "end" ? "right" : "left";

  return (
    <PanelContext.Provider value={panelCtx}>
      <motion.div
        ref={panelRef}
        id={ctx.menuId}
        role="menu"
        aria-labelledby={ctx.triggerId}
        tabIndex={-1}
        inert={!open}
        data-menu-panel
        onKeyDown={handlePanelKeys}
        onMouseLeave={() => {
          // Keep the highlight when focus is inside (keyboard user just
          // happens to move the pointer away).
          const panel = panelRef.current;
          if (panel?.contains(document.activeElement)) return;
          setActiveKey(null);
        }}
        initial={false}
        animate={{
          opacity: open ? 1 : 0,
          scale: ctx.reduce ? 1 : open ? 1 : 0.94,
          y: ctx.reduce ? 0 : open ? 0 : isTop ? 4 : -4,
          x: align === "center" ? "-50%" : 0,
        }}
        transition={
          open
            ? ctx.reduce
              ? { duration: 0.15, ease: EASE_OUT }
              : SPRING_PANEL
            : { duration: 0.12, ease: EASE_OUT }
        }
        style={{
          transformOrigin: `${originY} ${originX}`,
          pointerEvents: open ? "auto" : "none",
        }}
        className={cn(
          "absolute z-50 min-w-56 rounded-xl border border-border bg-background p-1 shadow-lg outline-none",
          isTop ? "bottom-full mb-1.5" : "top-full mt-1.5",
          align === "start" && "left-0",
          align === "center" && "left-1/2",
          align === "end" && "right-0",
          className,
        )}
      >
        {children}
      </motion.div>
    </PanelContext.Provider>
  );
}

export interface DropdownMenuLabelProps {
  className?: string;
  children: ReactNode;
}

export function DropdownMenuLabel({
  className,
  children,
}: DropdownMenuLabelProps) {
  return (
    <div
      className={cn(
        "px-2.5 pt-1.5 pb-1 text-xs font-medium text-muted-foreground/80",
        className,
      )}
    >
      {children}
    </div>
  );
}

export interface DropdownMenuSeparatorProps {
  className?: string;
}

export function DropdownMenuSeparator({
  className,
}: DropdownMenuSeparatorProps) {
  return (
    <hr className={cn("-mx-1 my-1 h-px border-0 bg-border", className)} />
  );
}

// Row shell shared by items, checkbox items and submenu triggers: a relative
// wrapper hosting the gliding focus surface behind the real button.
interface ItemShellProps {
  active: boolean;
  children: ReactNode;
}

function ItemShell({ active, children }: ItemShellProps) {
  const panel = usePanelContext("DropdownMenu item");
  const reduce = useReducedMotion() ?? false;
  return (
    <div className="relative">
      <AnimatePresence>
        {active ? (
          <motion.div
            layoutId={panel.surfaceId}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.15 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
            className="pointer-events-none absolute inset-0 rounded-lg bg-muted"
          />
        ) : null}
      </AnimatePresence>
      {children}
    </div>
  );
}

// Hover and focus funnel into the panel's single activeKey.
function useItemActivation(itemKey: string) {
  const panel = usePanelContext("DropdownMenu item");
  return {
    active: panel.activeKey === itemKey,
    handlers: {
      onMouseEnter: () => panel.setActiveKey(itemKey),
      onFocus: () => panel.setActiveKey(itemKey),
    },
  };
}

const ITEM_BUTTON_CLASSES =
  "relative z-10 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm outline-none transition-colors disabled:pointer-events-none disabled:opacity-50";

export interface DropdownMenuItemProps {
  icon?: ReactNode;
  description?: string;
  shortcut?: string;
  disabled?: boolean;
  destructive?: boolean;
  onSelect?: () => void;
  className?: string;
  children: ReactNode;
}

export function DropdownMenuItem({
  icon,
  description,
  shortcut,
  disabled = false,
  destructive = false,
  onSelect,
  className,
  children,
}: DropdownMenuItemProps) {
  const menu = useMenuContext("DropdownMenuItem");
  const itemKey = useId();
  const { active, handlers } = useItemActivation(itemKey);
  return (
    <ItemShell active={active}>
      <button
        type="button"
        role="menuitem"
        data-menu-item
        disabled={disabled}
        {...handlers}
        onClick={() => {
          onSelect?.();
          menu.close(true);
        }}
        className={cn(
          ITEM_BUTTON_CLASSES,
          destructive
            ? "text-destructive"
            : active
              ? "text-foreground"
              : "text-muted-foreground",
          className,
        )}
      >
        {icon ? (
          <span
            aria-hidden="true"
            className={cn(
              "shrink-0 [&>svg]:h-4 [&>svg]:w-4",
              destructive ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {icon}
          </span>
        ) : null}
        <span className="min-w-0 flex-1">
          <span className="block truncate">{children}</span>
          {description ? (
            <span className="block truncate text-xs text-muted-foreground">
              {description}
            </span>
          ) : null}
        </span>
        {shortcut ? (
          <kbd className="shrink-0 font-mono text-[11px] text-muted-foreground/70">
            {shortcut}
          </kbd>
        ) : null}
      </button>
    </ItemShell>
  );
}

export interface DropdownMenuCheckboxItemProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export function DropdownMenuCheckboxItem({
  checked,
  onCheckedChange,
  disabled = false,
  className,
  children,
}: DropdownMenuCheckboxItemProps) {
  const reduce = useReducedMotion() ?? false;
  const itemKey = useId();
  const { active, handlers } = useItemActivation(itemKey);
  return (
    <ItemShell active={active}>
      <button
        type="button"
        role="menuitemcheckbox"
        aria-checked={checked}
        data-menu-item
        disabled={disabled}
        {...handlers}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          ITEM_BUTTON_CLASSES,
          active ? "text-foreground" : "text-muted-foreground",
          className,
        )}
      >
        <span
          aria-hidden="true"
          className="flex h-4 w-4 shrink-0 items-center justify-center"
        >
          <AnimatePresence initial={false}>
            {checked ? (
              <motion.span
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={
                  reduce
                    ? { opacity: 0, transition: { duration: 0.1 } }
                    : {
                        opacity: 0,
                        scale: 0.5,
                        transition: { duration: 0.1, ease: EASE_OUT },
                      }
                }
                transition={{ duration: 0.15, ease: EASE_OUT }}
              >
                <Check className="h-3.5 w-3.5" />
              </motion.span>
            ) : null}
          </AnimatePresence>
        </span>
        <span className="min-w-0 flex-1 truncate">{children}</span>
      </button>
    </ItemShell>
  );
}

interface SubContextValue {
  open: boolean;
  openSub: () => void;
  scheduleClose: () => void;
  closeNow: (focusTrigger?: boolean) => void;
  subTriggerId: string;
  subMenuId: string;
}

const SubContext = createContext<SubContextValue | null>(null);

function useSubContext(component: string) {
  const ctx = useContext(SubContext);
  if (!ctx)
    throw new Error(`${component} must be used within <DropdownMenuSub>`);
  return ctx;
}

export interface DropdownMenuSubProps {
  className?: string;
  children: ReactNode;
}

export function DropdownMenuSub({ className, children }: DropdownMenuSubProps) {
  const menu = useMenuContext("DropdownMenuSub");
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const openSub = useCallback(() => {
    clearTimer();
    setOpen(true);
  }, [clearTimer]);

  const subTriggerId = `${baseId}-subtrigger`;

  const closeNow = useCallback(
    (focusTrigger = false) => {
      clearTimer();
      setOpen(false);
      if (focusTrigger) document.getElementById(subTriggerId)?.focus();
    },
    [clearTimer, subTriggerId],
  );

  const scheduleClose = useCallback(() => {
    clearTimer();
    closeTimer.current = setTimeout(() => setOpen(false), SUB_CLOSE_GRACE_MS);
  }, [clearTimer]);

  // Collapse with the root menu and never leak the grace timer.
  useEffect(() => {
    if (!menu.open) setOpen(false);
  }, [menu.open]);
  useEffect(() => clearTimer, [clearTimer]);

  const ctx = useMemo<SubContextValue>(
    () => ({
      open,
      openSub,
      scheduleClose,
      closeNow,
      subTriggerId,
      subMenuId: `${baseId}-submenu`,
    }),
    [open, openSub, scheduleClose, closeNow, subTriggerId, baseId],
  );

  return (
    <SubContext.Provider value={ctx}>
      {/* motion.div (not a static div) hosts the hover-intent handlers — same
          pattern as SharedLayoutBg's container. */}
      <motion.div
        onMouseEnter={openSub}
        onMouseLeave={scheduleClose}
        className={cn("relative", className)}
      >
        {children}
      </motion.div>
    </SubContext.Provider>
  );
}

export interface DropdownMenuSubTriggerProps {
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function DropdownMenuSubTrigger({
  icon,
  className,
  children,
}: DropdownMenuSubTriggerProps) {
  const sub = useSubContext("DropdownMenuSubTrigger");
  const itemKey = useId();
  const { active, handlers } = useItemActivation(itemKey);
  return (
    <ItemShell active={active}>
      <button
        type="button"
        role="menuitem"
        id={sub.subTriggerId}
        aria-haspopup="menu"
        aria-expanded={sub.open}
        aria-controls={sub.subMenuId}
        data-menu-item
        {...handlers}
        onClick={() => (sub.open ? sub.closeNow() : sub.openSub())}
        onKeyDown={(e) => {
          if (e.key !== "ArrowRight") return;
          e.preventDefault();
          e.stopPropagation();
          sub.openSub();
          // Focus lands on the submenu's first item once it has mounted.
          requestAnimationFrame(() => {
            const panel = document.getElementById(sub.subMenuId);
            if (panel) panelItems(panel)[0]?.focus();
          });
        }}
        className={cn(
          ITEM_BUTTON_CLASSES,
          active ? "text-foreground" : "text-muted-foreground",
          className,
        )}
      >
        {icon ? (
          <span
            aria-hidden="true"
            className="shrink-0 text-muted-foreground [&>svg]:h-4 [&>svg]:w-4"
          >
            {icon}
          </span>
        ) : null}
        <span className="min-w-0 flex-1 truncate">{children}</span>
        <ChevronRight
          aria-hidden="true"
          className="h-3.5 w-3.5 shrink-0 text-muted-foreground/70"
        />
      </button>
    </ItemShell>
  );
}

export interface DropdownMenuSubContentProps {
  className?: string;
  children: ReactNode;
}

export function DropdownMenuSubContent({
  className,
  children,
}: DropdownMenuSubContentProps) {
  const menu = useMenuContext("DropdownMenuSubContent");
  const sub = useSubContext("DropdownMenuSubContent");
  const panelRef = useRef<HTMLDivElement>(null);
  const surfaceId = useId();
  const [activeKey, setActiveKey] = useState<string | null>(null);
  // Which side of the parent panel the submenu opens toward; flips to the
  // left when the right edge would leave the viewport.
  const [side, setSide] = useState<"right" | "left">("right");

  useLayoutEffect(() => {
    if (!sub.open) return;
    const panel = panelRef.current;
    if (!panel) return;
    const rect = panel.getBoundingClientRect();
    if (side === "right" && rect.right > window.innerWidth - 8)
      setSide("left");
  }, [sub.open, side]);

  useEffect(() => {
    if (!sub.open) setActiveKey(null);
  }, [sub.open]);

  const panelCtx = useMemo<PanelContextValue>(
    () => ({ surfaceId, activeKey, setActiveKey }),
    [surfaceId, activeKey],
  );

  return (
    <PanelContext.Provider value={panelCtx}>
      <AnimatePresence>
        {sub.open ? (
          <motion.div
            ref={panelRef}
            id={sub.subMenuId}
            role="menu"
            aria-labelledby={sub.subTriggerId}
            tabIndex={-1}
            data-menu-panel
            onKeyDown={(e) => {
              if (e.key === "ArrowLeft") {
                e.preventDefault();
                e.stopPropagation();
                sub.closeNow(true);
                return;
              }
              handlePanelKeys(e);
            }}
            onMouseLeave={() => {
              const panel = panelRef.current;
              if (panel?.contains(document.activeElement)) return;
              setActiveKey(null);
            }}
            initial={
              menu.reduce
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.96, x: side === "right" ? -4 : 4 }
            }
            animate={
              menu.reduce
                ? { opacity: 1 }
                : { opacity: 1, scale: 1, x: 0 }
            }
            exit={{ opacity: 0, transition: { duration: 0.1, ease: EASE_OUT } }}
            transition={menu.reduce ? { duration: 0.15 } : SPRING_PANEL}
            style={{
              transformOrigin: side === "right" ? "top left" : "top right",
            }}
            className={cn(
              "absolute -top-1 z-50 min-w-44 rounded-xl border border-border bg-background p-1 shadow-lg outline-none",
              side === "right" ? "left-full ml-1" : "right-full mr-1",
              className,
            )}
          >
            {children}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </PanelContext.Provider>
  );
}
