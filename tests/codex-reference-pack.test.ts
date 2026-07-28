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
  vendored: boolean;
  path?: string;
  privacyBoundary?: string;
  width: number;
  height: number;
  sha256: string;
  excludedFeatures?: string[];
};

type AcceptanceCase = {
  id: string;
  viewport: string;
  theme: string;
  states: string[];
  surfaces: string[];
  keyboardFocus?: boolean;
  reducedMotion?: boolean;
  referenceSourceIds: string[];
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

  test("defines a complete, uniquely named acceptance matrix", () => {
    const pack = readReferencePack();
    const caseIds = values(pack.acceptanceCases, "id");
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
      expect(acceptanceCase.referenceSourceIds.length).toBeGreaterThan(0);
    }
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
  });
});
