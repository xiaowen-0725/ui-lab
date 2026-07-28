import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { InspirationSubnav } from "@/components/app/inspiration/inspiration-subnav";
import { SiteExplorer } from "@/components/app/inspiration/site-explorer";

export const metadata: Metadata = {
	title: "Website References",
	description: "Browse reviewed, external websites by industry, page type, visual traits, and curation badge.",
};

export default async function InspirationSitesPage() {
	const t = await getTranslations("inspiration");
	return <div className="relative"><section className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:pt-28"><p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">{t("sitesEyebrow")}</p><h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">{t("sitesTitle")}</h1><p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">{t("sitesIntro")}</p><div className="mt-8"><InspirationSubnav /></div><div className="mt-6"><Suspense><SiteExplorer /></Suspense></div></section><SiteFooter /></div>;
}
