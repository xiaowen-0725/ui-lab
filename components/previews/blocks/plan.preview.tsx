"use client";

// Live sample for Vercel AI Elements Plan (Apache-2.0).

import {
  Plan,
  PlanAction,
  PlanContent,
  PlanDescription,
  PlanHeader,
  PlanTitle,
  PlanTrigger,
} from "@/components/agents/plan";
import { Task, TaskContent, TaskItem, TaskTrigger } from "@/components/agents/task";

export function PlanPreview() {
  return (
    <div className="w-full max-w-lg">
      <Plan defaultOpen>
        <PlanHeader>
          <div className="space-y-1">
            <PlanTitle>Ship the catalog entries</PlanTitle>
            <PlanDescription>
              Register live samples, bilingual names, and registry files for each missing agent primitive.
            </PlanDescription>
          </div>
          <PlanAction>
            <PlanTrigger />
          </PlanAction>
        </PlanHeader>
        <PlanContent>
          <Task defaultOpen>
            <TaskTrigger title="Port the missing surfaces" />
            <TaskContent>
              <TaskItem>Keep beUI and AI Elements attribution on every file.</TaskItem>
              <TaskItem>Adapt imports to ui-lab primitives.</TaskItem>
              <TaskItem>Do not add a full agents runtime.</TaskItem>
            </TaskContent>
          </Task>
        </PlanContent>
      </Plan>
    </div>
  );
}
