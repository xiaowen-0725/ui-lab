import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { CopyButton } from "@/components/app/docs/copy-button";
import { BrandReferencePreview } from "@/components/app/inspiration/brand-reference-preview";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localizedDescription, localizedName } from "@/lib/i18n-content";
import {
	getInspirationBrandBySlug,
	readInspirationBrandDocument,
} from "@/lib/inspiration-brand-content";
import {
	INSPIRATION_BRANDS,
	INSPIRATION_BRANDS_UPSTREAM,
} from "@/lib/inspiration-brands";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
	return INSPIRATION_BRANDS.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const brand = getInspirationBrandBySlug(slug);
	if (!brand) return {};

	return {
		title: `${brand.name} Brand Reference`,
		description: brand.description,
	};
}

export default async function InspirationBrandPage({
	params,
}: {
	params: Promise<{ locale: string; slug: string }>;
}) {
	const { slug } = await params;
	const brand = getInspirationBrandBySlug(slug);
	if (!brand) notFound();

	const locale = (await getLocale()) as Locale;
	const t = await getTranslations("inspiration");
	const document = await readInspirationBrandDocument(brand.slug);
	const name = localizedName(brand, locale);
	const description = localizedDescription(brand, locale);
	const sourceLinks = [
		{
			key: "officialWebsite",
			href: brand.officialUrl,
		},
		{
			key: "upstreamFile",
			href: brand.sourceBrowseUrl,
		},
		{
			key: "getDesign",
			href: brand.getDesignUrl,
		},
		{
			key: "repository",
			href: INSPIRATION_BRANDS_UPSTREAM.repo,
		},
	] as const;

	return (
		<div className="relative">
			<main className="mx-auto min-w-0 max-w-5xl px-4 pb-24 pt-24 md:pt-28">
				<Link
					href="/inspiration/brands"
					className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
					{t("backToBrands")}
				</Link>

				<div className="mt-7">
					<div className="flex flex-wrap gap-2">
						<span className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
							{t(`domain.${brand.domain}`)}
						</span>
						{brand.collections.map((collection) => (
							<span key={collection} className="rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground">
								{t(`collectionLabel.${collection}`)}
							</span>
						))}
					</div>
					<h1 className="mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
						{name}
					</h1>
					<p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
						{description}
					</p>
				</div>

				<div className="mt-8 max-w-3xl">
					<BrandReferencePreview
						brand={brand}
						size="detail"
						ariaLabel={t("officialScreenshotLabel", { name: brand.name })}
					/>
					<p className="mt-2 text-xs leading-relaxed text-muted-foreground/80">
						{t(
							brand.screenshot.status === "captured"
								? "officialScreenshotNote"
								: "fallbackAssetNote",
							{ date: brand.screenshot.capturedAt },
						)}
					</p>
				</div>

				<section className="mt-8 grid gap-4 md:grid-cols-3">
					<div className="rounded-3xl border border-border bg-card/20 p-5">
						<p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
							{t("licenseTitle")}
						</p>
						<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
							{t("licenseNote")}
						</p>
					</div>
					<div className="rounded-3xl border border-border bg-card/20 p-5">
						<p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
							{t("provenanceTitle")}
						</p>
						<p className="mt-2 break-all font-mono text-xs leading-relaxed text-muted-foreground">
							{INSPIRATION_BRANDS_UPSTREAM.commit}
						</p>
						{brand.metadataSource === "design-document" ? (
							<p className="mt-2 text-xs leading-relaxed text-muted-foreground/80">
								{t("metadataFromDocumentDetail")}
							</p>
						) : null}
					</div>
					<div className="rounded-3xl border border-border bg-card/20 p-5">
						<p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
							{t("brandRightsTitle")}
						</p>
						<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
							{t("brandRights")}
						</p>
					</div>
				</section>

				<section className="mt-8 rounded-3xl border border-border bg-card/20 p-5 md:p-6">
					<h2 className="text-sm font-semibold text-foreground">
						{t("sourceLinks")}
					</h2>
					<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
						{t("communityReferenceDetail")}
					</p>
					<div className="mt-4 flex flex-wrap gap-2">
						{sourceLinks.map((link) => (
							<a
								key={link.key}
								href={link.href}
								target="_blank"
								rel="noreferrer noopener"
								className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-sm text-foreground transition-colors hover:border-(--color-border-strong)"
							>
								{t(link.key)}
								<ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
							</a>
						))}
					</div>
				</section>

				<section className="mt-8 min-w-0">
					<div className="flex items-end justify-between gap-3">
						<div>
							<p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground/70">
								{t("documentEyebrow")}
							</p>
							<h2 className="mt-1 text-xl font-semibold text-foreground">
								DESIGN.md
							</h2>
						</div>
						<CopyButton
							text={document}
							eventName="copy_inspiration_design_md"
							eventLabel={brand.slug}
						/>
					</div>
					<div className="mt-4 min-w-0 overflow-hidden rounded-3xl border border-border bg-background">
						<pre className="max-h-[70vh] min-w-0 overflow-auto p-5 text-xs leading-relaxed text-muted-foreground">
							{document}
						</pre>
					</div>
					<p className="mt-3 text-xs leading-relaxed text-muted-foreground/80">
						{t("copyDesignMd")}
					</p>
				</section>
			</main>
			<SiteFooter />
		</div>
	);
}
