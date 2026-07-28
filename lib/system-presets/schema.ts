import {
  canonicalSha256,
  canonicalStringify,
  type JsonObject,
} from "@/lib/contracts/canonical-json";
import type { SystemPreset } from "./types";

const ROOT_KEYS = [
  "schemaVersion",
  "slug",
  "version",
  "status",
  "approvedAt",
  "name",
  "nameZh",
  "aliases",
  "description",
  "descriptionZh",
  "profiles",
  "themeKit",
  "compatibleRecipes",
  "capabilities",
  "componentAllowlist",
  "safeOverrideKeys",
  "lockedVisual",
  "assets",
  "referencePack",
  "required",
  "forbidden",
] as const;
const THEME_KIT_KEYS = ["slug", "contractHash"] as const;
const CAPABILITY_KEYS = [
  "slug",
  "name",
  "nameZh",
  "required",
  "components",
] as const;
const ASSET_KEYS = ["kind", "id", "requirement", "required"] as const;
const LOCKED_VISUAL_KEYS = [
  "typography",
  "icons",
  "surfaces",
  "selection",
  "density",
  "geometry",
  "shadows",
  "motion",
  "responsive",
] as const;
const TYPOGRAPHY_KEYS = [
  "families",
  "assetIds",
  "weights",
  "scale",
  "numerals",
  "fallbackPolicy",
] as const;
const TYPOGRAPHY_FAMILY_KEYS = ["body", "display", "mono"] as const;
const TYPOGRAPHY_SCALE_KEYS = [
  "display",
  "headline",
  "title",
  "body",
  "bodySm",
  "caption",
] as const;
const TYPOGRAPHY_SCALE_STEP_KEYS = [
  "sizePx",
  "lineHeight",
  "letterSpacingEm",
] as const;
const TYPOGRAPHY_NUMERAL_KEYS = ["family", "variant", "usage"] as const;
const ICON_KEYS = [
  "family",
  "package",
  "sizesPx",
  "strokeWidthPx",
  "linecap",
  "linejoin",
  "opticalSizing",
  "defaultStyle",
  "filledUsage",
  "statusTreatment",
  "forbiddenSubstitutions",
] as const;
const SURFACE_KEYS = [
  "roles",
  "hierarchy",
  "componentAnatomy",
  "maxBlurPx",
  "translucencyRule",
] as const;
const SURFACE_ROLE_KEYS = [
  "canvas",
  "sidebar",
  "header",
  "task",
  "composer",
  "panel",
  "popover",
  "overlay",
] as const;
const COMPONENT_ANATOMY_KEYS = [
  "shell",
  "sidebar",
  "task",
  "composer",
  "panel",
  "overlay",
] as const;
const SELECTION_KEYS = [
  "backgroundToken",
  "foregroundToken",
  "iconToken",
  "hoverToken",
  "focusRingToken",
  "treatment",
  "disabledOpacity",
] as const;
const DENSITY_KEYS = [
  "baseUnitPx",
  "spacingScalePx",
  "navigationRowPx",
  "toolbarPx",
  "toolbarSmallPx",
  "panePx",
  "composerSingleLinePx",
  "threadContentMaxWidth",
] as const;
const GEOMETRY_KEYS = [
  "radiusScalePx",
  "controlRadiusPx",
  "panelRadiusPx",
  "composerRadiusPx",
  "fullRadiusPx",
  "borderWidthsPx",
] as const;
const SHADOW_KEYS = ["levels", "translucencyRule", "maxBlurPx"] as const;
const SHADOW_LEVEL_KEYS = [
  "hairline",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
] as const;
const MOTION_KEYS = [
  "durationsMs",
  "curves",
  "properties",
  "reducedMotion",
] as const;
const MOTION_DURATION_KEYS = [
  "press",
  "quick",
  "standard",
  "deliberate",
] as const;
const MOTION_CURVE_KEYS = ["standard", "snappy"] as const;
const REDUCED_MOTION_KEYS = [
  "removeTransform",
  "preserveOpacity",
] as const;
const RESPONSIVE_KEYS = [
  "wide",
  "collapse",
  "narrow",
  "nativeChromePolicy",
] as const;
const WIDE_KEYS = ["minWidthPx", "behavior"] as const;
const COLLAPSE_KEYS = ["minWidthPx", "maxWidthPx", "behavior"] as const;
const NARROW_KEYS = ["maxWidthPx", "behavior"] as const;
const REFERENCE_PACK_KEYS = [
  "id",
  "status",
  "contractHash",
  "fixture",
  "cases",
] as const;
const FIXTURE_KEYS = [
  "id",
  "version",
  "path",
  "fixtureHash",
  "payload",
] as const;
const CASE_KEYS = [
  "id",
  "viewport",
  "size",
  "scale",
  "theme",
  "states",
  "surfaces",
  "fixtureId",
  "keyboardFocus",
  "reducedMotion",
  "status",
  "fontLoadingState",
  "captureTiming",
  "calibrationSourceIds",
  "goldenCapture",
] as const;
const PROFILES = ["next-app", "vite-app", "electron-renderer"] as const;
const ASSET_KINDS = ["font", "icon", "image", "illustration"] as const;
const VIEWPORTS = ["wide", "collapse", "narrow"] as const;
const THEMES = ["light", "dark"] as const;
const SAFE_OVERRIDE_KEYS = [
  "branding",
  "productCopy",
  "navigation",
  "locale",
  "semanticStateColors",
  "platformChrome",
] as const;
const MOTION_PROPERTIES = [
  "transform",
  "opacity",
  "color",
  "background-color",
] as const;

function invalid(message: string): never {
  throw new Error(`Invalid SystemPreset: ${message}`);
}

function assertExactObject(
  value: unknown,
  keys: readonly string[],
  name: string,
): asserts value is Record<string, unknown> {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    (Object.getPrototypeOf(value) !== Object.prototype &&
      Object.getPrototypeOf(value) !== null)
  ) {
    invalid(`${name} must be a plain object.`);
  }
  const actual = Object.keys(value);
  const unknown = actual.filter((key) => !keys.includes(key));
  if (unknown.length > 0) {
    invalid(`${name} has unknown field(s): ${unknown.join(", ")}.`);
  }
  const missing = keys.filter((key) => !actual.includes(key));
  if (missing.length > 0) {
    invalid(`${name} has missing field(s): ${missing.join(", ")}.`);
  }
}

function assertNonEmptyString(value: unknown, name: string): asserts value is string {
  if (typeof value !== "string" || value.trim() === "") {
    invalid(`${name} must be a non-empty string.`);
  }
}

function assertBoolean(value: unknown, name: string): asserts value is boolean {
  if (typeof value !== "boolean") invalid(`${name} must be boolean.`);
}

function assertPositiveInteger(
  value: unknown,
  name: string,
): asserts value is number {
  if (!Number.isInteger(value) || (value as number) < 1) {
    invalid(`${name} must be an integer greater than or equal to 1.`);
  }
}

function assertHash(value: unknown, name: string): asserts value is string {
  if (typeof value !== "string" || !/^[a-f0-9]{64}$/.test(value)) {
    invalid(`${name} must be a SHA-256 hex digest.`);
  }
}

function assertDate(value: unknown, name: string): asserts value is string {
  assertNonEmptyString(value, name);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)) ||
    new Date(`${value}T00:00:00.000Z`).toISOString().slice(0, 10) !== value
  ) {
    invalid(`${name} must be a valid YYYY-MM-DD date.`);
  }
}

function stringArray(value: unknown, name: string): string[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((item) => typeof item !== "string" || item.trim() === "")
  ) {
    invalid(`${name} must be a non-empty string array.`);
  }
  if (new Set(value).size !== value.length) {
    invalid(`${name} must contain unique values.`);
  }
  return value as string[];
}

function objectArray(value: unknown, name: string): unknown[] {
  if (!Array.isArray(value) || value.length === 0) {
    invalid(`${name} must be a non-empty array.`);
  }
  return value;
}

function assertAllowed(
  value: unknown,
  allowed: readonly string[],
  name: string,
): asserts value is string {
  if (typeof value !== "string" || !allowed.includes(value)) {
    invalid(`${name} must be one of: ${allowed.join(", ")}.`);
  }
}

function assertCanonicalObject(
  value: unknown,
  name: string,
): asserts value is JsonObject {
  if (
    !value ||
    typeof value !== "object" ||
    Array.isArray(value) ||
    (Object.getPrototypeOf(value) !== Object.prototype &&
      Object.getPrototypeOf(value) !== null)
  ) {
    invalid(`${name} must be a plain JSON object.`);
  }
  try {
    canonicalStringify(value);
  } catch {
    invalid(`${name} must contain canonical JSON values only.`);
  }
}

function assertNonEmptyCanonicalObject(
  value: unknown,
  name: string,
): asserts value is JsonObject {
  assertCanonicalObject(value, name);
  if (Object.keys(value).length === 0) {
    invalid(`${name} must be a non-empty canonical JSON object.`);
  }
}

function assertFiniteNumber(
  value: unknown,
  name: string,
): asserts value is number {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    invalid(`${name} must be a finite number.`);
  }
}

function assertPositiveNumber(
  value: unknown,
  name: string,
): asserts value is number {
  assertFiniteNumber(value, name);
  if (value <= 0) invalid(`${name} must be greater than 0.`);
}

function assertNumberInRange(
  value: unknown,
  minimum: number,
  maximum: number,
  name: string,
): asserts value is number {
  assertFiniteNumber(value, name);
  if (value < minimum || value > maximum) {
    invalid(`${name} must be between ${minimum} and ${maximum}.`);
  }
}

function numberArray(
  value: unknown,
  name: string,
  minimum: number,
  minimumInclusive: boolean,
): number[] {
  if (!Array.isArray(value) || value.length === 0) {
    invalid(`${name} must be a non-empty number array.`);
  }
  for (const item of value) {
    assertFiniteNumber(item, name);
    if (
      (minimumInclusive && item < minimum) ||
      (!minimumInclusive && item <= minimum)
    ) {
      invalid(
        `${name} values must be ${minimumInclusive ? "at least" : "greater than"} ${minimum}.`,
      );
    }
  }
  if (new Set(value).size !== value.length) {
    invalid(`${name} must contain unique values.`);
  }
  return value;
}

function assertToken(value: unknown, name: string): asserts value is string {
  if (
    typeof value !== "string" ||
    !/^--[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value)
  ) {
    invalid(`${name} must be a CSS custom-property token beginning with --.`);
  }
}

function assertLockedVisual(
  value: unknown,
): asserts value is SystemPreset["lockedVisual"] {
  assertExactObject(value, LOCKED_VISUAL_KEYS, "lockedVisual");

  const typography = value.typography;
  assertExactObject(typography, TYPOGRAPHY_KEYS, "lockedVisual.typography");
  assertExactObject(
    typography.families,
    TYPOGRAPHY_FAMILY_KEYS,
    "lockedVisual.typography.families",
  );
  for (const key of TYPOGRAPHY_FAMILY_KEYS) {
    assertNonEmptyString(
      typography.families[key],
      `lockedVisual.typography.families.${key}`,
    );
  }
  stringArray(typography.assetIds, "lockedVisual.typography.assetIds");
  numberArray(typography.weights, "lockedVisual.typography.weights", 0, false);
  assertExactObject(
    typography.scale,
    TYPOGRAPHY_SCALE_KEYS,
    "lockedVisual.typography.scale",
  );
  for (const key of TYPOGRAPHY_SCALE_KEYS) {
    const step = typography.scale[key];
    const name = `lockedVisual.typography.scale.${key}`;
    assertExactObject(step, TYPOGRAPHY_SCALE_STEP_KEYS, name);
    assertPositiveNumber(step.sizePx, `${name}.sizePx`);
    assertPositiveNumber(step.lineHeight, `${name}.lineHeight`);
    assertFiniteNumber(step.letterSpacingEm, `${name}.letterSpacingEm`);
  }
  assertExactObject(
    typography.numerals,
    TYPOGRAPHY_NUMERAL_KEYS,
    "lockedVisual.typography.numerals",
  );
  if (typography.numerals.family !== "mono") {
    invalid('lockedVisual.typography.numerals.family must be "mono".');
  }
  if (typography.numerals.variant !== "tabular-nums") {
    invalid(
      'lockedVisual.typography.numerals.variant must be "tabular-nums".',
    );
  }
  stringArray(
    typography.numerals.usage,
    "lockedVisual.typography.numerals.usage",
  );
  assertNonEmptyString(
    typography.fallbackPolicy,
    "lockedVisual.typography.fallbackPolicy",
  );

  const icons = value.icons;
  assertExactObject(icons, ICON_KEYS, "lockedVisual.icons");
  assertNonEmptyString(icons.family, "lockedVisual.icons.family");
  assertNonEmptyString(icons.package, "lockedVisual.icons.package");
  numberArray(icons.sizesPx, "lockedVisual.icons.sizesPx", 0, false);
  assertPositiveNumber(
    icons.strokeWidthPx,
    "lockedVisual.icons.strokeWidthPx",
  );
  if (icons.linecap !== "round" || icons.linejoin !== "round") {
    invalid("lockedVisual.icons linecap and linejoin must both be round.");
  }
  for (const key of [
    "opticalSizing",
    "defaultStyle",
    "filledUsage",
    "statusTreatment",
  ] as const) {
    assertNonEmptyString(icons[key], `lockedVisual.icons.${key}`);
  }
  stringArray(
    icons.forbiddenSubstitutions,
    "lockedVisual.icons.forbiddenSubstitutions",
  );

  const surfaces = value.surfaces;
  assertExactObject(surfaces, SURFACE_KEYS, "lockedVisual.surfaces");
  assertExactObject(
    surfaces.roles,
    SURFACE_ROLE_KEYS,
    "lockedVisual.surfaces.roles",
  );
  for (const key of SURFACE_ROLE_KEYS) {
    assertToken(surfaces.roles[key], `lockedVisual.surfaces.roles.${key}`);
  }
  stringArray(surfaces.hierarchy, "lockedVisual.surfaces.hierarchy");
  assertExactObject(
    surfaces.componentAnatomy,
    COMPONENT_ANATOMY_KEYS,
    "lockedVisual.surfaces.componentAnatomy",
  );
  for (const key of COMPONENT_ANATOMY_KEYS) {
    assertNonEmptyString(
      surfaces.componentAnatomy[key],
      `lockedVisual.surfaces.componentAnatomy.${key}`,
    );
  }
  assertNumberInRange(
    surfaces.maxBlurPx,
    0,
    10,
    "lockedVisual.surfaces.maxBlurPx",
  );
  assertNonEmptyString(
    surfaces.translucencyRule,
    "lockedVisual.surfaces.translucencyRule",
  );

  const selection = value.selection;
  assertExactObject(selection, SELECTION_KEYS, "lockedVisual.selection");
  for (const key of [
    "backgroundToken",
    "foregroundToken",
    "iconToken",
    "hoverToken",
    "focusRingToken",
  ] as const) {
    assertToken(selection[key], `lockedVisual.selection.${key}`);
  }
  assertNonEmptyString(
    selection.treatment,
    "lockedVisual.selection.treatment",
  );
  assertNumberInRange(
    selection.disabledOpacity,
    0,
    1,
    "lockedVisual.selection.disabledOpacity",
  );

  const density = value.density;
  assertExactObject(density, DENSITY_KEYS, "lockedVisual.density");
  for (const key of [
    "baseUnitPx",
    "navigationRowPx",
    "toolbarPx",
    "toolbarSmallPx",
    "panePx",
    "composerSingleLinePx",
  ] as const) {
    assertPositiveNumber(density[key], `lockedVisual.density.${key}`);
  }
  numberArray(
    density.spacingScalePx,
    "lockedVisual.density.spacingScalePx",
    0,
    false,
  );
  assertNonEmptyString(
    density.threadContentMaxWidth,
    "lockedVisual.density.threadContentMaxWidth",
  );

  const geometry = value.geometry;
  assertExactObject(geometry, GEOMETRY_KEYS, "lockedVisual.geometry");
  numberArray(
    geometry.radiusScalePx,
    "lockedVisual.geometry.radiusScalePx",
    0,
    true,
  );
  for (const key of [
    "controlRadiusPx",
    "panelRadiusPx",
    "composerRadiusPx",
    "fullRadiusPx",
  ] as const) {
    assertPositiveNumber(geometry[key], `lockedVisual.geometry.${key}`);
  }
  numberArray(
    geometry.borderWidthsPx,
    "lockedVisual.geometry.borderWidthsPx",
    0,
    false,
  );

  const shadows = value.shadows;
  assertExactObject(shadows, SHADOW_KEYS, "lockedVisual.shadows");
  assertExactObject(
    shadows.levels,
    SHADOW_LEVEL_KEYS,
    "lockedVisual.shadows.levels",
  );
  for (const key of SHADOW_LEVEL_KEYS) {
    assertNonEmptyString(
      shadows.levels[key],
      `lockedVisual.shadows.levels.${key}`,
    );
  }
  assertNonEmptyString(
    shadows.translucencyRule,
    "lockedVisual.shadows.translucencyRule",
  );
  assertNumberInRange(
    shadows.maxBlurPx,
    0,
    10,
    "lockedVisual.shadows.maxBlurPx",
  );

  const motion = value.motion;
  assertExactObject(motion, MOTION_KEYS, "lockedVisual.motion");
  assertExactObject(
    motion.durationsMs,
    MOTION_DURATION_KEYS,
    "lockedVisual.motion.durationsMs",
  );
  for (const key of MOTION_DURATION_KEYS) {
    assertPositiveNumber(
      motion.durationsMs[key],
      `lockedVisual.motion.durationsMs.${key}`,
    );
    if (motion.durationsMs[key] > 300) {
      invalid(`lockedVisual.motion.durationsMs.${key} must be <= 300.`);
    }
  }
  assertExactObject(
    motion.curves,
    MOTION_CURVE_KEYS,
    "lockedVisual.motion.curves",
  );
  for (const key of MOTION_CURVE_KEYS) {
    assertNonEmptyString(motion.curves[key], `lockedVisual.motion.curves.${key}`);
  }
  const properties = stringArray(
    motion.properties,
    "lockedVisual.motion.properties",
  );
  for (const property of properties) {
    if (
      !MOTION_PROPERTIES.includes(
        property as (typeof MOTION_PROPERTIES)[number],
      )
    ) {
      invalid(
        `lockedVisual.motion.properties contains unsupported property "${property}".`,
      );
    }
  }
  assertExactObject(
    motion.reducedMotion,
    REDUCED_MOTION_KEYS,
    "lockedVisual.motion.reducedMotion",
  );
  assertBoolean(
    motion.reducedMotion.removeTransform,
    "lockedVisual.motion.reducedMotion.removeTransform",
  );
  assertBoolean(
    motion.reducedMotion.preserveOpacity,
    "lockedVisual.motion.reducedMotion.preserveOpacity",
  );

  const responsive = value.responsive;
  assertExactObject(responsive, RESPONSIVE_KEYS, "lockedVisual.responsive");
  assertExactObject(
    responsive.wide,
    WIDE_KEYS,
    "lockedVisual.responsive.wide",
  );
  assertNumberInRange(
    responsive.wide.minWidthPx,
    0,
    Number.MAX_SAFE_INTEGER,
    "lockedVisual.responsive.wide.minWidthPx",
  );
  assertNonEmptyString(
    responsive.wide.behavior,
    "lockedVisual.responsive.wide.behavior",
  );
  assertExactObject(
    responsive.collapse,
    COLLAPSE_KEYS,
    "lockedVisual.responsive.collapse",
  );
  assertNumberInRange(
    responsive.collapse.minWidthPx,
    0,
    Number.MAX_SAFE_INTEGER,
    "lockedVisual.responsive.collapse.minWidthPx",
  );
  assertPositiveNumber(
    responsive.collapse.maxWidthPx,
    "lockedVisual.responsive.collapse.maxWidthPx",
  );
  if (responsive.collapse.minWidthPx > responsive.collapse.maxWidthPx) {
    invalid(
      "lockedVisual.responsive.collapse.minWidthPx must be <= maxWidthPx.",
    );
  }
  assertNonEmptyString(
    responsive.collapse.behavior,
    "lockedVisual.responsive.collapse.behavior",
  );
  assertExactObject(
    responsive.narrow,
    NARROW_KEYS,
    "lockedVisual.responsive.narrow",
  );
  assertPositiveNumber(
    responsive.narrow.maxWidthPx,
    "lockedVisual.responsive.narrow.maxWidthPx",
  );
  assertNonEmptyString(
    responsive.narrow.behavior,
    "lockedVisual.responsive.narrow.behavior",
  );
  assertNonEmptyString(
    responsive.nativeChromePolicy,
    "lockedVisual.responsive.nativeChromePolicy",
  );
}

export function assertValidSystemPreset(
  value: unknown,
): asserts value is SystemPreset {
  assertExactObject(value, ROOT_KEYS, "root");
  if (value.schemaVersion !== 1) invalid("schemaVersion must be 1.");
  assertNonEmptyString(value.slug, "slug");
  assertPositiveInteger(value.version, "version");
  if (value.status !== "approved") invalid('status must be "approved".');
  assertDate(value.approvedAt, "approvedAt");
  assertNonEmptyString(value.name, "name");
  assertNonEmptyString(value.nameZh, "nameZh");
  stringArray(value.aliases, "aliases");
  assertNonEmptyString(value.description, "description");
  assertNonEmptyString(value.descriptionZh, "descriptionZh");

  const profiles = stringArray(value.profiles, "profiles");
  for (const profile of profiles) assertAllowed(profile, PROFILES, "profile");

  assertExactObject(value.themeKit, THEME_KIT_KEYS, "themeKit");
  assertNonEmptyString(value.themeKit.slug, "themeKit.slug");
  assertHash(value.themeKit.contractHash, "themeKit.contractHash");
  stringArray(value.compatibleRecipes, "compatibleRecipes");

  const componentAllowlist = stringArray(
    value.componentAllowlist,
    "componentAllowlist",
  );
  const capabilities = objectArray(value.capabilities, "capabilities");
  const capabilitySlugs: string[] = [];
  for (const [index, capability] of capabilities.entries()) {
    const name = `capabilities[${index}]`;
    assertExactObject(capability, CAPABILITY_KEYS, name);
    assertNonEmptyString(capability.slug, `${name}.slug`);
    capabilitySlugs.push(capability.slug);
    assertNonEmptyString(capability.name, `${name}.name`);
    assertNonEmptyString(capability.nameZh, `${name}.nameZh`);
    assertBoolean(capability.required, `${name}.required`);
    const components = stringArray(capability.components, `${name}.components`);
    for (const component of components) {
      if (!componentAllowlist.includes(component)) {
        invalid(`${name}.components contains "${component}" outside componentAllowlist.`);
      }
    }
  }
  if (new Set(capabilitySlugs).size !== capabilitySlugs.length) {
    invalid("capability slugs must be unique.");
  }

  const safeOverrideKeys = stringArray(
    value.safeOverrideKeys,
    "safeOverrideKeys",
  );
  for (const key of safeOverrideKeys) {
    if (
      !SAFE_OVERRIDE_KEYS.includes(
        key as (typeof SAFE_OVERRIDE_KEYS)[number],
      )
    ) {
      invalid(`safeOverrideKeys contains unsupported key "${key}".`);
    }
  }

  assertLockedVisual(value.lockedVisual);

  const assets = objectArray(value.assets, "assets");
  const assetIds: string[] = [];
  for (const [index, asset] of assets.entries()) {
    const name = `assets[${index}]`;
    assertExactObject(asset, ASSET_KEYS, name);
    assertAllowed(asset.kind, ASSET_KINDS, `${name}.kind`);
    assertNonEmptyString(asset.id, `${name}.id`);
    assetIds.push(asset.id);
    assertNonEmptyString(asset.requirement, `${name}.requirement`);
    assertBoolean(asset.required, `${name}.required`);
  }
  if (new Set(assetIds).size !== assetIds.length) {
    invalid("asset IDs must be unique.");
  }
  for (const assetId of value.lockedVisual.typography.assetIds) {
    if (!assetIds.includes(assetId)) {
      invalid(
        `lockedVisual.typography.assetIds references unknown asset "${assetId}".`,
      );
    }
  }

  assertExactObject(value.referencePack, REFERENCE_PACK_KEYS, "referencePack");
  assertNonEmptyString(value.referencePack.id, "referencePack.id");
  if (value.referencePack.status !== "approved") {
    invalid(
      'referencePack.status must be "approved" for an approved SystemPreset.',
    );
  }
  assertHash(value.referencePack.contractHash, "referencePack.contractHash");

  assertExactObject(
    value.referencePack.fixture,
    FIXTURE_KEYS,
    "referencePack.fixture",
  );
  const fixture = value.referencePack.fixture;
  assertNonEmptyString(fixture.id, "referencePack.fixture.id");
  assertPositiveInteger(fixture.version, "referencePack.fixture.version");
  assertNonEmptyString(fixture.path, "referencePack.fixture.path");
  assertHash(fixture.fixtureHash, "referencePack.fixture.fixtureHash");
  assertNonEmptyCanonicalObject(
    fixture.payload,
    "referencePack.fixture.payload",
  );
  const fixturePayload = fixture.payload;
  if (fixturePayload.id !== fixture.id) {
    invalid("referencePack.fixture.payload.id must match fixture.id.");
  }
  if (fixturePayload.version !== fixture.version) {
    invalid("referencePack.fixture.payload.version must match fixture.version.");
  }
  if (fixturePayload.deterministic !== true) {
    invalid("referencePack.fixture.payload.deterministic must be true.");
  }
  stringArray(
    fixturePayload.capturePreconditions,
    "referencePack.fixture.payload.capturePreconditions",
  );
  assertNonEmptyCanonicalObject(
    fixturePayload.caseSelectors,
    "referencePack.fixture.payload.caseSelectors",
  );
  const caseSelectors = fixturePayload.caseSelectors;
  for (const [caseId, selectors] of Object.entries(caseSelectors)) {
    stringArray(
      selectors,
      `referencePack.fixture.payload.caseSelectors.${caseId}`,
    );
  }
  if (canonicalSha256(fixturePayload) !== fixture.fixtureHash) {
    invalid("referencePack.fixture.fixtureHash must match its canonical payload.");
  }

  const cases = objectArray(value.referencePack.cases, "referencePack.cases");
  const caseIds: string[] = [];
  for (const [index, referenceCase] of cases.entries()) {
    const name = `referencePack.cases[${index}]`;
    assertExactObject(referenceCase, CASE_KEYS, name);
    assertNonEmptyString(referenceCase.id, `${name}.id`);
    caseIds.push(referenceCase.id);
    assertAllowed(referenceCase.viewport, VIEWPORTS, `${name}.viewport`);
    if (
      typeof referenceCase.size !== "string" ||
      !/^[1-9]\d*x[1-9]\d*$/.test(referenceCase.size)
    ) {
      invalid(`${name}.size must be a positive WIDTHxHEIGHT value.`);
    }
    if (
      typeof referenceCase.scale !== "number" ||
      !Number.isFinite(referenceCase.scale) ||
      referenceCase.scale <= 0
    ) {
      invalid(`${name}.scale must be a positive finite number.`);
    }
    assertAllowed(referenceCase.theme, THEMES, `${name}.theme`);
    stringArray(referenceCase.states, `${name}.states`);
    stringArray(referenceCase.surfaces, `${name}.surfaces`);
    assertNonEmptyString(referenceCase.fixtureId, `${name}.fixtureId`);
    if (referenceCase.fixtureId !== fixture.id) {
      invalid(`${name}.fixtureId must match referencePack.fixture.id.`);
    }
    assertBoolean(referenceCase.keyboardFocus, `${name}.keyboardFocus`);
    assertBoolean(referenceCase.reducedMotion, `${name}.reducedMotion`);
    if (referenceCase.status !== "planned") {
      invalid(`${name}.status must be "planned".`);
    }
    assertNonEmptyString(
      referenceCase.fontLoadingState,
      `${name}.fontLoadingState`,
    );
    assertNonEmptyString(referenceCase.captureTiming, `${name}.captureTiming`);
    stringArray(
      referenceCase.calibrationSourceIds,
      `${name}.calibrationSourceIds`,
    );
    if (referenceCase.goldenCapture !== null) {
      invalid(`${name}.goldenCapture must be null while status is planned.`);
    }
  }
  if (new Set(caseIds).size !== caseIds.length) {
    invalid("reference case IDs must be unique.");
  }
  const selectorCaseIds = Object.keys(caseSelectors);
  if (
    selectorCaseIds.length !== caseIds.length ||
    selectorCaseIds.some((caseId) => !caseIds.includes(caseId))
  ) {
    invalid(
      "referencePack.fixture.payload.caseSelectors keys must exactly match reference case IDs.",
    );
  }

  stringArray(value.required, "required");
  stringArray(value.forbidden, "forbidden");
}

function deepFreeze<T>(value: T): Readonly<T> {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const nested of Object.values(value as object)) deepFreeze(nested);
    Object.freeze(value);
  }
  return value;
}

export function parseSystemPreset(value: unknown): Readonly<SystemPreset> {
  assertValidSystemPreset(value);
  const clone = JSON.parse(canonicalStringify(value)) as SystemPreset;
  return deepFreeze(clone);
}
