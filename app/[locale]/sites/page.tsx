import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { describedLink, toCatalogLink } from "@/components/app/catalog/catalog-door";
import { CatalogScreen } from "@/components/app/catalog/catalog-screen";
import type { Locale } from "@/i18n/routing";
import { SITES } from "@/lib/sites";

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
				...(["workspace", "marketing", "personal"] as const)
					.filter((useCase) => SITES.some((entry) => entry.useCase === useCase))
					.map((useCase) => ({ title: {
							workspace: locale === "zh" ? "工作区模板" : "Workspace templates",
							marketing: locale === "zh" ? "落地页模板" : "Marketing templates",
							personal: locale === "zh" ? "个人网站模板" : "Personal templates",
						}[useCase], items: SITES.filter((entry) => entry.useCase === useCase).map((entry) => describedLink(locale, entry.pagePath, entry)),
					})),
				{
					title: t("groups.completeSites"),
					items: SITES.filter((entry) => !entry.useCase).map((entry) =>
						describedLink(locale, entry.pagePath, entry),
					),
				},
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
