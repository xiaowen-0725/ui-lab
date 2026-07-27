import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

export const PROJECT_CONFIG_NAME = "ui-lab.config.json";
export const APPLICATION_PROFILES = [
  "next-app",
  "vite-app",
  "electron-renderer",
] as const;
export const APPLICATION_MODES = ["adopt", "replace"] as const;

export type ApplicationProfile = (typeof APPLICATION_PROFILES)[number];
export type ApplicationMode = (typeof APPLICATION_MODES)[number];

export type ProjectConfig = {
  schemaVersion: 1;
  profile: ApplicationProfile;
  system: string;
  recipe?: string;
  components: string[];
  mode: ApplicationMode;
};

const PROJECT_CONFIG_KEYS = new Set([
  "schemaVersion",
  "profile",
  "system",
  "recipe",
  "components",
  "mode",
]);

function invalidConfig(message: string): never {
  throw new Error(`Invalid ${PROJECT_CONFIG_NAME}: ${message}`);
}

export function parseProjectConfig(value: unknown): ProjectConfig {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    invalidConfig("expected a JSON object.");
  }

  const record = value as Record<string, unknown>;
  const unknownKeys = Object.keys(record).filter((key) => !PROJECT_CONFIG_KEYS.has(key));
  if (unknownKeys.length > 0) {
    invalidConfig(`unknown field${unknownKeys.length > 1 ? "s" : ""}: ${unknownKeys.join(", ")}.`);
  }
  if (record.schemaVersion !== 1) {
    invalidConfig('field "schemaVersion" must be 1.');
  }
  if (!APPLICATION_PROFILES.includes(record.profile as ApplicationProfile)) {
    invalidConfig(
      `field "profile" must be one of: ${APPLICATION_PROFILES.join(", ")}.`,
    );
  }
  if (typeof record.system !== "string" || record.system.trim() === "") {
    invalidConfig('field "system" must be a non-empty string.');
  }
  if (
    record.recipe !== undefined &&
    (typeof record.recipe !== "string" || record.recipe.trim() === "")
  ) {
    invalidConfig('field "recipe" must be a non-empty string when present.');
  }
  if (
    !Array.isArray(record.components) ||
    record.components.some(
      (component) => typeof component !== "string" || component.trim() === "",
    )
  ) {
    invalidConfig('field "components" must be an array of non-empty strings.');
  }
  if (!APPLICATION_MODES.includes(record.mode as ApplicationMode)) {
    invalidConfig(`field "mode" must be one of: ${APPLICATION_MODES.join(", ")}.`);
  }

  return {
    schemaVersion: 1,
    profile: record.profile as ApplicationProfile,
    system: record.system as string,
    ...(record.recipe === undefined ? {} : { recipe: record.recipe as string }),
    components: [...(record.components as string[])],
    mode: record.mode as ApplicationMode,
  };
}

export function readProjectConfig(directory: string): {
  configPath: string;
  config: ProjectConfig;
} {
  const configPath = resolve(directory, PROJECT_CONFIG_NAME);
  let value: unknown;
  try {
    value = JSON.parse(readFileSync(configPath, "utf8"));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot read ${configPath}: ${reason}`);
  }

  return { configPath, config: parseProjectConfig(value) };
}

export function writeProjectConfig(path: string, config: ProjectConfig): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(config, null, 2)}\n`, "utf8");
}
