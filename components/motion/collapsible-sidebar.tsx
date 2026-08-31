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
  MoreGlyph,
  PlusGlyph,
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
  defaultOpen?: boolean;
  children?: CollapsibleSidebarItem[];
};

export type CollapsibleSidebarGroup = {
  id: string;
  label: string;
  defaultOpen?: boolean;
  onMore?: () => void;
  onAdd?: () => void;
  items: CollapsibleSidebarItem[];
};

export interface CollapsibleSidebarProps {
  workspaceName: string;
  workspaceIcon?: ReactNode;
  searchPlaceholder?: string;
  onSearch?: () => void;
  items?: CollapsibleSidebarItem[];
  groups?: CollapsibleSidebarGroup[];
  rail?: ReactNode;
  footer?: ReactNode;
  collapsed?: boolean;
  defaultCollapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  activeId?: string;
  defaultActiveId?: string;
  onActiveChange?: (id: string) => void;
  className?: string;
}

const EXPANDED_WIDTH = 268;
const RAIL_WIDTH = 56;

function collectOpenFolders(
  items: CollapsibleSidebarItem[],
  groups: CollapsibleSidebarGroup[],
) {
  const open: Record<string, boolean> = {};
  const walk = (nodes: CollapsibleSidebarItem[]) => {
    for (const node of nodes) {
      if (node.children?.length && node.defaultOpen) open[node.id] = true;
      if (node.children) walk(node.children);
    }
  };
  walk(items);
  for (const group of groups) walk(group.items);
  return open;
}

export function CollapsibleSidebar({
  workspaceName,
  workspaceIcon,
  searchPlaceholder = "Command",
  onSearch,
  items = [],
  groups = [],
  rail,
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
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>(() =>
    collectOpenFolders(items, groups),
  );

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
      <div
        className={cn(
          "relative flex h-full min-h-0 shrink-0 overflow-hidden border-r border-border bg-[#F7F7F8] text-[#111113]",
          className,
        )}
      >
        {rail ? (
          <div className="flex w-[52px] shrink-0 flex-col border-r border-[#e8e8ea]">
            {rail}
          </div>
        ) : null}
        <motion.aside
          aria-label={workspaceName}
          initial={false}
          animate={{ width }}
          transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
          className="relative flex h-full min-w-0 flex-col overflow-hidden"
        >
          <div
            className={cn(
              "flex items-center gap-2 px-2 pt-3",
              collapsed ? "justify-center" : "px-3",
            )}
          >
            <div
              className={cn(
                "flex min-w-0 flex-1 items-center gap-2",
                collapsed && "justify-center",
              )}
            >
              <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-[10px]">
                {workspaceIcon ?? (
                  <span className="flex size-8 items-center justify-center rounded-[10px] bg-[#111113] text-xs font-semibold text-white">
                    {workspaceName.slice(0, 1)}
                  </span>
                )}
              </span>
              <SidebarLabel
                collapsed={collapsed}
                reduce={!!reduce}
                className="flex min-w-0 items-center gap-0.5 truncate text-[13px] font-semibold tracking-tight"
              >
                <span className="truncate">{workspaceName}</span>
                <ChevronDownIcon className="size-3 shrink-0 text-[#8a8a93]" />
              </SidebarLabel>
            </div>
            <motion.button
              type="button"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!collapsed}
              onClick={() => setCollapsed(!collapsed)}
              whileTap={reduce || !canHover ? undefined : { scale: 0.94 }}
              transition={SPRING_PRESS}
              className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[#8a8a93] outline-none hover:bg-[#efeff1] hover:text-[#111113] focus-visible:ring-2 focus-visible:ring-[#111113]/15"
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
                className="mx-auto flex size-8 items-center justify-center rounded-lg text-[#8a8a93] outline-none hover:bg-[#efeff1] hover:text-[#111113] focus-visible:ring-2 focus-visible:ring-[#111113]/15"
              >
                <span className="text-sm font-medium">⌘</span>
              </motion.button>
            ) : (
              <button
                type="button"
                onClick={onSearch}
                className="flex h-9 w-full items-center gap-2 rounded-full bg-[#efeff1] px-3 text-left text-[13px] text-[#8a8a93] outline-none hover:bg-[#e8e8ea] focus-visible:ring-2 focus-visible:ring-[#111113]/15"
              >
                <span className="shrink-0 text-[13px] font-medium text-[#6f6f78]">⌘</span>
                <span className="truncate">{searchPlaceholder}</span>
                <span className="ml-auto text-[#b0b0b6]">/</span>
              </button>
            )}
          </div>

          <nav className="mt-3 flex-1 overflow-y-auto px-2 pb-3 [scrollbar-width:thin]">
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
                    <div className="mx-auto mb-1 h-px w-6 bg-[#e4e4e7]" />
                  ) : (
                    <div className="mb-1 flex w-full items-center gap-1 px-2 text-[10px] font-medium tracking-[0.14em] text-[#9a9aa3] uppercase">
                      <button
                        type="button"
                        onClick={() => toggleGroup(group.id)}
                        className="flex min-w-0 flex-1 items-center gap-1 text-left outline-none hover:text-[#111113]"
                      >
                        <span className="truncate">{group.label}</span>
                        <ChevronDownIcon
                          className={cn("size-3 transition-transform", !open && "-rotate-90")}
                        />
                      </button>
                      {group.onMore ? (
                        <button
                          type="button"
                          aria-label={`${group.label} more`}
                          onClick={group.onMore}
                          className="inline-flex size-5 items-center justify-center rounded-md text-[#9a9aa3] outline-none hover:bg-[#efeff1] hover:text-[#111113]"
                        >
                          <MoreGlyph className="size-3" />
                        </button>
                      ) : null}
                      {group.onAdd ? (
                        <button
                          type="button"
                          aria-label={`Add to ${group.label}`}
                          onClick={group.onAdd}
                          className="inline-flex size-5 items-center justify-center rounded-md text-[#9a9aa3] outline-none hover:bg-[#efeff1] hover:text-[#111113]"
                        >
                          <PlusGlyph className="size-3" />
                        </button>
                      ) : null}
                    </div>
                  )}
                  <AnimatePresence initial={false}>
                    {(collapsed || open) && (
                      <motion.ul
                        initial={{ opacity: 0 }}
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
            <div className={cn("p-2", collapsed && "px-1.5")}>{footer}</div>
          ) : null}
        </motion.aside>
      </div>
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
            className="absolute inset-0 rounded-[10px] bg-[#efeff1]"
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
            "relative z-10 flex min-h-8 min-w-0 flex-1 items-center gap-2 rounded-[10px] px-2 text-left text-[13px] outline-none focus-visible:ring-2 focus-visible:ring-[#111113]/15",
            collapsed && "size-8 flex-none justify-center px-0",
            active ? "text-[#111113]" : "text-[#6f6f78] hover:text-[#111113]",
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
            <span className="ml-auto text-[11px] tabular-nums text-[#8a8a93]">
              {item.badge}
            </span>
          ) : null}
        </motion.button>
        {!collapsed && item.onAction ? (
          <button
            type="button"
            aria-label={item.actionLabel ?? `Add to ${item.label}`}
            onClick={item.onAction}
            className="relative z-10 mr-1 hidden size-6 items-center justify-center rounded-md text-[#8a8a93] outline-none hover:bg-white hover:text-[#111113] focus-visible:flex focus-visible:ring-2 focus-visible:ring-[#111113]/15 group-hover:flex"
          >
            <PlusGlyph className="size-3" />
          </button>
        ) : null}
        {!collapsed && hasChildren ? (
          <button
            type="button"
            aria-label={folderOpen ? `Collapse ${item.label}` : `Expand ${item.label}`}
            aria-expanded={folderOpen}
            onClick={() => onToggleFolder(item.id)}
            className="relative z-10 mr-1 inline-flex size-6 items-center justify-center rounded-md text-[#8a8a93] outline-none hover:bg-white hover:text-[#111113] focus-visible:ring-2 focus-visible:ring-[#111113]/15"
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
            initial={{ opacity: 0 }}
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
