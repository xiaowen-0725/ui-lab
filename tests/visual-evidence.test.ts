import { describe, expect, test } from "bun:test";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import sharp from "sharp";
import {
  type VisualEvidence,
  loadVisualEvidence,
} from "@/lib/assembly-order/visual-evidence";
import { buildCatalog } from "@/lib/catalog";
import { processAssemblyOrderAction } from "@/lib/assembly-order/service";
import { createOrderDraftFromResolution } from "@/lib/order-manifest";
import { CODEX_DESKTOP_V1 } from "@/lib/system-presets/codex-desktop-v1";
import { resolveSystemPresetOrder } from "@/lib/system-presets/resolve";

const CASE_IDS = CODEX_DESKTOP_V1.referencePack.cases.map((item) => item.id);

async function createValidTemporaryEvidence(
  acceptance: VisualEvidence["acceptance"] = { status: "pending" },
) {
  const root = await mkdtemp(join(tmpdir(), "uilab-visual-evidence-"));
  const referenceDirectory = join(
    root,
    "public/system-presets/codex-desktop-v1/reference",
  );
  await mkdir(referenceDirectory, { recursive: true });
  const entries: VisualEvidence["cases"] = [];
  for (const reference of CODEX_DESKTOP_V1.referencePack.cases) {
    const [width, height] = reference.size.split("x").map(Number);
    const file = join(referenceDirectory, `${reference.id}.png`);
    await sharp({
      create: { width, height, channels: 4, background: "white" },
    })
      .png()
      .toFile(file);
    const bytes = await Bun.file(file).arrayBuffer();
    entries.push({
      caseId: reference.id,
      path: `reference/${reference.id}.png`,
      size: reference.size,
      scale: reference.scale,
      theme: reference.theme,
      sha256: createHash("sha256")
        .update(Buffer.from(bytes))
        .digest("hex"),
    });
  }
  const index: VisualEvidence = {
    schemaVersion: 1,
    evidenceRole: "candidate-regression",
    presetSlug: CODEX_DESKTOP_V1.slug,
    referencePackId: CODEX_DESKTOP_V1.referencePack.id,
    referencePackHash: CODEX_DESKTOP_V1.referencePack.contractHash,
    fixtureId: CODEX_DESKTOP_V1.referencePack.fixture.id,
    fixtureHash: CODEX_DESKTOP_V1.referencePack.fixture.fixtureHash,
    acceptance,
    cases: entries,
  };
  const indexPath = join(root, "candidate-evidence.json");
  await writeFile(indexPath, JSON.stringify(index));
  return { root, referenceDirectory, indexPath, index };
}

function approvedAcceptance(): VisualEvidence["acceptance"] {
  return {
    status: "approved",
    approvedAt: "2026-07-28T10:00:00.000Z",
    approvedBy: "zhoujw",
    decisionEvidence: "UI Lab Codex reference-board decision #1",
    reviewedCaseIds: [...CASE_IDS],
  };
}

describe("visual evidence provider", () => {
  test("keeps the shipped complete captures as pending candidate regression evidence", async () => {
    const result = await loadVisualEvidence();

    expect(result.available).toBe(true);
    if (!result.available) throw new Error(result.reason);
    expect(result.acceptanceStatus).toBe("pending");
    expect(result.evidence.evidenceRole).toBe("candidate-regression");
    expect(result.evidence.acceptance).toEqual({ status: "pending" });
    expect(result.evidence.cases).toHaveLength(8);
    expect(result.candidateCaptures).toEqual(result.evidence.cases);
    expect(result.trustedEvidence).toBeNull();
    expect(result.evidence.cases.map((item) => item.caseId)).toEqual(CASE_IDS);
  });

  test("accepts approved evidence only with an exact reviewed case set and enables confirmation", async () => {
    const fixture = await createValidTemporaryEvidence(approvedAcceptance());
    const result = await loadVisualEvidence(fixture);

    expect(result.available).toBe(true);
    if (!result.available) throw new Error(result.reason);
    expect(result.acceptanceStatus).toBe("approved");
    expect(result.trustedEvidence).toEqual({
      visualAcceptance: {
        approvedAt: "2026-07-28T10:00:00.000Z",
        approvedBy: "zhoujw",
        decisionEvidence: "UI Lab Codex reference-board decision #1",
        reviewedCaseIds: CASE_IDS,
      },
      captures: result.evidence.cases.map((item) => ({
        caseId: item.caseId,
        goldenSha256: item.sha256,
      })),
    });
    const catalog = await buildCatalog();
    const selection = {
      presetSlug: "codex-desktop-v1",
      recipeSlug: "agent-workbench",
      profile: "electron-renderer" as const,
      capabilitySlugs: ["tasks", "artifact", "board", "connectors", "settings"],
      safeOverrides: {},
      productId: "parking-agent",
      locales: ["zh-CN"],
      platformChrome: "native" as const,
    };
    const draft = createOrderDraftFromResolution(
      resolveSystemPresetOrder({ ...selection, catalog }),
      {
        orderId: "approved-evidence-order",
        createdAt: "2026-07-28T09:30:00.000Z",
        productId: "parking-agent",
        locales: ["zh-CN"],
        platformChrome: "native",
        catalogSource: "test",
      },
    );
    const captures = result.evidence.cases.map((item) => ({
      caseId: item.caseId,
      goldenSha256: item.sha256,
    }));
    const confirmed = await processAssemblyOrderAction(
      {
        action: "confirm",
        draft,
        captures,
        review: {
          explicitlyConfirmed: true,
          reviewedCaseIds: draft.previewScenarios.caseIds,
        },
      },
      {
        loadCatalog: async () => catalog,
        loadTrustedVisualEvidence: async () => result.trustedEvidence,
        now: () => "2026-07-28T10:30:00.000Z",
      },
    );
    expect(confirmed.identity.status).toBe("confirmed");

    const imported = await processAssemblyOrderAction(
      { action: "import", manifest: confirmed },
      {
        loadCatalog: async () => catalog,
        loadTrustedVisualEvidence: async () => result.trustedEvidence,
      },
    );
    expect(imported).toEqual(confirmed);
  });

  test("rejects malformed acceptance objects instead of treating them as pending", async () => {
    const fixture = await createValidTemporaryEvidence();
    const invalidAcceptances: unknown[] = [
      { status: "pending", approvedBy: "nobody" },
      {
        status: "approved",
        approvedAt: "2026-07-28T10:00:00.000Z",
        approvedBy: "zhoujw",
        reviewedCaseIds: CASE_IDS,
      },
      { ...approvedAcceptance(), unexpected: true },
      { ...approvedAcceptance(), approvedAt: "July 28, 2026" },
      { ...approvedAcceptance(), approvedBy: "" },
      { ...approvedAcceptance(), decisionEvidence: "" },
      { ...approvedAcceptance(), reviewedCaseIds: CASE_IDS.slice(0, -1) },
      { ...approvedAcceptance(), reviewedCaseIds: [...CASE_IDS, CASE_IDS[0]] },
      {
        ...approvedAcceptance(),
        reviewedCaseIds: [...CASE_IDS.slice(0, -1), "unknown-case"],
      },
    ];

    for (const acceptance of invalidAcceptances) {
      const index = { ...fixture.index, acceptance };
      await writeFile(fixture.indexPath, JSON.stringify(index));
      const result = await loadVisualEvidence(fixture);
      expect(result.available).toBe(false);
      if (result.available) throw new Error("invalid acceptance was accepted");
      expect(result.reason).toMatch(/acceptance/i);
    }
  });

  test("rejects absolute, traversal, and alias paths even when they resolve to a candidate PNG", async () => {
    const fixture = await createValidTemporaryEvidence();
    const caseId = fixture.index.cases[0].caseId;
    const file = join(fixture.referenceDirectory, `${caseId}.png`);
    const unsafePaths = [
      file,
      `reference/../reference/${caseId}.png`,
      `reference/./${caseId}.png`,
      `reference//${caseId}.png`,
    ];

    for (const path of unsafePaths) {
      const index = structuredClone(fixture.index);
      index.cases[0].path = path;
      await writeFile(fixture.indexPath, JSON.stringify(index));
      const result = await loadVisualEvidence(fixture);
      expect(result.available).toBe(false);
      if (result.available) throw new Error("unsafe path was accepted");
      expect(result.reason).toMatch(/path/i);
    }
  });

  test("rejects malformed index and capture fields before file verification", async () => {
    const fixture = await createValidTemporaryEvidence();
    await writeFile(fixture.indexPath, "[]");
    const invalidRoot = await loadVisualEvidence(fixture);
    expect(invalidRoot.available).toBe(false);
    if (invalidRoot.available) throw new Error("invalid root was accepted");
    expect(invalidRoot.reason).toMatch(/shape/i);

    const invalidCases: Array<{
      expectedReason: RegExp;
      mutate: (index: VisualEvidence) => void;
    }> = [
      {
        expectedReason: /shape/i,
        mutate: (index) => {
          Object.assign(index, { unexpected: true });
        },
      },
      {
        expectedReason: /role/i,
        mutate: (index) => {
          Object.assign(index, { evidenceRole: "approved-reference" });
        },
      },
      {
        expectedReason: /sha-?256/i,
        mutate: (index) => {
          index.cases[0].sha256 = "A".repeat(64);
        },
      },
      {
        expectedReason: /theme/i,
        mutate: (index) => {
          Object.assign(index.cases[0], { theme: "sepia" });
        },
      },
      {
        expectedReason: /scale/i,
        mutate: (index) => {
          index.cases[0].scale = 0;
        },
      },
    ];

    for (const invalidCase of invalidCases) {
      const index = structuredClone(fixture.index);
      invalidCase.mutate(index);
      await writeFile(fixture.indexPath, JSON.stringify(index));
      const result = await loadVisualEvidence(fixture);
      expect(result.available).toBe(false);
      if (result.available) throw new Error("malformed capture was accepted");
      expect(result.reason).toMatch(invalidCase.expectedReason);
    }
  });

  test("rejects fabricated bytes and incorrect PNG dimensions", async () => {
    const fixture = await createValidTemporaryEvidence();
    const wrongHashIndex = structuredClone(fixture.index);
    wrongHashIndex.cases[0].sha256 = "a".repeat(64);
    await writeFile(fixture.indexPath, JSON.stringify(wrongHashIndex));
    const wrongHash = await loadVisualEvidence(fixture);
    expect(wrongHash.available).toBe(false);
    if (wrongHash.available) throw new Error("fabricated hash was accepted");
    expect(wrongHash.reason).toMatch(/hash mismatch/i);

    const dimensionsIndex = structuredClone(fixture.index);
    const item = dimensionsIndex.cases[0];
    const file = join(fixture.referenceDirectory, `${item.caseId}.png`);
    await sharp({
      create: { width: 1, height: 1, channels: 4, background: "white" },
    })
      .png()
      .toFile(file);
    const bytes = await Bun.file(file).arrayBuffer();
    item.sha256 = createHash("sha256")
      .update(Buffer.from(bytes))
      .digest("hex");
    await writeFile(fixture.indexPath, JSON.stringify(dimensionsIndex));
    const wrongDimensions = await loadVisualEvidence(fixture);
    expect(wrongDimensions.available).toBe(false);
    if (wrongDimensions.available) {
      throw new Error("incorrect dimensions were accepted");
    }
    expect(wrongDimensions.reason).toMatch(/dimensions/i);
  });
});
