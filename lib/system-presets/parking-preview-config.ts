const DEFAULT_CAPABILITIES = [
  "tasks",
  "artifact",
  "board",
  "connectors",
  "settings",
] as const;
const PREVIEW_QUERY_MAX_LENGTH = 4_096;
const PREVIEW_TEXT_MAX_LENGTH = 512;
const COLOR_KEYS = ["success", "warning", "danger", "destructive", "info"] as const;

export type ParkingPreviewCapability = (typeof DEFAULT_CAPABILITIES)[number];
export type ParkingPreviewSemanticColor = (typeof COLOR_KEYS)[number];

/** Browser-only projection of safe Assembly Order fields for an iframe preview. */
export type ParkingPreviewConfiguration = {
  productName: string;
  /** Preserves intent when a query explicitly uses the default product name. */
  productNameOverride?: boolean;
  logoReference: string;
  composerPlaceholder: string;
  activeLocale: string;
  platformChrome: "native" | "web";
  semanticStateColors: Partial<Record<ParkingPreviewSemanticColor, string>>;
  capabilitySlugs: readonly ParkingPreviewCapability[];
};

export const DEFAULT_PARKING_PREVIEW_CONFIGURATION: Readonly<ParkingPreviewConfiguration> =
  Object.freeze({
    productName: "Parking Ops",
    productNameOverride: false,
    logoReference: "",
    composerPlaceholder: "描述下一步停车运营核验…",
    activeLocale: "zh-CN",
    platformChrome: "native",
    semanticStateColors: Object.freeze({}),
    capabilitySlugs: Object.freeze([...DEFAULT_CAPABILITIES]),
  });

function previewText(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= PREVIEW_TEXT_MAX_LENGTH
    ? trimmed
    : fallback;
}

function previewLocale(value: string | null): string {
  if (!value || value.length > 64) {
    return DEFAULT_PARKING_PREVIEW_CONFIGURATION.activeLocale;
  }
  try {
    return (
      Intl.getCanonicalLocales(value)[0] ??
      DEFAULT_PARKING_PREVIEW_CONFIGURATION.activeLocale
    );
  } catch {
    return DEFAULT_PARKING_PREVIEW_CONFIGURATION.activeLocale;
  }
}

function isExplicitPreviewColor(value: string): boolean {
  if (/^#(?:[a-f\d]{3}|[a-f\d]{4}|[a-f\d]{6}|[a-f\d]{8})$/i.test(value)) {
    return true;
  }
  return /^(?:rgb|rgba|hsl|hsla|oklch)\((?:[\d.%+\-a-z]+[\s,/]*)+\)$/i.test(
    value,
  );
}

function previewCapabilities(value: string | null): ParkingPreviewCapability[] {
  if (!value) return [...DEFAULT_CAPABILITIES];
  const values = value.split(",");
  if (
    values.length === 0 ||
    values.some(
      (item) => !DEFAULT_CAPABILITIES.includes(item as ParkingPreviewCapability),
    ) ||
    new Set(values).size !== values.length
  ) {
    return [...DEFAULT_CAPABILITIES];
  }
  return values as ParkingPreviewCapability[];
}

function defaultConfiguration(): ParkingPreviewConfiguration {
  return {
    ...DEFAULT_PARKING_PREVIEW_CONFIGURATION,
    capabilitySlugs: [...DEFAULT_CAPABILITIES],
    semanticStateColors: {},
  };
}

/** Encodes bounded, explicitly safe values in a stable query string. */
export function buildParkingPreviewSearchParams(
  configuration: Partial<ParkingPreviewConfiguration> = {},
): URLSearchParams {
  const current: ParkingPreviewConfiguration = {
    productName: previewText(
      configuration.productName,
      DEFAULT_PARKING_PREVIEW_CONFIGURATION.productName,
    ),
    productNameOverride: configuration.productNameOverride,
    logoReference: previewText(configuration.logoReference, ""),
    composerPlaceholder: previewText(
      configuration.composerPlaceholder,
      DEFAULT_PARKING_PREVIEW_CONFIGURATION.composerPlaceholder,
    ),
    activeLocale: previewLocale(configuration.activeLocale ?? null),
    platformChrome:
      configuration.platformChrome === "web"
        ? "web"
        : DEFAULT_PARKING_PREVIEW_CONFIGURATION.platformChrome,
    capabilitySlugs: previewCapabilities(
      configuration.capabilitySlugs?.join(",") ?? null,
    ),
    semanticStateColors: Object.fromEntries(
      COLOR_KEYS.flatMap((key) => {
        const color = configuration.semanticStateColors?.[key];
        return typeof color === "string" && isExplicitPreviewColor(color)
          ? [[key, color]]
          : [];
      }),
    ) as ParkingPreviewConfiguration["semanticStateColors"],
  };
  const params = new URLSearchParams();
  if (current.productName !== DEFAULT_PARKING_PREVIEW_CONFIGURATION.productName) {
    params.set("productName", current.productName);
  }
  if (current.logoReference) params.set("logoReference", current.logoReference);
  if (
    current.composerPlaceholder !==
    DEFAULT_PARKING_PREVIEW_CONFIGURATION.composerPlaceholder
  ) {
    params.set("composerPlaceholder", current.composerPlaceholder);
  }
  if (current.activeLocale !== DEFAULT_PARKING_PREVIEW_CONFIGURATION.activeLocale) {
    params.set("locale", current.activeLocale);
  }
  if (current.platformChrome !== DEFAULT_PARKING_PREVIEW_CONFIGURATION.platformChrome) {
    params.set("platformChrome", current.platformChrome);
  }
  for (const key of COLOR_KEYS) {
    const color = current.semanticStateColors[key];
    if (color) params.set(`color.${key}`, color);
  }
  if (
    current.capabilitySlugs.join(",") !==
    DEFAULT_PARKING_PREVIEW_CONFIGURATION.capabilitySlugs.join(",")
  ) {
    params.set("capabilities", current.capabilitySlugs.join(","));
  }
  return params.toString().length <= PREVIEW_QUERY_MAX_LENGTH
    ? params
    : new URLSearchParams();
}

/** Parses only bounded, explicit values; invalid values fall back to defaults. */
export function parseParkingPreviewSearchParams(
  input: URLSearchParams | Record<string, string | string[] | undefined>,
): ParkingPreviewConfiguration {
  const params =
    input instanceof URLSearchParams
      ? input
      : new URLSearchParams(
          Object.entries(input).flatMap(([key, value]) =>
            typeof value === "string" ? [[key, value]] : [],
          ),
        );
  if (params.toString().length > PREVIEW_QUERY_MAX_LENGTH) {
    return defaultConfiguration();
  }
  const semanticStateColors: ParkingPreviewConfiguration["semanticStateColors"] = {};
  for (const key of COLOR_KEYS) {
    const value = params.get(`color.${key}`)?.trim();
    if (value && isExplicitPreviewColor(value)) semanticStateColors[key] = value;
  }
  return {
    productName: previewText(
      params.get("productName"),
      DEFAULT_PARKING_PREVIEW_CONFIGURATION.productName,
    ),
    productNameOverride: params.has("productName"),
    logoReference: previewText(params.get("logoReference"), ""),
    composerPlaceholder: previewText(
      params.get("composerPlaceholder"),
      DEFAULT_PARKING_PREVIEW_CONFIGURATION.composerPlaceholder,
    ),
    activeLocale: previewLocale(params.get("locale")),
    platformChrome:
      params.get("platformChrome") === "web"
        ? "web"
        : DEFAULT_PARKING_PREVIEW_CONFIGURATION.platformChrome,
    semanticStateColors,
    capabilitySlugs: previewCapabilities(params.get("capabilities")),
  };
}
