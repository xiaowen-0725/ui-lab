import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { AtomsExplorer } from "@/components/app/atoms/atoms-explorer";
import { SiteFooter } from "@/components/app/chrome/site-footer";

export const metadata: Metadata = {
  title: "Atoms",
  description:
    "Compare motion curves, springs, radii, shadows, font stacks, and type scales — then copy the exact CSS or JavaScript value.",
};

export default async function AtomsPage() {
  const t = await getTranslations("atoms");

  return (
    <div className="relative">
      <section className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:pt-28">
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
            <AtomsExplorer />
          </Suspense>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
