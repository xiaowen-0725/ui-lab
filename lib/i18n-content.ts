import type { Locale } from "@/i18n/routing";

/**
 * Resolvers for the bilingual fields on registry entries. Chinese is preferred
 * when the locale is `zh` and a `*Zh` field exists; otherwise we fall back to
 * the canonical English text. Machine endpoints (registry.json, /r, llms.txt)
 * intentionally do NOT use these — they always serve the English canonical
 * fields so shadcn/AI tooling stays stable.
 */
type Named = { name: string; nameZh?: string };
type Described = { description?: string; descriptionZh?: string };

export function localizedName(entry: Named, locale: Locale): string {
  return locale === "zh" && entry.nameZh ? entry.nameZh : entry.name;
}

export function localizedDescription(
  entry: Described,
  locale: Locale,
): string | undefined {
  return locale === "zh" && entry.descriptionZh
    ? entry.descriptionZh
    : entry.description;
}
