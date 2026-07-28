import { buildCatalog, type CatalogItem } from "@/lib/catalog";
import {
  canonicalStringify,
  type JsonObject,
} from "@/lib/contracts/canonical-json";
import {
  assertOrderManifestMatchesCatalog,
  confirmOrderManifest,
  createOrderDraftFromResolution,
  createOrderRevision,
  type OrderManifest,
  type OrderAcceptanceCapture,
  type OrderVisualAcceptance,
  parseOrderManifest,
  recordOrderAcceptanceCaptures,
} from "@/lib/order-manifest";
import { resolveSystemPresetOrder } from "@/lib/system-presets/resolve";
import { createAssemblyOrderSelection } from "./client";
import type { TrustedVisualEvidence } from "./visual-evidence";
import type {
  AssemblyOrderActionRequest,
  AssemblyOrderErrorCode,
  AssemblyOrderSelection,
} from "./types";

type TrustedVisualEvidenceRequest = {
  manifest: Readonly<OrderManifest>;
  requestedCaptures: readonly OrderAcceptanceCapture[];
  catalog: readonly CatalogItem[];
};

const APPROVED_EVIDENCE_UNAVAILABLE_MESSAGE =
  "Approved reference acceptance evidence is unavailable; candidate regression captures cannot confirm or validate a confirmed order.";

export type AssemblyOrderServiceDependencies = {
  loadCatalog?: () => Promise<CatalogItem[]>;
  loadTrustedVisualEvidence?: (
    request: TrustedVisualEvidenceRequest,
  ) => Promise<TrustedVisualEvidence | null>;
  now?: () => string;
  createOrderId?: () => string;
};

export class AssemblyOrderServiceError extends Error {
  readonly code: AssemblyOrderErrorCode;

  constructor(code: AssemblyOrderErrorCode, message: string) {
    super(message);
    this.name = "AssemblyOrderServiceError";
    this.code = code;
  }
}

function invalidRequest(message = "Invalid Assembly Order request."): never {
  throw new AssemblyOrderServiceError("INVALID_REQUEST", message);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function assertExactKeys(
  value: unknown,
  allowed: readonly string[],
  required: readonly string[],
  name: string,
): asserts value is Record<string, unknown> {
  if (!isPlainObject(value)) invalidRequest(`${name} must be a JSON object.`);
  const unknown = Object.keys(value).filter((key) => !allowed.includes(key));
  const missing = required.filter((key) => !(key in value));
  if (unknown.length > 0 || missing.length > 0) {
    invalidRequest(`Invalid ${name} fields.`);
  }
}

function assertOptionalString(
  value: unknown,
  name: string,
): asserts value is string | undefined {
  if (value !== undefined && !isNonEmptyString(value)) {
    invalidRequest(`${name} must be a non-empty string.`);
  }
}

function assertOptionalIso(
  value: unknown,
  name: string,
): asserts value is string | undefined {
  if (value === undefined) return;
  if (
    !isNonEmptyString(value) ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString() !== value
  ) {
    invalidRequest(`${name} must be an ISO-8601 timestamp.`);
  }
}

const SELECTION_KEYS = [
  "presetSlug",
  "recipeSlug",
  "profile",
  "capabilitySlugs",
  "safeOverrides",
  "productId",
  "locales",
  "platformChrome",
] as const;

function parseSelection(value: unknown): Readonly<AssemblyOrderSelection> {
  assertExactKeys(value, SELECTION_KEYS, SELECTION_KEYS, "nextSelection");
  try {
    return createAssemblyOrderSelection(value as AssemblyOrderSelection);
  } catch {
    return invalidRequest("Invalid Assembly Order selection.");
  }
}

function parseCaptures(value: unknown): OrderAcceptanceCapture[] {
  if (!Array.isArray(value) || value.length === 0) {
    return invalidRequest("captures must be a non-empty array.");
  }
  const captures = value.map((capture) => {
    assertExactKeys(
      capture,
      ["caseId", "goldenSha256"],
      ["caseId", "goldenSha256"],
      "capture",
    );
    if (
      !isNonEmptyString(capture.caseId) ||
      typeof capture.goldenSha256 !== "string" ||
      !/^[a-f0-9]{64}$/.test(capture.goldenSha256)
    ) {
      return invalidRequest("Invalid reference capture.");
    }
    return {
      caseId: capture.caseId,
      goldenSha256: capture.goldenSha256,
    };
  });
  if (new Set(captures.map((capture) => capture.caseId)).size !== captures.length) {
    return invalidRequest("Reference capture case IDs must be unique.");
  }
  return captures;
}

function parseReview(
  value: unknown,
  expectedCaseIds: readonly string[],
): void {
  assertExactKeys(
    value,
    ["explicitlyConfirmed", "reviewedCaseIds"],
    ["explicitlyConfirmed", "reviewedCaseIds"],
    "review",
  );
  if (value.explicitlyConfirmed !== true || !Array.isArray(value.reviewedCaseIds)) {
    invalidRequest("Explicit full-matrix review is required.");
  }
  const caseIds = value.reviewedCaseIds;
  if (
    caseIds.some((caseId) => !isNonEmptyString(caseId)) ||
    new Set(caseIds).size !== caseIds.length ||
    caseIds.length !== expectedCaseIds.length ||
    caseIds.some((caseId) => !expectedCaseIds.includes(caseId))
  ) {
    invalidRequest("Reviewed case IDs must exactly match the preview matrix.");
  }
}

function parseVisualAcceptance(
  value: unknown,
  expectedCaseIds: readonly string[],
): OrderVisualAcceptance {
  assertExactKeys(
    value,
    ["approvedAt", "approvedBy", "decisionEvidence", "reviewedCaseIds"],
    ["approvedAt", "approvedBy", "decisionEvidence", "reviewedCaseIds"],
    "visualAcceptance",
  );
  if (
    !isNonEmptyString(value.approvedAt) ||
    Number.isNaN(Date.parse(value.approvedAt)) ||
    new Date(value.approvedAt).toISOString() !== value.approvedAt ||
    !isNonEmptyString(value.approvedBy) ||
    !isNonEmptyString(value.decisionEvidence) ||
    !Array.isArray(value.reviewedCaseIds)
  ) {
    invalidRequest("Invalid trusted visual acceptance provenance.");
  }
  const reviewedCaseIds = value.reviewedCaseIds;
  if (
    reviewedCaseIds.some((caseId) => !isNonEmptyString(caseId)) ||
    new Set(reviewedCaseIds).size !== reviewedCaseIds.length ||
    reviewedCaseIds.length !== expectedCaseIds.length ||
    reviewedCaseIds.some((caseId) => !expectedCaseIds.includes(caseId))
  ) {
    invalidRequest(
      "Trusted visual acceptance must exactly cover the reference cases.",
    );
  }
  return {
    approvedAt: value.approvedAt,
    approvedBy: value.approvedBy,
    decisionEvidence: value.decisionEvidence,
    reviewedCaseIds,
  };
}

function parseTrustedVisualEvidence(
  value: unknown,
  expectedCaseIds: readonly string[],
): TrustedVisualEvidence {
  assertExactKeys(
    value,
    ["captures", "visualAcceptance"],
    ["captures", "visualAcceptance"],
    "trusted visual evidence",
  );
  return {
    captures: parseCaptures(value.captures),
    visualAcceptance: parseVisualAcceptance(
      value.visualAcceptance,
      expectedCaseIds,
    ),
  };
}

function capturesMatch(
  requested: readonly OrderAcceptanceCapture[],
  trusted: readonly OrderAcceptanceCapture[],
): boolean {
  if (requested.length !== trusted.length) return false;
  const normalize = (captures: readonly OrderAcceptanceCapture[]) =>
    captures
      .map((capture) => `${capture.caseId}:${capture.goldenSha256}`)
      .sort();
  return normalize(requested).every(
    (capture, index) => capture === normalize(trusted)[index],
  );
}

function visualAcceptanceMatches(
  actual: OrderVisualAcceptance,
  trusted: OrderVisualAcceptance,
): boolean {
  return (
    canonicalStringify(actual as unknown as JsonObject) ===
    canonicalStringify(trusted as unknown as JsonObject)
  );
}

function capturesFromManifest(
  manifest: Readonly<OrderManifest>,
): OrderAcceptanceCapture[] {
  return manifest.referenceEvidence.cases.map((item) => ({
    caseId: item.id,
    goldenSha256: item.goldenSha256 as string,
  }));
}

async function loadTrustedEvidence(
  dependencies: AssemblyOrderServiceDependencies,
  request: TrustedVisualEvidenceRequest,
): Promise<TrustedVisualEvidence> {
  if (!dependencies.loadTrustedVisualEvidence) {
    throw new AssemblyOrderServiceError(
      "REFERENCE_EVIDENCE_UNAVAILABLE",
      APPROVED_EVIDENCE_UNAVAILABLE_MESSAGE,
    );
  }
  let evidence: TrustedVisualEvidence | null;
  try {
    evidence = await dependencies.loadTrustedVisualEvidence(request);
  } catch {
    throw new AssemblyOrderServiceError(
      "REFERENCE_EVIDENCE_UNAVAILABLE",
      APPROVED_EVIDENCE_UNAVAILABLE_MESSAGE,
    );
  }
  if (!evidence) {
    throw new AssemblyOrderServiceError(
      "REFERENCE_EVIDENCE_UNAVAILABLE",
      APPROVED_EVIDENCE_UNAVAILABLE_MESSAGE,
    );
  }
  try {
    return parseTrustedVisualEvidence(
      evidence,
      request.manifest.referenceEvidence.cases.map((item) => item.id),
    );
  } catch {
    throw new AssemblyOrderServiceError(
      "REFERENCE_EVIDENCE_UNAVAILABLE",
      APPROVED_EVIDENCE_UNAVAILABLE_MESSAGE,
    );
  }
}

function parseTrustedManifest(value: unknown): Readonly<OrderManifest> {
  try {
    return parseOrderManifest(value);
  } catch {
    return invalidRequest("Invalid Order Manifest.");
  }
}

function assertCatalogPolicy(
  order: unknown,
  catalog: CatalogItem[],
): asserts order is OrderManifest {
  try {
    assertOrderManifestMatchesCatalog(order, catalog);
  } catch {
    throw new AssemblyOrderServiceError(
      "ORDER_POLICY_MISMATCH",
      "Order Manifest does not match the trusted Catalog.",
    );
  }
}

function resolvedDraft(
  selection: Readonly<AssemblyOrderSelection>,
  catalog: CatalogItem[],
  identity: { orderId: string; createdAt: string },
): Readonly<OrderManifest> {
  try {
    const resolution = resolveSystemPresetOrder({
      presetSlug: selection.presetSlug,
      recipeSlug: selection.recipeSlug,
      profile: selection.profile,
      capabilitySlugs: [...selection.capabilitySlugs],
      safeOverrides: selection.safeOverrides as JsonObject,
      catalog,
    });
    const order = createOrderDraftFromResolution(resolution, {
      ...identity,
      productId: selection.productId,
      locales: [...selection.locales],
      platformChrome: selection.platformChrome,
      catalogSource: "trusted-server-catalog",
    });
    assertOrderManifestMatchesCatalog(order, catalog);
    return order;
  } catch (error) {
    if (error instanceof AssemblyOrderServiceError) throw error;
    throw new AssemblyOrderServiceError(
      "ORDER_POLICY_MISMATCH",
      "Assembly Order selection does not match the trusted Catalog.",
    );
  }
}

function nextRevisionSections(order: Readonly<OrderManifest>) {
  return {
    target: order.target,
    preset: order.preset,
    composition: order.composition,
    safeOverrides: order.safeOverrides,
    lockedVisualSnapshot: order.lockedVisualSnapshot,
    previewScenarios: order.previewScenarios,
    referenceEvidence: order.referenceEvidence,
    derivedArtifacts: order.derivedArtifacts,
  };
}

/**
 * Stateless server policy boundary. A trusted Catalog is loaded on every
 * action; no client-provided Catalog or golden hash is authoritative.
 */
export async function processAssemblyOrderAction(
  input: unknown,
  dependencies: AssemblyOrderServiceDependencies = {},
): Promise<Readonly<OrderManifest>> {
  if (!isPlainObject(input) || typeof input.action !== "string") {
    return invalidRequest();
  }
  if (!["resolve", "import", "confirm", "revise"].includes(input.action)) {
    return invalidRequest("Unknown Assembly Order action.");
  }

  const loadCatalog = dependencies.loadCatalog ?? buildCatalog;
  const catalog = await loadCatalog();
  const now = dependencies.now ?? (() => new Date().toISOString());
  const createOrderId =
    dependencies.createOrderId ?? (() => globalThis.crypto.randomUUID());

  switch (input.action) {
    case "resolve": {
      assertExactKeys(
        input,
        ["action", ...SELECTION_KEYS, "orderId", "createdAt"],
        ["action", ...SELECTION_KEYS],
        "resolve request",
      );
      assertOptionalString(input.orderId, "orderId");
      assertOptionalIso(input.createdAt, "createdAt");
      const {
        action: _action,
        orderId,
        createdAt,
        ...selectionInput
      } = input;
      const selection = parseSelection(selectionInput);
      return resolvedDraft(selection, catalog, {
        orderId: orderId ?? createOrderId(),
        createdAt: createdAt ?? now(),
      });
    }
    case "import": {
      assertExactKeys(
        input,
        ["action", "manifest"],
        ["action", "manifest"],
        "import request",
      );
      const order = parseTrustedManifest(input.manifest);
      assertCatalogPolicy(order, catalog);
      if (order.identity.status === "confirmed") {
        const requestedCaptures = capturesFromManifest(order);
        const trustedEvidence = await loadTrustedEvidence(dependencies, {
          manifest: order,
          requestedCaptures,
          catalog,
        });
        if (
          !capturesMatch(requestedCaptures, trustedEvidence.captures) ||
          !order.confirmation ||
          !visualAcceptanceMatches(
            order.confirmation.visualAcceptance,
            trustedEvidence.visualAcceptance,
          )
        ) {
          throw new AssemblyOrderServiceError(
            "REFERENCE_EVIDENCE_MISMATCH",
            "Imported confirmation does not match current approved visual evidence.",
          );
        }
      }
      return order;
    }
    case "confirm": {
      assertExactKeys(
        input,
        ["action", "draft", "captures", "review", "reviewerId", "confirmedAt"],
        ["action", "draft", "captures", "review"],
        "confirm request",
      );
      assertOptionalString(input.reviewerId, "reviewerId");
      assertOptionalIso(input.confirmedAt, "confirmedAt");
      const draft = parseTrustedManifest(input.draft);
      assertCatalogPolicy(draft, catalog);
      if (draft.identity.status !== "draft") {
        return invalidRequest("Only draft orders can be confirmed.");
      }
      parseReview(input.review, draft.previewScenarios.caseIds);
      const requestedCaptures = parseCaptures(input.captures);
      const parsedTrustedEvidence = await loadTrustedEvidence(dependencies, {
        manifest: draft,
        requestedCaptures,
        catalog,
      });
      const parsedTrustedCaptures = parsedTrustedEvidence.captures;
      if (!capturesMatch(requestedCaptures, parsedTrustedCaptures)) {
        throw new AssemblyOrderServiceError(
          "REFERENCE_EVIDENCE_MISMATCH",
          "Requested captures do not match current approved visual evidence.",
        );
      }
      try {
        const recorded = recordOrderAcceptanceCaptures(
          draft,
          parsedTrustedCaptures,
          catalog,
        );
        return confirmOrderManifest(
          recorded,
          {
            confirmedAt: input.confirmedAt ?? now(),
            ...(input.reviewerId ? { reviewerId: input.reviewerId } : {}),
            visualAcceptance: parsedTrustedEvidence.visualAcceptance,
          },
          catalog,
        );
      } catch {
        return invalidRequest("Order could not be confirmed.");
      }
    }
    case "revise": {
      assertExactKeys(
        input,
        ["action", "parent", "nextSelection", "reason", "createdAt"],
        ["action", "parent", "nextSelection", "reason"],
        "revise request",
      );
      if (!isNonEmptyString(input.reason)) {
        return invalidRequest("reason must be a non-empty string.");
      }
      assertOptionalIso(input.createdAt, "createdAt");
      const parent = parseTrustedManifest(input.parent);
      assertCatalogPolicy(parent, catalog);
      if (parent.identity.status !== "confirmed") {
        return invalidRequest("Only confirmed orders can be revised.");
      }
      const selection = parseSelection(input.nextSelection);
      const createdAt = input.createdAt ?? now();
      const nextDraft = resolvedDraft(selection, catalog, {
        orderId: parent.identity.orderId,
        createdAt,
      });
      try {
        const revision = createOrderRevision(parent, {
          createdAt,
          reason: input.reason,
          nextSections: nextRevisionSections(nextDraft),
        });
        assertOrderManifestMatchesCatalog(revision, catalog);
        return revision;
      } catch {
        return invalidRequest("Order revision is invalid.");
      }
    }
    default:
      return invalidRequest("Unknown Assembly Order action.");
  }
}

export type { AssemblyOrderActionRequest };
