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
