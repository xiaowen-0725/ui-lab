import { defineRouting } from "next-intl/routing";

/**
 * Locale routing. Chinese is the primary locale and lives on bare paths
 * (`/`, `/components`), English is served under `/en/*`. Missing translations
 * fall back to English via the resolver in `lib/i18n-content.ts`.
 */
export const routing = defineRouting({
  locales: ["zh", "en"],
  defaultLocale: "zh",
  localePrefix: "as-needed",
});

export type Locale = (typeof routing.locales)[number];
