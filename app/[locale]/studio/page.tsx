import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { StudioExplorer } from "@/components/app/studio/studio-explorer";

export const metadata: Metadata = {
  title: "Studio",
  description:
    "Compose a custom design system from UI Lab atoms, preview it on a live Agent workbench, and export CSS variables, Tailwind @theme, and DESIGN.md.",
};

export default async function StudioPage() {
  const t = await getTranslations("studio");

  return (
    <div className="relative">
      <section className="mx-auto max-w-[90rem] px-4 pb-24 pt-24 md:pt-28">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {t("intro")}
        </p>
        <div className="mt-10">
          <Suspense>
            <StudioExplorer />
          </Suspense>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
