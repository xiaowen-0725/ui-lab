import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { InspirationExplorer } from "@/components/app/inspiration/inspiration-explorer";
import { InspirationSubnav } from "@/components/app/inspiration/inspiration-subnav";

export const metadata: Metadata = {
  title: "Inspiration Library",
  description:
    "Browse a reviewed directory of websites and collections for web, product, brand, social, editorial, motion, and 3D inspiration.",
};

export default async function InspirationPage() {
  const t = await getTranslations("inspiration");

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
        <div className="mt-8">
          <InspirationSubnav />
        </div>
        <div className="mt-6">
          <Suspense>
            <InspirationExplorer />
          </Suspense>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
