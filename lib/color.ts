export type RgbColor = { r: number; g: number; b: number };

/** Parses `#RGB` / `#RRGGBB` into 0–255 channels; `null` on anything else. */
export function parseHexColor(input: string): RgbColor | null {
  const hex = input.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    const [r, g, b] = hex.split("");
    return {
      r: Number.parseInt(r + r, 16),
      g: Number.parseInt(g + g, 16),
      b: Number.parseInt(b + b, 16),
    };
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

/** Normalizes to an uppercase `#RRGGBB`; `null` when input is not valid hex. */
export function normalizeHexColor(input: string): string | null {
  const rgb = parseHexColor(input);
  if (!rgb) return null;
  const toHex = (channel: number) => channel.toString(16).padStart(2, "0");
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`.toUpperCase();
}

/** YIQ perceived brightness — values at or above 150 read as a light swatch. */
export function isLightHexColor(hex: string): boolean {
  const rgb = parseHexColor(hex);
  if (!rgb) return false;
  return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 >= 150;
}

/** WCAG relative luminance (0..1); invalid hex resolves to 0. */
export function relativeLuminance(hex: string): number {
  const rgb = parseHexColor(hex);
  if (!rgb) return 0;
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(rgb.r) + 0.7152 * lin(rgb.g) + 0.0722 * lin(rgb.b);
}

/** WCAG contrast ratio, 1..21; invalid input resolves to 1 (no contrast). */
export function contrastRatio(hex1: string, hex2: string): number {
  const a = relativeLuminance(hex1);
  const b = relativeLuminance(hex2);
  const [hi, lo] = a >= b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** Mixes `top` at `weightPercent` (0..100) over `bottom`; returns `#RRGGBB` — the equivalent opaque color behind a translucent glass surface. */
export function mixHex(top: string, bottom: string, weightPercent: number): string {
  const t = parseHexColor(top);
  const b = parseHexColor(bottom);
  if (!t || !b) return normalizeHexColor(bottom) ?? "#000000";
  const w = Math.max(0, Math.min(100, weightPercent)) / 100;
  const ch = (x: number, y: number) => Math.round(x * w + y * (1 - w));
  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(ch(t.r, b.r))}${toHex(ch(t.g, b.g))}${toHex(ch(t.b, b.b))}`.toUpperCase();
}
