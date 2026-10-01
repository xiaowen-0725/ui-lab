import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import {
  CatalogDoor,
  toCatalogLink,
} from "@/components/app/catalog/catalog-door";
import { MotionCardFace } from "@/components/app/catalog/motion-samples";
import type { Locale } from "@/i18n/routing";
import { MOTION_GROUPS, MOTIONS } from "@/lib/motions";

export const metadata: Metadata = {
  title: "Motion dictionary",
  description:
    "Named motion you can replay, pointing at a component or system when one exists.",
};

export default async function MotionDictionaryPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("catalog");

  return (
    <CatalogDoor
      eyebrow={t("motion.eyebrow")}
      title={t("motion.title")}
      intro={t("motion.intro")}
      alsoCalled={t("alsoCalled")}
      groups={MOTION_GROUPS.map((group) => ({
        title: t(`groups.${group}`),
        items: MOTIONS.filter((entry) => entry.group === group).map((entry) => ({
          ...toCatalogLink(locale, {
            id: entry.slug,
            href: `/dictionary/motion/${entry.slug}`,
            name: entry.name,
            nameZh: entry.nameZh,
            description: entry.sentence,
            descriptionZh: entry.sentenceZh,
            aliases: entry.aliases,
          }),
          preview: <MotionCardFace slug={entry.slug} />,
        })),
      }))}
    />
  );
}
