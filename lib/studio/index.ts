export { composeDesignSystem } from "@/lib/studio/export";
export {
  DEFAULT_STUDIO_CONFIG,
  defaultSurfaceForScheme,
  normalizeStudioConfig,
  resolveStudioTokens,
  STUDIO_ACCENT,
  STUDIO_ACCENTS,
  STUDIO_DENSITIES,
  STUDIO_ELEVATIONS,
  STUDIO_FONT_PAIRINGS,
  STUDIO_GLASS_ALPHA,
  STUDIO_GLASS_BLUR,
  STUDIO_RADII,
  STUDIO_STARTER_PRESETS,
  STUDIO_SURFACES,
  studioConfigFromSearchParams,
  studioConfigToSearchParams,
} from "@/lib/studio/presets";
export { studioConfigToEntry, studioConfigToSkin } from "@/lib/studio/skin";
export type {
  StudioBorder,
  StudioConfig,
  StudioExportBundle,
  StudioResolvedTokens,
  StudioScheme,
  StudioStarterPreset,
  StudioSurfacePreset,
} from "@/lib/studio/types";
