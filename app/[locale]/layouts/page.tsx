import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { LayoutsExplorer } from "@/components/app/layouts/layouts-explorer";

export const metadata: Metadata = {
  title: "Design Systems",
  description:
    "Explore design systems on a complete, interactive Agent workbench, then copy the vocabulary and DESIGN.md that recreate the look.",
};

export default async function LayoutsPage() {
  const t = await getTranslations("layouts");

  return (
    <div className="relative">
      <section className="mx-auto max-w-[90rem] px-4 pb-24 pt-24 md:pt-28">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {t("intro")}
        </p>
        <div className="mt-10">
          {/* The `?ds=` switcher reads search params on the client. */}
          <Suspense>
            <LayoutsExplorer />
          </Suspense>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
