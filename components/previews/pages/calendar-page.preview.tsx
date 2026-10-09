"use client";

import { useLocale } from "next-intl";
import { CalendarPage } from "@/components/pages/calendar-page";

export function CalendarPagePreview() {
  const locale = useLocale() === "en" ? "en" : "zh";
  return (
    <div className="h-[42rem] w-full overflow-hidden rounded-xl border border-border">
      <CalendarPage locale={locale} />
    </div>
  );
}
