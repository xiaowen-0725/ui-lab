"use client";

import { useState } from "react";
import {
  CollapsibleSidebar,
  type CollapsibleSidebarGroup,
  type CollapsibleSidebarItem,
} from "@/components/motion/collapsible-sidebar";
import {
  BellGlyph,
  BrandMark,
  ConsumexMark,
  CreateMark,
  FilterGlyph,
  GradientAvatar,
  HomeIcon,
  InboxIcon,
  JammioMark,
  MenuGlyph,
  PlayGlyph,
  PlusGlyph,
  ProjectsIcon,
  PuzzleGlyph,
  ReportsIcon,
  SearchGlyph,
  SlidersIcon,
  SortGlyph,
  SunIcon,
  TasksIcon,
  TeamsIcon,
  ThoughtsMark,
  TuesdayMark,
  UpgradeBowlGlyph,
  UserIcon,
  ViewsIcon,
} from "@/components/motion/startup-visuals-icons";
import { ProductChrome } from "@/components/previews/blocks/product-chrome";

const items: CollapsibleSidebarItem[] = [
  { id: "home", label: "Home", icon: <HomeIcon /> },
  { id: "updates", label: "Updates", icon: <BellGlyph />, badge: 44 },
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
    onMore: () => {},
    onAdd: () => {},
    items: [
      { id: "projects", label: "Projects", icon: <ProjectsIcon /> },
      {
        id: "tasks",
        label: "Tasks",
        icon: <TasksIcon />,
        actionLabel: "New task",
        onAction: () => {},
      },
      { id: "views", label: "Views", icon: <ViewsIcon /> },
      { id: "teams", label: "Teams", icon: <TeamsIcon />, badge: 48 },
      { id: "reports", label: "Reports", icon: <ReportsIcon /> },
    ],
  },
  {
    id: "project-list",
    label: "Projects",
    onMore: () => {},
    onAdd: () => {},
    items: [
      {
        id: "tuesday",
        label: "Tuesday™",
        icon: <TuesdayMark />,
        defaultOpen: true,
        children: [
          { id: "tuesday-march", label: "March", badge: 23 },
          { id: "tuesday-april", label: "April", badge: 99 },
        ],
      },
      { id: "jammio", label: "Jammio™", icon: <JammioMark /> },
      {
        id: "create",
        label: "Create™ AI",
        icon: <CreateMark />,
        children: [
          { id: "create-march", label: "March", badge: 99 },
          { id: "create-april", label: "April", badge: 99 },
        ],
      },
      { id: "thoughts", label: "Thoughts™", icon: <ThoughtsMark /> },
      {
        id: "consumex",
        label: "Consumex™",
        icon: <ConsumexMark />,
        children: [
          { id: "consumex-jan", label: "January", badge: 12 },
          { id: "consumex-feb", label: "February", badge: 23 },
        ],
      },
    ],
  },
];

const TASKS = [
  { title: "Review April intake", project: "Tuesday™", owner: "Mina", due: "Apr 4" },
  { title: "Ship onboarding copy", project: "Create™ AI", owner: "Leo", due: "Apr 6" },
  { title: "Triage support queue", project: "Jammio™", owner: "Asha", due: "Apr 7" },
  { title: "Close Q1 notes", project: "Thoughts™", owner: "Ken", due: "Apr 9" },
  { title: "Map vendor list", project: "Consumex™", owner: "Rui", due: "Apr 11" },
];

function GlobalRail() {
  const icons = [
    { id: "menu", label: "Menu", icon: <MenuGlyph /> },
    { id: "home", label: "Home", icon: <HomeIcon /> },
    { id: "search", label: "Search", icon: <SearchGlyph /> },
    { id: "updates", label: "Updates", icon: <BellGlyph /> },
    { id: "inbox", label: "Inbox", icon: <InboxIcon /> },
    { id: "tasks", label: "My tasks", icon: <TasksIcon /> },
    { id: "workspace", label: "Workspace", icon: <TeamsIcon /> },
    { id: "projects", label: "Projects", icon: <PuzzleGlyph /> },
  ];

  return (
    <div className="flex h-full flex-col items-center py-3">
      <div className="flex flex-1 flex-col items-center gap-2 text-[#8a8a93]">
        {icons.map((item) => (
          <span
            key={item.id}
            title={item.label}
            className="inline-flex size-8 items-center justify-center rounded-lg"
          >
            {item.icon}
          </span>
        ))}
      </div>
      <div className="flex flex-col items-center gap-2 text-[#8a8a93]">
        <SunIcon />
        <UserIcon />
        <SlidersIcon />
        <GradientAvatar className="size-7" />
      </div>
    </div>
  );
}

function UpgradeCard({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return (
      <div className="flex justify-center">
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-[#111113] text-white">
          <UpgradeBowlGlyph className="size-3.5" />
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-[16px] border border-[#ececee] bg-white p-2.5 shadow-[0_8px_24px_rgba(17,17,19,0.04)]">
      <div className="relative mb-2 overflow-hidden rounded-[12px] bg-[#f3f3f5]">
        <div className="grid h-[72px] grid-cols-3 gap-1.5 p-2">
          <div className="rounded-md bg-white shadow-sm" />
          <div className="rounded-md bg-white shadow-sm" />
          <div className="rounded-md bg-[#ececee]" />
        </div>
        <span className="absolute inset-0 flex items-center justify-center">
          <PlayGlyph className="size-7 drop-shadow-sm" />
        </span>
      </div>
      <button
        type="button"
        className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-full bg-[#111113] text-[12px] font-medium text-white"
      >
        Upgrade Plan
        <UpgradeBowlGlyph className="size-3.5" />
      </button>
    </div>
  );
}

export function CollapsibleSidebarPreview() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ProductChrome scheme="light" className="flex h-[620px]">
      <CollapsibleSidebar
        workspaceName="Starline™ AI"
        workspaceIcon={<BrandMark className="size-8" />}
        searchPlaceholder="Command"
        items={items}
        groups={groups}
        rail={<GlobalRail />}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
        defaultActiveId="tasks"
        footer={<UpgradeCard collapsed={collapsed} />}
      />
      <div className="flex min-w-0 flex-1 flex-col bg-[#f7f7f8]">
        <div className="flex items-center justify-between gap-3 border-b border-[#ececee] px-5 py-3">
          <div>
            <p className="text-[15px] font-semibold tracking-tight text-[#111113]">Tasks</p>
            <p className="mt-0.5 text-[12px] text-[#8a8a93]">
              Open work across Tuesday™, Create™ AI, and the rest of the workspace.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-[#8a8a93]">
            <span className="hidden items-center gap-1 rounded-full px-2.5 py-1 text-[12px] sm:inline-flex">
              <SortGlyph className="size-3.5" />
              Sort
            </span>
            <span className="hidden items-center gap-1 rounded-full px-2.5 py-1 text-[12px] sm:inline-flex">
              <FilterGlyph className="size-3.5" />
              Filter
            </span>
            <span className="inline-flex h-8 items-center gap-1 rounded-full bg-[#111113] px-3 text-[12px] font-medium text-white">
              <PlusGlyph className="size-3.5" />
              New
            </span>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4 [scrollbar-width:thin]">
          <div className="overflow-hidden rounded-[16px] border border-[#ececee] bg-white">
            <table className="w-full text-left text-[13px]">
              <thead className="text-[11px] tracking-wide text-[#8a8a93] uppercase">
                <tr className="border-b border-[#f0f0f2]">
                  <th className="px-4 py-2.5 font-medium">Task</th>
                  <th className="px-4 py-2.5 font-medium">Project</th>
                  <th className="px-4 py-2.5 font-medium">Owner</th>
                  <th className="px-4 py-2.5 font-medium">Due</th>
                </tr>
              </thead>
              <tbody>
                {TASKS.map((row) => (
                  <tr key={row.title} className="border-t border-[#f3f3f5] text-[#111113]">
                    <td className="px-4 py-3 font-medium">{row.title}</td>
                    <td className="px-4 py-3 text-[#6f6f78]">{row.project}</td>
                    <td className="px-4 py-3 text-[#6f6f78]">{row.owner}</td>
                    <td className="px-4 py-3 text-[#8a8a93]">{row.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProductChrome>
  );
}
