import { baselineKit } from "./compose";
import { BLUE_INK_COLORS } from "./blue-ink-colors";
import type { ThemeKit, ThemeMode, ThemeTokenSet } from "./types";

/** Blue is the brand accent; both schemes retain independently tuned neutral surfaces. */
export function blueInkKit(): ThemeKit {
  const base = baselineKit();
  const tune = (mode: ThemeMode): ThemeTokenSet => {
    const set = base[mode];
    if (!set) throw new Error(`Missing baseline ${mode}`);
    const colors = BLUE_INK_COLORS[mode];
    const { primary, background, card } = colors;
    const onPrimary = colors["primary-foreground"];
    return {
      ...set,
      shadcn: {
        ...set.shadcn,
        ...Object.fromEntries(Object.entries(colors).filter(([key]) => !key.startsWith("chart-"))),
      },
      wb: {
        ...set.wb,
        "wb-surface": background,
        "wb-surface-raised": card,
        "wb-accent": primary,
        "wb-accent-fg": onPrimary,
      },
      charts: Object.fromEntries(Object.entries(colors).filter(([key]) => key.startsWith("chart-"))),
    };
  };
  return {
    ...base,
    slug: "blue-ink",
    name: "Blue Ink",
    nameZh: "蓝墨",
    description: "A blue-accented workspace theme with independently tuned light and dark schemes.",
    descriptionZh: "以蓝色为强调色，分别调校浅色与深色的工作区主题。",
    source: "brand-theme",
    light: tune("light"),
    dark: tune("dark"),
  };
}
