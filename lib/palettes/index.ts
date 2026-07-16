// Source of truth for the Palettes module (配色方案).
// Same site-wide formula as styles: live sample + names/aliases + "say this
// to AI" prompt + usage notes. A palette is eight semantic color roles;
// paletteToSkin() maps them onto the style-demo skin contract with neutral
// geometry, so the exact same demo scene previews every palette.

import { darkPalettes } from "./dark";
import { earthyPalettes } from "./earthy";
import { softPalettes } from "./soft";
import type { PaletteEntry } from "./types";
import { vividPalettes } from "./vivid";
import type { StyleSkin } from "@/lib/styles";

export { PALETTE_GROUPS } from "./types";
export type {
  PaletteColors,
  PaletteEntry,
  PaletteGroup,
  PaletteGroupKey,
} from "./types";

export const PALETTES: PaletteEntry[] = [
  ...softPalettes,
  ...vividPalettes,
  ...darkPalettes,
  ...earthyPalettes,
];

/**
 * Neutral geometry (radius/shadow/weights stay fixed) — only color varies,
 * so switching palettes compares color decisions and nothing else.
 */
export function paletteToSkin(palette: PaletteEntry): StyleSkin {
  const c = palette.colors;
  return {
    backdrop: "none",
    vars: {
      "--st-page-bg": c.bg,
      "--st-page-fg": c.text,
      "--st-muted": c.muted,
      "--st-card-bg": c.surface,
      "--st-card-border": `1px solid ${c.border}`,
      "--st-card-blur": "none",
      "--st-radius-lg": "14px",
      "--st-radius-sm": "10px",
      "--st-shadow": "0 10px 28px rgba(0, 0, 0, 0.08)",
      "--st-divider": `1px solid ${c.border}`,
      "--st-accent": c.accent,
      "--st-heading-weight": "600",
      "--st-heading-tracking": "-0.02em",
      "--st-badge-bg": `color-mix(in srgb, ${c.accent} 16%, transparent)`,
      "--st-badge-fg": c.text,
      "--st-badge-border": "1px solid transparent",
      "--st-badge-transform": "none",
      "--st-badge-tracking": "0.02em",
      "--st-btn-primary-bg": c.primary,
      "--st-btn-primary-fg": c.primaryFg,
      "--st-btn-primary-border": "1px solid transparent",
      "--st-btn-primary-shadow": "none",
      "--st-btn-secondary-bg": "transparent",
      "--st-btn-secondary-fg": c.text,
      "--st-btn-secondary-border": `1px solid ${c.border}`,
    },
  };
}
