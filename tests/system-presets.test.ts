import { describe, expect, test } from "bun:test";
import { buildCatalog } from "@/lib/catalog";
import {
  catalogContractHash,
  catalogSnapshotContractHash,
} from "@/lib/catalog-contract";
import {
  canonicalSha256,
  type JsonObject,
} from "@/lib/contracts/canonical-json";
import {
  confirmOrderManifest,
  createOrderDraftFromResolution,
  isOrderManifestHashValid,
} from "@/lib/order-manifest";
import { CODEX_DESKTOP_THEME_KIT } from "@/lib/theme-kits/codex-desktop";
import {
  assertValidSystemPreset,
  CODEX_DESKTOP_V1,
  parseSystemPreset,
  SYSTEM_PRESETS,
  findSystemPreset,
  systemPresetContractHash,
} from "@/lib/system-presets";
import {
  resolveSystemPresetOrder,
} from "@/lib/system-presets/resolve";
function jsonClone(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value));
}

describe("Codex Desktop system preset", () => {
  test("parses a strict canonical schema into a deeply frozen clone", () => {
    const roundTripped = parseSystemPreset(jsonClone(CODEX_DESKTOP_V1));

    expect(roundTripped).not.toBe(CODEX_DESKTOP_V1);
    expect(systemPresetContractHash(roundTripped)).toBe(
      systemPresetContractHash(CODEX_DESKTOP_V1),
    );
    expect(Object.isFrozen(SYSTEM_PRESETS)).toBe(true);
    expect(Object.isFrozen(CODEX_DESKTOP_V1)).toBe(true);
    expect(Object.isFrozen(CODEX_DESKTOP_V1.capabilities)).toBe(true);
    expect(Object.isFrozen(CODEX_DESKTOP_V1.capabilities[0].components)).toBe(
      true,
    );
    expect(Object.isFrozen(CODEX_DESKTOP_V1.referencePack.fixture)).toBe(true);
    expect(Object.isFrozen(CODEX_DESKTOP_V1.referencePack.cases[0])).toBe(true);
    expect(Object.isFrozen(roundTripped)).toBe(true);
    expect(Object.isFrozen(roundTripped.lockedVisual)).toBe(true);
    expect(Object.isFrozen(roundTripped.referencePack.cases)).toBe(true);
    expect(Object.keys(roundTripped.lockedVisual).sort()).toEqual([
      "density",
      "geometry",
      "icons",
      "motion",
      "responsive",
      "selection",
      "shadows",
      "surfaces",
      "typography",
    ]);
    expect(
      Object.values(roundTripped.lockedVisual).every(
        (section) => Object.keys(section).length > 0,
      ),
    ).toBe(true);
    expect(() => assertValidSystemPreset(roundTripped)).not.toThrow();
  });

  test("rejects unknown, inconsistent, and invalid preset metadata", () => {
    const unknownRoot = {
      ...(jsonClone(CODEX_DESKTOP_V1) as object),
      unknown: true,
    };
    expect(() => parseSystemPreset(unknownRoot)).toThrow(/unknown/i);

    const duplicateCapabilities = jsonClone(CODEX_DESKTOP_V1) as {
      capabilities: Array<Record<string, unknown>>;
    };
    duplicateCapabilities.capabilities.push({
      ...duplicateCapabilities.capabilities[0],
    });
    expect(() => parseSystemPreset(duplicateCapabilities)).toThrow(
      /capabilit.*unique/i,
    );

    const outsideAllowlist = jsonClone(CODEX_DESKTOP_V1) as {
      capabilities: Array<{ components: string[] }>;
    };
    outsideAllowlist.capabilities[0].components.push("outside-allowlist");
    expect(() => parseSystemPreset(outsideAllowlist)).toThrow(/allowlist/i);

    const invalidFixtureHash = jsonClone(CODEX_DESKTOP_V1) as {
      referencePack: { fixture: { fixtureHash: string } };
    };
    invalidFixtureHash.referencePack.fixture.fixtureHash = "not-a-hash";
    expect(() => parseSystemPreset(invalidFixtureHash)).toThrow(/hash/i);

    const reviewReferencePack = jsonClone(CODEX_DESKTOP_V1) as {
      referencePack: { status: string };
    };
    reviewReferencePack.referencePack.status = "review";
    expect(() => parseSystemPreset(reviewReferencePack)).toThrow(/approved/i);

    const missingLockedVisualSection = jsonClone(CODEX_DESKTOP_V1) as {
      lockedVisual: Record<string, unknown>;
    };
    delete missingLockedVisualSection.lockedVisual.motion;
    expect(() => parseSystemPreset(missingLockedVisualSection)).toThrow(
      /lockedVisual.*missing/i,
    );

    const emptyLockedVisualSection = jsonClone(CODEX_DESKTOP_V1) as {
      lockedVisual: { motion: Record<string, unknown> };
    };
    emptyLockedVisualSection.lockedVisual.motion = {};
    expect(() => parseSystemPreset(emptyLockedVisualSection)).toThrow(
      /lockedVisual\.motion.*missing/i,
    );

    const unsupportedOverride = jsonClone(CODEX_DESKTOP_V1) as {
      safeOverrideKeys: string[];
    };
    unsupportedOverride.safeOverrideKeys.push("typography");
    expect(() => parseSystemPreset(unsupportedOverride)).toThrow(
      /safeOverrideKeys.*unsupported/i,
    );

    const duplicateCases = jsonClone(CODEX_DESKTOP_V1) as {
      referencePack: { cases: Array<Record<string, unknown>> };
    };
    duplicateCases.referencePack.cases.push({
      ...duplicateCases.referencePack.cases[0],
    });
    expect(() => parseSystemPreset(duplicateCases)).toThrow(/case.*unique/i);

    const wrongFixture = jsonClone(CODEX_DESKTOP_V1) as {
      referencePack: { cases: Array<{ fixtureId: string }> };
    };
    wrongFixture.referencePack.cases[0].fixtureId = "other-fixture";
    expect(() => parseSystemPreset(wrongFixture)).toThrow(/fixture/i);

    const missingFixtureMetadata = jsonClone(CODEX_DESKTOP_V1) as {
      referencePack: { fixture: { payload: Record<string, unknown> } };
    };
    delete missingFixtureMetadata.referencePack.fixture.payload.deterministic;
    expect(() => parseSystemPreset(missingFixtureMetadata)).toThrow(
      /deterministic/i,
    );

    const fixtureHashMismatch = jsonClone(CODEX_DESKTOP_V1) as {
      referencePack: {
        fixture: {
          payload: Record<string, unknown>;
        };
      };
    };
    fixtureHashMismatch.referencePack.fixture.payload.clock =
      "2026-07-28T09:31:00.000Z";
    expect(() => parseSystemPreset(fixtureHashMismatch)).toThrow(
      /fixtureHash.*payload/i,
    );

    const selectorMismatch = jsonClone(CODEX_DESKTOP_V1) as {
      referencePack: {
        fixture: {
          fixtureHash: string;
          payload: { caseSelectors: Record<string, string[]> };
        };
      };
    };
    delete selectorMismatch.referencePack.fixture.payload.caseSelectors[
      "wide-light-task-dense"
    ];
    selectorMismatch.referencePack.fixture.fixtureHash = canonicalSha256(
      selectorMismatch.referencePack.fixture.payload,
    );
    expect(() => parseSystemPreset(selectorMismatch)).toThrow(
      /caseSelectors/i,
    );
  });

  test("rejects placeholder and invalid nested locked visual contracts", () => {
    for (const section of [
      "typography",
      "icons",
      "surfaces",
      "selection",
      "density",
      "geometry",
      "shadows",
      "motion",
      "responsive",
    ] as const) {
      const placeholder = jsonClone(CODEX_DESKTOP_V1) as {
        lockedVisual: Record<string, unknown>;
      };
      placeholder.lockedVisual[section] = { placeholder: true };
      expect(() => parseSystemPreset(placeholder)).toThrow(
        new RegExp(`lockedVisual\\.${section}`, "i"),
      );
    }

    const invalidCases: Array<{
      section: string;
      path: string[];
      action: "delete" | "replace";
      value?: unknown;
    }> = [
      {
        section: "typography",
        path: ["typography", "families", "body"],
        action: "delete",
      },
      {
        section: "icons",
        path: ["icons", "sizesPx"],
        action: "replace",
        value: [0],
      },
      {
        section: "surfaces",
        path: ["surfaces", "roles", "canvas"],
        action: "replace",
        value: "white",
      },
      {
        section: "selection",
        path: ["selection", "disabledOpacity"],
        action: "replace",
        value: 2,
      },
      {
        section: "density",
        path: ["density", "spacingScalePx"],
        action: "replace",
        value: [4, 4],
      },
      {
        section: "geometry",
        path: ["geometry", "radiusScalePx"],
        action: "replace",
        value: [-1],
      },
      {
        section: "shadows",
        path: ["shadows", "levels", "hairline"],
        action: "delete",
      },
      {
        section: "motion",
        path: ["motion", "properties"],
        action: "replace",
        value: ["width"],
      },
      {
        section: "responsive",
        path: ["responsive", "collapse", "minWidthPx"],
        action: "replace",
        value: 1200,
      },
    ];
    for (const { section, path, action, value } of invalidCases) {
      const invalidNested = jsonClone(CODEX_DESKTOP_V1) as {
        lockedVisual: Record<string, unknown>;
      };
      let target = invalidNested.lockedVisual;
      for (const segment of path.slice(0, -1)) {
        const nested = target[segment];
        if (!nested || typeof nested !== "object" || Array.isArray(nested)) {
          throw new Error(`Invalid test mutation path: ${path.join(".")}`);
        }
        target = nested as Record<string, unknown>;
      }
      const field = path.at(-1);
      if (!field) throw new Error("Invalid empty test mutation path.");
      if (action === "delete") delete target[field];
      else target[field] = value;
      expect(() => parseSystemPreset(invalidNested)).toThrow(
        new RegExp(`lockedVisual\\.${section}`, "i"),
      );
    }
  });

  test("publishes exactly one approved full-contract Catalog preset", async () => {
    const catalog = await buildCatalog();
    const presets = catalog.filter((item) => item.kind === "system-preset");
    const preset = presets.find((item) => item.slug === "codex-desktop-v1");

    expect(presets).toHaveLength(1);
    if (!preset?.systemPreset)
      throw new Error("codex system preset fixture is missing");
    const systemPreset = preset.systemPreset;
    const registeredPreset = findSystemPreset("codex-desktop-v1");
    if (!registeredPreset)
      throw new Error("registered system preset is missing");
    expect(systemPreset.status).toBe("approved");
    expect(systemPreset).toBe(registeredPreset);
    expect(preset.themePreview?.modes).toEqual(["light", "dark"]);
    expect(preset.fetch.command).toContain("theme-codex-desktop-v1");
    expect(preset.fetch.endpoint).toContain("/themes/codex-desktop-v1.css");
    expect(systemPresetContractHash(systemPreset)).toMatch(/^[a-f0-9]{64}$/);
    expect(CODEX_DESKTOP_THEME_KIT.modes).toEqual(["light", "dark"]);
    expect(systemPreset.themeKit.contractHash).toBe(
      canonicalSha256(CODEX_DESKTOP_THEME_KIT),
    );
    expect(systemPreset.lockedVisual.typography.families).toEqual(
      CODEX_DESKTOP_THEME_KIT.fonts,
    );
    expect(systemPreset.lockedVisual.typography.assetIds).toEqual([
      "system-font",
    ]);
    expect(
      systemPreset.lockedVisual.typography.scale.body.letterSpacingEm,
    ).toBe(0);
    expect(systemPreset.lockedVisual.typography.scale.body.sizePx).toBe(14);
    expect(systemPreset.lockedVisual.typography.numerals).toMatchObject({
      family: "mono",
      variant: "tabular-nums",
    });
    expect(systemPreset.lockedVisual.icons).toMatchObject({
      family: "Lucide",
      package: "lucide-react",
      linecap: "round",
      linejoin: "round",
      defaultStyle: "outline",
    });
    expect(systemPreset.lockedVisual.surfaces.roles.canvas).toBe(
      "--wb-surface",
    );
    expect(
      systemPreset.lockedVisual.surfaces.componentAnatomy.composer,
    ).toContain("composer");
    expect(systemPreset.lockedVisual.selection.backgroundToken).toBe(
      "--accent",
    );
    expect(systemPreset.lockedVisual.density.baseUnitPx).toBe(4);
    expect(systemPreset.lockedVisual.geometry.panelRadiusPx).toBe(12);
    expect(systemPreset.lockedVisual.shadows.maxBlurPx).toBe(10);
    expect(systemPreset.lockedVisual.motion.properties).toEqual([
      "transform",
      "opacity",
      "color",
      "background-color",
    ]);
    expect(systemPreset.lockedVisual.responsive.collapse).toMatchObject({
      minWidthPx: 768,
      maxWidthPx: 1199,
    });
    expect(systemPreset.safeOverrideKeys).toEqual([
      "branding",
      "productCopy",
      "navigation",
      "locale",
      "semanticStateColors",
      "platformChrome",
    ]);

    const referenceCases = systemPreset.referencePack.cases;
    expect(referenceCases.every((item) => item.status === "planned")).toBe(
      true,
    );
    expect(referenceCases.every((item) => item.goldenCapture === null)).toBe(
      true,
    );
    expect(
      referenceCases.every(
        (item) =>
          item.fontLoadingState === "document-fonts-ready" &&
          item.captureTiming === "two-animation-frames-after-state-settle",
      ),
    ).toBe(true);
    expect(systemPreset.referencePack.fixture.path).toBe(
      "content/system-presets/codex-desktop-v1/fixtures/parking-high-density-v1.json",
    );
    expect(
      systemPreset.referencePack.fixture.payload.capturePreconditions,
    ).toEqual([
      "document.fonts.ready",
      "two animation frames after stable state",
      "reduced-motion branch",
    ]);
    expect(
      Object.keys(
        systemPreset.referencePack.fixture.payload.caseSelectors,
      ).sort(),
    ).toEqual(referenceCases.map((item) => item.id).sort());
    const focusCase = referenceCases.find(
      (item) => item.id === "wide-light-board-focus",
    );
    expect(focusCase?.viewport).toBe("wide");
    expect(focusCase?.size).toBe("1440x900");
    expect(focusCase?.theme).toBe("light");
    expect(focusCase?.surfaces).toEqual(["board"]);
    expect(focusCase?.keyboardFocus).toBe(true);
    expect(focusCase?.reducedMotion).toBe(false);
    expect(focusCase?.calibrationSourceIds).toEqual([
      "codex-desktop-light",
      "codex-workbench-light",
    ]);
    const reducedMotionCase = referenceCases.find(
      (item) => item.id === "wide-light-settings-reduced-motion",
    );
    expect(reducedMotionCase?.viewport).toBe("wide");
    expect(reducedMotionCase?.theme).toBe("light");
    expect(reducedMotionCase?.surfaces).toEqual(["settings"]);
    expect(reducedMotionCase?.keyboardFocus).toBe(false);
    expect(reducedMotionCase?.reducedMotion).toBe(true);

    const recipe = catalog.find(
      (item) => item.kind === "recipe" && item.slug === "agent-workbench",
    );
    expect(
      recipe?.components?.every((slug) =>
        systemPreset.componentAllowlist.includes(slug),
      ),
    ).toBe(true);
    expect(
      systemPreset.componentAllowlist.every((slug) =>
        catalog.some((item) => item.kind === "component" && item.slug === slug),
      ),
    ).toBe(true);
  });

  test("keeps display fields out of Catalog contracts and snapshots order-independent", async () => {
    const catalog = await buildCatalog();
    const preset = catalog.find((item) => item.kind === "system-preset");
    if (!preset?.systemPreset) throw new Error("preset missing");
    expect(catalogContractHash({ ...preset, name: "Display rename" })).toBe(
      catalogContractHash(preset),
    );
    expect(
      catalogContractHash({
        ...preset,
        systemPreset: {
          ...preset.systemPreset,
          lockedVisual: {
            ...preset.systemPreset.lockedVisual,
            typography: {
              ...preset.systemPreset.lockedVisual.typography,
              scale: {
                ...preset.systemPreset.lockedVisual.typography.scale,
                body: {
                  ...preset.systemPreset.lockedVisual.typography.scale.body,
                  sizePx: 15,
                },
              },
            },
          },
        },
      }),
    ).not.toBe(catalogContractHash(preset));
    expect(catalogSnapshotContractHash([preset, catalog[0]])).toBe(
      catalogSnapshotContractHash([catalog[0], preset]),
    );
  });

  test("resolves all Parking capabilities into deterministic vendorable components", async () => {
    const catalog = await buildCatalog();
    const resolution = resolveSystemPresetOrder({
      presetSlug: "codex-desktop-v1",
      recipeSlug: "agent-workbench",
      profile: "electron-renderer",
      capabilitySlugs: ["tasks", "artifact", "board", "connectors", "settings"],
      safeOverrides: { branding: "Parking Agent" },
      catalog,
    });

    expect(resolution.components.map((component) => component.slug)).toEqual([
      "agent-composer",
      "agent-inbox",
      "agent-thread",
      "agent-workbench",
      "artifact-panel",
      "morphing-modal",
      "popover",
      "select",
      "settings-panel",
      "switch",
      "tabs",
      "thread-list",
    ]);
    expect(
      resolution.components.every((component) =>
        component.contractHash.match(/^[a-f0-9]{64}$/),
      ),
    ).toBe(true);
    expect(
      resolution.components.every(
        (component) => component.sourceFiles.length > 0,
      ),
    ).toBe(true);
    expect(
      resolution.assets.every((asset) =>
        ["system-preset", "recipe"].includes(asset.source),
      ),
    ).toBe(true);
    expect(
      resolution.assets.some((asset) => asset.source === "system-preset"),
    ).toBe(true);
    expect(resolution.assets.some((asset) => asset.source === "recipe")).toBe(
      true,
    );
    expect(Object.isFrozen(resolution)).toBe(true);
    expect(resolution.profile).toBe("electron-renderer");
    expect(resolution.recipe.category).toBe("application");
    expect(resolution.preset.version).toBe(1);
    expect(resolution.preset.themeKit.slug).toBe("codex-desktop-v1");
    expect(resolution.preset.contractHash).toBe(
      systemPresetContractHash(CODEX_DESKTOP_V1),
    );

    const base = {
      presetSlug: "codex-desktop-v1",
      recipeSlug: "agent-workbench",
      profile: "electron-renderer" as const,
      safeOverrides: {},
      catalog,
    };
    expect(() =>
      resolveSystemPresetOrder({
        ...base,
        capabilitySlugs: ["tasks", "tasks"],
      }),
    ).toThrow();
    expect(() =>
      resolveSystemPresetOrder({ ...base, capabilitySlugs: ["artifact"] }),
    ).toThrow(/required/i);
    expect(() =>
      resolveSystemPresetOrder({ ...base, capabilitySlugs: ["unknown"] }),
    ).toThrow();
    expect(() =>
      resolveSystemPresetOrder({
        ...base,
        capabilitySlugs: ["tasks", "artifact", "settings"],
        safeOverrides: { typography: "bad" },
      }),
    ).toThrow();
    expect(() =>
      resolveSystemPresetOrder({
        ...base,
        recipeSlug: "saas-landing",
        capabilitySlugs: ["tasks", "artifact", "settings"],
      }),
    ).toThrow();
    expect(() =>
      resolveSystemPresetOrder({
        ...base,
        capabilitySlugs: ["tasks", "artifact", "settings"],
        safeOverrides: { branding: { invalid: undefined } } as never,
      }),
    ).toThrow();
    expect(() =>
      resolveSystemPresetOrder({
        ...base,
        capabilitySlugs: ["tasks", "artifact", "settings"],
        safeOverrides: {
          branding: {
            productName: "Parking Agent",
            logoReference: "assets/parking-logo.svg",
          },
          productCopy: {
            composer: { placeholder: "描述下一项停车运营任务" },
          },
          navigation: ["tasks", "connectors", "settings"],
          locale: ["zh-CN", "en-US"],
          semanticStateColors: {
            success: "#16a34a",
            destructive: "rgb(220 38 38 / 80%)",
            warning: "hsl(38 92% 50%)",
            danger: "var(--danger)",
            info: "oklch(0.7 0.1 240)",
          },
          platformChrome: "native",
        },
      }),
    ).not.toThrow();
    const invalidSafeOverrides: unknown[] = [
      { branding: {} },
      { branding: { productName: "" } },
      { branding: { unknown: "value" } },
      { productCopy: {} },
      { productCopy: { composer: { placeholder: "" } } },
      { productCopy: { composer: 3 } },
      { navigation: ["tasks", "tasks"] },
      { locale: [] },
      { locale: "en_US" },
      { locale: ["zh-CN", "not_locale"] },
      { semanticStateColors: { neutral: "#ffffff" } },
      { semanticStateColors: { success: "green" } },
      { semanticStateColors: { success: "#1234567" } },
      { semanticStateColors: { success: "rgb(nope)" } },
      { semanticStateColors: { success: "rgb(256 0 0)" } },
      { semanticStateColors: { success: "rgb(0 0 0 / 101%)" } },
      { semanticStateColors: { success: "hsl(0 101% 50%)" } },
      { semanticStateColors: { success: "oklch(1.1 0.2 30)" } },
      { platformChrome: "desktop" },
    ];
    for (const safeOverrides of invalidSafeOverrides) {
      expect(() =>
        resolveSystemPresetOrder({
          ...base,
          capabilitySlugs: ["tasks", "artifact", "settings"],
          safeOverrides: safeOverrides as JsonObject,
        }),
      ).toThrow(/override/i);
    }

    const missingSourceCatalog = catalog.map((item) =>
      item.kind === "component" && item.slug === "agent-thread"
        ? { ...item, sourceFiles: [] }
        : item,
    );
    expect(() =>
      resolveSystemPresetOrder({
        ...base,
        capabilitySlugs: ["tasks", "artifact", "settings"],
        catalog: missingSourceCatalog,
      }),
    ).toThrow(/source family/i);

    const incompatibleProfileCatalog = catalog.map((item) =>
      item.kind === "recipe" && item.slug === "agent-workbench"
        ? { ...item, profiles: ["next-app" as const] }
        : item,
    );
    expect(() =>
      resolveSystemPresetOrder({
        ...base,
        capabilitySlugs: ["tasks", "artifact", "settings"],
        catalog: incompatibleProfileCatalog,
      }),
    ).toThrow(/profile/i);

    const deletedPresetCatalog = catalog.filter(
      (item) =>
        !(item.kind === "system-preset" && item.slug === base.presetSlug),
    );
    expect(() =>
      resolveSystemPresetOrder({
        ...base,
        capabilitySlugs: ["tasks", "artifact", "settings"],
        catalog: deletedPresetCatalog,
      }),
    ).toThrow(/preset/i);

    const deletedPayloadCatalog = catalog.map((item) =>
      item.kind === "system-preset" && item.slug === base.presetSlug
        ? { ...item, systemPreset: undefined }
        : item,
    );
    expect(() =>
      resolveSystemPresetOrder({
        ...base,
        capabilitySlugs: ["tasks", "artifact", "settings"],
        catalog: deletedPayloadCatalog,
      }),
    ).toThrow(/payload/i);

    const tamperedPresetCatalog: unknown = catalog.map((item) =>
      item.kind === "system-preset" &&
      item.slug === base.presetSlug &&
      item.systemPreset
        ? {
            ...item,
            systemPreset: {
              ...item.systemPreset,
              schemaVersion: 2 as const,
            },
          }
        : item,
    );
    expect(() =>
      resolveSystemPresetOrder({
        ...base,
        capabilitySlugs: ["tasks", "artifact", "settings"],
        catalog: tamperedPresetCatalog as typeof catalog,
      }),
    ).toThrow(/schemaVersion/i);
  });

  test("creates a frozen planned order draft that cannot confirm without acceptance captures", async () => {
    const catalog = await buildCatalog();
    const resolution = resolveSystemPresetOrder({
      presetSlug: "codex-desktop-v1",
      recipeSlug: "agent-workbench",
      profile: "electron-renderer",
      capabilitySlugs: ["tasks", "artifact", "board", "connectors", "settings"],
      safeOverrides: {},
      catalog,
    });
    const draft = createOrderDraftFromResolution(resolution, {
      orderId: "parking-desktop",
      createdAt: "2026-07-28T09:30:00.000Z",
      productId: "parking-agent",
      locales: ["zh-CN"],
      platformChrome: "native",
      catalogSource: "snapshot",
    });
    expect(isOrderManifestHashValid(draft)).toBe(true);
    expect(draft.preset.slug).toBe("codex-desktop-v1");
    expect(draft.preset.version).toBe(1);
    expect(draft.preset.contractHash).toBe(resolution.preset.contractHash);
    expect(draft.target.category).toBe("application");
    expect(draft.target.profile).toBe("electron-renderer");
    expect(resolution.preset.themeKit.slug).toBe("codex-desktop-v1");
    expect(draft.composition.recipe.slug).toBe("agent-workbench");
    expect(draft.composition.assets).toEqual(resolution.assets);
    expect(draft.referenceEvidence.cases.map((item) => item.id)).toEqual(
      resolution.referencePack.cases.map((item) => item.id),
    );
    expect(Object.isFrozen(draft)).toBe(true);
    expect(() =>
      confirmOrderManifest(
        draft,
        {
          confirmedAt: "2026-07-28T10:00:00.000Z",
          visualAcceptance: {
            approvedAt: "2026-07-28T09:45:00.000Z",
            approvedBy: "visual-reviewer",
            decisionEvidence: "Reference Board decision #1",
            reviewedCaseIds: draft.referenceEvidence.cases.map(
              (item) => item.id,
            ),
          },
        },
        catalog,
      ),
    ).toThrow(/acceptance capture/i);

    const nativeChromeResolution = resolveSystemPresetOrder({
      presetSlug: "codex-desktop-v1",
      recipeSlug: "agent-workbench",
      profile: "electron-renderer",
      capabilitySlugs: ["tasks", "artifact", "settings"],
      safeOverrides: { platformChrome: "native" },
      catalog,
    });
    expect(() =>
      createOrderDraftFromResolution(nativeChromeResolution, {
        orderId: "parking-desktop-mismatch",
        createdAt: "2026-07-28T09:30:00.000Z",
        productId: "parking-agent",
        locales: ["zh-CN"],
        platformChrome: "web",
        catalogSource: "snapshot",
      }),
    ).toThrow(/platformChrome/i);
  });
});
