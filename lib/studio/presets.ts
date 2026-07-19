import { DENSITIES, FONT_PAIRS, RADII, SHADOWS } from "@/lib/atoms";
import type {
  StudioBorder,
  StudioConfig,
  StudioResolvedTokens,
  StudioScheme,
  StudioStarterPreset,
  StudioSurfacePreset,
} from "@/lib/studio/types";

export const STUDIO_ACCENT = {
  sky: "#339cff",
  lavender: "#5e6ad2",
  electricBlue: "#0070f3",
  clearBlue: "#0075de",
  terracotta: "#cc785c",
  indigo: "#533afd",
  systemBlue: "#0071e3",
  emerald: "#3ecf8e",
  designBlue: "#0d99ff",
  coral: "#ff7759",
  violet: "#6d5dfc",
  neutral: "#171717",
} as const;

export const STUDIO_ACCENTS = Object.values(STUDIO_ACCENT);

/** Opacity (%) of a "glass" raised surface; 100% for solid surfaces. */
export const STUDIO_GLASS_ALPHA = 72;
/** Backdrop blur radius applied to raised surfaces when glass is enabled. */
export const STUDIO_GLASS_BLUR = "14px";

export const STUDIO_SURFACES: readonly StudioSurfacePreset[] = [
  {
    key: "paper",
    scheme: "light",
    name: "Paper",
    nameZh: "纯白",
    canvas: "#ffffff",
    surface: "#f7f7f5",
    raised: "#ffffff",
    ink: "#1d1d1f",
    hairline: "#e6e6e6",
  },
  {
    key: "cream",
    scheme: "light",
    name: "Cream",
    nameZh: "暖奶油",
    canvas: "#faf9f5",
    surface: "#f5f0e8",
    raised: "#ffffff",
    ink: "#141413",
    hairline: "#e6dfd8",
  },
  {
    key: "cool",
    scheme: "light",
    name: "Cool",
    nameZh: "冷灰",
    canvas: "#ffffff",
    surface: "#f6f9fc",
    raised: "#ffffff",
    ink: "#0d253d",
    hairline: "#e3e8ee",
  },
  {
    key: "ivory",
    scheme: "light",
    name: "Ivory",
    nameZh: "象牙",
    canvas: "#ffffff",
    surface: "#eeece7",
    raised: "#ffffff",
    ink: "#212121",
    hairline: "#d9d9dd",
  },
  {
    key: "ink",
    scheme: "dark",
    name: "Ink",
    nameZh: "近黑",
    canvas: "#0a0a0b",
    surface: "#0f1011",
    raised: "#18191a",
    ink: "#f7f8f8",
    hairline: "#23252a",
  },
  {
    key: "black",
    scheme: "dark",
    name: "Black",
    nameZh: "纯黑",
    canvas: "#000000",
    surface: "#0a0a0a",
    raised: "#111111",
    ink: "#ededed",
    hairline: "#2e2e2e",
  },
  {
    key: "graphite",
    scheme: "dark",
    name: "Graphite",
    nameZh: "石墨",
    canvas: "#151515",
    surface: "#1c1c1c",
    raised: "#262626",
    ink: "#f5f5f5",
    hairline: "#303030",
  },
  {
    key: "forest",
    scheme: "dark",
    name: "Forest",
    nameZh: "墨绿黑",
    canvas: "#1c1c1c",
    surface: "#202020",
    raised: "#262626",
    ink: "#ffffff",
    hairline: "#303030",
  },
] as const;

const RADIUS_KEYS = ["none", "sm", "md", "lg", "xl"] as const;
const ELEVATION_KEYS = ["hairline", "raised", "floating"] as const;

export const STUDIO_RADII = RADII.filter((entry) =>
  RADIUS_KEYS.some((key) => key === entry.slug),
);
export const STUDIO_ELEVATIONS = SHADOWS.filter((entry) =>
  ELEVATION_KEYS.some((key) => key === entry.slug),
);
export const STUDIO_FONT_PAIRINGS = FONT_PAIRS;
export const STUDIO_DENSITIES = DENSITIES;

export const STUDIO_STARTER_PRESETS: readonly StudioStarterPreset[] = [
  {
    key: "minimal-light",
    name: "Minimal Light",
    nameZh: "极简浅",
    config: {
      scheme: "light",
      accent: STUDIO_ACCENT.sky,
      surface: "paper",
      radius: "md",
      elevation: "hairline",
      fontPairing: "system-neutral",
      density: "standard",
      glass: false,
      border: "hairline",
    },
  },
  {
    key: "tech-dark",
    name: "Tech Dark",
    nameZh: "科技深",
    config: {
      scheme: "dark",
      accent: STUDIO_ACCENT.lavender,
      surface: "ink",
      radius: "lg",
      elevation: "floating",
      fontPairing: "native-crisp",
      density: "standard",
      glass: false,
      border: "hairline",
    },
  },
  {
    key: "warm-reading",
    name: "Warm Reading",
    nameZh: "暖阅读",
    config: {
      scheme: "light",
      accent: STUDIO_ACCENT.terracotta,
      surface: "cream",
      radius: "xl",
      elevation: "raised",
      fontPairing: "editorial-serif",
      density: "comfortable",
      glass: false,
      border: "hairline",
    },
  },
  {
    key: "glass",
    name: "Glass",
    nameZh: "玻璃",
    config: {
      scheme: "light",
      accent: STUDIO_ACCENT.violet,
      surface: "cool",
      radius: "xl",
      elevation: "floating",
      fontPairing: "system-neutral",
      density: "standard",
      glass: true,
      border: "none",
    },
  },
] as const;

export const DEFAULT_STUDIO_CONFIG: StudioConfig = {
  ...STUDIO_STARTER_PRESETS[0].config,
};

export function defaultSurfaceForScheme(scheme: StudioScheme): string {
  return scheme === "dark" ? "ink" : "paper";
}

function matchingAccent(value: string | undefined): string | undefined {
  if (!value) return undefined;
  return STUDIO_ACCENTS.find((accent) => accent.toLowerCase() === value.toLowerCase());
}

/**
 * `glass`/`border` arrive as real booleans/unions from in-memory config, but as
 * plain strings when parsed off the URL — this input type covers both so
 * callers don't need to pre-coerce query-string values.
 */
export type StudioConfigInput = Partial<Omit<StudioConfig, "glass" | "border">> & {
  glass?: StudioConfig["glass"] | string;
  border?: StudioConfig["border"] | string;
};

export function normalizeStudioConfig(input: StudioConfigInput): StudioConfig {
  const scheme: StudioScheme = input.scheme === "dark" ? "dark" : "light";
  const surface = STUDIO_SURFACES.find(
    (entry) => entry.key === input.surface && entry.scheme === scheme,
  );
  const radius = STUDIO_RADII.find((entry) => entry.slug === input.radius);
  const elevation = STUDIO_ELEVATIONS.find((entry) => entry.slug === input.elevation);
  const fontPairing = STUDIO_FONT_PAIRINGS.find(
    (entry) => entry.slug === input.fontPairing,
  );
  const density = STUDIO_DENSITIES.find((entry) => entry.slug === input.density);
  const name = input.name?.trim();
  const glassRaw: unknown = input.glass;
  const glass = glassRaw === true || glassRaw === "true" || glassRaw === "1";
  const borderRaw: unknown = input.border;
  const border: StudioBorder =
    borderRaw === "none" || borderRaw === "hairline" || borderRaw === "solid"
      ? borderRaw
      : "hairline";

  return {
    scheme,
    accent: matchingAccent(input.accent) ?? DEFAULT_STUDIO_CONFIG.accent,
    surface: surface?.key ?? defaultSurfaceForScheme(scheme),
    radius: radius?.slug ?? DEFAULT_STUDIO_CONFIG.radius,
    elevation: elevation?.slug ?? DEFAULT_STUDIO_CONFIG.elevation,
    fontPairing: fontPairing?.slug ?? DEFAULT_STUDIO_CONFIG.fontPairing,
    density: density?.slug ?? DEFAULT_STUDIO_CONFIG.density,
    glass,
    border,
    ...(name ? { name } : {}),
  };
}

export function resolveStudioTokens(config: StudioConfig): StudioResolvedTokens {
  const normalized = normalizeStudioConfig(config);
  const surface = STUDIO_SURFACES.find(
    (entry) => entry.key === normalized.surface && entry.scheme === normalized.scheme,
  );
  const radius = STUDIO_RADII.find((entry) => entry.slug === normalized.radius);
  const elevation = STUDIO_ELEVATIONS.find(
    (entry) => entry.slug === normalized.elevation,
  );
  const fontPairing = STUDIO_FONT_PAIRINGS.find(
    (entry) => entry.slug === normalized.fontPairing,
  );
  const density = STUDIO_DENSITIES.find((entry) => entry.slug === normalized.density);

  if (!surface || !radius || !elevation || !fontPairing || !density) {
    throw new Error("Studio atom configuration could not be resolved.");
  }

  return { surface, radius, elevation, fontPairing, density };
}

export function studioConfigFromSearchParams(
  searchParams: Pick<URLSearchParams, "get">,
): StudioConfig {
  const scheme = searchParams.get("scheme");

  return normalizeStudioConfig({
    scheme: scheme === "dark" ? "dark" : "light",
    accent: searchParams.get("accent") ?? undefined,
    surface: searchParams.get("surface") ?? undefined,
    radius: searchParams.get("radius") ?? undefined,
    elevation: searchParams.get("shadow") ?? undefined,
    fontPairing: searchParams.get("font") ?? undefined,
    density: searchParams.get("density") ?? undefined,
    glass: searchParams.get("glass") ?? undefined,
    border: searchParams.get("border") ?? undefined,
    name: searchParams.get("name") ?? undefined,
  });
}

export function studioConfigToSearchParams(config: StudioConfig): URLSearchParams {
  const normalized = normalizeStudioConfig(config);
  return new URLSearchParams({
    scheme: normalized.scheme,
    accent: normalized.accent,
    surface: normalized.surface,
    radius: normalized.radius,
    shadow: normalized.elevation,
    font: normalized.fontPairing,
    density: normalized.density,
    glass: normalized.glass ? "1" : "0",
    border: normalized.border,
    name: config.name ?? "",
  });
}
