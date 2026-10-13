import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { ConceptBrowser } from "@/components/app/catalog/concept-browser";
import type { Locale } from "@/i18n/routing";
import { CONCEPT_GROUPS, CONCEPTS, conceptHaystack } from "@/lib/concepts";

export const metadata: Metadata = {
  title: "Concept dictionary",
  description:
    "Everyday interface concepts, with a live sample and the component when we already ship one.",
};

export default async function ConceptsPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("catalog");
  const zh = locale === "zh";

  return (
    <section>
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        {t("concepts.eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
        {t("concepts.title")}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
        {t("concepts.intro")}
      </p>
      <ConceptBrowser
        groups={CONCEPT_GROUPS.map((group) => ({ key: group, title: t(`groups.${group}`) }))}
        items={CONCEPT_GROUPS.flatMap((group) =>
          CONCEPTS.filter((entry) => entry.group === group).map((entry) => ({
            slug: entry.slug,
            group: entry.group,
            name: zh ? entry.nameZh : entry.name,
            altName: zh ? entry.name : entry.nameZh,
            description: zh ? entry.sentenceZh : entry.sentence,
            aliases: entry.aliases.slice(0, 4),
            haystack: conceptHaystack(entry),
          })),
        )}
        labels={{
          search: t("concepts.searchLabel"),
          placeholder: t("concepts.searchPlaceholder"),
          empty: t("concepts.empty"),
          all: t("concepts.allGroups"),
          alsoCalled: t("alsoCalled"),
        }}
      />
    </section>
  );
}
