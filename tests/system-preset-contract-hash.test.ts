import { describe, expect, test } from "bun:test";
import { buildCatalog } from "@/lib/catalog";
import { catalogContractHash as mainCatalogContractHash } from "@/lib/catalog-contract";
import {
  CODEX_DESKTOP_V1,
  systemPresetContractHash,
} from "@/lib/system-presets";
import { catalogContractHash as cliCatalogContractHash } from "../cli/src/project-lock";

describe("System Preset behavior contract hash", () => {
  test("ignores root and capability display copy", async () => {
    const renamedPreset = {
      ...CODEX_DESKTOP_V1,
      approvedAt: "2099-01-01T00:00:00.000Z",
      name: "Renamed system",
      nameZh: "重命名系统",
      aliases: ["renamed"],
      description: "Renamed description",
      descriptionZh: "重命名描述",
      capabilities: CODEX_DESKTOP_V1.capabilities.map((capability) => ({
        ...capability,
        name: `Renamed ${capability.name}`,
        nameZh: `重命名${capability.nameZh}`,
      })),
    };
    const catalog = await buildCatalog();
    const item = catalog.find(
      (candidate) => candidate.kind === "system-preset",
    );
    if (!item?.systemPreset) throw new Error("system preset fixture is missing");

    const renamedItem = { ...item, systemPreset: renamedPreset };

    expect(systemPresetContractHash(renamedPreset)).toBe(
      systemPresetContractHash(CODEX_DESKTOP_V1),
    );
    expect(mainCatalogContractHash(renamedItem)).toBe(
      mainCatalogContractHash(item),
    );
    expect(cliCatalogContractHash(renamedItem)).toBe(
      cliCatalogContractHash(item),
    );
  });

  test("keeps main and CLI catalog contract hashes aligned for every item", async () => {
    const catalog = await buildCatalog();
    const mismatches = catalog
      .filter(
        (item) =>
          mainCatalogContractHash(item) !== cliCatalogContractHash(item),
      )
      .map((item) => `${item.kind}:${item.slug}`);

    expect(mismatches).toEqual([]);
  });

  test("changes for every behavior slice and keeps main and CLI parity", async () => {
    const catalog = await buildCatalog();
    const item = catalog.find(
      (candidate) => candidate.kind === "system-preset",
    );
    if (!item?.systemPreset) throw new Error("system preset fixture is missing");

    const changedPresets = [
      {
        ...CODEX_DESKTOP_V1,
        lockedVisual: {
          ...CODEX_DESKTOP_V1.lockedVisual,
          typography: {
            ...CODEX_DESKTOP_V1.lockedVisual.typography,
            scale: {
              ...CODEX_DESKTOP_V1.lockedVisual.typography.scale,
              body: {
                ...CODEX_DESKTOP_V1.lockedVisual.typography.scale.body,
                sizePx: 15,
              },
            },
          },
        },
      },
      {
        ...CODEX_DESKTOP_V1,
        componentAllowlist: [...CODEX_DESKTOP_V1.componentAllowlist, "extra"],
      },
      {
        ...CODEX_DESKTOP_V1,
        referencePack: {
          ...CODEX_DESKTOP_V1.referencePack,
          fixture: { ...CODEX_DESKTOP_V1.referencePack.fixture, version: 99 },
        },
      },
      {
        ...CODEX_DESKTOP_V1,
        referencePack: {
          ...CODEX_DESKTOP_V1.referencePack,
          cases: CODEX_DESKTOP_V1.referencePack.cases.map((item, index) =>
            index === 0 ? { ...item, captureTiming: "changed" } : item,
          ),
        },
      },
    ];

    for (const systemPreset of changedPresets) {
      expect(systemPresetContractHash(systemPreset)).not.toBe(
        systemPresetContractHash(CODEX_DESKTOP_V1),
      );
      const changedItem = { ...item, systemPreset };
      expect(mainCatalogContractHash(changedItem)).not.toBe(
        mainCatalogContractHash(item),
      );
      expect(cliCatalogContractHash(changedItem)).toBe(
        mainCatalogContractHash(changedItem),
      );
    }
  });
});
