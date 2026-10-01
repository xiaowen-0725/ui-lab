import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { toCatalogLink } from "@/components/app/catalog/catalog-door";
import { CatalogScreen } from "@/components/app/catalog/catalog-screen";
import type { Locale } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Sites",
  description:
    "Shells shared by several screens. A site registers pages and does not copy their source.",
};

export default async function SitesPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("catalog");

  return (
    <CatalogScreen
      eyebrow={t("sites.eyebrow")}
      title={t("sites.title")}
      intro={t("sites.intro")}
      alsoCalled={t("alsoCalled")}
      groups={[
        {
          title: t("groups.shells"),
          items: [
            toCatalogLink(locale, {
              id: "agent-workbench",
              href: "/layouts",
              name: "Agent workbench",
              nameZh: "Agent 工作台",
              description:
                "A multi-pane shell for an agent product. Skins for this shell live under Themes.",
              descriptionZh:
                "Agent 产品的多栏外壳。这层壳的皮在主题里。",
            }),
          ],
        },
      ]}
    />
  );
}
