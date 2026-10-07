import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import type { CatalogItem } from "./catalog-source.js";
import type { ProjectConfig } from "./project-config.js";

export const PROJECT_LOCK_NAME = "ui-lab.lock.json";

export type ProjectLockItem = {
  kind: CatalogItem["kind"];
  slug: string;
  contractHash: string;
  sourceFiles?: string[];
  /** Optional override for entries added from a different catalog source. */
  catalogSource?: string;
};

export type ProjectLock = {
  schemaVersion: 1;
  catalogSource: string;
  items: ProjectLockItem[];
};

const LOCK_KEYS = new Set(["schemaVersion", "catalogSource", "items"]);
const LOCK_ITEM_KEYS = new Set(["kind", "slug", "contractHash", "sourceFiles", "catalogSource"]);
const CATALOG_KINDS = new Set<CatalogItem["kind"]>([
  "component",
  "atom-set",
  "icon-style",
  "icon-motion",
  "style",
  "palette",
  "design-system",
  "recipe",
  "vocabulary",
  "reference",
]);

function stableSerialize(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  const entries = Object.keys(record)
    .filter((key) => record[key] !== undefined)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableSerialize(record[key])}`);
  return `{${entries.join(",")}}`;
}

function contractPayload(item: CatalogItem): Record<string, unknown> {
  const payload: Record<string, unknown> = { fetch: item.fetch };

  if (item.kind === "component") {
    payload.sourceFile = item.sourceFile;
    payload.sourceFiles = item.sourceFiles;
    payload.installTargets = item.installTargets;
    payload.installationFiles = item.installationFiles;
    payload.sourceVersion = item.sourceVersion;
    payload.exportName = item.exportName;
    payload.profiles = item.profiles;
    payload.components = item.components;
    payload.pages = item.pages;
    payload.shellComponent = item.shellComponent;
  }
  if (item.themePreview) {
    payload.themePreview = item.themePreview;
  }
  if (item.kind === "recipe") {
    payload.profiles = item.profiles;
    payload.recommendedSystem = item.recommendedSystem;
    payload.entryComponent = item.entryComponent;
    payload.components = item.components;
    payload.optionalComponents = item.optionalComponents;
    payload.slots = item.slots?.map((slot) => ({
      name: slot.name,
      required: slot.required,
    }));
    payload.states = item.states?.map((state) => ({ name: state.name }));
    payload.responsive = item.responsive?.map((rule) => ({
      viewport: rule.viewport,
      behavior: rule.behavior,
    }));
    payload.assets = item.assets?.map((asset) => ({
      kind: asset.kind,
      requirement: asset.requirement,
      required: asset.required,
    }));
    payload.sections = item.sections;
    payload.required = item.required;
    payload.forbidden = item.forbidden;
  }
  return payload;
}

export function catalogContractHash(item: CatalogItem): string {
  return createHash("sha256")
    .update(stableSerialize(contractPayload(item)))
    .digest("hex");
}

function selectedCatalogItems(
  items: CatalogItem[],
  config: ProjectConfig,
): CatalogItem[] {
  const selected: CatalogItem[] = [];
  const systems = items.filter(
    (item) => item.slug === config.system && item.themePreview,
  );
  if (systems.length !== 1) {
    throw new Error(`Configured system "${config.system}" is missing or ambiguous in the catalog.`);
  }
  selected.push(systems[0]);

  if (config.recipe) {
    const recipe = items.find(
      (item) => item.kind === "recipe" && item.slug === config.recipe,
    );
    if (!recipe) throw new Error(`Configured recipe "${config.recipe}" does not exist in the catalog.`);
    if (!recipe.profiles?.includes(config.profile)) {
      throw new Error(`Recipe "${config.recipe}" does not support profile "${config.profile}".`);
    }
    selected.push(recipe);
  }

  for (const slug of config.components) {
    const component = items.find(
      (item) => item.kind === "component" && item.slug === slug,
    );
    if (!component) throw new Error(`Configured component "${slug}" does not exist in the catalog.`);
    selected.push(component);
  }

  return [...new Map(selected.map((item) => [`${item.kind}:${item.slug}`, item])).values()];
}

export function buildProjectLock(
  items: CatalogItem[],
  config: ProjectConfig,
  catalogSource: string,
): ProjectLock {
  const lockItems = selectedCatalogItems(items, config)
    .map(
      (item): ProjectLockItem => ({
        kind: item.kind,
        slug: item.slug,
        contractHash: catalogContractHash(item),
        ...(item.kind === "component" && item.sourceFiles
          ? { sourceFiles: [...item.sourceFiles] }
          : {}),
      }),
    )
    .sort((left, right) =>
      `${left.kind}:${left.slug}`.localeCompare(`${right.kind}:${right.slug}`),
    );

  return {
    schemaVersion: 1,
    catalogSource,
    items: lockItems,
  };
}

/** Keep the baseline of still-selected entries; only new identities are pinned.
 * Removed selections are dropped, but existing contracts are never refreshed.
 * The top-level source remains the default provenance for legacy v1 entries.
 */
export function updateProjectLock(
  items: CatalogItem[],
  config: ProjectConfig,
  catalogSource: string,
  previous?: ProjectLock,
): ProjectLock {
  const current = buildProjectLock(items, config, catalogSource);
  if (!previous) return current;
  const baseline = new Map(previous.items.map((item) => [`${item.kind}:${item.slug}`, item]));
  return {
    schemaVersion: 1,
    catalogSource: previous.catalogSource,
    items: current.items.map((item) => baseline.get(`${item.kind}:${item.slug}`) ?? {
      ...item,
      ...(catalogSource === previous.catalogSource ? {} : { catalogSource }),
    }),
  };
}

function invalidLock(message: string): never {
  throw new Error(`Invalid ${PROJECT_LOCK_NAME}: ${message}`);
}

export function parseProjectLock(value: unknown): ProjectLock {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    invalidLock("expected a JSON object.");
  }
  const record = value as Record<string, unknown>;
  const unknownKeys = Object.keys(record).filter((key) => !LOCK_KEYS.has(key));
  if (unknownKeys.length > 0) {
    invalidLock(
      `unknown field${unknownKeys.length > 1 ? "s" : ""}: ${unknownKeys.join(", ")}.`,
    );
  }
  if (record.schemaVersion !== 1) {
    invalidLock('field "schemaVersion" must be 1.');
  }
  if (
    typeof record.catalogSource !== "string" ||
    record.catalogSource.trim() === ""
  ) {
    invalidLock('field "catalogSource" must be a non-empty string.');
  }
  if (!Array.isArray(record.items)) {
    invalidLock('field "items" must be an array.');
  }

  const parsedItems = record.items.map((value, index): ProjectLockItem => {
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      invalidLock(`field "items[${index}]" must be an object.`);
    }
    const item = value as Record<string, unknown>;
    const unknownItemKeys = Object.keys(item).filter(
      (key) => !LOCK_ITEM_KEYS.has(key),
    );
    if (unknownItemKeys.length > 0) {
      invalidLock(
        `field "items[${index}]" has unknown field${unknownItemKeys.length > 1 ? "s" : ""}: ${unknownItemKeys.join(", ")}.`,
      );
    }
    if (!CATALOG_KINDS.has(item.kind as CatalogItem["kind"])) {
      invalidLock(`field "items[${index}].kind" is invalid.`);
    }
    if (typeof item.slug !== "string" || item.slug.trim() === "") {
      invalidLock(`field "items[${index}].slug" must be a non-empty string.`);
    }
    if (
      typeof item.contractHash !== "string" ||
      !/^[a-f0-9]{64}$/.test(item.contractHash)
    ) {
      invalidLock(
        `field "items[${index}].contractHash" must be a SHA-256 hex digest.`,
      );
    }
    if (
      item.sourceFiles !== undefined &&
      (!Array.isArray(item.sourceFiles) ||
        item.sourceFiles.some((sourceFile) => typeof sourceFile !== "string"))
    ) {
      invalidLock(`field "items[${index}].sourceFiles" must be a string array.`);
    }
    if (item.kind !== "component" && item.sourceFiles !== undefined) {
      invalidLock(
        `field "items[${index}].sourceFiles" is only valid for components.`,
      );
    }
    if (item.catalogSource !== undefined && (typeof item.catalogSource !== "string" || !item.catalogSource.trim())) {
      invalidLock(`field "items[${index}].catalogSource" must be a non-empty string.`);
    }

    return {
      kind: item.kind as CatalogItem["kind"],
      slug: item.slug as string,
      contractHash: item.contractHash as string,
      ...(item.sourceFiles === undefined
        ? {}
        : { sourceFiles: [...(item.sourceFiles as string[])] }),
      ...(item.catalogSource === undefined ? {} : { catalogSource: item.catalogSource as string }),
    };
  });

  const identities = parsedItems.map((item) => `${item.kind}:${item.slug}`);
  if (new Set(identities).size !== identities.length) {
    invalidLock('field "items" contains duplicate kind/slug entries.');
  }

  return {
    schemaVersion: 1,
    catalogSource: record.catalogSource as string,
    items: parsedItems,
  };
}

export function readProjectLock(directory: string): {
  lockPath: string;
  lock: ProjectLock;
} {
  const lockPath = resolve(directory, PROJECT_LOCK_NAME);
  let value: unknown;
  try {
    value = JSON.parse(readFileSync(lockPath, "utf8"));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot read ${lockPath}: ${reason}`);
  }
  return { lockPath, lock: parseProjectLock(value) };
}

export function writeProjectLock(path: string, lock: ProjectLock): void {
  mkdirSync(dirname(path), { recursive: true });
  const text = `${JSON.stringify(lock, null, 2)}\n`;
  try {
    if (readFileSync(path, "utf8") === text) return;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
  }
  writeFileSync(path, text, "utf8");
}
