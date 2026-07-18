import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { PalettesExplorer } from "@/components/app/palettes/palettes-explorer";

export const metadata: Metadata = {
  title: "Palettes",
  description:
    "See color palettes live on the same page — Morandi, dopamine, dark luxe — with every hex assigned a role, then copy an AI-ready prompt.",
};

export default async function PalettesPage() {
  const t = await getTranslations("palettes");

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
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground/80">
          {t.rich("moreLink", {
            link: (chunks) => (
              <a
                href="https://huemint.com/back-gradient-2/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-foreground/80 underline underline-offset-4 transition-colors hover:text-foreground"
              >
                {chunks}
              </a>
            ),
          })}
        </p>
        <div className="mt-10">
          {/* useSearchParams in the explorer needs a Suspense boundary for
           * static rendering of this page. */}
          <Suspense>
            <PalettesExplorer />
          </Suspense>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
