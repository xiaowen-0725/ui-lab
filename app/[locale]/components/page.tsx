import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { describedLink } from "@/components/app/catalog/catalog-door";
import { CatalogScreen } from "@/components/app/catalog/catalog-screen";
import type { Locale } from "@/i18n/routing";
import { allComponents } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Components",
  description: "Installable interface components, grouped by responsibility rather than historical source folders.",
};

export default async function ComponentsPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("catalog");
  const components = allComponents().filter((entry) => entry.assetRole === "component");
  return (
    <CatalogScreen
      eyebrow={t("components.eyebrow")}
      title={t("components.title")}
      intro={t("components.intro")}
      alsoCalled={t("alsoCalled")}
      groups={[{ title: t("groups.components"), items: components.map((entry) => describedLink(locale, `/components/${entry.category.slug}/${entry.slug}`, entry)) }]}
    />
  );
}
