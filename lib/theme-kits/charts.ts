// Derives 6 categorical chart colors from a single accent color.

import { formatOklch, hexToOklch } from "./oklch";
import type { ThemeMode } from "./types";

const HUE_OFFSETS = [0, 60, 150, 210, 285, 330] as const;
const L_LIGHT = [0.55, 0.68, 0.52, 0.7, 0.58, 0.65] as const;
const L_DARK = [0.52, 0.64, 0.5, 0.66, 0.55, 0.62] as const;
const NEUTRAL_HUE = 195;
const MIN_C = 0.11;
const MAX_C = 0.17;

function buildSequence(
  baseHue: number,
  baseChroma: number,
  mode: ThemeMode,
): Record<string, string> {
  const ladder = mode === "light" ? L_LIGHT : L_DARK;
  const c = Math.min(Math.max(baseChroma, MIN_C), MAX_C);
  const result: Record<string, string> = {};
  HUE_OFFSETS.forEach((offset, i) => {
    const h = (baseHue + offset) % 360;
    result[`chart-${i + 1}`] = formatOklch(ladder[i], c, h);
  });
  return result;
}

/**
 * Derives 6 categorical chart colors (`chart-1`..`chart-6`) from a kit's
 * accent color: fixed hue offsets + alternating lightness bands + clamped
 * chroma, aligned with standard dataviz categorical-palette practice
 * (consistent lightness/chroma bands with a fixed hue rotation order aid
 * colorblind-safe differentiation).
 */
export function deriveChartColors(accent: string, mode: ThemeMode): Record<string, string> {
  const parsed = hexToOklch(accent);
  // Inlined (rather than hoisted to an `isNearGray` boolean) so TS narrows
  // `parsed.h` to `number` below — same condition either way.
  if (!parsed || parsed.h === null || parsed.c < 0.06) {
    // Fixed neutral hue (195) for accents too muted/gray to carry 6 distinct
    // hues meaningfully — same aligns-with-dataviz formula (lightness bands +
    // fixed hue rotation order aid CVD accessibility), just with a pinned hue.
    return buildSequence(NEUTRAL_HUE, MIN_C, mode);
  }
  return buildSequence(parsed.h, parsed.c, mode);
}
