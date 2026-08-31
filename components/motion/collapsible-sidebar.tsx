"use client";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import {
  type ReactNode,
  useCallback,
  useId,
  useState,
} from "react";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  SidebarToggleIcon,
} from "@/components/motion/startup-visuals-icons";
import { EASE_OUT, SPRING_LAYOUT, SPRING_PRESS } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { cn } from "@/lib/utils";

export type CollapsibleSidebarItem = {
  id: string;
  label: string;
  icon?: ReactNode;
  badge?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  children?: CollapsibleSidebarItem[];
};

export type CollapsibleSidebarGroup = {
  id: string;
  label: string;
  defaultOpen?: boolean;
  items: CollapsibleSidebarItem[];
};

export interface CollapsibleSidebarProps {
  workspaceName: string;
  workspaceIcon?: ReactNode;
  searchPlaceholder?: string;
  onSearch?: () => void;
  items?: CollapsibleSidebarItem[];
  groups?: CollapsibleSidebarGroup[];
  footer?: ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  className?: string;
}

const EXPANDED_WIDTH = 256;
const RAIL_WIDTH = 64;

export function CollapsibleSidebar({
  workspaceName,
  workspaceIcon,
  searchPlaceholder = "Command",
  onSearch,
  items = [],
  groups = [],
  footer,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  onCollapsedChange,
  activeId: activeIdProp,
  defaultActiveId,
  onActiveChange,
  className,
}: CollapsibleSidebarProps) {
  const reduce = useReducedMotion();
  const canHover = useHoverCapable();
  const layoutId = useId();
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  const [internalActive, setInternalActive] = useState(
    defaultActiveId ?? items[0]?.id ?? groups[0]?.items[0]?.id ?? "",
  );
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((group) => [group.id, group.defaultOpen ?? true])),
  );
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({});

  const collapsed = collapsedProp ?? internalCollapsed;
  const activeId = activeIdProp ?? internalActive;
  const width = collapsed ? RAIL_WIDTH : EXPANDED_WIDTH;

  const setCollapsed = useCallback(
    (next: boolean) => {
      if (collapsedProp === undefined) setInternalCollapsed(next);
      onCollapsedChange?.(next);
    },
    [collapsedProp, onCollapsedChange],
  );

  const setActive = useCallback(
    (id: string) => {
      if (activeIdProp === undefined) setInternalActive(id);
      onActiveChange?.(id);
    },
    [activeIdProp, onActiveChange],
  );

  const toggleGroup = (id: string) => {
    setOpenGroups((current) => ({ ...current, [id]: !current[id] }));
  };

  const toggleFolder = (id: string) => {
    setOpenFolders((current) => ({ ...current, [id]: !current[id] }));
  };

  return (
    <LayoutGroup id={layoutId}>
      <motion.aside
        aria-label={workspaceName}
        initial={false}
        animate={{ width }}
        transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
        className={cn(
          "relative flex h-full shrink-0 flex-col overflow-hidden border-r border-border bg-card text-card-foreground",
          className,
        )}
      >
        <div className={cn("flex items-center gap-2 px-2 pt-3", collapsed ? "justify-center" : "px-3")}>
          <div
            className={cn(
              "flex min-w-0 flex-1 items-center gap-2",
              collapsed && "justify-center",
            )}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-xs font-semibold text-background">
              {workspaceIcon ?? workspaceName.slice(0, 1)}
            </span>
            <SidebarLabel collapsed={collapsed} reduce={!!reduce} className="truncate text-sm font-semibold">
              {workspaceName}
            </SidebarLabel>
          </div>
          <motion.button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
            onClick={() => setCollapsed(!collapsed)}
            whileTap={reduce || !canHover ? undefined : { scale: 0.94 }}
            transition={SPRING_PRESS}
            className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            <SidebarToggleIcon className="size-4" />
          </motion.button>
        </div>

        <div className="px-2 pt-3">
          {collapsed ? (
            <motion.button
              type="button"
              aria-label={searchPlaceholder}
              onClick={onSearch}
              whileTap={reduce || !canHover ? undefined : { scale: 0.94 }}
              transition={SPRING_PRESS}
              className="mx-auto flex size-8 items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/20"
            >
              <span className="text-sm font-medium">⌘</span>
            </motion.button>
          ) : (
            <button
              type="button"
              onClick={onSearch}
              className="flex h-8 w-full items-center gap-2 rounded-lg border border-border bg-background px-2.5 text-left text-xs text-muted-foreground outline-none hover:border-foreground/20 focus-visible:ring-2 focus-visible:ring-foreground/20"
            >
              <span className="shrink-0 text-[13px] font-medium">⌘</span>
              <span className="truncate">{searchPlaceholder}</span>
              <span className="ml-auto text-muted-foreground/80">/</span>
            </button>
          )}
        </div>

        <nav className="mt-3 flex-1 overflow-y-auto px-2 pb-3">
          <ul className="flex flex-col gap-0.5">
            {items.map((item) => (
              <SidebarRow
                key={item.id}
                item={item}
                depth={0}
                collapsed={collapsed}
                reduce={!!reduce}
                canHover={canHover}
                activeId={activeId}
                openFolders={openFolders}
                onSelect={setActive}
                onToggleFolder={toggleFolder}
              />
            ))}
          </ul>

          {groups.map((group) => {
            const open = openGroups[group.id] ?? true;
            return (
              <div key={group.id} className="mt-4">
                {collapsed ? (
                  <div className="mx-auto mb-1 h-px w-6 bg-border" />
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className="mb-1 flex w-full items-center gap-1 px-2 text-[11px] font-medium tracking-wide text-muted-foreground uppercase outline-none hover:text-foreground"
                  >
                    <span className="flex-1 truncate text-left">{group.label}</span>
                    <ChevronDownIcon
                      className={cn("size-3 transition-transform", !open && "-rotate-90")}
                    />
                  </button>
                )}
                <AnimatePresence initial={false}>
                  {(collapsed || open) && (
                    <motion.ul
                      initial={reduce ? { opacity: 0 } : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: reduce ? 0.12 : 0.18, ease: EASE_OUT }}
                      className="flex flex-col gap-0.5"
                    >
                      {group.items.map((item) => (
                        <SidebarRow
                          key={item.id}
                          item={item}
                          depth={0}
                          collapsed={collapsed}
                          reduce={!!reduce}
                          canHover={canHover}
                          activeId={activeId}
                          openFolders={openFolders}
                          onSelect={setActive}
                          onToggleFolder={toggleFolder}
                        />
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        {footer ? (
          <div className={cn("border-t border-border p-2", collapsed && "px-1.5")}>
            {footer}
          </div>
        ) : null}
      </motion.aside>
    </LayoutGroup>
  );
}

function SidebarLabel({
  collapsed,
  reduce,
  className,
  children,
}: {
  collapsed: boolean;
  reduce: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.span
      aria-hidden={collapsed}
      initial={false}
      animate={{
        opacity: collapsed ? 0 : 1,
        x: reduce ? 0 : collapsed ? -8 : 0,
      }}
      transition={{ duration: reduce ? 0.12 : 0.18, ease: EASE_OUT }}
      className={cn(
        "min-w-0",
        collapsed && "pointer-events-none w-0 overflow-hidden",
        className,
      )}
    >
      {children}
    </motion.span>
  );
}

function SidebarRow({
  item,
  depth,
  collapsed,
  reduce,
  canHover,
  activeId,
  openFolders,
  onSelect,
  onToggleFolder,
}: {
  item: CollapsibleSidebarItem;
  depth: number;
  collapsed: boolean;
  reduce: boolean;
  canHover: boolean;
  activeId: string;
  openFolders: Record<string, boolean>;
  onSelect: (id: string) => void;
  onToggleFolder: (id: string) => void;
}) {
  const hasChildren = Boolean(item.children?.length);
  const folderOpen = openFolders[item.id] ?? false;
  const active = activeId === item.id;

  return (
    <li>
      <div
        className={cn(
          "group relative flex items-center",
          collapsed && "justify-center",
        )}
      >
        {active ? (
          <motion.span
            layoutId={reduce ? undefined : "sidebar-active"}
            className="absolute inset-0 rounded-lg bg-muted"
            transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
          />
        ) : null}
        <motion.button
          type="button"
          onClick={() => onSelect(item.id)}
          whileHover={
            canHover && !reduce && !active ? { x: collapsed ? 0 : 2 } : undefined
          }
          transition={SPRING_PRESS}
          className={cn(
            "relative z-10 flex min-h-8 min-w-0 flex-1 items-center gap-2 rounded-lg px-2 text-left text-sm outline-none focus-visible:ring-2 focus-visible:ring-foreground/20",
            collapsed && "size-8 flex-none justify-center px-0",
            active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
          )}
          style={collapsed ? undefined : { paddingLeft: 8 + depth * 12 }}
          aria-current={active ? "page" : undefined}
        >
          <span className="flex size-4 shrink-0 items-center justify-center [&>svg]:size-4">
            {item.icon}
          </span>
          <SidebarLabel collapsed={collapsed} reduce={reduce} className="flex-1 truncate">
            {item.label}
          </SidebarLabel>
          {!collapsed && item.badge ? (
            <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
              {item.badge}
            </span>
          ) : null}
        </motion.button>
        {!collapsed && item.onAction ? (
          <button
            type="button"
            aria-label={item.actionLabel ?? `Add to ${item.label}`}
            onClick={item.onAction}
            className="relative z-10 mr-1 hidden size-6 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-background hover:text-foreground focus-visible:flex focus-visible:ring-2 focus-visible:ring-foreground/20 group-hover:flex"
          >
            +
          </button>
        ) : null}
        {!collapsed && hasChildren ? (
          <button
            type="button"
            aria-label={folderOpen ? `Collapse ${item.label}` : `Expand ${item.label}`}
            aria-expanded={folderOpen}
            onClick={() => onToggleFolder(item.id)}
            className="relative z-10 mr-1 inline-flex size-6 items-center justify-center rounded-md text-muted-foreground outline-none hover:bg-background hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground/20"
          >
            <ChevronRightIcon
              className={cn("size-3.5 transition-transform", folderOpen && "rotate-90")}
            />
          </button>
        ) : null}
      </div>
      <AnimatePresence initial={false}>
        {!collapsed && hasChildren && folderOpen ? (
          <motion.ul
            initial={reduce ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0.1 : 0.16, ease: EASE_OUT }}
            className="flex flex-col gap-0.5"
          >
            {item.children?.map((child) => (
              <SidebarRow
                key={child.id}
                item={child}
                depth={depth + 1}
                collapsed={collapsed}
                reduce={reduce}
                canHover={canHover}
                activeId={activeId}
                openFolders={openFolders}
                onSelect={onSelect}
                onToggleFolder={onToggleFolder}
              />
            ))}
          </motion.ul>
        ) : null}
      </AnimatePresence>
    </li>
  );
}
