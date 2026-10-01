import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { describedLink } from "@/components/app/catalog/catalog-door";
import { CatalogScreen } from "@/components/app/catalog/catalog-screen";
import type { Locale } from "@/i18n/routing";
import {
  BACKGROUND_FADES,
  BACKGROUNDS,
  BREAKPOINTS,
  DENSITIES,
  FONT_PAIRS,
  ICON_STYLES,
  LAYERS,
  LINES,
  RADII,
  SHADOWS,
  SPACING_SCALE,
  TYPE_SCALE,
} from "@/lib/atoms";
import { DESIGN_SYSTEMS } from "@/lib/layouts";
import { PALETTES } from "@/lib/palettes";
import { STYLES } from "@/lib/styles";

export const metadata: Metadata = {
  title: "Themes",
  description:
    "Semantic values for light and dark, including color, radius, type, spacing, and workbench skins.",
};

export default async function ThemesPage() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("catalog");
  const link = (
    category: string,
    entry: Parameters<typeof describedLink>[2],
  ) => describedLink(locale, `/atoms?cat=${category}#${entry.slug}`, entry);

  return (
    <CatalogScreen
      eyebrow={t("themes.eyebrow")}
      title={t("themes.title")}
      intro={t("themes.intro")}
      alsoCalled={t("alsoCalled")}
      groups={[
        {
          title: t("groups.styles"),
          items: STYLES.map((entry) =>
            describedLink(locale, `/styles?style=${entry.slug}`, entry),
          ),
        },
        {
          title: t("groups.palettes"),
          items: PALETTES.map((entry) =>
            describedLink(locale, `/palettes?palette=${entry.slug}`, entry),
          ),
        },
        {
          title: t("groups.skins"),
          items: DESIGN_SYSTEMS.map((entry) =>
            describedLink(locale, `/layouts?ds=${entry.slug}`, entry),
          ),
        },
        {
          title: t("groups.tokens"),
          items: [
            ...RADII.map((entry) => link("shape", entry)),
            ...SHADOWS.map((entry) => link("shape", entry)),
            ...LAYERS.map((entry) => link("shape", entry)),
            ...FONT_PAIRS.map((entry) => link("typography", entry)),
            ...TYPE_SCALE.map((entry) => link("typography", entry)),
            ...SPACING_SCALE.map((entry) => link("spacing", entry)),
            ...DENSITIES.map((entry) => link("spacing", entry)),
            ...BREAKPOINTS.map((entry) => link("spacing", entry)),
            ...LINES.map((entry) => link("lines", entry)),
            ...ICON_STYLES.map((entry) => link("icons", entry)),
            ...BACKGROUNDS.map((entry) => link("backgrounds", entry)),
            ...BACKGROUND_FADES.map((entry) => link("backgrounds", entry)),
          ],
        },
      ]}
    />
  );
}
