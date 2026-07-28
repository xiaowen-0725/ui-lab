import {
  canonicalSha256,
  canonicalStringify,
  type JsonObject,
} from "@/lib/contracts/canonical-json";
import type { CatalogItem } from "@/lib/catalog";
import type { AssetKind, AssetSource } from "@/lib/system-presets/types";
import { resolveSystemPresetOrder } from "@/lib/system-presets/resolve";

type Status = "draft" | "confirmed";
type Category = "application" | "landing";
type Profile = "next-app" | "vite-app" | "electron-renderer";
type PlatformChrome = "native" | "web";
type Viewport = "wide" | "collapse" | "narrow";
type Theme = "light" | "dark";

export type ReferenceEvidenceCase = {
  id: string;
  viewport: Viewport;
  size: string;
  scale: number;
  theme: Theme;
  states: string[];
  surfaces: string[];
  keyboardFocus: boolean;
  reducedMotion: boolean;
  fixtureId: string;
  fontLoadingState: string;
  captureTiming: string;
  calibrationSourceIds: string[];
  goldenSha256: string | null;
};

export type OrderManifestAsset = {
  kind: AssetKind;
  id?: string;
  requirement: string;
  required: boolean;
  source: AssetSource;
};

export type OrderManifest = {
  schemaVersion: 1;
  identity: {
    orderId: string;
    revision: number;
    status: Status;
    createdAt: string;
    confirmedAt?: string;
    manifestHash: string;
  };
  lineage?: { parentOrderId: string; parentRevision: number; parentHash: string; reason: string };
  target: {
    category: Category;
    profile: Profile;
    productId: string;
    locales: string[];
    platformChrome: PlatformChrome;
  };
  preset: { slug: string; version: number; contractHash: string; catalogSource: string; catalogSnapshotHash: string };
  composition: {
    recipe: { slug: string; contractHash: string };
    capabilities: string[];
    components: Array<{ slug: string; contractHash: string; sourceFiles: string[] }>;
    assets: OrderManifestAsset[];
  };
  safeOverrides: JsonObject;
  lockedVisualSnapshot: JsonObject;
  previewScenarios: { fixture: { id: string; version: number; fixtureHash: string }; caseIds: string[] };
  referenceEvidence: { referencePackId: string; referencePackHash: string; cases: ReferenceEvidenceCase[] };
  confirmation?: { confirmedAt: string; reviewerId?: string; previewMatrixHash: string };
  derivedArtifacts: JsonObject;
};

export type OrderManifestDraftInput = Omit<
  OrderManifest,
  "schemaVersion" | "confirmation" | "identity"
> & {
  identity: Omit<OrderManifest["identity"], "status" | "manifestHash" | "confirmedAt">;
};

type RevisionSections = Pick<
  OrderManifest,
  | "target"
  | "preset"
  | "composition"
  | "safeOverrides"
  | "lockedVisualSnapshot"
  | "previewScenarios"
  | "referenceEvidence"
  | "derivedArtifacts"
>;

export type ResolvedSystemPresetOrder = ReturnType<typeof resolveSystemPresetOrder>;

export type OrderReferenceGoldenCapture = {
  caseId: string;
  goldenSha256: string;
};

function clone<T>(value: T): T {
  return JSON.parse(canonicalStringify(value as JsonObject)) as T;
}

function freeze<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const nested of Object.values(value as object)) freeze(nested);
    Object.freeze(value);
  }
  return value;
}

function isHash(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function assertIso(value: unknown, name: string): asserts value is string {
  if (!isNonEmptyString(value) || Number.isNaN(Date.parse(value)) || new Date(value).toISOString() !== value) {
    throw new Error(`${name} must be an ISO-8601 timestamp.`);
  }
}

function assertStringArray(value: unknown, name: string): asserts value is string[] {
  if (!Array.isArray(value) || value.length === 0 || value.some((item) => !isNonEmptyString(item))) {
    throw new Error(`${name} must be a non-empty string array.`);
  }
}

function assertUniqueStringArray(value: unknown, name: string): asserts value is string[] {
  assertStringArray(value, name);
  if (new Set(value).size !== value.length) throw new Error(`${name} must be unique.`);
}

function canonicalLocales(value: string[], name: string): string[] {
  try {
    const locales = value.map((locale) => Intl.getCanonicalLocales(locale)[0]);
    if (locales.some((locale) => !locale) || new Set(locales).size !== locales.length) {
      throw new Error();
    }
    return locales;
  } catch {
    throw new Error(`${name} must contain unique BCP-47 locale tags.`);
  }
}

function assertJsonObject(value: unknown, name: string): asserts value is JsonObject {
  try {
    const parsed = JSON.parse(canonicalStringify(value as JsonObject));
    if (!parsed || Array.isArray(parsed) || typeof parsed !== "object") throw new Error();
  } catch {
    throw new Error(`${name} must be a JSON object.`);
  }
}

function assertExactKeys(value: unknown, keys: readonly string[], name: string): asserts value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) {
    throw new Error(`Invalid OrderManifest ${name} must be a plain object.`);
  }
  const unknown = Object.keys(value).filter((key) => !keys.includes(key));
  if (unknown.length > 0) throw new Error(`Invalid OrderManifest ${name} has unknown field(s): ${unknown.join(", ")}.`);
}

function assertRequiredKeys(value: Record<string, unknown>, keys: readonly string[], name: string): void {
  const missing = keys.filter((key) => !(key in value));
  if (missing.length > 0) throw new Error(`Invalid OrderManifest ${name} has missing field(s): ${missing.join(", ")}.`);
}

function assertManifestShape(value: unknown): asserts value is OrderManifest {
  assertExactKeys(value, ["schemaVersion", "identity", "lineage", "target", "preset", "composition", "safeOverrides", "lockedVisualSnapshot", "previewScenarios", "referenceEvidence", "confirmation", "derivedArtifacts"], "root");
  assertExactKeys(value.identity, ["orderId", "revision", "status", "createdAt", "confirmedAt", "manifestHash"], "identity");
  if (value.lineage !== undefined) assertExactKeys(value.lineage, ["parentOrderId", "parentRevision", "parentHash", "reason"], "lineage");
  assertExactKeys(value.target, ["category", "profile", "productId", "locales", "platformChrome"], "target");
  assertExactKeys(value.preset, ["slug", "version", "contractHash", "catalogSource", "catalogSnapshotHash"], "preset");
  assertExactKeys(value.composition, ["recipe", "capabilities", "components", "assets"], "composition");
  assertExactKeys(value.composition.recipe, ["slug", "contractHash"], "composition.recipe");
  if (!Array.isArray(value.composition.components)) throw new Error("Invalid OrderManifest composition.components must be an array.");
  for (const component of value.composition.components) assertExactKeys(component, ["slug", "contractHash", "sourceFiles"], "composition.component");
  if (!Array.isArray(value.composition.assets)) throw new Error("Invalid OrderManifest composition.assets must be an array.");
  for (const asset of value.composition.assets) {
    assertExactKeys(asset, ["kind", "id", "requirement", "required", "source"], "composition.asset");
    assertRequiredKeys(asset, ["kind", "requirement", "required", "source"], "composition.asset");
  }
  assertExactKeys(value.previewScenarios, ["fixture", "caseIds"], "previewScenarios");
  assertExactKeys(value.previewScenarios.fixture, ["id", "version", "fixtureHash"], "previewScenarios.fixture");
  assertExactKeys(value.referenceEvidence, ["referencePackId", "referencePackHash", "cases"], "referenceEvidence");
  if (!Array.isArray(value.referenceEvidence.cases)) throw new Error("Invalid OrderManifest referenceEvidence.cases must be an array.");
  for (const item of value.referenceEvidence.cases) {
    const keys = ["id", "viewport", "size", "scale", "theme", "states", "surfaces", "keyboardFocus", "reducedMotion", "fixtureId", "fontLoadingState", "captureTiming", "calibrationSourceIds", "goldenSha256"] as const;
    assertExactKeys(item, keys, "referenceEvidence.case");
    assertRequiredKeys(item, keys, "referenceEvidence.case");
  }
  if (value.confirmation !== undefined) assertExactKeys(value.confirmation, ["confirmedAt", "reviewerId", "previewMatrixHash"], "confirmation");
}

function payloadWithoutHash(manifest: OrderManifest): JsonObject {
  const payload = clone(manifest);
  const { manifestHash: _manifestHash, ...identity } = payload.identity;
  return { ...payload, identity } as unknown as JsonObject;
}

function validate(manifest: OrderManifest, verifyHash: boolean): void {
  if (manifest.schemaVersion !== 1) throw new Error("OrderManifest schemaVersion must be 1.");
  const { identity } = manifest;
  if (!isNonEmptyString(identity.orderId) || !Number.isInteger(identity.revision) || identity.revision < 1) {
    throw new Error("OrderManifest identity requires a non-empty orderId and revision >= 1.");
  }
  if (identity.status !== "draft" && identity.status !== "confirmed") throw new Error("Invalid manifest status.");
  assertIso(identity.createdAt, "identity.createdAt");
  if (!isHash(identity.manifestHash)) throw new Error("identity.manifestHash must be a SHA-256 digest.");
  if (manifest.lineage) {
    if (!isNonEmptyString(manifest.lineage.parentOrderId) || !Number.isInteger(manifest.lineage.parentRevision) || manifest.lineage.parentRevision < 1 || !isHash(manifest.lineage.parentHash) || !isNonEmptyString(manifest.lineage.reason)) {
      throw new Error("Invalid manifest lineage.");
    }
  }
  if (identity.revision === 1 && manifest.lineage) throw new Error("Revision 1 cannot have lineage.");
  if (identity.revision > 1) {
    if (!manifest.lineage || manifest.lineage.parentOrderId !== identity.orderId || manifest.lineage.parentRevision !== identity.revision - 1) {
      throw new Error("Revision > 1 requires matching lineage.");
    }
  }
  if (verifyHash && canonicalSha256(payloadWithoutHash(manifest)) !== identity.manifestHash) {
    throw new Error("OrderManifest hash is invalid.");
  }
  if (!isNonEmptyString(manifest.target.productId) || !["application", "landing"].includes(manifest.target.category) || !["next-app", "vite-app", "electron-renderer"].includes(manifest.target.profile) || !["native", "web"].includes(manifest.target.platformChrome)) throw new Error("Invalid target.");
  assertUniqueStringArray(manifest.target.locales, "target.locales");
  const normalizedLocales = canonicalLocales(manifest.target.locales, "target.locales");
  if (normalizedLocales.some((locale, index) => locale !== manifest.target.locales[index])) {
    throw new Error("target.locales must use canonical BCP-47 locale tags.");
  }
  if (!isNonEmptyString(manifest.preset.slug) || !Number.isInteger(manifest.preset.version) || manifest.preset.version < 1 || !isHash(manifest.preset.contractHash) || !isHash(manifest.preset.catalogSnapshotHash) || !isNonEmptyString(manifest.preset.catalogSource)) throw new Error("Invalid preset.");
  if (!isNonEmptyString(manifest.composition.recipe.slug) || !isHash(manifest.composition.recipe.contractHash)) throw new Error("Invalid recipe reference.");
  assertStringArray(manifest.composition.capabilities, "composition.capabilities");
  if (new Set(manifest.composition.capabilities).size !== manifest.composition.capabilities.length) throw new Error("composition.capabilities must be unique.");
  if (!Array.isArray(manifest.composition.components) || manifest.composition.components.length === 0) throw new Error("composition.components must be non-empty.");
  for (const component of manifest.composition.components) {
    if (!isNonEmptyString(component.slug) || !isHash(component.contractHash)) throw new Error("Invalid component reference.");
    assertStringArray(component.sourceFiles, "component.sourceFiles");
  }
  if (new Set(manifest.composition.components.map((component) => component.slug)).size !== manifest.composition.components.length) throw new Error("composition.components must be unique.");
  if (!Array.isArray(manifest.composition.assets) || manifest.composition.assets.length === 0) {
    throw new Error("composition.assets must be non-empty.");
  }
  const assetKeys: string[] = [];
  for (const asset of manifest.composition.assets) {
    if (!["font", "icon", "image", "illustration"].includes(asset.kind)) {
      throw new Error("Invalid composition asset kind.");
    }
    if (asset.id !== undefined && !isNonEmptyString(asset.id)) {
      throw new Error("composition asset id must be non-empty when present.");
    }
    if (
      !isNonEmptyString(asset.requirement) ||
      typeof asset.required !== "boolean" ||
      !["system-preset", "recipe"].includes(asset.source)
    ) {
      throw new Error("Invalid composition asset.");
    }
    assetKeys.push(
      `${asset.source}:${asset.id ?? `${asset.kind}:${asset.requirement}`}`,
    );
  }
  if (new Set(assetKeys).size !== assetKeys.length) {
    throw new Error("composition assets must be unique.");
  }
  assertJsonObject(manifest.safeOverrides, "safeOverrides");
  assertJsonObject(manifest.lockedVisualSnapshot, "lockedVisualSnapshot");
  assertJsonObject(manifest.derivedArtifacts, "derivedArtifacts");
  if (!isNonEmptyString(manifest.previewScenarios.fixture.id) || !Number.isInteger(manifest.previewScenarios.fixture.version) || manifest.previewScenarios.fixture.version < 1 || !isHash(manifest.previewScenarios.fixture.fixtureHash)) throw new Error("Invalid preview fixture.");
  assertStringArray(manifest.previewScenarios.caseIds, "previewScenarios.caseIds");
  if (new Set(manifest.previewScenarios.caseIds).size !== manifest.previewScenarios.caseIds.length) throw new Error("previewScenarios.caseIds must be unique.");
  if (!isNonEmptyString(manifest.referenceEvidence.referencePackId) || !isHash(manifest.referenceEvidence.referencePackHash) || !Array.isArray(manifest.referenceEvidence.cases) || manifest.referenceEvidence.cases.length === 0) throw new Error("Invalid reference evidence.");
  for (const item of manifest.referenceEvidence.cases) {
    const size = /^([1-9]\d*)x([1-9]\d*)$/.exec(item.size);
    if (!isNonEmptyString(item.id) || !["wide", "collapse", "narrow"].includes(item.viewport) || !size || !Number.isFinite(item.scale) || item.scale <= 0 || !["light", "dark"].includes(item.theme) || !isNonEmptyString(item.fixtureId) || item.fixtureId !== manifest.previewScenarios.fixture.id) throw new Error("Invalid reference evidence case or fixture.");
    assertUniqueStringArray(item.states, "reference evidence states");
    assertUniqueStringArray(item.surfaces, "reference evidence surfaces");
    if (typeof item.keyboardFocus !== "boolean" || typeof item.reducedMotion !== "boolean") throw new Error("Reference evidence focus and reduced-motion flags must be boolean.");
    if (!isNonEmptyString(item.fontLoadingState)) throw new Error("Reference evidence font loading state must be non-empty.");
    if (!isNonEmptyString(item.captureTiming)) throw new Error("Reference evidence capture timing must be non-empty.");
    assertUniqueStringArray(item.calibrationSourceIds, "reference evidence calibration source IDs");
    if (item.goldenSha256 !== null && !isHash(item.goldenSha256)) throw new Error("Invalid golden SHA-256.");
  }
  const referenceCaseIds = manifest.referenceEvidence.cases.map((item) => item.id);
  if (new Set(referenceCaseIds).size !== referenceCaseIds.length) throw new Error("reference evidence case IDs must be unique.");
  if (referenceCaseIds.length !== manifest.previewScenarios.caseIds.length || referenceCaseIds.some((id) => !manifest.previewScenarios.caseIds.includes(id))) throw new Error("Preview case IDs must exactly match reference evidence cases.");
  if (identity.status === "draft") {
    if (identity.confirmedAt !== undefined || manifest.confirmation !== undefined) throw new Error("Draft manifests cannot have confirmation.");
  } else {
    assertIso(identity.confirmedAt, "identity.confirmedAt");
    if (!manifest.confirmation) throw new Error("Confirmed manifests require confirmation.");
    assertIso(manifest.confirmation.confirmedAt, "confirmation.confirmedAt");
    if (manifest.confirmation.confirmedAt !== identity.confirmedAt) throw new Error("Confirmation timestamp must match identity.");
    if (manifest.confirmation.reviewerId !== undefined && !isNonEmptyString(manifest.confirmation.reviewerId)) throw new Error("confirmation.reviewerId must be non-empty.");
    if (!isHash(manifest.confirmation.previewMatrixHash) || manifest.confirmation.previewMatrixHash !== canonicalSha256(manifest.referenceEvidence.cases)) throw new Error("Invalid preview matrix hash.");
    if (manifest.referenceEvidence.cases.some((item) => !isHash(item.goldenSha256))) throw new Error("Confirmed manifests require golden SHA-256 values.");
  }
}

function withHash(manifest: OrderManifest): OrderManifest {
  const next = clone(manifest);
  next.identity.manifestHash = canonicalSha256(payloadWithoutHash(next));
  return freeze(next);
}

export function assertValidOrderManifest(manifest: unknown): asserts manifest is OrderManifest {
  assertManifestShape(manifest);
  validate(manifest, true);
}

export function parseOrderManifest(value: unknown): Readonly<OrderManifest> {
  assertValidOrderManifest(value);
  return freeze(clone(value));
}

export function isOrderManifestHashValid(manifest: unknown): boolean {
  try {
    assertValidOrderManifest(manifest);
    return true;
  } catch {
    return false;
  }
}

function createOrderManifestDraft(input: OrderManifestDraftInput): Readonly<OrderManifest> {
  const { lineage, ...sections } = input;
  const manifest = clone({
    schemaVersion: 1,
    ...sections,
    ...(lineage ? { lineage } : {}),
    identity: { ...input.identity, status: "draft", manifestHash: "0".repeat(64) },
  }) as OrderManifest;
  assertManifestShape(manifest);
  validate(manifest, false);
  return withHash(manifest);
}

function assertCatalogMatch(actual: unknown, expected: unknown, label: string): void {
  if (canonicalStringify(actual as JsonObject) !== canonicalStringify(expected as JsonObject)) {
    throw new Error(`OrderManifest does not match Catalog ${label}.`);
  }
}

/**
 * Verifies that a structurally valid Manifest is still the exact policy result
 * of the supplied, trusted Catalog. `catalogSource` remains provenance text
 * only and is deliberately not compared.
 */
export function assertOrderManifestMatchesCatalog(
  manifest: unknown,
  catalog: CatalogItem[],
): asserts manifest is OrderManifest {
  assertValidOrderManifest(manifest);
  const resolution = resolveSystemPresetOrder({
    presetSlug: manifest.preset.slug,
    recipeSlug: manifest.composition.recipe.slug,
    profile: manifest.target.profile,
    capabilitySlugs: [...manifest.composition.capabilities],
    safeOverrides: manifest.safeOverrides,
    catalog,
  });

  if (manifest.target.category !== resolution.recipe.category || manifest.target.profile !== resolution.profile) {
    throw new Error("OrderManifest target does not match Catalog.");
  }
  if (manifest.preset.version !== resolution.preset.version ||
    manifest.preset.contractHash !== resolution.preset.contractHash ||
    manifest.preset.catalogSnapshotHash !== resolution.catalogSnapshotHash) {
    throw new Error("OrderManifest preset does not match Catalog.");
  }
  if (manifest.composition.recipe.slug !== resolution.recipe.slug || manifest.composition.recipe.contractHash !== resolution.recipe.contractHash) {
    throw new Error("OrderManifest recipe does not match Catalog.");
  }
  assertCatalogMatch(
    [...manifest.composition.capabilities].sort(),
    [...resolution.capabilities].sort(),
    "capabilities",
  );
  assertCatalogMatch(manifest.composition.components, resolution.components, "components");
  assertCatalogMatch(manifest.composition.assets, resolution.assets, "assets");
  assertCatalogMatch(manifest.lockedVisualSnapshot, resolution.lockedVisualSnapshot, "lockedVisualSnapshot");
  assertCatalogMatch(manifest.previewScenarios, {
    fixture: {
      id: resolution.referencePack.fixture.id,
      version: resolution.referencePack.fixture.version,
      fixtureHash: resolution.referencePack.fixture.fixtureHash,
    },
    caseIds: resolution.referencePack.cases.map((item) => item.id),
  }, "preview scenarios");
  assertCatalogMatch({
    referencePackId: manifest.referenceEvidence.referencePackId,
    referencePackHash: manifest.referenceEvidence.referencePackHash,
    cases: manifest.referenceEvidence.cases.map(({ goldenSha256: _goldenSha256, ...item }) => item),
  }, {
    referencePackId: resolution.referencePack.id,
    referencePackHash: resolution.referencePack.contractHash,
    cases: resolution.referencePack.cases.map((item) => ({
      id: item.id,
      viewport: item.viewport,
      size: item.size,
      scale: item.scale,
      theme: item.theme,
      states: item.states,
      surfaces: item.surfaces,
      keyboardFocus: item.keyboardFocus,
      reducedMotion: item.reducedMotion,
      fixtureId: item.fixtureId,
      fontLoadingState: item.fontLoadingState,
      captureTiming: item.captureTiming,
      calibrationSourceIds: item.calibrationSourceIds,
    })),
  }, "reference evidence");

  const requestedPlatformChrome = manifest.safeOverrides.platformChrome;
  if (requestedPlatformChrome !== undefined && requestedPlatformChrome !== manifest.target.platformChrome) {
    throw new Error("safeOverrides.platformChrome must match target platformChrome.");
  }
  const requestedLocales = manifest.safeOverrides.locale;
  if (requestedLocales !== undefined) {
    const locales = typeof requestedLocales === "string" ? [requestedLocales] : requestedLocales;
    let overrideLocales: string[];
    let targetLocales: string[];
    try {
      overrideLocales = Array.isArray(locales) ? (locales as string[]).map((locale) => Intl.getCanonicalLocales(locale)[0]) : [];
      targetLocales = manifest.target.locales.map((locale) => Intl.getCanonicalLocales(locale)[0]);
    } catch {
      throw new Error("safeOverrides.locale must match target locales.");
    }
    if (overrideLocales.some((locale) => !locale) || targetLocales.some((locale) => !locale) || canonicalStringify(overrideLocales.sort() as unknown as JsonObject) !== canonicalStringify(targetLocales.sort() as unknown as JsonObject)) {
      throw new Error("safeOverrides.locale must match target locales.");
    }
  }
}

export function createOrderDraftFromResolution(
  resolution: ResolvedSystemPresetOrder,
  input: {
    orderId: string;
    createdAt: string;
    productId: string;
    locales: string[];
    platformChrome: PlatformChrome;
    catalogSource: string;
    derivedArtifacts?: JsonObject;
  },
): Readonly<OrderManifest> {
  const requestedPlatformChrome = resolution.safeOverrides.platformChrome;
  if (requestedPlatformChrome !== undefined && requestedPlatformChrome !== input.platformChrome) {
    throw new Error("safeOverrides.platformChrome must match target platformChrome.");
  }
  return createOrderManifestDraft({
    identity: { orderId: input.orderId, revision: 1, createdAt: input.createdAt },
    target: {
      category: resolution.recipe.category as Category,
      profile: resolution.profile,
      productId: input.productId,
      locales: canonicalLocales(input.locales, "target.locales"),
      platformChrome: input.platformChrome,
    },
    preset: {
      slug: resolution.preset.slug,
      version: resolution.preset.version,
      contractHash: resolution.preset.contractHash,
      catalogSource: input.catalogSource,
      catalogSnapshotHash: resolution.catalogSnapshotHash,
    },
    composition: {
      recipe: { slug: resolution.recipe.slug, contractHash: resolution.recipe.contractHash },
      capabilities: [...resolution.capabilities],
      components: resolution.components.map((component) => ({ ...component, sourceFiles: [...component.sourceFiles] })),
      assets: resolution.assets.map((asset) => ({ ...asset })),
    },
    safeOverrides: resolution.safeOverrides,
    lockedVisualSnapshot: resolution.lockedVisualSnapshot,
    previewScenarios: {
      fixture: {
        id: resolution.referencePack.fixture.id,
        version: resolution.referencePack.fixture.version,
        fixtureHash: resolution.referencePack.fixture.fixtureHash,
      },
      caseIds: resolution.referencePack.cases.map((item) => item.id),
    },
    referenceEvidence: {
      referencePackId: resolution.referencePack.id,
      referencePackHash: resolution.referencePack.contractHash,
      cases: resolution.referencePack.cases.map((item) => ({
        id: item.id, viewport: item.viewport, size: item.size, scale: item.scale,
        theme: item.theme, states: [...item.states], surfaces: [...item.surfaces],
        keyboardFocus: item.keyboardFocus, reducedMotion: item.reducedMotion,
        fixtureId: item.fixtureId, fontLoadingState: item.fontLoadingState,
        captureTiming: item.captureTiming, calibrationSourceIds: [...item.calibrationSourceIds],
        goldenSha256: item.goldenCapture,
      })),
    },
    derivedArtifacts: input.derivedArtifacts ?? {},
  });
}

export function recordOrderReferenceGoldens(
  draft: OrderManifest,
  captures: OrderReferenceGoldenCapture[],
  catalog: CatalogItem[],
): Readonly<OrderManifest> {
  assertOrderManifestMatchesCatalog(draft, catalog);
  if (draft.identity.status !== "draft") throw new Error("Only draft manifests can record reference goldens.");
  if (!Array.isArray(captures) || captures.length !== draft.referenceEvidence.cases.length) {
    throw new Error("Reference goldens must exactly cover every case.");
  }
  const captureByCase = new Map<string, string>();
  for (const capture of captures) {
    assertExactKeys(capture, ["caseId", "goldenSha256"], "reference golden capture");
    assertRequiredKeys(capture, ["caseId", "goldenSha256"], "reference golden capture");
    if (!isNonEmptyString(capture.caseId) || !isHash(capture.goldenSha256) || captureByCase.has(capture.caseId)) {
      throw new Error("Reference goldens must have unique case IDs and valid hashes.");
    }
    captureByCase.set(capture.caseId, capture.goldenSha256);
  }
  if (draft.referenceEvidence.cases.some((item) => !captureByCase.has(item.id))) {
    throw new Error("Reference goldens must exactly cover every case.");
  }
  const next = clone(draft) as OrderManifest;
  next.referenceEvidence.cases = next.referenceEvidence.cases.map((item) => ({
    ...item,
    goldenSha256: captureByCase.get(item.id) as string,
  }));
  validate(next, false);
  return withHash(next);
}

export function confirmOrderManifest(
  draft: OrderManifest,
  confirmation: { confirmedAt: string; reviewerId?: string },
  catalog: CatalogItem[],
): Readonly<OrderManifest> {
  assertOrderManifestMatchesCatalog(draft, catalog);
  if (draft.identity.status !== "draft") throw new Error("Only draft manifests can be confirmed.");
  if (draft.referenceEvidence.cases.some((item) => !isHash(item.goldenSha256))) throw new Error("Cannot confirm without golden SHA-256 values.");
  assertIso(confirmation.confirmedAt, "confirmation.confirmedAt");
  if (confirmation.reviewerId !== undefined && !isNonEmptyString(confirmation.reviewerId)) throw new Error("reviewerId must be non-empty.");
  const next = clone(draft) as OrderManifest;
  next.identity.status = "confirmed";
  next.identity.confirmedAt = confirmation.confirmedAt;
  next.confirmation = {
    confirmedAt: confirmation.confirmedAt,
    ...(confirmation.reviewerId ? { reviewerId: confirmation.reviewerId } : {}),
    previewMatrixHash: canonicalSha256(next.referenceEvidence.cases),
  };
  validate(next, false);
  return withHash(next);
}

export function createOrderRevision(
  parent: OrderManifest,
  input: { createdAt: string; reason: string; nextSections: RevisionSections },
): Readonly<OrderManifest> {
  assertValidOrderManifest(parent);
  if (parent.identity.status !== "confirmed") throw new Error("Only confirmed manifests can be revised.");
  assertExactKeys(input, ["createdAt", "reason", "nextSections"], "revision input");
  assertRequiredKeys(input, ["createdAt", "reason", "nextSections"], "revision input");
  assertExactKeys(
    input.nextSections,
    ["target", "preset", "composition", "safeOverrides", "lockedVisualSnapshot", "previewScenarios", "referenceEvidence", "derivedArtifacts"],
    "revision nextSections",
  );
  assertRequiredKeys(
    input.nextSections,
    ["target", "preset", "composition", "safeOverrides", "lockedVisualSnapshot", "previewScenarios", "referenceEvidence", "derivedArtifacts"],
    "revision nextSections",
  );
  assertIso(input.createdAt, "revision.createdAt");
  if (!isNonEmptyString(input.reason)) throw new Error("Revision reason must be non-empty.");
  const referenceEvidence = {
    ...input.nextSections.referenceEvidence,
    cases: input.nextSections.referenceEvidence.cases.map((item) => ({
      ...item,
      goldenSha256: null,
    })),
  };
  return createOrderManifestDraft({
    identity: { orderId: parent.identity.orderId, revision: parent.identity.revision + 1, createdAt: input.createdAt },
    lineage: {
      parentOrderId: parent.identity.orderId,
      parentRevision: parent.identity.revision,
      parentHash: parent.identity.manifestHash,
      reason: input.reason,
    },
    target: input.nextSections.target,
    preset: input.nextSections.preset,
    composition: input.nextSections.composition,
    safeOverrides: input.nextSections.safeOverrides,
    lockedVisualSnapshot: input.nextSections.lockedVisualSnapshot,
    previewScenarios: input.nextSections.previewScenarios,
    referenceEvidence,
    derivedArtifacts: input.nextSections.derivedArtifacts,
  });
}
