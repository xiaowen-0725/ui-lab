import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";
import type {
  OrderAcceptanceCapture,
  OrderVisualAcceptance,
} from "@/lib/order-manifest";
import { CODEX_DESKTOP_V1 } from "@/lib/system-presets/codex-desktop-v1";

export type VisualEvidenceCase = {
  caseId: string;
  path: string;
  size: string;
  scale: number;
  theme: "light" | "dark";
  sha256: string;
};

export type VisualEvidenceAcceptance =
  | { status: "pending" }
  | {
      status: "approved";
      approvedAt: string;
      approvedBy: string;
      decisionEvidence: string;
      reviewedCaseIds: string[];
    };

export type VisualEvidence = {
  schemaVersion: 1;
  evidenceRole: "candidate-regression";
  presetSlug: string;
  referencePackId: string;
  referencePackHash: string;
  fixtureId: string;
  fixtureHash: string;
  acceptance: VisualEvidenceAcceptance;
  cases: VisualEvidenceCase[];
};

export type TrustedVisualEvidence = {
  captures: readonly OrderAcceptanceCapture[];
  visualAcceptance: Readonly<OrderVisualAcceptance>;
};

export type VisualEvidenceResult =
  | {
      available: true;
      acceptanceStatus: VisualEvidenceAcceptance["status"];
      evidence: VisualEvidence;
      candidateCaptures: readonly VisualEvidenceCase[];
      trustedEvidence: TrustedVisualEvidence | null;
    }
  | {
      available: false;
      acceptanceStatus: "unavailable";
      reason: string;
    };

const DEFAULT_ROOT = process.cwd();
const DEFAULT_INDEX = resolve(
  DEFAULT_ROOT,
  "content/system-presets/codex-desktop-v1/candidate-evidence.json",
);
const EXPECTED = CODEX_DESKTOP_V1.referencePack;
const EXPECTED_CASE_IDS = EXPECTED.cases.map((item) => item.id);
const INDEX_KEYS = [
  "schemaVersion",
  "evidenceRole",
  "presetSlug",
  "referencePackId",
  "referencePackHash",
  "fixtureId",
  "fixtureHash",
  "acceptance",
  "cases",
] as const;
const CASE_KEYS = [
  "caseId",
  "path",
  "size",
  "scale",
  "theme",
  "sha256",
] as const;
const PENDING_ACCEPTANCE_KEYS = ["status"] as const;
const APPROVED_ACCEPTANCE_KEYS = [
  "status",
  "approvedAt",
  "approvedBy",
  "decisionEvidence",
  "reviewedCaseIds",
] as const;

function unavailable(
  reason: string,
): Extract<VisualEvidenceResult, { available: false }> {
  return { available: false, acceptanceStatus: "unavailable", reason };
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function hasExactKeys(
  value: Record<string, unknown>,
  expectedKeys: readonly string[],
): boolean {
  const keys = Object.keys(value);
  return (
    keys.length === expectedKeys.length &&
    keys.every((key) => expectedKeys.includes(key))
  );
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isSha256(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{64}$/.test(value);
}

function isIsoTimestamp(value: unknown): value is string {
  return (
    isNonEmptyString(value) &&
    !Number.isNaN(Date.parse(value)) &&
    new Date(value).toISOString() === value
  );
}

function sameExactCaseSet(caseIds: unknown): caseIds is string[] {
  return (
    Array.isArray(caseIds) &&
    caseIds.every(isNonEmptyString) &&
    caseIds.length === EXPECTED_CASE_IDS.length &&
    new Set(caseIds).size === caseIds.length &&
    caseIds.every((caseId) => EXPECTED_CASE_IDS.includes(caseId))
  );
}

function parseAcceptance(
  value: unknown,
):
  | VisualEvidenceAcceptance
  | Extract<VisualEvidenceResult, { available: false }> {
  if (!isPlainObject(value) || typeof value.status !== "string") {
    return unavailable("invalid visual evidence acceptance shape");
  }
  if (value.status === "pending") {
    if (!hasExactKeys(value, PENDING_ACCEPTANCE_KEYS)) {
      return unavailable("invalid pending visual evidence acceptance shape");
    }
    return { status: "pending" };
  }
  if (value.status === "approved") {
    if (!hasExactKeys(value, APPROVED_ACCEPTANCE_KEYS)) {
      return unavailable("invalid approved visual evidence acceptance shape");
    }
    if (
      !isIsoTimestamp(value.approvedAt) ||
      !isNonEmptyString(value.approvedBy) ||
      !isNonEmptyString(value.decisionEvidence) ||
      !sameExactCaseSet(value.reviewedCaseIds)
    ) {
      return unavailable("invalid approved visual evidence acceptance");
    }
    return {
      status: "approved",
      approvedAt: value.approvedAt,
      approvedBy: value.approvedBy,
      decisionEvidence: value.decisionEvidence,
      reviewedCaseIds: value.reviewedCaseIds,
    };
  }
  return unavailable("invalid visual evidence acceptance status");
}

function isUnavailable(
  value:
    | VisualEvidenceAcceptance
    | Extract<VisualEvidenceResult, { available: false }>,
): value is Extract<VisualEvidenceResult, { available: false }> {
  return "available" in value && value.available === false;
}

function parseIndex(value: unknown): VisualEvidenceResult {
  if (!isPlainObject(value) || !hasExactKeys(value, INDEX_KEYS)) {
    return unavailable("invalid visual evidence index shape");
  }
  if (value.evidenceRole !== "candidate-regression") {
    return unavailable("invalid visual evidence role");
  }
  if (
    value.schemaVersion !== 1 ||
    !isNonEmptyString(value.presetSlug) ||
    !isNonEmptyString(value.referencePackId) ||
    !isNonEmptyString(value.fixtureId) ||
    !Array.isArray(value.cases)
  ) {
    return unavailable("invalid visual evidence index shape");
  }
  if (!isSha256(value.referencePackHash) || !isSha256(value.fixtureHash)) {
    return unavailable("invalid visual evidence index SHA-256");
  }
  const acceptance = parseAcceptance(value.acceptance);
  if (isUnavailable(acceptance)) return acceptance;

  const cases: VisualEvidenceCase[] = [];
  for (const candidate of value.cases) {
    if (!isPlainObject(candidate) || !hasExactKeys(candidate, CASE_KEYS)) {
      return unavailable("invalid visual evidence case shape");
    }
    if (!isNonEmptyString(candidate.caseId)) {
      return unavailable("invalid visual evidence caseId");
    }
    if (!isNonEmptyString(candidate.path)) {
      return unavailable(`invalid visual evidence path: ${candidate.caseId}`);
    }
    if (
      !isNonEmptyString(candidate.size) ||
      !/^[1-9]\d*x[1-9]\d*$/.test(candidate.size)
    ) {
      return unavailable(`invalid visual evidence size: ${candidate.caseId}`);
    }
    if (
      typeof candidate.scale !== "number" ||
      !Number.isFinite(candidate.scale) ||
      candidate.scale <= 0
    ) {
      return unavailable(`invalid visual evidence scale: ${candidate.caseId}`);
    }
    if (candidate.theme !== "light" && candidate.theme !== "dark") {
      return unavailable(`invalid visual evidence theme: ${candidate.caseId}`);
    }
    if (!isSha256(candidate.sha256)) {
      return unavailable(
        `invalid visual evidence SHA-256: ${candidate.caseId}`,
      );
    }
    cases.push({
      caseId: candidate.caseId,
      path: candidate.path,
      size: candidate.size,
      scale: candidate.scale,
      theme: candidate.theme,
      sha256: candidate.sha256,
    });
  }

  const evidence: VisualEvidence = {
    schemaVersion: 1,
    evidenceRole: "candidate-regression",
    presetSlug: value.presetSlug,
    referencePackId: value.referencePackId,
    referencePackHash: value.referencePackHash,
    fixtureId: value.fixtureId,
    fixtureHash: value.fixtureHash,
    acceptance,
    cases,
  };
  const approvedCaptures = evidence.cases.map((item) => ({
    caseId: item.caseId,
    goldenSha256: item.sha256,
  }));
  return {
    available: true,
    acceptanceStatus: acceptance.status,
    evidence,
    candidateCaptures: evidence.cases,
    trustedEvidence:
      acceptance.status === "approved"
        ? {
            captures: approvedCaptures,
            visualAcceptance: {
              approvedAt: acceptance.approvedAt,
              approvedBy: acceptance.approvedBy,
              decisionEvidence: acceptance.decisionEvidence,
              reviewedCaseIds: acceptance.reviewedCaseIds,
            },
          }
        : null,
  };
}

export async function loadVisualEvidence(
  options: { root?: string; indexPath?: string } = {},
): Promise<VisualEvidenceResult> {
  const root = options.root ?? DEFAULT_ROOT;
  try {
    const parsed = parseIndex(
      JSON.parse(
        await readFile(options.indexPath ?? DEFAULT_INDEX, "utf8"),
      ) as unknown,
    );
    if (!parsed.available) return parsed;
    const { evidence: index } = parsed;
    if (
      index.presetSlug !== CODEX_DESKTOP_V1.slug ||
      index.referencePackId !== EXPECTED.id ||
      index.referencePackHash !== EXPECTED.contractHash ||
      index.fixtureId !== EXPECTED.fixture.id ||
      index.fixtureHash !== EXPECTED.fixture.fixtureHash
    ) {
      return unavailable("index metadata does not match the trusted preset");
    }

    const references = EXPECTED.cases;
    if (
      index.cases.length !== references.length ||
      new Set(index.cases.map((item) => item.caseId)).size !== references.length
    ) {
      return unavailable("index does not cover every reference case");
    }

    for (const reference of references) {
      const item = index.cases.find(
        (candidate) => candidate.caseId === reference.id,
      );
      if (!item) {
        return unavailable("index does not cover every reference case");
      }
      const expectedPath = `reference/${reference.id}.png`;
      if (item.path !== expectedPath) {
        return unavailable(`case path mismatch: ${reference.id}`);
      }
      if (
        item.size !== reference.size ||
        item.scale !== reference.scale ||
        item.theme !== reference.theme
      ) {
        return unavailable(`case metadata mismatch: ${reference.id}`);
      }

      const file = resolve(
        root,
        "public/system-presets/codex-desktop-v1",
        expectedPath,
      );
      const bytes = await readFile(file);
      if (createHash("sha256").update(bytes).digest("hex") !== item.sha256) {
        return unavailable(`case hash mismatch: ${reference.id}`);
      }
      const [width, height] = item.size.split("x").map(Number);
      const metadata = await sharp(bytes).metadata();
      if (metadata.format !== "png") {
        return unavailable(`case format mismatch: ${reference.id}`);
      }
      if (metadata.width !== width || metadata.height !== height) {
        return unavailable(`case dimensions mismatch: ${reference.id}`);
      }
    }

    return parsed;
  } catch (error) {
    return unavailable(
      error instanceof Error ? error.message : "visual evidence unavailable",
    );
  }
}
