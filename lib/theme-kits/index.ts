import { DESIGN_SYSTEMS } from "@/lib/layouts/design-systems";
import { STUDIO_STARTER_PRESETS } from "@/lib/studio/presets";
import { baselineKit, kitFromDesignSystem, kitFromStudioPreset } from "./compose";
import type { ThemeKit } from "./types";

export const THEME_KITS: ThemeKit[] = [
  baselineKit(),
  ...DESIGN_SYSTEMS.map(kitFromDesignSystem).filter((kit): kit is ThemeKit => kit !== null),
  ...STUDIO_STARTER_PRESETS.map(kitFromStudioPreset),
];

export function findThemeKit(slug: string): ThemeKit | undefined {
  return THEME_KITS.find((kit) => kit.slug === slug);
}

export * from "./types";
export { themeKitToCss } from "./css";
export { deriveChartColors } from "./charts";
