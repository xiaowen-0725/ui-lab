import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { SectionsExplorer } from "@/components/app/sections/sections-explorer";

export const metadata: Metadata = {
  title: "Sections",
  description:
    "The anatomy of a landing page — hero, features, pricing, FAQ and more, each shape live with a copy-ready AI prompt.",
};

export default async function SectionsPage() {
  const t = await getTranslations("sections");

  return (
    <div className="relative">
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:pt-28">
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
          {/* useSearchParams in the explorer needs a Suspense boundary for
           * static rendering of this page. */}
          <Suspense>
            <SectionsExplorer />
          </Suspense>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
