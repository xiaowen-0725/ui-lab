import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { describedLink } from "@/components/app/catalog/catalog-door";
import { CatalogScreen } from "@/components/app/catalog/catalog-screen";
import type { Locale } from "@/i18n/routing";
import { findCategory } from "@/lib/registry";
import { SECTIONS } from "@/lib/sections";

export const metadata: Metadata = {
  title: "Blocks",
  description:
    "Arranged sections. Installing one brings the components it uses.",
};

export default async function BlocksPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("catalog");
  const blocks = findCategory("blocks")?.components ?? [];

  return (
    <CatalogScreen
      eyebrow={t("blocks.eyebrow")}
      title={t("blocks.title")}
      intro={t("blocks.intro")}
      alsoCalled={t("alsoCalled")}
      groups={[
        {
          title: t("groups.blocks"),
          items: blocks.map((entry) =>
            describedLink(locale, `/components/blocks/${entry.slug}`, entry),
          ),
        },
        {
          title: t("groups.sections"),
          items: SECTIONS.map((entry) =>
            describedLink(locale, `/sections?section=${entry.slug}`, entry),
          ),
        },
      ]}
    />
  );
}
