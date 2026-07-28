import type { JsonObject } from "@/lib/contracts/canonical-json";
import { canonicalStringify } from "@/lib/contracts/canonical-stringify";
import type { OrderManifest } from "@/lib/order-manifest";
import type {
  AssemblyOrderSelection,
  SemanticOrderChange,
} from "./types";

const PROFILES = ["next-app", "vite-app", "electron-renderer"] as const;
const PLATFORM_CHROME = ["native", "web"] as const;
export const MAX_ORDER_SHARE_ENCODED_LENGTH = 1_000_000;

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function cloneJson<T>(value: T): T {
  return JSON.parse(canonicalStringify(value)) as T;
}

function freeze<T>(value: T): Readonly<T> {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value as object)) freeze(child);
    Object.freeze(value);
  }
  return value;
}

function canonicalLocales(value: unknown): string[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((locale) => !isNonEmptyString(locale))
  ) {
    throw new Error("Assembly Order locales must be a non-empty BCP-47 list.");
  }
  try {
    const locales = value.map(
      (locale) => Intl.getCanonicalLocales(locale as string)[0],
    );
    if (
      locales.some((locale) => !locale) ||
      new Set(locales).size !== locales.length
    ) {
      throw new Error();
    }
    return locales;
  } catch {
    throw new Error("Assembly Order locales must be a unique BCP-47 list.");
  }
}

function uniqueStrings(value: unknown, name: string): string[] {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((item) => !isNonEmptyString(item)) ||
    new Set(value).size !== value.length
  ) {
    throw new Error(`${name} must be a non-empty unique string list.`);
  }
  return [...value] as string[];
}

export function createAssemblyOrderSelection(
  input: AssemblyOrderSelection,
): Readonly<AssemblyOrderSelection> {
  if (
    !isPlainObject(input) ||
    !isNonEmptyString(input.presetSlug) ||
    !isNonEmptyString(input.recipeSlug) ||
    !PROFILES.includes(input.profile) ||
    !isNonEmptyString(input.productId) ||
    !PLATFORM_CHROME.includes(input.platformChrome) ||
    !isPlainObject(input.safeOverrides)
  ) {
    throw new Error("Invalid Assembly Order selection.");
  }
  const safeOverrides = cloneJson(input.safeOverrides);
  if (!isPlainObject(safeOverrides)) {
    throw new Error("Assembly Order safeOverrides must be a JSON object.");
  }
  return freeze({
    presetSlug: input.presetSlug,
    recipeSlug: input.recipeSlug,
    profile: input.profile,
    capabilitySlugs: uniqueStrings(
      input.capabilitySlugs,
      "Assembly Order capabilities",
    ),
    safeOverrides: safeOverrides as JsonObject,
    productId: input.productId,
    locales: canonicalLocales(input.locales),
    platformChrome: input.platformChrome,
  });
}

export function updateAssemblyOrderSelection(
  current: Readonly<AssemblyOrderSelection>,
  patch: Partial<AssemblyOrderSelection>,
): Readonly<AssemblyOrderSelection> {
  return createAssemblyOrderSelection({
    ...current,
    ...patch,
    capabilitySlugs: [
      ...(patch.capabilitySlugs ?? current.capabilitySlugs),
    ],
    locales: [...(patch.locales ?? current.locales)],
    safeOverrides: cloneJson(patch.safeOverrides ?? current.safeOverrides),
  });
}

type SharedOrderEnvelope = {
  schemaVersion: 1;
  mode: "read-only";
  order: OrderManifest;
};

function projectOrder(order: OrderManifest): OrderManifest {
  return cloneJson({
    schemaVersion: order.schemaVersion,
    identity: {
      orderId: order.identity.orderId,
      revision: order.identity.revision,
      status: order.identity.status,
      createdAt: order.identity.createdAt,
      ...(order.identity.confirmedAt
        ? { confirmedAt: order.identity.confirmedAt }
        : {}),
      manifestHash: order.identity.manifestHash,
    },
    ...(order.lineage
      ? {
          lineage: {
            parentOrderId: order.lineage.parentOrderId,
            parentRevision: order.lineage.parentRevision,
            parentHash: order.lineage.parentHash,
            reason: order.lineage.reason,
          },
        }
      : {}),
    target: cloneJson(order.target),
    preset: cloneJson(order.preset),
    composition: {
      recipe: cloneJson(order.composition.recipe),
      capabilities: [...order.composition.capabilities],
      components: order.composition.components.map((component) => ({
        slug: component.slug,
        contractHash: component.contractHash,
        sourceFiles: [...component.sourceFiles],
      })),
      assets: order.composition.assets.map((asset) => ({
        kind: asset.kind,
        ...(asset.id ? { id: asset.id } : {}),
        requirement: asset.requirement,
        required: asset.required,
        source: asset.source,
      })),
    },
    safeOverrides: cloneJson(order.safeOverrides),
    lockedVisualSnapshot: cloneJson(order.lockedVisualSnapshot),
    previewScenarios: cloneJson(order.previewScenarios),
    referenceEvidence: cloneJson(order.referenceEvidence),
    ...(order.confirmation
      ? { confirmation: cloneJson(order.confirmation) }
      : {}),
    derivedArtifacts: cloneJson(order.derivedArtifacts),
  }) as OrderManifest;
}

function assertSharedOrder(value: unknown): asserts value is OrderManifest {
  if (
    !isPlainObject(value) ||
    value.schemaVersion !== 1 ||
    !isPlainObject(value.identity) ||
    !isNonEmptyString(value.identity.orderId) ||
    !Number.isInteger(value.identity.revision) ||
    !["draft", "confirmed"].includes(String(value.identity.status)) ||
    !/^[a-f0-9]{64}$/.test(String(value.identity.manifestHash)) ||
    !isPlainObject(value.target) ||
    !isPlainObject(value.preset) ||
    !isPlainObject(value.composition) ||
    !isPlainObject(value.safeOverrides) ||
    !isPlainObject(value.lockedVisualSnapshot) ||
    !isPlainObject(value.previewScenarios) ||
    !isPlainObject(value.referenceEvidence) ||
    !isPlainObject(value.derivedArtifacts)
  ) {
    throw new Error("Invalid read-only Order share.");
  }
}

function toBase64Url(value: string): string {
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/u, "");
}

function fromBase64Url(value: string): string {
  if (!/^[A-Za-z0-9_-]+$/u.test(value)) {
    throw new Error("Invalid read-only Order share.");
  }
  const remainder = value.length % 4;
  if (remainder === 1) throw new Error("Invalid read-only Order share.");
  const padded = `${value.replace(/-/g, "+").replace(/_/g, "/")}${"=".repeat(
    (4 - remainder) % 4,
  )}`;
  try {
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) =>
      character.charCodeAt(0),
    );
    return new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  } catch {
    throw new Error("Invalid read-only Order share.");
  }
}

export function encodeOrderShare(order: OrderManifest): string {
  assertSharedOrder(order);
  const envelope: SharedOrderEnvelope = {
    schemaVersion: 1,
    mode: "read-only",
    order: projectOrder(order),
  };
  const encoded = toBase64Url(JSON.stringify(envelope));
  if (encoded.length > MAX_ORDER_SHARE_ENCODED_LENGTH) {
    throw new Error("Read-only Order share is too large.");
  }
  return encoded;
}

export function decodeOrderShare(value: string): Readonly<OrderManifest> {
  if (!isNonEmptyString(value)) {
    throw new Error("Invalid read-only Order share.");
  }
  if (value.length > MAX_ORDER_SHARE_ENCODED_LENGTH) {
    throw new Error("Read-only Order share is too large.");
  }
  try {
    const envelope = JSON.parse(fromBase64Url(value)) as unknown;
    if (
      !isPlainObject(envelope) ||
      Object.keys(envelope).some(
        (key) => !["schemaVersion", "mode", "order"].includes(key),
      ) ||
      envelope.schemaVersion !== 1 ||
      envelope.mode !== "read-only"
    ) {
      throw new Error();
    }
    assertSharedOrder(envelope.order);
    return freeze(projectOrder(envelope.order));
  } catch {
    throw new Error("Invalid read-only Order share.");
  }
}

export function serializeAssemblyOrder(order: OrderManifest): string {
  assertSharedOrder(order);
  return canonicalStringify(projectOrder(order));
}

const IGNORED_SEMANTIC_PATHS = new Set([
  "identity",
  "confirmation",
  "lineage",
  "preset.catalogSource",
]);

function isIgnoredSemanticPath(path: string): boolean {
  return (
    IGNORED_SEMANTIC_PATHS.has(path) ||
    /^referenceEvidence\.cases\[\d+\]\.goldenSha256$/u.test(path)
  );
}

function diffValues(
  before: unknown,
  after: unknown,
  path: string,
  changes: SemanticOrderChange[],
): void {
  if (isIgnoredSemanticPath(path)) return;
  if (Object.is(before, after)) return;
  if (Array.isArray(before) && Array.isArray(after)) {
    const length = Math.max(before.length, after.length);
    for (let index = 0; index < length; index += 1) {
      diffValues(before[index], after[index], `${path}[${index}]`, changes);
    }
    return;
  }
  if (isPlainObject(before) && isPlainObject(after)) {
    const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])].sort();
    for (const key of keys) {
      diffValues(
        before[key],
        after[key],
        path ? `${path}.${key}` : key,
        changes,
      );
    }
    return;
  }
  changes.push({
    path,
    before: cloneJson(before ?? null),
    after: cloneJson(after ?? null),
  });
}

export function diffAssemblyOrders(
  before: OrderManifest,
  after: OrderManifest,
): SemanticOrderChange[] {
  const changes: SemanticOrderChange[] = [];
  diffValues(before, after, "", changes);
  return changes.sort((left, right) => left.path.localeCompare(right.path));
}
