"use client";

// Ported from beUI (starc007/ui-components, MIT).
// Live sample of the resource tree only — no AnimatedSidebar shell.

import { useState } from "react";
import {
  AISidebar,
  type SidebarResource,
} from "@/components/agents/ai-sidebar";

const RESOURCES: SidebarResource[] = [
  { id: "design-system", label: "Design system", kind: "project" },
  { id: "client-portal", label: "Client portal", kind: "project" },
  {
    id: "platform",
    label: "Platform",
    kind: "project",
    children: [
      { id: "api", label: "API migration", kind: "file" },
      { id: "billing", label: "Billing states", kind: "file" },
      { id: "docs", label: "Read platform docs", kind: "bookmark" },
    ],
  },
  {
    id: "agent-workspace",
    label: "Agent workspace",
    kind: "project",
    children: [
      {
        id: "resource-review",
        label: "Review resource sidebar interaction details",
        kind: "file",
      },
      { id: "release-offer", label: "Prepare release announcement", kind: "file" },
      { id: "haptics", label: "Explore interaction feedback", kind: "bookmark" },
    ],
  },
  { id: "release-notes", label: "Release notes", kind: "file" },
];

function findLabel(items: SidebarResource[], id: string): string | undefined {
  for (const item of items) {
    if (item.id === id) return item.label;
    const child = item.children ? findLabel(item.children, id) : undefined;
    if (child) return child;
  }
}

export function AISidebarPreview() {
  const [active, setActive] = useState("resource-review");
  const [items, setItems] = useState(RESOURCES);
  const activeLabel = findLabel(items, active) ?? active;

  return (
    <div className="flex h-[360px] w-full max-w-xl overflow-hidden rounded-xl border border-border bg-background">
      <div className="w-56 shrink-0 overflow-y-auto border-r border-border p-2">
        <p className="px-2 pb-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          Projects
        </p>
        <AISidebar
          items={items}
          activeId={active}
          defaultExpandedIds={["platform", "agent-workspace"]}
          onActiveChange={setActive}
          onItemsChange={setItems}
        />
      </div>
      <div className="min-w-0 flex-1 p-5">
        <p className="text-xs text-muted-foreground">Selected resource</p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight">{activeLabel}</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Folders expand in place. Files can be selected, renamed, or moved with
          the row menu.
        </p>
      </div>
    </div>
  );
}
