import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { describedLink } from "@/components/app/catalog/catalog-door";
import { CatalogScreen } from "@/components/app/catalog/catalog-screen";
import type { Locale } from "@/i18n/routing";
import { PAGES } from "@/lib/pages";
import { LAYOUT_PATTERNS } from "@/lib/patterns";
import { allComponents } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Pages",
  description: "One full screen, and how that screen divides space.",
};

export default async function PagesPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("catalog");

  return (
    <CatalogScreen
      eyebrow={t("pages.eyebrow")}
      title={t("pages.title")}
      intro={t("pages.intro")}
      alsoCalled={t("alsoCalled")}
      groups={[
        { title: t("groups.completePages"), items: [
          ...PAGES.map((entry) => describedLink(locale, entry.pagePath, entry)),
          ...allComponents().filter((entry) => entry.assetRole === "page" && !PAGES.some((page) => page.slug === entry.slug)).map((entry) => describedLink(locale, `/components/${entry.category.slug}/${entry.slug}`, entry)),
        ] },
        {
          title: t("groups.patterns"),
          items: LAYOUT_PATTERNS.map((entry) =>
            describedLink(locale, `/patterns#${entry.slug}`, entry),
          ),
        },
      ]}
    />
  );
}
