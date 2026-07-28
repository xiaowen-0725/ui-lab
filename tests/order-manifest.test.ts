import { describe, expect, test } from "bun:test";
import { buildCatalog } from "@/lib/catalog";
import { canonicalSha256, canonicalStringify, type JsonObject } from "@/lib/contracts/canonical-json";
import {
  assertOrderManifestMatchesCatalog,
  assertValidOrderManifest,
  confirmOrderManifest,
  createOrderDraftFromResolution,
  createOrderRevision,
  isOrderManifestHashValid,
  parseOrderManifest,
  recordOrderReferenceGoldens,
} from "@/lib/order-manifest";
import { resolveSystemPresetOrder } from "@/lib/system-presets/resolve";

const HASH = "a".repeat(64);

async function plannedOrder(safeOverrides: JsonObject = {}) {
  const catalog = await buildCatalog();
  const resolution = resolveSystemPresetOrder({
    presetSlug: "codex-desktop-v1",
    recipeSlug: "agent-workbench",
    profile: "electron-renderer",
    capabilitySlugs: ["tasks", "artifact", "board", "connectors", "settings"],
    safeOverrides,
    catalog,
  });
  return {
    catalog,
    draft: createOrderDraftFromResolution(resolution, {
      orderId: "parking-desktop",
      createdAt: "2026-07-28T09:30:00.000Z",
      productId: "parking-agent",
      locales: ["zh-CN"],
      platformChrome: "native",
      catalogSource: "snapshot",
    }),
  };
}

function goldens(draft: Awaited<ReturnType<typeof plannedOrder>>["draft"]) {
  return draft.referenceEvidence.cases.map((item, index) => ({
    caseId: item.id,
    goldenSha256: `${index}`.padStart(64, "b"),
  }));
}

type MutableManifest = JsonObject & {
  identity: JsonObject & { manifestHash: string };
  lockedVisualSnapshot: JsonObject;
  composition: JsonObject & {
    components: Array<{ slug: string }>;
    assets: Array<{ requirement: string }>;
  };
  preset: JsonObject & { catalogSnapshotHash: string };
};

function rehash(value: MutableManifest) {
  const { manifestHash: _manifestHash, ...identity } = value.identity;
  return canonicalSha256({ ...value, identity });
}

describe("canonical JSON", () => {
  test("sorts object keys and produces the known SHA-256", () => {
    expect(canonicalStringify({ b: 2, a: 1 })).toBe('{"a":1,"b":2}');
    expect(canonicalSha256({ b: 2, a: 1 })).toBe(
      "43258cff783fe7036d8a43033f830adfc60ec037382473548ac742b888292777",
    );
  });
});

describe("OrderManifest public policy seams", () => {
  test("creates an immutable, hash-valid public draft and parses no unknown JSON", async () => {
    const { catalog, draft } = await plannedOrder();
    expect(isOrderManifestHashValid(draft)).toBe(true);
    expect(Object.isFrozen(draft)).toBe(true);
    assertOrderManifestMatchesCatalog(draft, catalog);
    expect(parseOrderManifest(JSON.parse(JSON.stringify(draft)))).toEqual(draft);
    expect(() => parseOrderManifest({ ...draft, unexpected: true })).toThrow(/unknown/i);
  });

  test("catalog policy rejects overrides and every policy-bound tampering", async () => {
    const catalog = await buildCatalog();
    const base = {
      presetSlug: "codex-desktop-v1", recipeSlug: "agent-workbench",
      profile: "electron-renderer" as const,
      capabilitySlugs: ["tasks", "artifact", "board", "connectors", "settings"], catalog,
    };
    expect(() => resolveSystemPresetOrder({ ...base, safeOverrides: { typography: "Comic Sans" } })).toThrow(/override/i);
    expect(() => resolveSystemPresetOrder({ ...base, safeOverrides: { unknownPolicy: true } })).toThrow(/override/i);
    const { draft } = await plannedOrder();
    for (const mutate of [
      (value: MutableManifest) => { value.lockedVisualSnapshot.density = "forged"; },
      (value: MutableManifest) => { value.composition.components[0].slug = "outside-allowlist"; },
      (value: MutableManifest) => { value.composition.assets[0].requirement = "forged"; },
      (value: MutableManifest) => { value.preset.catalogSnapshotHash = HASH; },
    ]) {
      const tampered = JSON.parse(JSON.stringify(draft)) as MutableManifest;
      mutate(tampered);
      tampered.identity.manifestHash = rehash(tampered);
      // Rebuilding a syntactically valid hash must still not bypass the Catalog.
      expect(() => assertOrderManifestMatchesCatalog(tampered, catalog)).toThrow();
    }
  });

  test("records only exact, valid golden capture coverage and confirms against Catalog", async () => {
    const { catalog, draft } = await plannedOrder();
    expect(() => confirmOrderManifest(draft, { confirmedAt: "2026-07-28T10:00:00.000Z" }, catalog)).toThrow(/golden/i);
    expect(() => recordOrderReferenceGoldens(draft, [], catalog)).toThrow(/cover/i);
    expect(() => recordOrderReferenceGoldens(draft, [{ caseId: draft.referenceEvidence.cases[0].id, goldenSha256: "bad" }], catalog)).toThrow();
    expect(() => recordOrderReferenceGoldens(draft, [...goldens(draft), ...goldens(draft)], catalog)).toThrow(/cover|unique/i);
    expect(() => recordOrderReferenceGoldens(draft, goldens(draft).map((item) => ({ ...item, extra: true })) as never, catalog)).toThrow(/unknown/i);
    const recorded = recordOrderReferenceGoldens(draft, goldens(draft), catalog);
    expect(recorded.referenceEvidence.cases.every((item) => item.goldenSha256)).toBe(true);
    expect(recorded.referenceEvidence.cases.map(({ goldenSha256: _goldenSha256, ...item }) => item)).toEqual(
      draft.referenceEvidence.cases.map(({ goldenSha256: _goldenSha256, ...item }) => item),
    );
    const confirmed = confirmOrderManifest(recorded, { confirmedAt: "2026-07-28T10:00:00.000Z" }, catalog);
    expect(confirmed.identity.status).toBe("confirmed");
    assertOrderManifestMatchesCatalog(confirmed, catalog);
  });

  test("enforces platform and locale override consistency", async () => {
    const { catalog } = await plannedOrder();
    const resolution = resolveSystemPresetOrder({
      presetSlug: "codex-desktop-v1", recipeSlug: "agent-workbench", profile: "electron-renderer",
      capabilitySlugs: ["tasks", "artifact", "board", "connectors", "settings"],
      safeOverrides: { platformChrome: "native", locale: "zh-CN" }, catalog,
    });
    expect(() => createOrderDraftFromResolution(resolution, {
      orderId: "x", createdAt: "2026-07-28T09:30:00.000Z", productId: "x", locales: ["en-US"], platformChrome: "web", catalogSource: "snapshot",
    })).toThrow(/platformChrome/i);
    const localeOnly = resolveSystemPresetOrder({
      presetSlug: "codex-desktop-v1", recipeSlug: "agent-workbench", profile: "electron-renderer",
      capabilitySlugs: ["tasks", "artifact", "board", "connectors", "settings"],
      safeOverrides: { locale: "zh-CN" }, catalog,
    });
    const localeMismatch = createOrderDraftFromResolution(localeOnly, {
      orderId: "locale", createdAt: "2026-07-28T09:30:00.000Z", productId: "x", locales: ["en-US"], platformChrome: "native", catalogSource: "snapshot",
    });
    expect(() => assertOrderManifestMatchesCatalog(localeMismatch, catalog)).toThrow(/locale/i);
    expect(() => createOrderDraftFromResolution(localeOnly, {
      orderId: "invalid-locale", createdAt: "2026-07-28T09:30:00.000Z", productId: "x", locales: ["not_locale"], platformChrome: "native", catalogSource: "snapshot",
    })).toThrow(/BCP-47/i);
    const canonicalLocale = createOrderDraftFromResolution(localeOnly, {
      orderId: "canonical-locale", createdAt: "2026-07-28T09:30:00.000Z", productId: "x", locales: ["zh-cn"], platformChrome: "native", catalogSource: "snapshot",
    });
    expect(canonicalLocale.target.locales).toEqual(["zh-CN"]);
    assertOrderManifestMatchesCatalog(canonicalLocale, catalog);
  });

  test("revisions reject forged lineage, clear goldens, and remain Catalog-governed", async () => {
    const { catalog, draft } = await plannedOrder({ branding: "Parking Agent" });
    const confirmed = confirmOrderManifest(recordOrderReferenceGoldens(draft, goldens(draft), catalog), { confirmedAt: "2026-07-28T10:00:00.000Z" }, catalog);
    const nextSections = {
      target: confirmed.target, preset: confirmed.preset, composition: confirmed.composition,
      safeOverrides: { branding: "Parking Agent Next" }, lockedVisualSnapshot: confirmed.lockedVisualSnapshot,
      previewScenarios: confirmed.previewScenarios, referenceEvidence: confirmed.referenceEvidence,
      derivedArtifacts: confirmed.derivedArtifacts,
    };
    const revision = createOrderRevision(confirmed, { createdAt: "2026-07-29T09:00:00.000Z", reason: "branding", nextSections });
    expect(revision.referenceEvidence.cases.every((item) => item.goldenSha256 === null)).toBe(true);
    assertOrderManifestMatchesCatalog(revision, catalog);
    expect(() => confirmOrderManifest(revision, { confirmedAt: "2026-07-29T10:00:00.000Z" }, catalog)).toThrow(/golden/i);
    const parentSnapshot = JSON.stringify(confirmed);
    const forged = { createdAt: "2026-07-29T09:00:00.000Z", reason: "forged", nextSections: { ...nextSections, identity: { orderId: "forged" }, lineage: { parentOrderId: "forged" } } };
    expect(() => createOrderRevision(confirmed, forged as never)).toThrow(/unknown/i);
    expect(() => createOrderRevision(confirmed, { ...forged, extra: true } as never)).toThrow(/unknown/i);
    expect(JSON.stringify(confirmed)).toBe(parentSnapshot);
    const invalid = { ...nextSections, composition: { ...nextSections.composition, capabilities: ["unknown"] } };
    const invalidRevision = createOrderRevision(confirmed, { createdAt: "2026-07-29T09:00:00.000Z", reason: "bad", nextSections: invalid });
    expect(() => assertOrderManifestMatchesCatalog(invalidRevision, catalog)).toThrow();
  });

  test("keeps hash tampering detectable", async () => {
    const { draft } = await plannedOrder();
    const tampered = JSON.parse(JSON.stringify(draft));
    tampered.safeOverrides = { branding: "tampered" };
    expect(() => assertValidOrderManifest(tampered)).toThrow(/hash/i);
  });
});
