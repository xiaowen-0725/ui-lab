import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import {
  CatalogDoor,
  toCatalogLink,
} from "@/components/app/catalog/catalog-door";
import { ConceptCardFace } from "@/components/app/catalog/concept-samples";
import type { Locale } from "@/i18n/routing";
import { CONCEPT_GROUPS, CONCEPTS } from "@/lib/concepts";

export const metadata: Metadata = {
  title: "Concept dictionary",
  description:
    "Everyday interface concepts, with a live sample and the component when we already ship one.",
};

export default async function ConceptsPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("catalog");

  return (
    <CatalogDoor
      eyebrow={t("concepts.eyebrow")}
      title={t("concepts.title")}
      intro={t("concepts.intro")}
      alsoCalled={t("alsoCalled")}
      groups={CONCEPT_GROUPS.map((group) => ({
        title: t(`groups.${group}`),
        items: CONCEPTS.filter((entry) => entry.group === group).map((entry) => ({
          ...toCatalogLink(locale, {
            id: entry.slug,
            href: `/dictionary/concepts/${entry.slug}`,
            name: entry.name,
            nameZh: entry.nameZh,
            description: entry.sentence,
            descriptionZh: entry.sentenceZh,
            aliases: entry.aliases,
          }),
          preview: <ConceptCardFace slug={entry.slug} />,
        })),
      }))}
    />
  );
}
