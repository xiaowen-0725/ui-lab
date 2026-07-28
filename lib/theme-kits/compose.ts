// Builds ThemeKit values from the three source shapes UI Lab already has:
// the baseline shadcn/wb defaults, a design-system entry, or a studio preset.

import {
  curveCssValue,
  DENSITIES,
  durationCssValue,
  FONT_PAIRS,
  MOTION_CURVES,
  MOTION_DURATIONS,
  RADII,
  SHADOWS,
  SPACING_SCALE,
  TYPE_SCALE,
} from "@/lib/atoms";
import { graphiteDesignSystem } from "@/lib/layouts/design-systems";
import type { DesignSystemEntry } from "@/lib/layouts/types";
import { WB_TOKENS_DARK, WB_TOKENS_LIGHT } from "@/lib/registry-wb-tokens";
import { composeStudioVariables } from "@/lib/studio/export";
import { normalizeStudioConfig } from "@/lib/studio/presets";
import type { StudioStarterPreset } from "@/lib/studio/types";
import { BASE_DARK, BASE_LIGHT } from "@/lib/themes";
import { deriveChartColors } from "./charts";
import type { ThemeKit, ThemeMode, ThemeTokenSet } from "./types";

/**
 * `Array.find` narrowed to non-optional — every call site below looks up a
 * hardcoded slug that is guaranteed to exist in its (also hardcoded) atom
 * list, so this only replaces a `!` non-null assertion with a clearer error
 * message if that invariant is ever broken.
 */
function findOrThrow<T extends { slug: string }>(list: readonly T[], slug: string): T {
  const found = list.find((item) => item.slug === slug);
  if (!found) throw new Error(`Expected atom with slug "${slug}" to exist.`);
  return found;
}

function buildStatics(fonts: { body: string; display: string; mono: string }): Record<
  string,
  string
> {
  const statics: Record<string, string> = {};

  for (const curve of MOTION_CURVES) {
    statics[`ease-${curve.slug}`] = curveCssValue(curve.value);
  }
  // Aliases matching THEME_CSS's own naming (--ease-out / --ease-in-out).
  statics["ease-out"] = curveCssValue(findOrThrow(MOTION_CURVES, "swift-out").value);
  statics["ease-in-out"] = curveCssValue(findOrThrow(MOTION_CURVES, "push-pull").value);

  for (const duration of MOTION_DURATIONS) {
    statics[`ease-duration-${duration.slug}`] = durationCssValue(duration.milliseconds);
  }

  for (const radius of RADII) {
    statics[`radius-${radius.slug}`] = radius.value;
  }
  // "lg" is documented as "The default radius for cards" — the shared bare default.
  statics.radius = findOrThrow(RADII, "lg").value;

  for (const step of SPACING_SCALE) {
    statics[`space-${step.slug}`] = `${step.pixels}px`;
  }
  // "standard" is documented as "The default density for general product
  // interfaces" — used for the bare space/space-row/space-padding trio.
  // Studio-preset kits override these three with the preset's own density.
  const standardDensity = findOrThrow(DENSITIES, "standard");
  statics.space = `${standardDensity.padding}px`;
  statics["space-row"] = `${standardDensity.rowHeight}px`;
  statics["space-padding"] = `${standardDensity.padding}px`;

  for (const step of TYPE_SCALE) {
    statics[`text-${step.slug}`] = step.fontSize;
    statics[`text-${step.slug}-line-height`] = `${step.lineHeight}`;
    statics[`text-${step.slug}-letter-spacing`] = step.letterSpacing;
  }

  statics["font-sans"] = fonts.body;
  statics["font-display"] = fonts.display;
  statics["font-mono"] = fonts.mono;

  return statics;
}

function buildExtra(mode: ThemeMode, shadowOverride?: string): Record<string, string> {
  const hairline = findOrThrow(SHADOWS, "hairline");
  const raised = findOrThrow(SHADOWS, "raised");
  const floating = findOrThrow(SHADOWS, "floating");
  return {
    "shadow-hairline": hairline[mode],
    "shadow-raised": raised[mode],
    "shadow-floating": floating[mode],
    // "raised" ("Cards resting just above the page") is the shared bare
    // default, same reasoning as radius/space above. Studio-preset kits
    // override this with the preset's own chosen elevation.
    shadow: shadowOverride ?? raised[mode],
  };
}

function deriveShadcnFromSite(
  site: Record<string, string>,
  accent: string,
  accentFg: string,
): Record<string, string> {
  const take = (key: string) => site[key] ?? "";
  return {
    background: take("background"),
    foreground: take("foreground"),
    card: take("card"),
    "card-foreground": take("foreground"),
    popover: take("card"),
    "popover-foreground": take("foreground"),
    primary: accent,
    "primary-foreground": accentFg,
    secondary: take("card"),
    "secondary-foreground": site["secondary-foreground"] ?? take("foreground"),
    muted: take("card"),
    "muted-foreground": take("muted-foreground"),
    accent,
    "accent-foreground": accentFg,
    destructive: take("danger"),
    border: take("border"),
    input: take("border"),
    ring: take("border-strong"),
    "border-strong": take("border-strong"),
    success: take("success"),
    warning: take("warning"),
    danger: take("danger"),
    "faint-foreground": take("faint-foreground"),
  };
}

function baselineTokenSet(mode: ThemeMode): ThemeTokenSet {
  const base = mode === "light" ? BASE_LIGHT : BASE_DARK;
  const wbSource = mode === "light" ? WB_TOKENS_LIGHT : WB_TOKENS_DARK;
  const accent = wbSource["wb-accent"];

  const shadcn: Record<string, string> = {};
  for (const [key, value] of Object.entries(base)) {
    shadcn[key.replace(/^--/, "")] = value;
  }
  // UI Lab extensions not present in BASE_LIGHT/DARK: reuse the matching
  // per-mode wb-* semantic colors (already correct literal values), and
  // derive faint-foreground as a step further toward the background than
  // muted-foreground already is — same color-mix idiom used elsewhere in
  // this codebase (lib/palettes/css.ts, lib/layouts/skin.ts).
  shadcn["border-strong"] = wbSource["wb-border-strong"];
  shadcn.success = wbSource["wb-success"];
  shadcn.warning = wbSource["wb-warning"];
  shadcn.danger = wbSource["wb-danger"];
  shadcn["faint-foreground"] =
    `color-mix(in oklab, ${base["--muted-foreground"]} 55%, ${base["--background"]} 45%)`;

  return {
    shadcn,
    wb: { ...wbSource },
    charts: deriveChartColors(accent, mode),
    extra: buildExtra(mode),
  };
}

export function baselineKit(): ThemeKit {
  const fontPair = findOrThrow(FONT_PAIRS, "system-neutral");
  const fonts = { body: fontPair.body, display: fontPair.display, mono: fontPair.mono };
  return {
    slug: "graphite",
    name: graphiteDesignSystem.name,
    nameZh: graphiteDesignSystem.nameZh,
    description: graphiteDesignSystem.description,
    descriptionZh: graphiteDesignSystem.descriptionZh,
    source: "baseline",
    modes: ["light", "dark"],
    light: baselineTokenSet("light"),
    dark: baselineTokenSet("dark"),
    statics: buildStatics(fonts),
    fonts,
  };
}

export function kitFromDesignSystem(entry: DesignSystemEntry): ThemeKit | null {
  const { scheme, vars, siteVars, fonts: skinFonts } = entry.skin;
  if (scheme === "auto" || Object.keys(vars).length === 0) return null;
  const mode: ThemeMode = scheme;

  const wb: Record<string, string> = {};
  for (const [key, value] of Object.entries(vars)) {
    wb[key.replace(/^--/, "")] = value;
  }
  const site: Record<string, string> = {};
  for (const [key, value] of Object.entries(siteVars)) {
    site[key.replace(/^--/, "")] = value;
  }

  const accent = wb["wb-accent"];
  const accentFg = wb["wb-accent-fg"];
  const fallback = findOrThrow(FONT_PAIRS, "system-neutral");
  const fonts = {
    body: skinFonts?.body ?? fallback.body,
    display: skinFonts?.display ?? fallback.display,
    mono: skinFonts?.mono ?? fallback.mono,
  };

  const tokenSet: ThemeTokenSet = {
    shadcn: deriveShadcnFromSite(site, accent, accentFg),
    wb,
    charts: deriveChartColors(accent, mode),
    extra: buildExtra(mode),
  };

  return {
    slug: entry.slug,
    name: entry.name,
    nameZh: entry.nameZh,
    description: entry.description,
    descriptionZh: entry.descriptionZh,
    source: "design-system",
    modes: [mode],
    light: mode === "light" ? tokenSet : undefined,
    dark: mode === "dark" ? tokenSet : undefined,
    statics: buildStatics(fonts),
    fonts,
  };
}

const CANONICAL_WB_KEYS = new Set(Object.keys(WB_TOKENS_LIGHT));
const SITE_KEYS = new Set([
  "background",
  "foreground",
  "card",
  "secondary-foreground",
  "muted-foreground",
  "faint-foreground",
  "border",
  "border-strong",
  "danger",
  "success",
  "warning",
]);
const STATIC_OVERRIDE_KEYS = new Set([
  "radius",
  "space",
  "space-row",
  "space-padding",
  "font-display",
  "font-sans",
  "font-mono",
]);
// Note: "shadow" is deliberately NOT in STATIC_OVERRIDE_KEYS — box-shadow
// values differ between light/dark per lib/atoms SHADOWS, so it's
// state-dependent and belongs in `extra`, not `statics` (matches the
// ThemeTokenSet.extra doc comment: "state-dependent, non-color, e.g. shadow-*").

export function kitFromStudioPreset(preset: StudioStarterPreset): ThemeKit {
  const normalized = normalizeStudioConfig(preset.config);
  const mode: ThemeMode = normalized.scheme;
  const variables = composeStudioVariables(preset.config);

  const wb: Record<string, string> = {};
  const site: Record<string, string> = {};
  const staticOverride: Record<string, string> = {};
  const extraOverride: Record<string, string> = {};

  for (const { name, value } of variables) {
    const key = name.replace(/^--/, "");
    if (STATIC_OVERRIDE_KEYS.has(key)) {
      staticOverride[key] = value;
    } else if (SITE_KEYS.has(key)) {
      site[key] = value;
    } else if (CANONICAL_WB_KEYS.has(key)) {
      wb[key] = value;
    } else {
      // "shadow" (state-dependent, see note above), plus studio-only extras
      // wb-surface-alpha / wb-blur that aren't part of the 43-key wb contract.
      extraOverride[key] = value;
    }
  }

  const accent = wb["wb-accent"];
  const accentFg = wb["wb-accent-fg"];
  const fonts = {
    body: staticOverride["font-sans"],
    display: staticOverride["font-display"],
    mono: staticOverride["font-mono"],
  };

  const tokenSet: ThemeTokenSet = {
    shadcn: deriveShadcnFromSite(site, accent, accentFg),
    wb,
    charts: deriveChartColors(accent, mode),
    extra: { ...buildExtra(mode, extraOverride.shadow), ...extraOverride },
  };

  return {
    slug: preset.key,
    name: preset.name,
    nameZh: preset.nameZh,
    // StudioStarterPreset carries no description; matches the existing
    // studioConfigToEntry() precedent in lib/studio/skin.ts (empty strings).
    description: "",
    descriptionZh: "",
    source: "studio-preset",
    modes: [mode],
    light: mode === "light" ? tokenSet : undefined,
    dark: mode === "dark" ? tokenSet : undefined,
    statics: { ...buildStatics(fonts), ...staticOverride },
    fonts,
  };
}
