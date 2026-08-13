import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { PalettesExplorer } from "@/components/app/palettes/palettes-explorer";

export const metadata: Metadata = {
  title: "Palettes",
  description:
    "See color palettes live on the same page — Morandi, dopamine, dark luxe — with every hex assigned a role, then copy an AI-ready prompt.",
};

export default async function PalettesPage() {
  const t = await getTranslations("palettes");

  return (
    <section>
      <h1 className="sr-only">{t("title")}</h1>
      <p className="sr-only">{t("intro")}</p>
      {/* useSearchParams in the explorer needs a Suspense boundary for static rendering. */}
      <Suspense>
        <PalettesExplorer />
      </Suspense>
    </section>
  );
}
