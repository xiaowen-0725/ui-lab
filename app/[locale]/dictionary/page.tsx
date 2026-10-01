import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { DICTIONARY_SECTIONS } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Dictionary",
  description:
    "Look up the formal name of an interface part or a motion you can already see.",
};

export default async function DictionaryPage() {
  const t = await getTranslations("catalog");
  const concepts = DICTIONARY_SECTIONS.find((section) => section.key === "concepts");
  const motion = DICTIONARY_SECTIONS.find((section) => section.key === "motion");
  const sections = [
    concepts
      ? { space: concepts, title: t("concepts.title"), intro: t("concepts.intro") }
      : null,
    motion
      ? { space: motion, title: t("motion.title"), intro: t("motion.intro") }
      : null,
  ].filter((section) => section !== null);

  return (
    <section>
      <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
        {t("dictionary.eyebrow")}
      </p>
      <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
        {t("dictionary.title")}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
        {t("dictionary.intro")}
      </p>
      <ul className="mt-10 grid gap-3 sm:grid-cols-2">
        {sections.map((section) => (
          <li key={section.space.key}>
            <Link
              href={section.space.href}
              className="block h-full rounded-2xl border border-border bg-card/20 p-5 transition-colors hover:border-(--color-border-strong)"
            >
              <span className="text-sm font-medium text-foreground">
                {section.title}
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">
                {section.intro}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
