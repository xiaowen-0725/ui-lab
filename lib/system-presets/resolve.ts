import {
  catalogContractHash,
  catalogSnapshotContractHash,
} from "@/lib/catalog-contract";
import type { CatalogItem } from "@/lib/catalog";
import {
  canonicalStringify,
  type JsonObject,
} from "@/lib/contracts/canonical-json";
import type { ApplicationProfile } from "@/lib/recipes";
import { systemPresetContractHash } from "./index";
import { parseSystemPreset } from "./schema";
import type { ResolvedAsset } from "./types";

const SEMANTIC_STATE_COLOR_KEYS = [
  "success",
  "warning",
  "danger",
  "destructive",
  "info",
] as const;

function freeze<T>(value: T): Readonly<T> {
  const copy = JSON.parse(canonicalStringify(value)) as T;
  const visit = (item: unknown) => {
    if (item && typeof item === "object") {
      Object.values(item).forEach(visit);
      Object.freeze(item);
    }
  };
  visit(copy);
  return copy;
}

function invalidSafeOverride(key: string): never {
  throw new Error(`Invalid safe override "${key}".`);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim() !== "";
}

function assertUniqueNonEmptyStrings(value: unknown, key: string): void {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((item) => !isNonEmptyString(item)) ||
    new Set(value).size !== value.length
  ) {
    invalidSafeOverride(key);
  }
}

function assertProductCopy(value: unknown, key: string): void {
  if (!isPlainObject(value) || Object.keys(value).length === 0) {
    invalidSafeOverride(key);
  }
  for (const [nestedKey, nestedValue] of Object.entries(value)) {
    if (!isNonEmptyString(nestedKey)) invalidSafeOverride(key);
    if (typeof nestedValue === "string") {
      if (!isNonEmptyString(nestedValue)) invalidSafeOverride(key);
      continue;
    }
    assertProductCopy(nestedValue, key);
  }
}

function numericToken(value: string): number | undefined {
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(value)) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function rangedToken(
  value: string,
  minimum: number,
  maximum: number,
  percentageAllowed: boolean,
): boolean {
  const percentage = value.endsWith("%");
  if (percentage && !percentageAllowed) return false;
  const parsed = numericToken(percentage ? value.slice(0, -1) : value);
  return parsed !== undefined && parsed >= minimum && parsed <= maximum;
}

function alphaToken(value: string | undefined): boolean {
  if (value === undefined) return true;
  return value.endsWith("%")
    ? rangedToken(value, 0, 100, true)
    : rangedToken(value, 0, 1, false);
}

function functionalParts(
  body: string,
  legacyAlpha: boolean,
): { channels: string[]; alpha?: string } | undefined {
  if (body.includes(",")) {
    if (body.includes("/")) return undefined;
    const parts = body.split(",").map((item) => item.trim());
    const expected = legacyAlpha ? 4 : 3;
    if (parts.length !== expected || parts.some((item) => item === "")) {
      return undefined;
    }
    return {
      channels: parts.slice(0, 3),
      ...(legacyAlpha ? { alpha: parts[3] } : {}),
    };
  }
  const slashParts = body.split("/").map((item) => item.trim());
  if (slashParts.length > 2 || slashParts.some((item) => item === "")) {
    return undefined;
  }
  const channels = slashParts[0].split(/\s+/);
  if (channels.length !== 3) return undefined;
  return { channels, ...(slashParts[1] ? { alpha: slashParts[1] } : {}) };
}

function hueToken(value: string): boolean {
  const match = /^([+-]?(?:\d+(?:\.\d*)?|\.\d+))(deg|grad|rad|turn)?$/.exec(
    value,
  );
  return Boolean(match && Number.isFinite(Number(match[1])));
}

function isRgbColor(name: string, body: string): boolean {
  const parts = functionalParts(body, name === "rgba");
  if (!parts || !alphaToken(parts.alpha)) return false;
  const percentages = parts.channels.map((channel) => channel.endsWith("%"));
  if (new Set(percentages).size !== 1) return false;
  return parts.channels.every((channel) =>
    percentages[0]
      ? rangedToken(channel, 0, 100, true)
      : rangedToken(channel, 0, 255, false),
  );
}

function isHslColor(name: string, body: string): boolean {
  const parts = functionalParts(body, name === "hsla");
  if (!parts || !alphaToken(parts.alpha)) return false;
  return (
    hueToken(parts.channels[0]) &&
    parts.channels[1].endsWith("%") &&
    rangedToken(parts.channels[1], 0, 100, true) &&
    parts.channels[2].endsWith("%") &&
    rangedToken(parts.channels[2], 0, 100, true)
  );
}

function isOklchColor(body: string): boolean {
  const parts = functionalParts(body, false);
  if (!parts || !alphaToken(parts.alpha)) return false;
  const [lightness, chroma, hue] = parts.channels;
  const validLightness = lightness.endsWith("%")
    ? rangedToken(lightness, 0, 100, true)
    : rangedToken(lightness, 0, 1, false);
  const chromaValue = numericToken(chroma);
  return (
    validLightness &&
    chromaValue !== undefined &&
    chromaValue >= 0 &&
    hueToken(hue)
  );
}

function isExplicitCssColor(value: unknown): value is string {
  if (!isNonEmptyString(value)) return false;
  if (/^#(?:[a-f0-9]{3}|[a-f0-9]{4}|[a-f0-9]{6}|[a-f0-9]{8})$/i.test(value)) {
    return true;
  }
  if (/^var\(--[a-z0-9]+(?:-[a-z0-9]+)*\)$/i.test(value)) return true;
  const functional = /^(rgb|rgba|hsl|hsla|oklch)\(([^()]*)\)$/i.exec(value);
  if (!functional) return false;
  const name = functional[1].toLowerCase();
  if (name === "rgb" || name === "rgba") {
    return isRgbColor(name, functional[2].trim());
  }
  if (name === "hsl" || name === "hsla") {
    return isHslColor(name, functional[2].trim());
  }
  return isOklchColor(functional[2].trim());
}

function assertLocales(value: unknown, key: string): void {
  const locales = isNonEmptyString(value)
    ? [value]
    : Array.isArray(value)
      ? value
      : [];
  if (locales.length === 0 || locales.some((locale) => !isNonEmptyString(locale))) {
    invalidSafeOverride(key);
  }
  try {
    const canonical = locales.map(
      (locale) => Intl.getCanonicalLocales(locale)[0],
    );
    if (canonical.some((locale) => !locale)) invalidSafeOverride(key);
    if (new Set(canonical).size !== canonical.length) invalidSafeOverride(key);
  } catch {
    invalidSafeOverride(key);
  }
}

function validateSafeOverrides(
  safeOverrides: JsonObject,
  allowedKeys: readonly string[],
): void {
  if (!isPlainObject(safeOverrides)) invalidSafeOverride("root");
  canonicalStringify(safeOverrides);
  for (const [key, value] of Object.entries(safeOverrides)) {
    if (!allowedKeys.includes(key)) invalidSafeOverride(key);
    switch (key) {
      case "branding": {
        if (isNonEmptyString(value)) break;
        if (!isPlainObject(value) || Object.keys(value).length === 0) {
          invalidSafeOverride(key);
        }
        if (
          Object.keys(value).some(
            (field) =>
              !["productName", "logoReference"].includes(field) ||
              !isNonEmptyString(value[field]),
          )
        ) {
          invalidSafeOverride(key);
        }
        break;
      }
      case "productCopy":
        assertProductCopy(value, key);
        break;
      case "navigation":
        assertUniqueNonEmptyStrings(value, key);
        break;
      case "locale":
        assertLocales(value, key);
        break;
      case "semanticStateColors": {
        if (!isPlainObject(value) || Object.keys(value).length === 0) {
          invalidSafeOverride(key);
        }
        if (
          Object.entries(value).some(
            ([colorKey, colorValue]) =>
              !SEMANTIC_STATE_COLOR_KEYS.includes(
                colorKey as (typeof SEMANTIC_STATE_COLOR_KEYS)[number],
              ) || !isExplicitCssColor(colorValue),
          )
        ) {
          invalidSafeOverride(key);
        }
        break;
      }
      case "platformChrome":
        if (value !== "native" && value !== "web") {
          invalidSafeOverride(key);
        }
        break;
      default:
        invalidSafeOverride(key);
    }
  }
}

export function resolveSystemPresetOrder(input: {
  presetSlug: string;
  recipeSlug: string;
  profile: ApplicationProfile;
  capabilitySlugs: string[];
  safeOverrides: JsonObject;
  catalog: CatalogItem[];
}) {
  const presetItem = input.catalog.find(
    (item) =>
      item.kind === "system-preset" && item.slug === input.presetSlug,
  );
  if (!presetItem) throw new Error("Unknown system preset.");
  if (!presetItem.systemPreset) {
    throw new Error("System preset Catalog item is missing its payload.");
  }
  const preset = parseSystemPreset(presetItem.systemPreset);
  if (preset.slug !== input.presetSlug) {
    throw new Error("System preset Catalog payload slug does not match its item.");
  }

  const recipe = input.catalog.find(
    (item) => item.kind === "recipe" && item.slug === input.recipeSlug,
  );
  if (
    !recipe ||
    (recipe.category !== "application" && recipe.category !== "landing") ||
    !preset.compatibleRecipes.includes(input.recipeSlug) ||
    !recipe.profiles?.includes(input.profile) ||
    !preset.profiles.includes(input.profile)
  ) {
    throw new Error("Incompatible recipe, category, or profile.");
  }
  if (new Set(input.capabilitySlugs).size !== input.capabilitySlugs.length) {
    throw new Error("Capabilities must be unique.");
  }

  const selectedCapabilities = input.capabilitySlugs.map((slug) => {
    const capability = preset.capabilities.find((item) => item.slug === slug);
    if (!capability) throw new Error("Unknown capability.");
    return capability;
  });
  if (
    preset.capabilities
      .filter((capability) => capability.required)
      .some((capability) => !input.capabilitySlugs.includes(capability.slug))
  ) {
    throw new Error("Missing required capability.");
  }
  validateSafeOverrides(input.safeOverrides, preset.safeOverrideKeys);

  const slugs = [
    ...new Set([
      ...(recipe.components ?? []),
      ...selectedCapabilities.flatMap((item) => item.components),
    ]),
  ].sort();
  const components = slugs.map((slug) => {
    if (!preset.componentAllowlist.includes(slug)) {
      throw new Error("Component outside allowlist.");
    }
    const item = input.catalog.find(
      (candidate) => candidate.kind === "component" && candidate.slug === slug,
    );
    if (!item?.sourceFiles?.length) {
      throw new Error("Missing Catalog source family.");
    }
    return {
      slug,
      contractHash: catalogContractHash(item),
      sourceFiles: [...item.sourceFiles],
    };
  });
  const assets: ResolvedAsset[] = [
    ...preset.assets.map((asset) => ({
      ...asset,
      source: "system-preset" as const,
    })),
    ...(recipe.assets ?? []).map((asset) => ({
      kind: asset.kind,
      requirement: asset.requirement,
      required: asset.required,
      source: "recipe" as const,
    })),
  ];

  return freeze({
    preset: {
      slug: preset.slug,
      version: preset.version,
      contractHash: systemPresetContractHash(preset),
      themeKit: preset.themeKit,
    },
    recipe: {
      slug: recipe.slug,
      category: recipe.category,
      contractHash: catalogContractHash(recipe),
    },
    profile: input.profile,
    capabilities: [...input.capabilitySlugs].sort(),
    components,
    assets,
    safeOverrides: input.safeOverrides,
    lockedVisualSnapshot: preset.lockedVisual,
    referencePack: preset.referencePack,
    catalogSnapshotHash: catalogSnapshotContractHash(input.catalog),
  });
}
