import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { toCatalogLink } from "@/components/app/catalog/catalog-door";
import { CatalogScreen } from "@/components/app/catalog/catalog-screen";
import type { Locale } from "@/i18n/routing";

export const metadata: Metadata = {
  title: "Docs",
  description: "How to install the catalog and how an AI reads it.",
};

const DOCS = [
  {
    id: "ai-agents",
    href: "/docs/ai-agents",
    name: "AI agents",
    nameZh: "AI 接入",
    description: "Query and install components that already exist.",
    descriptionZh: "查询并安装目录里已经有的组件。",
  },
  {
    id: "motion-patterns",
    href: "/docs/motion-patterns",
    name: "Motion guides",
    nameZh: "动效指南",
    description: "How motion in this catalog is supposed to feel.",
    descriptionZh: "这份目录里的动效应该是什么手感。",
  },
  {
    id: "theme",
    href: "/docs/theme",
    name: "Theme tokens",
    nameZh: "主题令牌",
    description: "How light and dark semantic tokens are set.",
    descriptionZh: "明暗两套语义令牌怎么取值。",
  },
] as const;

export default async function DocsPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("catalog");

  return (
    <CatalogScreen
      eyebrow={t("docs.eyebrow")}
      title={t("docs.title")}
      intro={t("docs.intro")}
      alsoCalled={t("alsoCalled")}
      groups={[
        {
          items: DOCS.map((entry) => toCatalogLink(locale, entry)),
        },
      ]}
    />
  );
}
