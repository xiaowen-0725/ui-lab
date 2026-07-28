import type { CatalogItem } from "@/lib/catalog";
import { canonicalSha256 } from "@/lib/contracts/canonical-json";
import { systemPresetContractPayload } from "@/lib/system-presets";

export function catalogContractHash(item: CatalogItem): string {
  const payload: Record<string, unknown> = { fetch: item.fetch };
  const assignDefined = (key: string, value: unknown) => {
    if (value !== undefined) payload[key] = value;
  };

  if (item.kind === "component") {
    assignDefined("sourceFile", item.sourceFile);
    assignDefined("sourceFiles", item.sourceFiles);
  }
  if (item.themePreview) {
    const { modes, light, dark } = item.themePreview;
    assignDefined("themePreview", {
      modes,
      ...(light === undefined ? {} : { light }),
      ...(dark === undefined ? {} : { dark }),
    });
  }
  if (item.kind === "recipe") {
    assignDefined("profiles", item.profiles);
    assignDefined("recommendedSystem", item.recommendedSystem);
    assignDefined("entryComponent", item.entryComponent);
    assignDefined("components", item.components);
    assignDefined("optionalComponents", item.optionalComponents);
    assignDefined(
      "slots",
      item.slots?.map(({ name, required }) => ({ name, required })),
    );
    assignDefined(
      "states",
      item.states?.map(({ name }) => ({ name })),
    );
    assignDefined(
      "responsive",
      item.responsive?.map(({ viewport, behavior }) => ({
        viewport,
        behavior,
      })),
    );
    assignDefined(
      "assets",
      item.assets?.map(({ kind, requirement, required }) => ({
        kind,
        requirement,
        required,
      })),
    );
    assignDefined("sections", item.sections);
    assignDefined("required", item.required);
    assignDefined("forbidden", item.forbidden);
  }
  if (item.kind === "system-preset") {
    assignDefined(
      "systemPreset",
      item.systemPreset
        ? systemPresetContractPayload(item.systemPreset)
        : undefined,
    );
  }

  return canonicalSha256(payload);
}

export function catalogSnapshotContractHash(items: CatalogItem[]): string {
  return canonicalSha256(
    items
      .map((item) => ({
        kind: item.kind,
        slug: item.slug,
        contractHash: catalogContractHash(item),
      }))
      .sort((left, right) =>
        `${left.kind}:${left.slug}`.localeCompare(
          `${right.kind}:${right.slug}`,
        ),
      ),
  );
}
