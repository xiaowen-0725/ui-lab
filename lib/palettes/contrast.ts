import { contrastRatio } from "@/lib/color";
import type { PaletteColors, PaletteEntry } from "./types";

export type PaletteContrastPairId =
  | "text-on-background"
  | "muted-on-background"
  | "text-on-surface"
  | "text-on-primary";

export type PaletteContrastResult = {
  id: PaletteContrastPairId;
  foregroundRole: keyof PaletteColors;
  backgroundRole: keyof PaletteColors;
  foreground: string;
  background: string;
  ratio: number;
  aaNormal: boolean;
  aaLarge: boolean;
  aaaNormal: boolean;
  aaaLarge: boolean;
};

const CONTRAST_PAIRS: readonly {
  id: PaletteContrastPairId;
  foregroundRole: keyof PaletteColors;
  backgroundRole: keyof PaletteColors;
}[] = [
  { id: "text-on-background", foregroundRole: "text", backgroundRole: "bg" },
  { id: "muted-on-background", foregroundRole: "muted", backgroundRole: "bg" },
  { id: "text-on-surface", foregroundRole: "text", backgroundRole: "surface" },
  {
    id: "text-on-primary",
    foregroundRole: "primaryFg",
    backgroundRole: "primary",
  },
];

export function paletteContrastReport(
  palette: PaletteEntry,
): PaletteContrastResult[] {
  return CONTRAST_PAIRS.map(({ id, foregroundRole, backgroundRole }) => {
    const foreground = palette.colors[foregroundRole];
    const background = palette.colors[backgroundRole];
    const ratio = contrastRatio(foreground, background);

    return {
      id,
      foregroundRole,
      backgroundRole,
      foreground,
      background,
      ratio,
      aaNormal: ratio >= 4.5,
      aaLarge: ratio >= 3,
      aaaNormal: ratio >= 7,
      aaaLarge: ratio >= 4.5,
    };
  });
}
