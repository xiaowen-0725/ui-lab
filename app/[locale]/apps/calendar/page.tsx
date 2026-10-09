import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AppsShell } from "@/components/app/apps/apps-shell";
import { CalendarApp } from "@/components/app/apps/calendar/calendar-app";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apps");
  return {
    title: t("calendarTitle"),
    description: t("calendarDescription"),
  };
}

export default function CalendarPage() {
  return (
    <AppsShell>
      <CalendarApp />
    </AppsShell>
  );
}
