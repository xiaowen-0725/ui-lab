import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, test } from "bun:test";
import sharp from "sharp";

const REPO_ROOT = resolve(import.meta.dir, "..");
const REFERENCE_PACK_PATH = resolve(
  REPO_ROOT,
  "content/system-presets/codex-desktop-v1/reference-pack.json",
);

type ReferenceSource = {
  id: string;
  role: string;
  theme: string;
  vendored: boolean;
  path?: string;
  privacyBoundary?: string;
  width: number;
  height: number;
  sha256: string;
  excludedFeatures?: string[];
  captureMetadata: {
    imagePixelScale: number;
    dpi: number;
    fontLoadingState: string;
    captureTiming: string;
    semanticScenario: string;
    evidenceRole: string;
  };
};

type AcceptanceCase = {
  id: string;
  viewport: string;
  theme: string;
  states: string[];
  surfaces: string[];
  keyboardFocus?: boolean;
  reducedMotion?: boolean;
  size: string;
  scale: number;
  fixtureId: string;
  status: string;
  fontLoadingState: string;
  captureTiming: string;
  goldenCapture: null;
  calibrationSourceIds: string[];
};

type FixturePack = {
  schemaVersion: number;
  id: string;
  version: number;
  capturePreconditions: string[];
  caseSelectors: Record<string, string[]>;
};

type ReferencePack = {
  schemaVersion: number;
  presetId: string;
  status: string;
  sources: ReferenceSource[];
  acceptanceCases: AcceptanceCase[];
  lockedDecisions: string[];
  safeOverrides: string[];
  forbiddenPatterns: string[];
  fixturePack: {
    id: string;
    version: number;
    path: string;
    sha256: string;
  };
  observedFacts: {
    icons: {
      family: string;
      defaultPx: number;
      strokePx: number;
    };
    shadows: Record<string, string>;
  };
};

function readReferencePack(): ReferencePack {
  return JSON.parse(readFileSync(REFERENCE_PACK_PATH, "utf8")) as ReferencePack;
}

function readFixturePack(path: string): FixturePack {
  return JSON.parse(readFileSync(resolve(REPO_ROOT, path), "utf8")) as FixturePack;
}

function publicAssetPath(sourcePath: string): string {
  return resolve(REPO_ROOT, "public", sourcePath.replace(/^\//, ""));
}

function values<T>(items: readonly T[], property: keyof T): T[keyof T][] {
  return items.map((item) => item[property]);
}

describe("Codex Desktop v1 reference pack", () => {
  test("publishes the reviewed reference-pack identity", () => {
    const pack = readReferencePack();

    expect(pack.schemaVersion).toBe(1);
    expect(pack.presetId).toBe("codex-desktop-v1");
    expect(pack.status).toBe("review");
  });

  test("pins reference source provenance and vendored bytes", async () => {
    const pack = readReferencePack();
    const expected = [
      {
        id: "codex-workbench-light",
        role: "authoritative",
        vendored: true,
        width: 888,
        height: 596,
        sha256: "8ff47021477adb204f6a24fcb29682bc3cf0893230ae4f40a1273c88ca8d7c9a",
      },
      {
        id: "codex-desktop-light",
        role: "authoritative",
        vendored: false,
        width: 1908,
        height: 1049,
        sha256: "66ec605a9c1032ac8691fa3ff4166c474468eb7c8b6c396658cb5d777148d1d9",
      },
      {
        id: "codex-composer-dark",
        role: "supporting",
        vendored: true,
        width: 1864,
        height: 980,
        sha256: "b0fb3bac95edeb5fc5667d6b12ec2e59834a40be4a62d705912feb8ea4b5f482",
      },
    ] as const;

    expect(new Set(values(pack.sources, "id")).size).toBe(pack.sources.length);

    for (const sourceExpectation of expected) {
      const source = pack.sources.find((candidate) => candidate.id === sourceExpectation.id);
      expect(source).toBeDefined();
      expect(source).toMatchObject(sourceExpectation);
      if (!source) continue;

      expect(source.captureMetadata).toMatchObject({
        imagePixelScale: 1,
        dpi: 72,
        fontLoadingState: "runtime-rendered",
        captureTiming: "stable-user-supplied-frame",
        evidenceRole: "calibration",
      });
      expect(source.captureMetadata.semanticScenario.trim().length).toBeGreaterThan(0);

      const defaultCandidate = resolve(
        REPO_ROOT,
        "public/system-presets/codex-desktop-v1/references",
        `${source.id}.png`,
      );
      if (source.vendored) {
        expect(source.path).toBeDefined();
        if (!source.path) continue;
        const assetPath = publicAssetPath(source.path);
        expect(existsSync(assetPath)).toBe(true);
        const bytes = readFileSync(assetPath);
        const metadata = await sharp(bytes).metadata();
        expect(metadata.width).toBe(sourceExpectation.width);
        expect(metadata.height).toBe(sourceExpectation.height);
        expect(createHash("sha256").update(bytes).digest("hex")).toBe(sourceExpectation.sha256);
      } else {
        expect(source.path).toBeUndefined();
        expect(source.privacyBoundary?.trim().length).toBeGreaterThan(0);
        expect(existsSync(defaultCandidate)).toBe(false);
      }
    }

    for (const source of pack.sources.filter((candidate) => candidate.role === "supporting")) {
      expect(source.excludedFeatures?.length).toBeGreaterThan(0);
    }
  });

  test("defines a planned, uniquely named acceptance matrix", () => {
    const pack = readReferencePack();
    const fixture = readFixturePack(pack.fixturePack.path);
    const caseIds = pack.acceptanceCases.map((entry) => entry.id);
    const allViewports = new Set(values(pack.acceptanceCases, "viewport"));
    const allThemes = new Set(values(pack.acceptanceCases, "theme"));
    const allStates = new Set(pack.acceptanceCases.flatMap((entry) => entry.states));
    const allSurfaces = new Set(pack.acceptanceCases.flatMap((entry) => entry.surfaces));

    expect(new Set(caseIds).size).toBe(caseIds.length);
    expect([...allViewports]).toEqual(expect.arrayContaining(["wide", "collapse", "narrow"]));
    expect([...allThemes]).toEqual(expect.arrayContaining(["light", "dark"]));
    expect([...allStates]).toEqual(
      expect.arrayContaining(["dense", "streaming", "approval", "empty", "error"]),
    );
    expect([...allSurfaces]).toEqual(
      expect.arrayContaining(["task", "artifact", "board", "connectors", "settings"]),
    );
    expect(pack.acceptanceCases.some((entry) => entry.keyboardFocus === true)).toBe(true);
    expect(pack.acceptanceCases.some((entry) => entry.reducedMotion === true)).toBe(true);
    for (const acceptanceCase of pack.acceptanceCases) {
      expect(acceptanceCase.size).toMatch(/^\d+x\d+$/);
      const [width, height] = acceptanceCase.size.split("x").map(Number);
      expect(width).toBeGreaterThan(0);
      expect(height).toBeGreaterThan(0);
      expect(acceptanceCase.scale).toBeGreaterThan(0);
      expect(acceptanceCase.fixtureId).toBe(pack.fixturePack.id);
      expect(acceptanceCase.status).toBe("planned");
      expect(acceptanceCase.fontLoadingState).toBe("document-fonts-ready");
      expect(acceptanceCase.captureTiming).toBe("two-animation-frames-after-state-settle");
      expect(acceptanceCase.goldenCapture).toBeNull();
      expect(acceptanceCase.calibrationSourceIds.length).toBeGreaterThan(0);
      expect(acceptanceCase.calibrationSourceIds.some((id) =>
        pack.sources.some((source) => source.id === id && source.role === "authoritative"),
      )).toBe(true);
      expect(acceptanceCase.calibrationSourceIds.some((id) =>
        pack.sources.some((source) => source.id === id && source.theme === acceptanceCase.theme),
      )).toBe(true);
      for (const sourceId of acceptanceCase.calibrationSourceIds) {
        expect(pack.sources.some((source) => source.id === sourceId)).toBe(true);
      }
      expect(fixture.caseSelectors[acceptanceCase.id]?.length).toBeGreaterThan(0);
    }
    expect(Object.keys(fixture.caseSelectors).sort()).toEqual([...caseIds].sort());
    for (const darkCase of pack.acceptanceCases.filter((entry) => entry.theme === "dark")) {
      expect(darkCase.calibrationSourceIds.some((id) => id === "codex-composer-dark")).toBe(true);
    }

    expect(fixture).toMatchObject({ schemaVersion: 1, id: "parking-high-density-v1", version: 1 });
    expect(fixture.capturePreconditions).toEqual(
      expect.arrayContaining([
        "document.fonts.ready",
        "two animation frames after stable state",
        "reduced-motion branch",
      ]),
    );
    const fixtureBytes = readFileSync(resolve(REPO_ROOT, pack.fixturePack.path));
    expect(createHash("sha256").update(fixtureBytes).digest("hex")).toBe(pack.fixturePack.sha256);
  });

  test("records visual decision boundaries and companion documents", () => {
    const pack = readReferencePack();

    expect(pack.lockedDecisions).toEqual(
      expect.arrayContaining([
        "typography",
        "icons",
        "surfaces",
        "selection",
        "density",
        "geometry",
        "shadows",
        "motion",
        "responsive",
      ]),
    );
    expect(pack.safeOverrides).toEqual(
      expect.arrayContaining([
        "branding",
        "capabilities",
        "content",
        "locale",
        "semanticStateColors",
        "platformChrome",
      ]),
    );
    expect(pack.forbiddenPatterns.length).toBeGreaterThan(0);
    expect(pack.observedFacts.icons).toMatchObject({
      family: "Lucide",
      defaultPx: 16,
      strokePx: 2,
    });
    expect(pack.observedFacts.shadows).toEqual({
      hairline: "0px 0px 0px .5px #0000001a",
      sm: "0px 1px 2px -1px #00000014",
      md: "0px 2px 4px -1px #00000014",
      lg: "0px 4px 8px -2px #0000001a",
      xl: "0px 8px 16px -4px #0000001f",
      "2xl": "0px 16px 32px -8px #00000030",
    });
    expect(
      existsSync(resolve(REPO_ROOT, "content/system-presets/codex-desktop-v1/VISUAL_FACTS.md")),
    ).toBe(true);
    expect(
      existsSync(resolve(REPO_ROOT, "content/system-presets/codex-desktop-v1/ACCEPTANCE_MATRIX.md")),
    ).toBe(true);
    expect(
      existsSync(resolve(REPO_ROOT, "content/system-presets/codex-desktop-v1/ATTRIBUTION.md")),
    ).toBe(true);
  });
});
