import { describe, expect, test } from "bun:test";
import { POST as postOrder } from "@/app/api/orders/route";
import { loadVisualEvidence } from "@/lib/assembly-order/visual-evidence";
import { buildCatalog } from "@/lib/catalog";
import {
  canonicalSha256,
  canonicalStringify,
  type JsonObject,
} from "@/lib/contracts/canonical-json";
import {
  createAssemblyOrderSelection,
  decodeOrderShare,
  diffAssemblyOrders,
  encodeOrderShare,
  serializeAssemblyOrder,
  updateAssemblyOrderSelection,
} from "@/lib/assembly-order/client";
import {
  AssemblyOrderServiceError,
  processAssemblyOrderAction,
} from "@/lib/assembly-order/service";
import { createOrderDraftFromResolution } from "@/lib/order-manifest";
import { resolveSystemPresetOrder } from "@/lib/system-presets/resolve";

const CAPABILITIES = ["tasks", "artifact", "board", "connectors", "settings"];

function trustedVisualEvidence(
  captures: Array<{ caseId: string; goldenSha256: string }>,
) {
  return {
    captures,
    visualAcceptance: {
      approvedAt: "2026-07-28T09:45:00.000Z",
      approvedBy: "visual-reviewer",
      decisionEvidence: "Reference Board decision #1",
      reviewedCaseIds: captures.map((capture) => capture.caseId),
    },
  };
}

type MutableHashedManifest = JsonObject & {
  identity: JsonObject & { manifestHash: string };
};

function rehashManifest(manifest: MutableHashedManifest): void {
  const { manifestHash: _manifestHash, ...identity } = manifest.identity;
  manifest.identity.manifestHash = canonicalSha256({ ...manifest, identity });
}

function selection(safeOverrides: JsonObject = {}) {
  return {
    presetSlug: "codex-desktop-v1",
    recipeSlug: "agent-workbench",
    profile: "electron-renderer" as const,
    capabilitySlugs: CAPABILITIES,
    safeOverrides,
    productId: "parking-agent",
    locales: ["zh-cn"],
    platformChrome: "native" as const,
  };
}

async function draft(safeOverrides: JsonObject = {}) {
  const catalog = await buildCatalog();
  const resolution = resolveSystemPresetOrder({
    ...selection(safeOverrides),
    catalog,
  });
  return createOrderDraftFromResolution(resolution, {
    orderId: "order-1",
    createdAt: "2026-07-28T09:30:00.000Z",
    productId: "parking-agent",
    locales: ["zh-CN"],
    platformChrome: "native",
    catalogSource: "test",
  });
}

describe("browser-safe Assembly Order tools", () => {
  test("keeps selection updates immutable and shares a read-only Unicode order locally", async () => {
    const initial = createAssemblyOrderSelection(selection({ branding: "泊车助手" }));
    const updated = updateAssemblyOrderSelection(initial, {
      safeOverrides: { branding: "Parking Agent" },
    });

    expect(initial.locales).toEqual(["zh-CN"]);
    expect(initial.safeOverrides).toEqual({ branding: "泊车助手" });
    expect(updated.safeOverrides).toEqual({ branding: "Parking Agent" });
    expect(Object.isFrozen(initial)).toBe(true);
    expect(Object.isFrozen(initial.capabilitySlugs)).toBe(true);

    const order = await draft({ branding: "泊车助手" });
    const orderWithUntrustedSource = JSON.parse(JSON.stringify(order));
    orderWithUntrustedSource.composition.components[0].sourceCode =
      "do not include me";
    const encoded = encodeOrderShare(orderWithUntrustedSource);
    const decoded = decodeOrderShare(encoded);
    expect(decoded).toEqual(order);
    expect(decoded.composition.components[0]).not.toHaveProperty("sourceCode");
    expect(Object.isFrozen(decoded)).toBe(true);
    expect(() => decodeOrderShare("%%%not-base64url%%%")).toThrow(/share/i);
    expect(() => decodeOrderShare("A".repeat(1_000_001))).toThrow(/too large/i);
  });

  test("reports stable semantic paths while ignoring order identity noise", async () => {
    const before = await draft({ branding: "Parking Agent" });
    const after = JSON.parse(JSON.stringify(before));
    after.identity.orderId = "shared-copy";
    after.identity.createdAt = "2026-07-29T09:30:00.000Z";
    after.identity.manifestHash = "f".repeat(64);
    after.safeOverrides.branding = "Parking Agent Next";

    expect(diffAssemblyOrders(before, after)).toEqual([
      {
        path: "safeOverrides.branding",
        before: "Parking Agent",
        after: "Parking Agent Next",
      },
    ]);

    const confirmedCopy = JSON.parse(JSON.stringify(before));
    confirmedCopy.identity.status = "confirmed";
    confirmedCopy.identity.confirmedAt = "2026-07-29T10:00:00.000Z";
    confirmedCopy.identity.manifestHash = "e".repeat(64);
    confirmedCopy.confirmation = {
      confirmedAt: "2026-07-29T10:00:00.000Z",
      reviewerId: "reviewer-2",
      previewMatrixHash: "d".repeat(64),
    };
    expect(diffAssemblyOrders(before, confirmedCopy)).toEqual([]);
  });

  test("serializes canonical one-line Unicode JSON without a Node dependency", async () => {
    const order = await draft({ branding: "泊车助手" });
    const serialized = serializeAssemblyOrder(order);

    expect(serialized).toBe(canonicalStringify(order));
    expect(serialized).toContain("泊车助手");
    expect(serialized).not.toContain("\n");
    expect(JSON.parse(serialized)).toEqual(order);

    const nonFinite = JSON.parse(JSON.stringify(order));
    nonFinite.referenceEvidence.cases[0].scale = Number.NaN;
    expect(() => serializeAssemblyOrder(nonFinite)).toThrow(/finite/i);

    const bundle = await Bun.build({
      entrypoints: ["./lib/assembly-order/index.ts"],
      target: "browser",
    });
    expect(bundle.success).toBe(true);
    const source = await bundle.outputs[0].text();
    expect(source).not.toContain("node:crypto");
    expect(source).not.toContain("buildCatalog");
  });
});

describe("trusted Assembly Order service", () => {
  test("resolves and imports only through a freshly loaded trusted Catalog", async () => {
    const catalog = await buildCatalog();
    let catalogLoads = 0;
    const dependencies = {
      loadCatalog: async () => {
        catalogLoads += 1;
        return catalog;
      },
      now: () => "2026-07-28T09:30:00.000Z",
      createOrderId: () => "server-order-id",
    };

    const resolved = await processAssemblyOrderAction(
      { action: "resolve", ...selection() },
      dependencies,
    );
    expect(resolved.identity.orderId).toBe("server-order-id");
    expect(resolved.target.locales).toEqual(["zh-CN"]);
    expect(catalogLoads).toBe(1);

    const imported = await processAssemblyOrderAction(
      {
        action: "import",
        manifest: JSON.parse(JSON.stringify(resolved)),
      },
      dependencies,
    );
    expect(imported).toEqual(resolved);
    expect(Object.isFrozen(imported)).toBe(true);
    expect(catalogLoads).toBe(2);

    const forged = JSON.parse(JSON.stringify(resolved));
    forged.preset.catalogSnapshotHash = "a".repeat(64);
    await expect(
      processAssemblyOrderAction(
        { action: "import", manifest: forged },
        dependencies,
      ),
    ).rejects.toMatchObject({ code: "INVALID_REQUEST" });
    expect(catalogLoads).toBe(3);
  });

  test("confirms only captures attested by a trusted provider", async () => {
    const catalog = await buildCatalog();
    const draftOrder = await draft();
    const requestedCaptures = draftOrder.referenceEvidence.cases.map(
      (item, index) => ({
        caseId: item.id,
        goldenSha256: String(index).padStart(64, "a"),
      }),
    );
    const review = {
      explicitlyConfirmed: true as const,
      reviewedCaseIds: draftOrder.previewScenarios.caseIds,
    };
    const dependencies = {
      loadCatalog: async () => catalog,
      now: () => "2026-07-28T10:00:00.000Z",
      createOrderId: () => "unused",
    };

    await expect(
      processAssemblyOrderAction(
        {
          action: "confirm",
          draft: draftOrder,
          captures: requestedCaptures,
          review,
        },
        dependencies,
      ),
    ).rejects.toMatchObject({
      code: "REFERENCE_EVIDENCE_UNAVAILABLE",
    });

    await expect(
      processAssemblyOrderAction(
        {
          action: "confirm",
          draft: draftOrder,
          captures: requestedCaptures,
          review,
        },
        {
          ...dependencies,
          loadTrustedVisualEvidence: async () =>
            trustedVisualEvidence(
              requestedCaptures.map((capture, index) => ({
                ...capture,
                goldenSha256: String(index + 1).padStart(64, "b"),
              })),
            ),
        },
      ),
    ).rejects.toMatchObject({ code: "REFERENCE_EVIDENCE_MISMATCH" });

    const confirmed = await processAssemblyOrderAction(
      {
        action: "confirm",
        draft: draftOrder,
        captures: requestedCaptures,
        review,
        reviewerId: "reviewer-1",
      },
      {
        ...dependencies,
        loadTrustedVisualEvidence: async () =>
          trustedVisualEvidence(requestedCaptures),
      },
    );
    expect(confirmed.identity.status).toBe("confirmed");
    expect(confirmed.confirmation?.reviewerId).toBe("reviewer-1");
    expect(confirmed.confirmation?.visualAcceptance).toEqual(
      trustedVisualEvidence(requestedCaptures).visualAcceptance,
    );

    await expect(
      processAssemblyOrderAction(
        {
          action: "confirm",
          draft: draftOrder,
          captures: requestedCaptures,
          review: {
            explicitlyConfirmed: true,
            reviewedCaseIds: draftOrder.previewScenarios.caseIds.slice(0, -1),
          },
        },
        {
          ...dependencies,
          loadTrustedVisualEvidence: async () =>
            trustedVisualEvidence(requestedCaptures),
        },
      ),
    ).rejects.toMatchObject({ code: "INVALID_REQUEST" });

    await expect(
      processAssemblyOrderAction(
        {
          action: "confirm",
          draft: confirmed,
          captures: requestedCaptures,
          review,
        },
        {
          ...dependencies,
          loadTrustedVisualEvidence: async () =>
            trustedVisualEvidence(requestedCaptures),
        },
      ),
    ).rejects.toBeInstanceOf(AssemblyOrderServiceError);
  });

  test("revalidates confirmed imports against current trusted visual evidence", async () => {
    const catalog = await buildCatalog();
    const draftOrder = await draft();
    const captures = draftOrder.referenceEvidence.cases.map((item, index) => ({
      caseId: item.id,
      goldenSha256: String(index).padStart(64, "d"),
    }));
    const trusted = trustedVisualEvidence(captures);
    const baseDependencies = {
      loadCatalog: async () => catalog,
      loadTrustedVisualEvidence: async () => trusted,
      now: () => "2026-07-28T10:00:00.000Z",
    };
    const confirmed = await processAssemblyOrderAction(
      {
        action: "confirm",
        draft: draftOrder,
        captures,
        review: {
          explicitlyConfirmed: true,
          reviewedCaseIds: draftOrder.previewScenarios.caseIds,
        },
      },
      baseDependencies,
    );

    const imported = await processAssemblyOrderAction(
      { action: "import", manifest: confirmed },
      baseDependencies,
    );
    expect(imported).toEqual(confirmed);

    await expect(
      processAssemblyOrderAction(
        { action: "import", manifest: confirmed },
        { loadCatalog: async () => catalog },
      ),
    ).rejects.toMatchObject({ code: "REFERENCE_EVIDENCE_UNAVAILABLE" });
    await expect(
      processAssemblyOrderAction(
        { action: "import", manifest: confirmed },
        {
          loadCatalog: async () => catalog,
          loadTrustedVisualEvidence: async () => null,
        },
      ),
    ).rejects.toMatchObject({ code: "REFERENCE_EVIDENCE_UNAVAILABLE" });

    await expect(
      processAssemblyOrderAction(
        { action: "import", manifest: confirmed },
        {
          loadCatalog: async () => catalog,
          loadTrustedVisualEvidence: async () => ({
            ...trusted,
            captures: trusted.captures.map((capture, index) =>
              index === 0
                ? { ...capture, goldenSha256: "e".repeat(64) }
                : capture,
            ),
          }),
        },
      ),
    ).rejects.toMatchObject({ code: "REFERENCE_EVIDENCE_MISMATCH" });

    await expect(
      processAssemblyOrderAction(
        { action: "import", manifest: confirmed },
        {
          loadCatalog: async () => catalog,
          loadTrustedVisualEvidence: async () => ({
            ...trusted,
            visualAcceptance: {
              ...trusted.visualAcceptance,
              approvedAt: "2026-07-27T09:45:00.000Z",
            },
          }),
        },
      ),
    ).rejects.toMatchObject({ code: "REFERENCE_EVIDENCE_MISMATCH" });

    await expect(
      processAssemblyOrderAction(
        { action: "import", manifest: confirmed },
        {
          loadCatalog: async () => catalog,
          loadTrustedVisualEvidence: async () => ({
            ...trusted,
            visualAcceptance: {
              ...trusted.visualAcceptance,
              decisionEvidence: "superseded decision",
            },
          }),
        },
      ),
    ).rejects.toMatchObject({ code: "REFERENCE_EVIDENCE_MISMATCH" });

    const selfConsistentForgery = JSON.parse(JSON.stringify(confirmed));
    selfConsistentForgery.confirmation.visualAcceptance.decisionEvidence =
      "forged but internally hash-consistent";
    rehashManifest(selfConsistentForgery);
    await expect(
      processAssemblyOrderAction(
        { action: "import", manifest: selfConsistentForgery },
        baseDependencies,
      ),
    ).rejects.toMatchObject({ code: "REFERENCE_EVIDENCE_MISMATCH" });
  });

  test("revises a confirmed order into a new draft with lineage and cleared acceptance captures", async () => {
    const catalog = await buildCatalog();
    const parentDraft = await draft({ branding: "Parking Agent" });
    const captures = parentDraft.referenceEvidence.cases.map((item, index) => ({
      caseId: item.id,
      goldenSha256: String(index).padStart(64, "c"),
    }));
    let catalogLoads = 0;
    const dependencies = {
      loadCatalog: async () => {
        catalogLoads += 1;
        return catalog;
      },
      now: () => "2026-07-28T10:00:00.000Z",
      createOrderId: () => "unused",
      loadTrustedVisualEvidence: async () => trustedVisualEvidence(captures),
    };
    const confirmed = await processAssemblyOrderAction(
      {
        action: "confirm",
        draft: parentDraft,
        captures,
        review: {
          explicitlyConfirmed: true,
          reviewedCaseIds: parentDraft.previewScenarios.caseIds,
        },
      },
      dependencies,
    );
    const parentJson = JSON.stringify(confirmed);

    const revision = await processAssemblyOrderAction(
      {
        action: "revise",
        parent: confirmed,
        nextSelection: selection({ branding: "Parking Agent Next" }),
        reason: "Approved product naming change",
        createdAt: "2026-07-29T09:00:00.000Z",
      },
      dependencies,
    );

    expect(revision.identity).toMatchObject({
      orderId: confirmed.identity.orderId,
      revision: 2,
      status: "draft",
    });
    expect(revision.lineage).toEqual({
      parentOrderId: confirmed.identity.orderId,
      parentRevision: 1,
      parentHash: confirmed.identity.manifestHash,
      reason: "Approved product naming change",
    });
    expect(
      revision.referenceEvidence.cases.every(
        (item) => item.goldenSha256 === null,
      ),
    ).toBe(true);
    expect(revision.safeOverrides).toEqual({
      branding: "Parking Agent Next",
    });
    expect(diffAssemblyOrders(confirmed, revision)).toEqual([
      {
        path: "safeOverrides.branding",
        before: "Parking Agent",
        after: "Parking Agent Next",
      },
    ]);
    expect(JSON.stringify(confirmed)).toBe(parentJson);
    expect(catalogLoads).toBe(2);
  });
});

describe("Assembly Order API boundary", () => {
  test("returns stable 400 JSON without exposing an exception stack", async () => {
    const malformed = await postOrder(
      new Request("http://localhost/api/orders", {
        method: "POST",
        body: "{not-json",
        headers: { "content-type": "application/json" },
      }),
    );
    expect(malformed.status).toBe(400);
    expect(await malformed.json()).toEqual({
      ok: false,
      error: {
        code: "INVALID_REQUEST",
        message: "Invalid JSON request body.",
      },
    });

    const policyMismatch = await postOrder(
      new Request("http://localhost/api/orders", {
        method: "POST",
        body: JSON.stringify({
          action: "resolve",
          ...selection(),
          capabilitySlugs: ["unknown"],
        }),
        headers: { "content-type": "application/json" },
      }),
    );
    const policyError = await policyMismatch.json();
    expect(policyMismatch.status).toBe(400);
    expect(policyError).toEqual({
      ok: false,
      error: {
        code: "ORDER_POLICY_MISMATCH",
        message:
          "Assembly Order selection does not match the trusted Catalog.",
      },
    });
    expect(JSON.stringify(policyError)).not.toContain("stack");

    const unknownField = await postOrder(
      new Request("http://localhost/api/orders", {
        method: "POST",
        body: JSON.stringify({
          action: "resolve",
          ...selection(),
          injectedCatalog: [],
        }),
      }),
    );
    expect(unknownField.status).toBe(400);
    expect(await unknownField.json()).toEqual({
      ok: false,
      error: {
        code: "INVALID_REQUEST",
        message: "Invalid resolve request fields.",
      },
    });
  });

  test("refuses confirmation while the route has only pending candidate evidence", async () => {
    const draftOrder = await draft();
    const evidence = await loadVisualEvidence();
    if (!evidence.available) throw new Error(evidence.reason);
    expect(evidence.acceptanceStatus).toBe("pending");
    const captures = evidence.evidence.cases.map((item) => ({
      caseId: item.caseId,
      goldenSha256: item.sha256,
    }));
    const response = await postOrder(
      new Request("http://localhost/api/orders", {
        method: "POST",
        body: JSON.stringify({
          action: "confirm",
          draft: draftOrder,
          captures,
          review: {
            explicitlyConfirmed: true,
            reviewedCaseIds: draftOrder.previewScenarios.caseIds,
          },
        }),
        headers: { "content-type": "application/json" },
      }),
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: {
        code: "REFERENCE_EVIDENCE_UNAVAILABLE",
        message:
          "Approved reference acceptance evidence is unavailable; candidate regression captures cannot confirm or validate a confirmed order.",
      },
    });

    const catalog = await buildCatalog();
    const confirmed = await processAssemblyOrderAction(
      {
        action: "confirm",
        draft: draftOrder,
        captures,
        review: {
          explicitlyConfirmed: true,
          reviewedCaseIds: draftOrder.previewScenarios.caseIds,
        },
      },
      {
        loadCatalog: async () => catalog,
        loadTrustedVisualEvidence: async () =>
          trustedVisualEvidence(captures),
        now: () => "2026-07-28T10:00:00.000Z",
      },
    );
    const pendingImport = await postOrder(
      new Request("http://localhost/api/orders", {
        method: "POST",
        body: JSON.stringify({ action: "import", manifest: confirmed }),
        headers: { "content-type": "application/json" },
      }),
    );
    expect(pendingImport.status).toBe(400);
    expect(await pendingImport.json()).toMatchObject({
      ok: false,
      error: { code: "REFERENCE_EVIDENCE_UNAVAILABLE" },
    });
  });
});
