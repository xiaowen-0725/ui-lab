import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { BrandExplorer } from "@/components/app/inspiration/brand-explorer";
import { InspirationSubnav } from "@/components/app/inspiration/inspiration-subnav";

export const metadata: Metadata = {
	title: "Brand References",
	description:
		"Browse 74 recognizable brand and product design systems with real website captures, official imagery, and reviewed DESIGN.md analyses.",
};

export default async function InspirationBrandsPage() {
	const t = await getTranslations("inspiration");

	return (
		<div className="relative">
			<section className="mx-auto max-w-7xl px-4 pb-24 pt-24 md:pt-28">
				<p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
					{t("brandsEyebrow")}
				</p>
				<h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
					{t("brandsTitle")}
				</h1>
				<p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
					{t("brandsIntro")}
				</p>
				<div className="mt-8">
					<InspirationSubnav />
				</div>
				<div className="mt-6">
					<Suspense>
						<BrandExplorer />
					</Suspense>
				</div>
			</section>
			<SiteFooter />
		</div>
	);
}
