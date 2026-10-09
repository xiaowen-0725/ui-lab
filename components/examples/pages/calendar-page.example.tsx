"use client";

import type { ComponentProps } from "react";
import { CalendarPage } from "@/components/pages/calendar-page";

// Supply your own content and callbacks through the installed component's props.
export function CalendarPageExample(props: ComponentProps<typeof CalendarPage>) {
  return <CalendarPage locale="zh" {...props} />;
}
