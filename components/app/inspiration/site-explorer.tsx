"use client";

import { ArrowRight, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { SiteReferencePreview } from "@/components/app/inspiration/brand-reference-preview";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localizedDescription, localizedName } from "@/lib/i18n-content";
import {
	INSPIRATION_DOMAIN_META,
	INSPIRATION_PAGE_TYPES,
	INSPIRATION_SITE_BADGES,
	INSPIRATION_SITES,
	INSPIRATION_VISUAL_TRAITS,
	type InspirationDomainKey,
	type InspirationPageTypeKey,
	type InspirationSiteBadgeKey,
	type InspirationVisualTraitKey,
} from "@/lib/inspiration";
import { cn } from "@/lib/utils";

const isDomain = (value: string | null): value is InspirationDomainKey => INSPIRATION_DOMAIN_META.some((item) => item.key === value);
const isPageType = (value: string | null): value is InspirationPageTypeKey => INSPIRATION_PAGE_TYPES.some(([key]) => key === value);
const isTrait = (value: string | null): value is InspirationVisualTraitKey => INSPIRATION_VISUAL_TRAITS.some(([key]) => key === value);
const isBadge = (value: string | null): value is InspirationSiteBadgeKey => INSPIRATION_SITE_BADGES.some(([key]) => key === value);

/** Filterable gallery of reviewed, external website references. */
export function SiteExplorer({ className }: { className?: string }) {
	const locale = useLocale() as Locale;
	const t = useTranslations("inspiration");
	const params = useSearchParams();
	const [query, setQuery] = useState(params.get("q") ?? "");
	const [domain, setDomain] = useState<InspirationDomainKey | null>(() => { const value = params.get("domain"); return isDomain(value) ? value : null; });
	const [pageType, setPageType] = useState<InspirationPageTypeKey | null>(() => { const value = params.get("pageType"); return isPageType(value) ? value : null; });
	const [trait, setTrait] = useState<InspirationVisualTraitKey | null>(() => { const value = params.get("trait"); return isTrait(value) ? value : null; });
	const [badge, setBadge] = useState<InspirationSiteBadgeKey | null>(() => { const value = params.get("badge"); return isBadge(value) ? value : null; });

	useEffect(() => {
		const get = (key: string) => params.get(key);
		setQuery(get("q") ?? "");
		const nextDomain = get("domain"); const nextPageType = get("pageType"); const nextTrait = get("trait"); const nextBadge = get("badge");
		setDomain(isDomain(nextDomain) ? nextDomain : null);
		setPageType(isPageType(nextPageType) ? nextPageType : null);
		setTrait(isTrait(nextTrait) ? nextTrait : null);
		setBadge(isBadge(nextBadge) ? nextBadge : null);
	}, [params]);

	const availableDomains = useMemo(() => INSPIRATION_DOMAIN_META.filter((item) => INSPIRATION_SITES.some((site) => site.domain === item.key)), []);
	const availablePageTypes = useMemo(() => INSPIRATION_PAGE_TYPES.filter(([key]) => INSPIRATION_SITES.some((site) => site.pageTypes.includes(key))), []);
	const availableTraits = useMemo(() => INSPIRATION_VISUAL_TRAITS.filter(([key]) => INSPIRATION_SITES.some((site) => site.visualTraits.includes(key))), []);
	const availableBadges = useMemo(() => INSPIRATION_SITE_BADGES.filter(([key]) => INSPIRATION_SITES.some((site) => site.badges.includes(key))), []);
	const domainByKey = useMemo(() => new Map(INSPIRATION_DOMAIN_META.map((item) => [item.key, item])), []);
	const filtered = useMemo(() => {
		const normalized = query.trim().toLocaleLowerCase();
		return INSPIRATION_SITES.filter((site) => {
			if (domain && site.domain !== domain) return false;
			if (pageType && !site.pageTypes.includes(pageType)) return false;
			if (trait && !site.visualTraits.includes(trait)) return false;
			if (badge && !site.badges.includes(badge)) return false;
			if (!normalized) return true;
			const currentDomain = domainByKey.get(site.domain);
			return [site.name, site.nameZh, ...site.aliases, site.description, site.descriptionZh, site.url, currentDomain?.name, currentDomain?.nameZh, ...site.pageTypes, ...site.visualTraits, ...site.badges].join(" ").toLocaleLowerCase().includes(normalized);
		});
	}, [badge, domain, domainByKey, pageType, query, trait]);
	const sync = (next: Record<string, string | null>) => {
		const url = new URL(window.location.href);
		for (const [key, value] of Object.entries(next)) { if (value) url.searchParams.set(key, value); else url.searchParams.delete(key); }
		window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
	};
	const clear = () => { setQuery(""); setDomain(null); setPageType(null); setTrait(null); setBadge(null); sync({ q: null, domain: null, pageType: null, trait: null, badge: null }); };
	const selectClass = "h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-(--color-border-strong)";

	return <div className={cn(className)}>
		<div className="rounded-3xl border border-border bg-card/20 p-4 md:p-5"><label className="relative block"><span className="sr-only">{t("sitesSearchLabel")}</span><Search aria-hidden="true" className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><input type="search" value={query} onChange={(event) => { const value = event.currentTarget.value; setQuery(value); sync({ q: value.trim() || null }); }} placeholder={t("sitesSearchPlaceholder")} className="h-11 w-full rounded-2xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-(--color-border-strong)" /></label><div className="mt-4 flex flex-wrap gap-2"><button type="button" onClick={() => { setDomain(null); sync({ domain: null }); }} aria-pressed={!domain} className={cn("rounded-full border px-3 py-1.5 text-sm", !domain ? "border-(--color-border-strong) bg-card text-foreground" : "border-border text-muted-foreground")}>{t("allDomains")}</button>{availableDomains.map((item) => <button key={item.key} type="button" onClick={() => { setDomain(item.key); sync({ domain: item.key }); }} aria-pressed={domain === item.key} className={cn("rounded-full border px-3 py-1.5 text-sm", domain === item.key ? "border-(--color-border-strong) bg-card text-foreground" : "border-border text-muted-foreground")}>{t(`domain.${item.key}`)}</button>)}</div><div className="mt-4 grid gap-2 border-t border-border pt-4 sm:grid-cols-3"><select aria-label={t("allPageTypes")} value={pageType ?? ""} onChange={(event) => { const value = event.currentTarget.value as InspirationPageTypeKey | ""; setPageType(value || null); sync({ pageType: value || null }); }} className={selectClass}><option value="">{t("allPageTypes")}</option>{availablePageTypes.map(([key]) => <option key={key} value={key}>{t(`pageType.${key}`)}</option>)}</select><select aria-label={t("allVisualTraits")} value={trait ?? ""} onChange={(event) => { const value = event.currentTarget.value as InspirationVisualTraitKey | ""; setTrait(value || null); sync({ trait: value || null }); }} className={selectClass}><option value="">{t("allVisualTraits")}</option>{availableTraits.map(([key]) => <option key={key} value={key}>{t(`visualTrait.${key}`)}</option>)}</select><select aria-label={t("allBadges")} value={badge ?? ""} onChange={(event) => { const value = event.currentTarget.value as InspirationSiteBadgeKey | ""; setBadge(value || null); sync({ badge: value || null }); }} className={selectClass}><option value="">{t("allBadges")}</option>{availableBadges.map(([key]) => <option key={key} value={key}>{t(`siteBadge.${key}`)}</option>)}</select></div></div>
		<div className="mt-6 flex items-center justify-between gap-4"><p className="text-sm text-muted-foreground">{t("sitesResults", { count: filtered.length })}</p>{query || domain || pageType || trait || badge ? <button type="button" onClick={clear} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground">{t("clear")}</button> : null}</div>
		{filtered.length ? <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{filtered.map((site) => <article key={site.slug} className="flex min-w-0 flex-col rounded-3xl border border-border bg-card/20 p-5"><SiteReferencePreview site={site} ariaLabel={t("officialScreenshotLabel", { name: site.name })} /><div className="mt-5 flex flex-wrap items-center gap-2"><span className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] text-muted-foreground">{t(`domain.${site.domain}`)}</span>{site.badges.map((item) => <span key={item} className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] text-muted-foreground">{t(`siteBadge.${item}`)}</span>)}</div><h2 className="mt-4 text-lg font-semibold text-foreground">{localizedName(site, locale)}</h2><p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{localizedDescription(site, locale)}</p><div className="mt-4 flex flex-wrap gap-1.5">{site.visualTraits.slice(0, 3).map((item) => <span key={item} className="text-xs text-muted-foreground">#{t(`visualTrait.${item}`)}</span>)}</div><div className="mt-5 flex items-center justify-between border-t border-border pt-4"><span className="text-xs text-muted-foreground">{t(site.screenshot.assetKind === "screenshot" ? "officialScreenshotBadge" : "officialOgBadge", { date: site.screenshot.capturedAt })}</span><Link href={`/inspiration/sites/${site.slug}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground">{t("viewReference")}<ArrowRight aria-hidden="true" className="h-3.5 w-3.5" /></Link></div></article>)}</div> : <div className="mt-4 rounded-3xl border border-dashed border-border bg-card/20 px-6 py-16 text-center"><p className="text-sm font-medium text-foreground">{t("sitesEmptyTitle")}</p><p className="mt-2 text-sm text-muted-foreground">{t("sitesEmptyDescription")}</p><button type="button" onClick={clear} className="mt-5 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground">{t("clear")}</button></div>}
	</div>;
}
