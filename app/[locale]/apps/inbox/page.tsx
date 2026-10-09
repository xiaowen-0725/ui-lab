import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AppsShell } from "@/components/app/apps/apps-shell";
import { InboxApp } from "@/components/app/apps/inbox/inbox-app";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apps");
  return {
    title: t("inboxTitle"),
    description: t("inboxDescription"),
  };
}

export default function InboxPage() {
  return (
    <AppsShell>
      <InboxApp />
    </AppsShell>
  );
}
