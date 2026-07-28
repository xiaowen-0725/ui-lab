import type { JsonObject } from "@/lib/contracts/canonical-json";
import type { ApplicationProfile } from "@/lib/recipes";

export type SystemPresetStatus = "approved";
export type ReferencePackStatus = "review" | "approved";
export type ReferenceCaseStatus = "planned";
export type ReferenceTheme = "light" | "dark";
export type ReferenceViewport = "wide" | "collapse" | "narrow";
export type AssetKind = "font" | "icon" | "image" | "illustration";
export type AssetSource = "system-preset" | "recipe";
export type SafeOverrideKey =
  | "branding"
  | "productCopy"
  | "navigation"
  | "locale"
  | "semanticStateColors"
  | "platformChrome";

export type TypographyScaleStep = {
  sizePx: number;
  lineHeight: number;
  letterSpacingEm: number;
};

export type SystemPresetLockedVisual = {
  typography: {
    families: { body: string; display: string; mono: string };
    assetIds: string[];
    weights: number[];
    scale: {
      display: TypographyScaleStep;
      headline: TypographyScaleStep;
      title: TypographyScaleStep;
      body: TypographyScaleStep;
      bodySm: TypographyScaleStep;
      caption: TypographyScaleStep;
    };
    numerals: {
      family: "mono";
      variant: "tabular-nums";
      usage: string[];
    };
    fallbackPolicy: string;
  };
  icons: {
    family: string;
    package: string;
    sizesPx: number[];
    strokeWidthPx: number;
    linecap: "round";
    linejoin: "round";
    opticalSizing: string;
    defaultStyle: string;
    filledUsage: string;
    statusTreatment: string;
    forbiddenSubstitutions: string[];
  };
  surfaces: {
    roles: {
      canvas: string;
      sidebar: string;
      header: string;
      task: string;
      composer: string;
      panel: string;
      popover: string;
      overlay: string;
    };
    hierarchy: string[];
    componentAnatomy: {
      shell: string;
      sidebar: string;
      task: string;
      composer: string;
      panel: string;
      overlay: string;
    };
    maxBlurPx: number;
    translucencyRule: string;
  };
  selection: {
    backgroundToken: string;
    foregroundToken: string;
    iconToken: string;
    hoverToken: string;
    focusRingToken: string;
    treatment: string;
    disabledOpacity: number;
  };
  density: {
    baseUnitPx: number;
    spacingScalePx: number[];
    navigationRowPx: number;
    toolbarPx: number;
    toolbarSmallPx: number;
    panePx: number;
    composerSingleLinePx: number;
    threadContentMaxWidth: string;
  };
  geometry: {
    radiusScalePx: number[];
    controlRadiusPx: number;
    panelRadiusPx: number;
    composerRadiusPx: number;
    fullRadiusPx: number;
    borderWidthsPx: number[];
  };
  shadows: {
    levels: {
      hairline: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      "2xl": string;
    };
    translucencyRule: string;
    maxBlurPx: number;
  };
  motion: {
    durationsMs: {
      press: number;
      quick: number;
      standard: number;
      deliberate: number;
    };
    curves: { standard: string; snappy: string };
    properties: Array<
      "transform" | "opacity" | "color" | "background-color"
    >;
    reducedMotion: {
      removeTransform: boolean;
      preserveOpacity: boolean;
    };
  };
  responsive: {
    wide: { minWidthPx: number; behavior: string };
    collapse: {
      minWidthPx: number;
      maxWidthPx: number;
      behavior: string;
    };
    narrow: { maxWidthPx: number; behavior: string };
    nativeChromePolicy: string;
  };
};

export type SystemPresetFixturePayload = JsonObject & {
  id: string;
  version: number;
  deterministic: true;
  capturePreconditions: string[];
  caseSelectors: Record<string, string[]>;
};

export type SystemPresetCapability = {
  slug: string;
  name: string;
  nameZh: string;
  required: boolean;
  components: readonly string[];
};

export type SystemPresetAsset = {
  kind: AssetKind;
  id: string;
  requirement: string;
  required: boolean;
};

export type ResolvedAsset = {
  kind: AssetKind;
  id?: string;
  requirement: string;
  required: boolean;
  source: AssetSource;
};

export type SystemPresetReferenceCase = {
  id: string;
  viewport: ReferenceViewport;
  size: string;
  scale: number;
  theme: ReferenceTheme;
  states: readonly string[];
  surfaces: readonly string[];
  fixtureId: string;
  keyboardFocus: boolean;
  reducedMotion: boolean;
  status: ReferenceCaseStatus;
  fontLoadingState: string;
  captureTiming: string;
  calibrationSourceIds: readonly string[];
  goldenCapture: null;
};

export type SystemPreset = {
  schemaVersion: 1;
  slug: string;
  version: number;
  status: SystemPresetStatus;
  approvedAt: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  description: string;
  descriptionZh: string;
  profiles: readonly ApplicationProfile[];
  themeKit: { slug: string; contractHash: string };
  compatibleRecipes: readonly string[];
  capabilities: readonly SystemPresetCapability[];
  componentAllowlist: readonly string[];
  safeOverrideKeys: readonly SafeOverrideKey[];
  lockedVisual: SystemPresetLockedVisual;
  assets: readonly SystemPresetAsset[];
  referencePack: {
    id: string;
    status: ReferencePackStatus;
    contractHash: string;
    fixture: {
      id: string;
      version: number;
      path: string;
      fixtureHash: string;
      payload: SystemPresetFixturePayload;
    };
    cases: readonly SystemPresetReferenceCase[];
  };
  required: readonly string[];
  forbidden: readonly string[];
};
