import { isLightHexColor } from "@/lib/color";
import { makeWbSkin } from "@/lib/layouts/skin";
import type { DesignSystemEntry, WorkbenchSkin } from "@/lib/layouts/types";
import {
  normalizeStudioConfig,
  resolveStudioTokens,
  STUDIO_ACCENT,
  STUDIO_GLASS_ALPHA,
  STUDIO_GLASS_BLUR,
} from "@/lib/studio/presets";
import type { StudioConfig } from "@/lib/studio/types";

const SEMANTIC_COLORS = {
  light: { success: "#1ea64a", danger: "#dc2626", warning: "#d97706" },
  dark: { success: "#40c977", danger: "#fa423e", warning: "#ff8549" },
} as const;

function inkStep(ink: string, canvas: string, percentage: number): string {
  return `color-mix(in srgb, ${ink} ${percentage}%, ${canvas})`;
}

// Mirrors makeWbSkin's private alpha helper; kept local since it isn't exported.
function alpha(color: string, percentage: number): string {
  return `color-mix(in srgb, ${color} ${percentage}%, transparent)`;
}

export function studioConfigToSkin(config: StudioConfig): WorkbenchSkin {
  const normalized = normalizeStudioConfig(config);
  const { surface, fontPairing } = resolveStudioTokens(normalized);
  const semantics = SEMANTIC_COLORS[normalized.scheme];

  const skin = makeWbSkin({
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

  skin.vars["--wb-surface-alpha"] = normalized.glass ? `${STUDIO_GLASS_ALPHA}%` : "100%";
  skin.vars["--wb-blur"] = normalized.glass ? STUDIO_GLASS_BLUR : "0px";

  const { ink, hairline } = surface;
  if (normalized.border === "none") {
    skin.vars["--wb-border"] = "transparent";
    skin.vars["--wb-hairline"] = "transparent";
    skin.vars["--wb-divider"] = "transparent";
    skin.siteVars["--border"] = "transparent";
  } else if (normalized.border === "solid") {
    const strong = alpha(ink, normalized.scheme === "dark" ? 22 : 16);
    skin.vars["--wb-border"] = strong;
    skin.vars["--wb-hairline"] = strong;
    skin.siteVars["--border"] = hairline;
    skin.siteVars["--border-strong"] = strong;
  }

  return skin;
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
