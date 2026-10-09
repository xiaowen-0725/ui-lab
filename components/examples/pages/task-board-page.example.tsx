"use client";

import type { ComponentProps } from "react";
import { TaskBoardPage } from "@/components/pages/task-board-page";

// Supply your own content and callbacks through the installed component's props.
export function TaskBoardPageExample(props: ComponentProps<typeof TaskBoardPage>) {
  return <TaskBoardPage locale="zh" {...props} />;
}
