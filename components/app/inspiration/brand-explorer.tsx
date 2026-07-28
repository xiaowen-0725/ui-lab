"use client";

import { ArrowRight, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { BrandReferencePreview } from "@/components/app/inspiration/brand-reference-preview";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localizedDescription, localizedName } from "@/lib/i18n-content";
import {
	INSPIRATION_BRANDS,
	INSPIRATION_COLLECTION_META,
	INSPIRATION_DOMAIN_META,
	type InspirationCollectionKey,
	type InspirationDomainKey,
} from "@/lib/inspiration";
import { cn } from "@/lib/utils";

function isDomain(value: string | null): value is InspirationDomainKey {
	return INSPIRATION_DOMAIN_META.some((entry) => entry.key === value);
}
function isCollection(value: string | null): value is InspirationCollectionKey {
	return INSPIRATION_COLLECTION_META.some((entry) => entry.key === value);
}

/** Searchable gallery of brand design references and attributed website captures. */
export function BrandExplorer({ className }: { className?: string }) {
	const locale = useLocale() as Locale;
	const t = useTranslations("inspiration");
	const searchParams = useSearchParams();
	const paramDomain = searchParams.get("domain");
	const paramCollection = searchParams.get("collection");
	const paramQuery = searchParams.get("q") ?? "";
	const [domain, setDomain] = useState<InspirationDomainKey | null>(() => isDomain(paramDomain) ? paramDomain : null);
	const [collection, setCollection] = useState<InspirationCollectionKey | null>(() => isCollection(paramCollection) ? paramCollection : null);
	const [query, setQuery] = useState(paramQuery);

	useEffect(() => {
		setDomain(isDomain(paramDomain) ? paramDomain : null);
		setCollection(isCollection(paramCollection) ? paramCollection : null);
		setQuery(paramQuery);
	}, [paramCollection, paramDomain, paramQuery]);

	const availableDomains = useMemo(() => INSPIRATION_DOMAIN_META.filter((item) => INSPIRATION_BRANDS.some((brand) => brand.domain === item.key)), []);
	const availableCollections = useMemo(() => INSPIRATION_COLLECTION_META.filter((item) => INSPIRATION_BRANDS.some((brand) => brand.collections.includes(item.key))), []);
	const domainByKey = useMemo(() => new Map(INSPIRATION_DOMAIN_META.map((item) => [item.key, item])), []);
	const collectionByKey = useMemo(() => new Map(INSPIRATION_COLLECTION_META.map((item) => [item.key, item])), []);

	const filteredBrands = useMemo(() => {
		const normalized = query.trim().toLocaleLowerCase();
		return INSPIRATION_BRANDS.filter((brand) => {
			if (domain && brand.domain !== domain) return false;
			if (collection && !brand.collections.includes(collection)) return false;
			if (!normalized) return true;
			const currentDomain = domainByKey.get(brand.domain);
			const collections = brand.collections.flatMap((key) => {
				const item = collectionByKey.get(key);
				return item ? [item.name, item.nameZh] : [];
			});
			return [brand.name, brand.nameZh, brand.description, brand.descriptionZh, currentDomain?.name, currentDomain?.nameZh, ...collections].join(" ").toLocaleLowerCase().includes(normalized);
		});
	}, [collection, collectionByKey, domain, domainByKey, query]);

	const syncUrl = (nextDomain: InspirationDomainKey | null, nextCollection: InspirationCollectionKey | null, nextQuery: string) => {
		const url = new URL(window.location.href);
		for (const [key, value] of [["domain", nextDomain], ["collection", nextCollection]] as const) {
			if (value) url.searchParams.set(key, value); else url.searchParams.delete(key);
		}
		const trimmed = nextQuery.trim();
		if (trimmed) url.searchParams.set("q", trimmed); else url.searchParams.delete("q");
		window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
	};
	const clearFilters = () => { setDomain(null); setCollection(null); setQuery(""); syncUrl(null, null, ""); };

	return <div className={cn(className)}>
		<div className="rounded-3xl border border-border bg-card/20 p-4 md:p-5">
			<label className="relative block"><span className="sr-only">{t("brandsSearchLabel")}</span><Search aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input type="search" value={query} onChange={(event) => { const value = event.currentTarget.value; setQuery(value); syncUrl(domain, collection, value); }} placeholder={t("brandsSearchPlaceholder")} className="h-11 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-(--color-border-strong)" /></label>
			<div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => { setDomain(null); syncUrl(null, collection, query); }} aria-pressed={domain === null} className={cn("rounded-full border px-3 py-1.5 text-sm transition-colors", domain === null ? "border-(--color-border-strong) bg-card text-foreground" : "border-border text-muted-foreground hover:text-foreground")}>{t("allDomains")}</button>{availableDomains.map((item) => <button key={item.key} type="button" onClick={() => { setDomain(item.key); syncUrl(item.key, collection, query); }} aria-pressed={domain === item.key} className={cn("rounded-full border px-3 py-1.5 text-sm transition-colors", domain === item.key ? "border-(--color-border-strong) bg-card text-foreground" : "border-border text-muted-foreground hover:text-foreground")}>{t(`domain.${item.key}`)}</button>)}</div>
			{availableCollections.length ? <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4"><span className="text-xs text-muted-foreground">{t("collection")}</span>{availableCollections.map((item) => <button key={item.key} type="button" onClick={() => { const next = collection === item.key ? null : item.key; setCollection(next); syncUrl(domain, next, query); }} aria-pressed={collection === item.key} className={cn("rounded-full border px-3 py-1 text-xs transition-colors", collection === item.key ? "border-(--color-border-strong) bg-card text-foreground" : "border-border text-muted-foreground hover:text-foreground")}>{t(`collectionLabel.${item.key}`)}</button>)}</div> : null}
		</div>
		<div className="mt-6 flex items-center justify-between gap-4"><p className="text-sm text-muted-foreground">{t("brandsResults", { count: filteredBrands.length })}</p>{(query || domain || collection) ? <button type="button" onClick={clearFilters} className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-foreground">{t("clear")}</button> : null}</div>
		{filteredBrands.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filteredBrands.map((brand) => <article key={brand.slug} className="flex min-w-0 flex-col rounded-3xl border border-border bg-card/20 p-5"><BrandReferencePreview brand={brand} ariaLabel={t("officialScreenshotLabel", { name: brand.name })} /><div className="mt-5 flex flex-wrap items-center gap-2"><span className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] text-muted-foreground">{t(`domain.${brand.domain}`)}</span>{brand.collections.map((key) => <span key={key} className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] text-muted-foreground">{t(`collectionLabel.${key}`)}</span>)}<span className="ml-auto text-[0.65rem] text-muted-foreground">{t(brand.parserMode === "yaml" ? "parserStructured" : "parserDocument")}</span></div><h2 className="mt-4 text-lg font-semibold text-foreground">{localizedName(brand, locale)}</h2><p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{localizedDescription(brand, locale)}</p><div className="mt-5 border-t border-border pt-4"><p className="text-xs leading-relaxed text-muted-foreground/80">{t(brand.screenshot.assetKind === "screenshot" ? "officialScreenshotBadge" : brand.screenshot.assetKind === "archival-screenshot" ? "archivalScreenshotBadge" : brand.screenshot.assetKind === "official-image" ? "officialImageBadge" : "officialOgBadge", { date: brand.screenshot.capturedAt })}</p><div className="mt-4 flex items-center justify-between gap-3"><span className="text-xs text-muted-foreground">{t("mitDocument")}</span><Link href={`/inspiration/brands/${brand.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">{t("viewReference")}<ArrowRight aria-hidden="true" className="h-3.5 w-3.5" /></Link></div></div></article>)}</div> : <div className="mt-4 rounded-3xl border border-dashed border-border bg-card/20 px-6 py-16 text-center"><p className="text-sm font-medium text-foreground">{t("brandsEmptyTitle")}</p><p className="mt-2 text-sm text-muted-foreground">{t("brandsEmptyDescription")}</p><button type="button" onClick={clearFilters} className="mt-5 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground transition-colors hover:border-(--color-border-strong)">{t("clear")}</button></div>}
	</div>;
}
