// Zero-dependency hex/oklch(...) literal <-> OKLCH conversion. Matrices are
// Björn Ottosson's standard OKLab constants — the same ones browsers use for
// CSS `oklch()`, so results match what a browser would compute.

export type Oklch = { l: number; c: number; h: number | null };

function srgbToLinear(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(c: number): number {
  const clamped = Math.min(1, Math.max(0, c));
  const s = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
  return Math.round(Math.min(1, Math.max(0, s)) * 255);
}

function parseHex(input: string): { r: number; g: number; b: number } | null {
  const hex = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    const [r, g, b] = hex.split("");
    return { r: Number.parseInt(r + r, 16), g: Number.parseInt(g + g, 16), b: Number.parseInt(b + b, 16) };
  }
  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
    };
  }
  return null;
}

/** linear sRGB (0..1) -> OKLCH. */
function linearRgbToOklch(r: number, g: number, b: number): Oklch {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.7936177850 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.4285922050 * m_ + 0.4505937099 * s_;
  const bb = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.8086757660 * s_;

  const C = Math.sqrt(a * a + bb * bb);
  // Below this, hue is numerically unstable for a color that reads as gray.
  if (C < 1e-4) return { l: L, c: C, h: null };
  const h = ((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360;
  return { l: L, c: C, h };
}

const OKLCH_LITERAL =
  /^oklch\(\s*([\d.]+)(%)?\s+([\d.]+)\s+(none|[\d.]+)\s*(?:\/\s*[\d.]+%?\s*)?\)$/i;

/**
 * Parses a `#rgb`/`#rrggbb` hex color, or an `oklch(L C H)` CSS literal
 * (design-system source data uses both), into OKLCH. Returns `null` when
 * neither form matches — callers must supply their own fallback.
 */
export function hexToOklch(input: string): Oklch | null {
  const hex = parseHex(input);
  if (hex) {
    return linearRgbToOklch(srgbToLinear(hex.r), srgbToLinear(hex.g), srgbToLinear(hex.b));
  }

  const match = input.trim().match(OKLCH_LITERAL);
  if (!match) return null;
  const [, lRaw, lPercent, cRaw, hRaw] = match;
  const l = lPercent ? Number.parseFloat(lRaw) / 100 : Number.parseFloat(lRaw);
  const c = Number.parseFloat(cRaw);
  const h = hRaw.toLowerCase() === "none" ? null : Number.parseFloat(hRaw) % 360;
  return { l, c, h: c < 1e-4 ? null : h };
}

/** Formats OKLCH components as a `oklch(0.62 0.14 245)` CSS literal. */
export function formatOklch(l: number, c: number, h: number): string {
  return `oklch(${l.toFixed(2)} ${c.toFixed(2)} ${Math.round(h)})`;
}

/**
 * Inverse of {@link hexToOklch} for a fully opaque color — OKLCH -> `#rrggbb`.
 * Not required by the theme-kit compose pipeline (which only ever writes
 * oklch() literals), but tests need it to compute WCAG contrast against
 * derived chart colors via `lib/color.ts`'s hex-only `contrastRatio`.
 */
export function oklchToHex(l: number, c: number, h: number): string {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b;

  const ll = l_ ** 3;
  const mm = m_ ** 3;
  const ss = s_ ** 3;

  const r = 4.0767416621 * ll - 3.3077115913 * mm + 0.2309699292 * ss;
  const g = -1.2684380046 * ll + 2.6097574011 * mm - 0.3413193965 * ss;
  const b2 = -0.0041960863 * ll - 0.7034186147 * mm + 1.7076147010 * ss;

  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(linearToSrgb(r))}${toHex(linearToSrgb(g))}${toHex(linearToSrgb(b2))}`.toUpperCase();
}
