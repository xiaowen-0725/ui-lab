"use client";

import {
  BarChart3,
  Building2,
  CheckSquare,
  FolderKanban,
  Home,
  Inbox,
  LayoutTemplate,
  Users,
} from "lucide-react";
import { useState } from "react";
import {
  CollapsibleSidebar,
  type CollapsibleSidebarGroup,
  type CollapsibleSidebarItem,
} from "@/components/motion/collapsible-sidebar";

const items: CollapsibleSidebarItem[] = [
  { id: "home", label: "Home", icon: <Home /> },
  { id: "inbox", label: "Inbox", icon: <Inbox />, badge: 12 },
  { id: "tasks", label: "My tasks", icon: <CheckSquare />, actionLabel: "New task", onAction: () => {} },
];

const groups: CollapsibleSidebarGroup[] = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { id: "reports", label: "Reports", icon: <BarChart3 /> },
      { id: "companies", label: "Companies", icon: <Building2 /> },
      { id: "templates", label: "Templates", icon: <LayoutTemplate /> },
      { id: "teams", label: "Teams", icon: <Users />, badge: 18 },
    ],
  },
  {
    id: "projects",
    label: "Projects",
    items: [
      {
        id: "atlas",
        label: "Atlas",
        icon: <FolderKanban />,
        children: [
          { id: "atlas-march", label: "March", badge: 8 },
          { id: "atlas-april", label: "April", badge: 14 },
        ],
      },
      {
        id: "harbor",
        label: "Harbor",
        icon: <FolderKanban />,
        children: [
          { id: "harbor-q1", label: "Q1 review", badge: 3 },
        ],
      },
    ],
  },
];

export function CollapsibleSidebarPreview() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-[460px] w-full overflow-hidden rounded-2xl border border-border bg-muted/40">
      <CollapsibleSidebar
        workspaceName="Orbit"
        searchPlaceholder="Search workspace"
        items={items}
        groups={groups}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        defaultActiveId="tasks"
        footer={
          collapsed ? (
            <div className="flex justify-center">
              <span className="size-7 rounded-full bg-foreground/90 text-[10px] font-semibold text-background inline-flex items-center justify-center">
                AL
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-xl bg-muted/70 px-2 py-2">
              <span className="inline-flex size-7 items-center justify-center rounded-full bg-foreground text-[10px] font-semibold text-background">
                AL
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-foreground">Alex Lee</p>
                <p className="truncate text-[11px] text-muted-foreground">Workspace admin</p>
              </div>
            </div>
          )
        }
      />
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <p className="text-sm font-medium text-foreground">Workspace</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Collapse the rail to keep icons only. Nested project folders stay in the expanded tree.
        </p>
        <div className="mt-4 grid flex-1 grid-cols-2 gap-3">
          {["Open tasks", "Reviews", "Reports", "Teams"].map((label) => (
            <div key={label} className="rounded-xl border border-border bg-card p-3">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-2 h-2 w-16 rounded bg-muted" />
              <p className="mt-2 h-2 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
