import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { ConceptEntryView } from "@/components/app/catalog/concept-entry";
import { MotionCardFace } from "@/components/app/catalog/motion-samples";
import type { Locale } from "@/i18n/routing";
import { findMotion, MOTIONS } from "@/lib/motions";

export function generateStaticParams() {
  return MOTIONS.map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = findMotion(slug);
  if (!entry) return {};
  return {
    title: `${entry.name} · Motion dictionary`,
    description: entry.sentence,
  };
}

export default async function MotionEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = findMotion(slug);
  if (!entry) notFound();
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("catalog");

  return (
    <ConceptEntryView
      entry={entry}
      locale={locale}
      sample={<MotionCardFace slug={entry.slug} />}
      labels={{
        eyebrow: t("motion.eyebrow"),
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
