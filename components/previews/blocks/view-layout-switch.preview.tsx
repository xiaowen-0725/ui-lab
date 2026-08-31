"use client";

import { useState } from "react";
import {
  DEFAULT_SURFACE_LAYOUTS,
  ViewLayoutSwitch,
} from "@/components/motion/view-layout-switch";

const COPY: Record<string, { title: string; body: string }> = {
  list: { title: "List", body: "Dense rows with status, owner, and due date." },
  kanban: { title: "Kanban", body: "Cards grouped by workflow column." },
  gantt: { title: "Gantt", body: "Date bars across a shared timeline." },
  calendar: { title: "Calendar", body: "Month cells with scheduled work." },
  dashboard: { title: "Dashboard", body: "A mosaic of summary widgets." },
};

export function ViewLayoutSwitchPreview() {
  const [layout, setLayout] = useState("list");
  const current = COPY[layout] ?? COPY.list;

  return (
    <div className="flex w-full flex-col items-center gap-6">
      <ViewLayoutSwitch value={layout} onValueChange={setLayout} />
      <div className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-4 py-3">
        <div>
          <p className="text-sm font-medium text-foreground">{current.title} view</p>
          <p className="text-xs text-muted-foreground">{current.body}</p>
        </div>
        <ViewLayoutSwitch
          variant="menu"
          layouts={DEFAULT_SURFACE_LAYOUTS}
          defaultValue="side-drawer"
        />
      </div>
      <div className="grid w-full grid-cols-3 gap-2">
        {(layout === "list"
          ? ["alpha", "bravo", "charlie"]
          : ["alpha", "bravo", "charlie", "delta", "echo", "foxtrot"]
        ).map((slot) => (
          <div
            key={`${layout}-${slot}`}
            className="h-16 rounded-xl border border-border bg-muted/50"
          />
        ))}
      </div>
    </div>
  );
}
