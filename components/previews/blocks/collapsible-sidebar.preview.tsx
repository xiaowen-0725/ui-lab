"use client";

import { useState } from "react";
import {
  CollapsibleSidebar,
  type CollapsibleSidebarGroup,
  type CollapsibleSidebarItem,
} from "@/components/motion/collapsible-sidebar";
import {
  BrandMark,
  GradientAvatar,
  HomeIcon,
  InboxIcon,
  PROJECT_TILES,
  ProjectTile,
  ProjectsIcon,
  ReportsIcon,
  SlidersIcon,
  SunIcon,
  TasksIcon,
  TeamsIcon,
  UpdatesIcon,
  UserIcon,
  ViewsIcon,
} from "@/components/motion/startup-visuals-icons";

const items: CollapsibleSidebarItem[] = [
  { id: "home", label: "Home", icon: <HomeIcon /> },
  { id: "updates", label: "Updates", icon: <UpdatesIcon />, badge: 44 },
  { id: "inbox", label: "Inbox", icon: <InboxIcon />, badge: 20 },
  {
    id: "my-tasks",
    label: "My tasks",
    icon: <TasksIcon />,
    actionLabel: "New task",
    onAction: () => {},
  },
];

const groups: CollapsibleSidebarGroup[] = [
  {
    id: "workspace",
    label: "Workspace",
    items: [
      { id: "projects", label: "Projects", icon: <ProjectsIcon /> },
      { id: "tasks", label: "Tasks", icon: <TasksIcon /> },
      { id: "views", label: "Views", icon: <ViewsIcon /> },
      { id: "teams", label: "Teams", icon: <TeamsIcon />, badge: 48 },
      { id: "reports", label: "Reports", icon: <ReportsIcon /> },
    ],
  },
  {
    id: "project-list",
    label: "Projects",
    items: [
      {
        id: "tuesday",
        label: "Tuesday™",
        icon: <ProjectTile {...PROJECT_TILES.tuesday} />,
        children: [
          { id: "tuesday-march", label: "March", badge: 8 },
          { id: "tuesday-april", label: "April", badge: 14 },
        ],
      },
      { id: "jammio", label: "Jammio™", icon: <ProjectTile {...PROJECT_TILES.jammio} /> },
      { id: "create", label: "Create™ AI", icon: <ProjectTile {...PROJECT_TILES.create} /> },
      { id: "thoughts", label: "Thoughts™", icon: <ProjectTile {...PROJECT_TILES.thoughts} /> },
      { id: "consumex", label: "Consumex™", icon: <ProjectTile {...PROJECT_TILES.consumex} /> },
    ],
  },
];

function UtilityRow({ collapsed }: { collapsed: boolean }) {
  const tools = [
    { id: "theme", label: "Appearance", icon: <SunIcon /> },
    { id: "profile", label: "Profile", icon: <UserIcon /> },
    { id: "settings", label: "Settings", icon: <SlidersIcon /> },
  ];

  if (collapsed) {
    return (
      <div className="flex flex-col items-center gap-2">
        {tools.map((tool) => (
          <span key={tool.id} className="text-muted-foreground">
            {tool.icon}
          </span>
        ))}
        <GradientAvatar className="size-7" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      {tools.map((tool) => (
        <span
          key={tool.id}
          className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground"
        >
          {tool.icon}
        </span>
      ))}
      <GradientAvatar className="ml-auto size-7" />
    </div>
  );
}

export function CollapsibleSidebarPreview() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-[560px] w-full overflow-hidden rounded-2xl border border-border bg-muted/40">
      <CollapsibleSidebar
        workspaceName="Starline™ AI"
        workspaceIcon={<BrandMark className="size-8" />}
        searchPlaceholder="Command"
        items={items}
        groups={groups}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        defaultActiveId="tasks"
        footer={<UtilityRow collapsed={collapsed} />}
      />
      <div className="flex min-w-0 flex-1 flex-col p-5">
        <p className="text-sm font-medium text-foreground">Workspace</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Collapse the rail to keep the same glyphs. Nested project folders stay in the expanded tree.
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
