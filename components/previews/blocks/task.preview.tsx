"use client";

// Live sample for Vercel AI Elements Task (Apache-2.0).

import { Task, TaskContent, TaskItem, TaskItemFile, TaskTrigger } from "@/components/agents/task";

export function TaskPreview() {
  return (
    <div className="w-full max-w-md">
      <Task defaultOpen>
        <TaskTrigger title="Search the current catalog" />
        <TaskContent>
          <TaskItem>
            Open <TaskItemFile>lib/registry.ts</TaskItemFile> and confirm the slug is missing.
          </TaskItem>
          <TaskItem>Add a live preview before registering the entry.</TaskItem>
          <TaskItem>Refresh the CLI snapshot after the catalog change.</TaskItem>
        </TaskContent>
      </Task>
    </div>
  );
}
