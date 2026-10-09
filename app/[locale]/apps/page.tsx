import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AppsHome } from "@/components/app/apps/apps-home";
import { AppsShell } from "@/components/app/apps/apps-shell";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apps");
  return {
    title: t("overviewTitle"),
    description: t("overviewIntro"),
  };
}

export default function AppsPage() {
  return (
    <AppsShell>
      <AppsHome />
    </AppsShell>
  );
}
