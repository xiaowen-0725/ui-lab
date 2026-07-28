import {
  canonicalSha256,
  canonicalStringify,
  type JsonObject,
} from "@/lib/contracts/canonical-json";

type Status = "draft" | "confirmed";
type Category = "application" | "landing";
type Profile = "next-app" | "vite-app" | "electron-renderer";
type PlatformChrome = "native" | "web";

export type ReferenceEvidenceCase = {
  id: string;
  size: string;
  scale: number;
  theme: string;
  states: string[];
  fixtureId: string;
  goldenSha256: string | null;
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

function assertManifestShape(value: unknown): asserts value is OrderManifest {
  assertExactKeys(value, ["schemaVersion", "identity", "lineage", "target", "preset", "composition", "safeOverrides", "lockedVisualSnapshot", "previewScenarios", "referenceEvidence", "confirmation", "derivedArtifacts"], "root");
  assertExactKeys(value.identity, ["orderId", "revision", "status", "createdAt", "confirmedAt", "manifestHash"], "identity");
  if (value.lineage !== undefined) assertExactKeys(value.lineage, ["parentOrderId", "parentRevision", "parentHash", "reason"], "lineage");
  assertExactKeys(value.target, ["category", "profile", "productId", "locales", "platformChrome"], "target");
  assertExactKeys(value.preset, ["slug", "version", "contractHash", "catalogSource", "catalogSnapshotHash"], "preset");
  assertExactKeys(value.composition, ["recipe", "capabilities", "components"], "composition");
  assertExactKeys(value.composition.recipe, ["slug", "contractHash"], "composition.recipe");
  if (!Array.isArray(value.composition.components)) throw new Error("Invalid OrderManifest composition.components must be an array.");
  for (const component of value.composition.components) assertExactKeys(component, ["slug", "contractHash", "sourceFiles"], "composition.component");
  assertExactKeys(value.previewScenarios, ["fixture", "caseIds"], "previewScenarios");
  assertExactKeys(value.previewScenarios.fixture, ["id", "version", "fixtureHash"], "previewScenarios.fixture");
  assertExactKeys(value.referenceEvidence, ["referencePackId", "referencePackHash", "cases"], "referenceEvidence");
  if (!Array.isArray(value.referenceEvidence.cases)) throw new Error("Invalid OrderManifest referenceEvidence.cases must be an array.");
  for (const item of value.referenceEvidence.cases) assertExactKeys(item, ["id", "size", "scale", "theme", "states", "fixtureId", "goldenSha256"], "referenceEvidence.case");
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
  assertStringArray(manifest.target.locales, "target.locales");
  if (new Set(manifest.target.locales).size !== manifest.target.locales.length) throw new Error("target.locales must be unique.");
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
  assertJsonObject(manifest.safeOverrides, "safeOverrides");
  assertJsonObject(manifest.lockedVisualSnapshot, "lockedVisualSnapshot");
  assertJsonObject(manifest.derivedArtifacts, "derivedArtifacts");
  if (!isNonEmptyString(manifest.previewScenarios.fixture.id) || !Number.isInteger(manifest.previewScenarios.fixture.version) || manifest.previewScenarios.fixture.version < 1 || !isHash(manifest.previewScenarios.fixture.fixtureHash)) throw new Error("Invalid preview fixture.");
  assertStringArray(manifest.previewScenarios.caseIds, "previewScenarios.caseIds");
  if (new Set(manifest.previewScenarios.caseIds).size !== manifest.previewScenarios.caseIds.length) throw new Error("previewScenarios.caseIds must be unique.");
  if (!isNonEmptyString(manifest.referenceEvidence.referencePackId) || !isHash(manifest.referenceEvidence.referencePackHash) || !Array.isArray(manifest.referenceEvidence.cases) || manifest.referenceEvidence.cases.length === 0) throw new Error("Invalid reference evidence.");
  for (const item of manifest.referenceEvidence.cases) {
    const size = /^([1-9]\d*)x([1-9]\d*)$/.exec(item.size);
    if (!isNonEmptyString(item.id) || !size || !Number.isFinite(item.scale) || item.scale <= 0 || !["light", "dark"].includes(item.theme) || !isNonEmptyString(item.fixtureId) || item.fixtureId !== manifest.previewScenarios.fixture.id) throw new Error("Invalid reference evidence case or fixture.");
    assertStringArray(item.states, "reference evidence states");
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

export function createOrderManifestDraft(input: OrderManifestDraftInput): Readonly<OrderManifest> {
  const { lineage, ...sections } = input;
  const manifest = clone({
    schemaVersion: 1,
    ...sections,
    ...(lineage ? { lineage } : {}),
    identity: { ...input.identity, status: "draft", manifestHash: "0".repeat(64) },
  }) as OrderManifest;
  validate(manifest, false);
  return withHash(manifest);
}

export function confirmOrderManifest(
  draft: OrderManifest,
  confirmation: { confirmedAt: string; reviewerId?: string },
): Readonly<OrderManifest> {
  assertValidOrderManifest(draft);
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
  assertIso(input.createdAt, "revision.createdAt");
  if (!isNonEmptyString(input.reason)) throw new Error("Revision reason must be non-empty.");
  return createOrderManifestDraft({
    identity: { orderId: parent.identity.orderId, revision: parent.identity.revision + 1, createdAt: input.createdAt },
    lineage: {
      parentOrderId: parent.identity.orderId,
      parentRevision: parent.identity.revision,
      parentHash: parent.identity.manifestHash,
      reason: input.reason,
    },
    ...input.nextSections,
  });
}
