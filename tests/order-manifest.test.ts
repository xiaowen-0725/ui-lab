import { describe, expect, test } from "bun:test";
import { canonicalSha256, canonicalStringify } from "@/lib/contracts/canonical-json";
import {
  assertValidOrderManifest,
  confirmOrderManifest,
  createOrderManifestDraft,
  createOrderRevision,
  isOrderManifestHashValid,
  parseOrderManifest,
  type OrderManifestDraftInput,
} from "@/lib/order-manifest";

const HASH = "a".repeat(64);

function draftInput(): OrderManifestDraftInput {
  return {
    identity: {
      orderId: "parking-desktop",
      revision: 1,
      createdAt: "2026-07-28T09:30:00.000Z",
    },
    target: {
      category: "application" as const,
      profile: "electron-renderer" as const,
      productId: "parking-agent",
      locales: ["zh-CN"],
      platformChrome: "native" as const,
    },
    preset: {
      slug: "codex-desktop-v1",
      version: 1,
      contractHash: HASH,
      catalogSource: "snapshot",
      catalogSnapshotHash: HASH,
    },
    composition: {
      recipe: { slug: "agent-workbench", contractHash: HASH },
      capabilities: ["tasks", "connectors"],
      components: [
        {
          slug: "agent-workbench",
          contractHash: HASH,
          sourceFiles: ["components/motion/agent-workbench/index.tsx"],
        },
      ],
    },
    safeOverrides: { branding: "Parking Agent" },
    lockedVisualSnapshot: { density: "high" },
    previewScenarios: {
      fixture: { id: "parking-high-density-v1", version: 1, fixtureHash: HASH },
      caseIds: ["wide-light-task-dense"],
    },
    referenceEvidence: {
      referencePackId: "codex-desktop-v1",
      referencePackHash: HASH,
      cases: [
        {
          id: "wide-light-task-dense",
          size: "1440x900",
          scale: 1,
          theme: "light",
          states: ["dense"],
          fixtureId: "parking-high-density-v1",
          goldenSha256: null as string | null,
        },
      ],
    },
    derivedArtifacts: { designMd: "DESIGN.md" },
  };
}

describe("canonical JSON", () => {
  test("sorts object keys and produces the known SHA-256", () => {
    expect(canonicalStringify({ b: 2, a: 1 })).toBe('{"a":1,"b":2}');
    expect(canonicalSha256({ b: 2, a: 1 })).toBe(
      "43258cff783fe7036d8a43033f830adfc60ec037382473548ac742b888292777",
    );
  });

  test("rejects non-JSON values instead of silently changing them", () => {
    for (const value of [undefined, Number.NaN, Infinity, () => {}, Symbol("x"), BigInt(1)]) {
      expect(() => canonicalStringify(value)).toThrow();
    }
    expect(() => canonicalStringify({ optional: undefined })).toThrow();
    expect(() => canonicalStringify(new Date())).toThrow();
  });
});

describe("OrderManifest v1", () => {
  test("creates an immutable, hash-valid draft snapshot", () => {
    const draft = createOrderManifestDraft(draftInput());

    expect(draft.identity.status).toBe("draft");
    expect(draft.identity.manifestHash).toMatch(/^[a-f0-9]{64}$/);
    expect(isOrderManifestHashValid(draft)).toBe(true);
    expect(Object.isFrozen(draft)).toBe(true);
    expect(Object.isFrozen(draft.composition.components)).toBe(true);
    expect(() => {
      (draft.safeOverrides as { branding: string }).branding = "mutated";
    }).toThrow();
  });

  test("parses only known-schema JSON into an immutable value", () => {
    const draft = createOrderManifestDraft(draftInput());
    const parsed = parseOrderManifest(JSON.parse(JSON.stringify(draft)));

    expect(parsed).toEqual(draft);
    expect(Object.isFrozen(parsed)).toBe(true);
    expect(() => parseOrderManifest({ ...draft, unexpected: true })).toThrow(
      /Invalid OrderManifest.*unknown/i,
    );
  });

  test("rejects revision-two drafts without valid lineage", () => {
    const input = draftInput();
    input.identity.revision = 2;

    expect(() => createOrderManifestDraft(input)).toThrow(/lineage/i);
  });

  test("rejects mismatched preview cases and fixture references", () => {
    const input = draftInput();
    input.previewScenarios.caseIds = ["other-case"];
    expect(() => createOrderManifestDraft(input)).toThrow(/case/i);

    const wrongFixture = draftInput();
    wrongFixture.referenceEvidence.cases[0].fixtureId = "other-fixture";
    expect(() => createOrderManifestDraft(wrongFixture)).toThrow(/fixture/i);
  });

  test("refuses confirmation until every reference case has a golden hash", () => {
    const draft = createOrderManifestDraft(draftInput());

    expect(() =>
      confirmOrderManifest(draft, {
        confirmedAt: "2026-07-28T10:00:00.000Z",
        reviewerId: "reviewer-1",
      }),
    ).toThrow(/golden/i);
  });

  test("confirms a golden-backed manifest and detects JSON tampering", () => {
    const input = draftInput();
    input.referenceEvidence.cases[0].goldenSha256 = "b".repeat(64);
    const draft = createOrderManifestDraft(input);
    const confirmed = confirmOrderManifest(draft, {
      confirmedAt: "2026-07-28T10:00:00.000Z",
      reviewerId: "reviewer-1",
    });

    expect(confirmed.identity.status).toBe("confirmed");
    expect(confirmed.confirmation?.previewMatrixHash).toBe(
      canonicalSha256(confirmed.referenceEvidence.cases),
    );
    expect(isOrderManifestHashValid(confirmed)).toBe(true);

    const tampered = JSON.parse(JSON.stringify(confirmed));
    tampered.safeOverrides.branding = "tampered";
    expect(() => assertValidOrderManifest(tampered)).toThrow(/hash/i);
  });

  test("revises a confirmed parent without mutating it", () => {
    const input = draftInput();
    input.referenceEvidence.cases[0].goldenSha256 = "b".repeat(64);
    const confirmed = confirmOrderManifest(createOrderManifestDraft(input), {
      confirmedAt: "2026-07-28T10:00:00.000Z",
    });
    const revision = createOrderRevision(confirmed, {
      createdAt: "2026-07-29T09:00:00.000Z",
      reason: "Add connector calibration",
      nextSections: {
        target: { ...confirmed.target, productId: "parking-agent-next" },
        preset: { ...confirmed.preset, slug: "codex-desktop-v2" },
        composition: { ...confirmed.composition, capabilities: ["tasks", "connectors", "board"] },
        safeOverrides: { branding: "Parking Agent v2" },
        lockedVisualSnapshot: { density: "high" },
        previewScenarios: confirmed.previewScenarios,
        referenceEvidence: confirmed.referenceEvidence,
        derivedArtifacts: { designMd: "DESIGN-v2.md" },
      },
    });

    expect(revision.identity).toMatchObject({ orderId: confirmed.identity.orderId, revision: 2, status: "draft" });
    expect(revision.lineage).toMatchObject({ parentOrderId: confirmed.identity.orderId, parentRevision: 1, parentHash: confirmed.identity.manifestHash });
    expect(revision.identity.manifestHash).not.toBe(confirmed.identity.manifestHash);
    expect(revision.preset.slug).toBe("codex-desktop-v2");
    expect(revision.composition.capabilities).toEqual(["tasks", "connectors", "board"]);
    expect(confirmed.identity.revision).toBe(1);
    expect(confirmed.safeOverrides).toEqual({ branding: "Parking Agent" });
  });
});
