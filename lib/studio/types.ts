import type {
  DensityAtom,
  FontPairAtom,
  RadiusAtom,
  ShadowAtom,
} from "@/lib/atoms";

export type StudioScheme = "light" | "dark";

export type StudioConfig = {
  scheme: StudioScheme;
  accent: string;
  surface: string;
  radius: string;
  elevation: string;
  fontPairing: string;
  density: string;
  name?: string;
};

export type StudioSurfacePreset = {
  key: string;
  scheme: StudioScheme;
  name: string;
  nameZh: string;
  canvas: string;
  surface: string;
  raised: string;
  ink: string;
  hairline: string;
};

export type StudioStarterPreset = {
  key: string;
  name: string;
  nameZh: string;
  config: StudioConfig;
};

export type StudioResolvedTokens = {
  surface: StudioSurfacePreset;
  radius: RadiusAtom;
  elevation: ShadowAtom;
  fontPairing: FontPairAtom;
  density: DensityAtom;
};

export type StudioExportBundle = {
  css: string;
  tailwind: string;
  designMd: string;
};
