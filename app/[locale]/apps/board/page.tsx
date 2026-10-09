import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AppsShell } from "@/components/app/apps/apps-shell";
import { BoardApp } from "@/components/app/apps/board/board-app";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("apps");
  return {
    title: t("boardTitle"),
    description: t("boardDescription"),
  };
}

export default function BoardPage() {
  return (
    <AppsShell>
      <BoardApp />
    </AppsShell>
  );
}
