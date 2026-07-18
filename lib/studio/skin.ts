import { isLightHexColor } from "@/lib/color";
import { makeWbSkin } from "@/lib/layouts/skin";
import type { DesignSystemEntry, WorkbenchSkin } from "@/lib/layouts/types";
import {
  normalizeStudioConfig,
  resolveStudioTokens,
  STUDIO_ACCENT,
} from "@/lib/studio/presets";
import type { StudioConfig } from "@/lib/studio/types";

const SEMANTIC_COLORS = {
  light: { success: "#1ea64a", danger: "#dc2626", warning: "#d97706" },
  dark: { success: "#40c977", danger: "#fa423e", warning: "#ff8549" },
} as const;

function inkStep(ink: string, canvas: string, percentage: number): string {
  return `color-mix(in srgb, ${ink} ${percentage}%, ${canvas})`;
}

export function studioConfigToSkin(config: StudioConfig): WorkbenchSkin {
  const normalized = normalizeStudioConfig(config);
  const { surface, fontPairing } = resolveStudioTokens(normalized);
  const semantics = SEMANTIC_COLORS[normalized.scheme];

  return makeWbSkin({
    scheme: normalized.scheme,
    canvas: surface.canvas,
    surface: surface.surface,
    raised: surface.raised,
    ink: surface.ink,
    inkSecondary: inkStep(surface.ink, surface.canvas, 85),
    inkMuted: inkStep(surface.ink, surface.canvas, 60),
    inkFaint: inkStep(surface.ink, surface.canvas, 40),
    hairline: surface.hairline,
    accent: normalized.accent,
    accentFg: isLightHexColor(normalized.accent)
      ? STUDIO_ACCENT.neutral
      : "#ffffff",
    ...semantics,
    fonts: {
      display: fontPairing.display,
      body: fontPairing.body,
      mono: fontPairing.mono,
    },
  });
}

export function studioConfigToEntry(config: StudioConfig): DesignSystemEntry {
  const name = config.name?.trim() || "My System";

  return {
    slug: "studio-preview",
    name,
    nameZh: name,
    aliases: [],
    description: "",
    descriptionZh: "",
    skin: studioConfigToSkin(config),
    promptZh: "",
    promptEn: "",
    designMd: "",
    keywords: [],
  };
}
