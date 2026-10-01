import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ConceptEntryView } from "@/components/app/catalog/concept-entry";
import type { Locale } from "@/i18n/routing";
import { CONCEPTS, findConcept } from "@/lib/concepts";

export function generateStaticParams() {
  return CONCEPTS.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = findConcept(slug);
  if (!entry) return {};
  return {
    title: `${entry.name} · Concept dictionary`,
    description: entry.sentence,
  };
}

export default async function ConceptPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findConcept(slug);
  if (!entry) notFound();
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("catalog");

  return (
    <ConceptEntryView
      entry={entry}
      locale={locale}
      labels={{
        eyebrow: t("concepts.eyebrow"),
        alsoCalled: t("alsoCalled"),
        sayToAi: t("entry.sayToAi"),
        install: t("entry.install"),
        openComponent: t("entry.openComponent"),
        sameComponent: t("entry.sameComponent"),
        oneWay: t("entry.oneWay"),
      }}
    />
  );
}
