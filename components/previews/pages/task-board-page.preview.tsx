"use client";

import { useLocale } from "next-intl";
import { TaskBoardPage } from "@/components/pages/task-board-page";

export function TaskBoardPagePreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return (
    <div className="h-[42rem] w-full overflow-hidden rounded-xl border border-border">
      <TaskBoardPage locale={locale} />
    </div>
  );
}
