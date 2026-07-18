import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { PatternsExplorer } from "@/components/app/patterns/patterns-explorer";

export const metadata: Metadata = {
  title: "Layout Patterns",
  description:
    "Eight full-page layout skeletons with labeled live wireframes, copy-ready CSS recipes, responsive notes, and precise AI prompts.",
};

export default async function PatternsPage() {
  const t = await getTranslations("patterns");

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
          <PatternsExplorer />
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
