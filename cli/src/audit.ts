import { existsSync, readFileSync, readdirSync } from "node:fs";
import {
  basename,
  dirname,
  extname,
  isAbsolute,
  relative,
  resolve,
  sep,
} from "node:path";
import type { CatalogItem } from "./catalog-source.js";
import { type ProjectConfig, readProjectConfig } from "./project-config.js";
import {
  buildProjectLock,
  PROJECT_LOCK_NAME,
  readProjectLock,
} from "./project-lock.js";

export type AuditFinding = {
  severity: "error" | "warning";
  code: string;
  message: string;
  path?: string;
};

export type AuditResult = {
  ok: boolean;
  directory: string;
  findings: AuditFinding[];
  summary: {
    errors: number;
    warnings: number;
  };
};

export type AuditOptions = {
  strict?: boolean;
  catalogSource?: string;
};

const SOURCE_EXTENSIONS = new Set([".js", ".jsx", ".ts", ".tsx"]);
const SKIPPED_DIRECTORIES = new Set([
  ".git",
  ".next",
  "build",
  "coverage",
  "dist",
  "node_modules",
  "out",
]);
const AGENT_WORKBENCH_FAMILY = [
  "agent-workbench",
  "thread-list",
  "agent-thread",
  "agent-composer",
  "artifact-panel",
] as const;

type ComponentsJsonContract = {
  componentsAlias: string;
  utilsAlias: string;
};

function walkProjectFiles(directory: string): string[] {
  const files: string[] = [];
  const pending = [directory];

  while (pending.length > 0) {
    const current = pending.pop();
    if (!current) continue;

    let entries;
    try {
      entries = readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }

    for (const entry of entries) {
      const path = resolve(current, entry.name);
      if (entry.isDirectory()) {
        if (!SKIPPED_DIRECTORIES.has(entry.name)) pending.push(path);
      } else if (entry.isFile()) {
        files.push(path);
      }
    }
  }

  return files;
}

function dependencyVersion(
  packageJson: Record<string, unknown>,
  dependency: string,
): string | undefined {
  for (const field of ["dependencies", "devDependencies"]) {
    const dependencies = packageJson[field];
    if (typeof dependencies !== "object" || dependencies === null || Array.isArray(dependencies)) {
      continue;
    }
    const version = (dependencies as Record<string, unknown>)[dependency];
    if (typeof version === "string") return version;
  }
  return undefined;
}

function hasMajor(version: string | undefined, major: number): boolean {
  if (!version) return false;
  const match = version.match(/\d+/);
  return match ? Number(match[0]) === major : false;
}

function normalizedFileStem(path: string): string {
  return basename(path, extname(path)).replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function normalizedSlug(slug: string): string {
  return slug.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
}

function relativePathWithin(directory: string, path: string): string | undefined {
  const candidate = relative(directory, path);
  if (
    candidate === "" ||
    candidate === ".." ||
    candidate.startsWith(`..${sep}`) ||
    isAbsolute(candidate)
  ) {
    return undefined;
  }
  return candidate;
}

function matchesComponentSource(
  path: string,
  item: CatalogItem,
  componentDirectories: string[],
): boolean {
  if (!SOURCE_EXTENSIONS.has(extname(path))) return false;

  const componentRelativePath = componentDirectories
    .map((directory) => relativePathWithin(directory, path))
    .find((candidate) => candidate !== undefined);
  if (!componentRelativePath) return false;

  const normalizedRelativePath = componentRelativePath.split(sep).join("/");
  const normalizedSourceFile = item.sourceFile?.replaceAll("\\", "/");
  const canonicalRelativePath = normalizedSourceFile?.startsWith("components/")
    ? normalizedSourceFile.slice("components/".length)
    : undefined;
  if (canonicalRelativePath && normalizedRelativePath === canonicalRelativePath) {
    return true;
  }

  const pathParts = componentRelativePath.split(sep);
  if (pathParts.length > 2) return false;

  const slugStem = normalizedSlug(item.slug);
  const hintedPath = item.sourceFile;
  const hintedFileStem = hintedPath ? normalizedFileStem(hintedPath) : undefined;
  const hintedParentStem = hintedPath
    ? basename(dirname(hintedPath)).replace(/[^a-zA-Z0-9]/g, "").toLowerCase()
    : undefined;
  const fileStem = normalizedFileStem(path);
  const parentStem = basename(dirname(path)).replace(/[^a-zA-Z0-9]/g, "").toLowerCase();

  if (pathParts.length === 1) {
    return (
      fileStem === slugStem ||
      Boolean(hintedFileStem && hintedFileStem !== "index" && fileStem === hintedFileStem)
    );
  }
  if (fileStem !== "index") return false;
  return parentStem === slugStem || (hintedFileStem === "index" && parentStem === hintedParentStem);
}

/**
 * Registry source families can be copied in either of the supported shapes:
 *
 * - canonical shadcn paths: `motion/agent-thread/cards.tsx`
 * - a project's direct component family: `agent-thread/cards.tsx`
 *
 * The primary entry has a more permissive legacy matcher above so existing
 * flat vendoring such as `agent-thread.tsx` remains valid. Sidecars are
 * deliberately stricter: a naked `cards.tsx` gives no evidence that it
 * belongs to `agent-thread`.
 */
function hasVendoredFamilySource(
  projectFiles: string[],
  componentDirectories: string[],
  sourceFile: string,
  slug: string,
): boolean {
  const normalizedSourceFile = sourceFile.replaceAll("\\", "/");
  const canonicalRelativePath = normalizedSourceFile.startsWith("components/")
    ? normalizedSourceFile.slice("components/".length)
    : normalizedSourceFile;
  const sourceParts = canonicalRelativePath.split("/");
  const familyTail =
    sourceParts[1] === slug ? sourceParts.slice(2) : sourceParts.slice(1);
  const directRelativePath =
    sourceParts.length > 1
      ? [slug, ...familyTail].join("/")
      : canonicalRelativePath;

  return projectFiles.some((path) => {
    if (!SOURCE_EXTENSIONS.has(extname(path))) return false;
    const componentRelativePath = componentDirectories
      .map((directory) => relativePathWithin(directory, path))
      .find((candidate) => candidate !== undefined);
    if (!componentRelativePath) return false;
    const normalizedRelativePath = componentRelativePath.split(sep).join("/");
    return (
      normalizedRelativePath === canonicalRelativePath ||
      normalizedRelativePath === directRelativePath
    );
  });
}

function stripJsTsComments(source: string): string {
  let result = "";
  let quote: "'" | '"' | "`" | undefined;

  for (let index = 0; index < source.length; index++) {
    const char = source[index];
    const next = source[index + 1];

    if (quote) {
      result += char;
      if (char === "\\") {
        if (next !== undefined) {
          result += next;
          index++;
        }
      } else if (char === quote) {
        quote = undefined;
      }
      continue;
    }

    if (char === "'" || char === '"' || char === "`") {
      quote = char;
      result += char;
      continue;
    }
    if (char === "/" && next === "/") {
      while (index < source.length && source[index] !== "\n") index++;
      result += "\n";
      continue;
    }
    if (char === "/" && next === "*") {
      index += 2;
      while (
        index < source.length &&
        !(source[index] === "*" && source[index + 1] === "/")
      ) {
        if (source[index] === "\n") result += "\n";
        index++;
      }
      index++;
      continue;
    }
    result += char;
  }

  return result;
}

function stripCssComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pushFinding(
  findings: AuditFinding[],
  severity: AuditFinding["severity"],
  code: string,
  message: string,
  path?: string,
): void {
  findings.push({ severity, code, message, ...(path ? { path } : {}) });
}

function readComponentsJsonContract(
  directory: string,
  findings: AuditFinding[],
): ComponentsJsonContract | undefined {
  const componentsJsonPath = resolve(directory, "components.json");
  if (!existsSync(componentsJsonPath)) {
    pushFinding(
      findings,
      "error",
      "components-json-missing",
      "components.json is required for the shadcn-compatible golden path.",
      componentsJsonPath,
    );
    return undefined;
  }

  try {
    const value: unknown = JSON.parse(readFileSync(componentsJsonPath, "utf8"));
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      throw new Error("expected a JSON object");
    }
    const aliases = (value as Record<string, unknown>).aliases;
    if (typeof aliases !== "object" || aliases === null || Array.isArray(aliases)) {
      throw new Error('field "aliases" must be an object');
    }
    const componentsAlias = (aliases as Record<string, unknown>).components;
    if (typeof componentsAlias !== "string" || componentsAlias.trim() === "") {
      throw new Error('field "aliases.components" must be a non-empty string');
    }
    const utilsAlias = (aliases as Record<string, unknown>).utils;
    if (typeof utilsAlias !== "string" || utilsAlias.trim() === "") {
      throw new Error('field "aliases.utils" must be a non-empty string');
    }
    return {
      componentsAlias: componentsAlias.trim(),
      utilsAlias: utilsAlias.trim(),
    };
  } catch (error) {
    pushFinding(
      findings,
      "error",
      "components-json-invalid",
      `Invalid components.json: ${error instanceof Error ? error.message : String(error)}.`,
      componentsJsonPath,
    );
    return undefined;
  }
}

function resolveComponentDirectories(directory: string, alias: string): string[] {
  const normalizedAlias = alias.replaceAll("\\", "/");
  const candidates =
    normalizedAlias.startsWith("@/") || normalizedAlias.startsWith("~/")
      ? [
          resolve(directory, normalizedAlias.slice(2)),
          resolve(directory, "src", normalizedAlias.slice(2)),
        ]
      : [
          resolve(
            directory,
            normalizedAlias.startsWith("./") ? normalizedAlias.slice(2) : normalizedAlias,
          ),
        ];
  return [...new Set(candidates)];
}

export function auditProject(
  items: CatalogItem[],
  directory: string,
  options: AuditOptions = {},
): AuditResult {
  const findings: AuditFinding[] = [];
  let config: ProjectConfig;
  try {
    ({ config } = readProjectConfig(directory));
  } catch (error) {
    pushFinding(
      findings,
      "error",
      "config-invalid",
      error instanceof Error ? error.message : String(error),
    );
    return finish(directory, findings, options.strict);
  }

  const lockPath = resolve(directory, PROJECT_LOCK_NAME);
  if (existsSync(lockPath)) {
    try {
      const { lock } = readProjectLock(directory);
      const expectedLock = buildProjectLock(
        items,
        config,
        options.catalogSource ?? lock.catalogSource,
      );
      if (
        options.catalogSource !== undefined &&
        lock.catalogSource !== options.catalogSource
      ) {
        pushFinding(
          findings,
          "warning",
          "lock-catalog-source-stale",
          `Lock catalogSource "${lock.catalogSource}" does not match the active catalog source "${options.catalogSource}".`,
          lockPath,
        );
      }

      const actualByIdentity = new Map(
        lock.items.map((item) => [`${item.kind}:${item.slug}`, item]),
      );
      const expectedByIdentity = new Map(
        expectedLock.items.map((item) => [`${item.kind}:${item.slug}`, item]),
      );
      const actualIdentities = [...actualByIdentity.keys()].sort();
      const expectedIdentities = [...expectedByIdentity.keys()].sort();
      if (JSON.stringify(actualIdentities) !== JSON.stringify(expectedIdentities)) {
        pushFinding(
          findings,
          "warning",
          "lock-selection-stale",
          "Lock item selection does not match the configured System, Recipe, and Components.",
          lockPath,
        );
      }

      for (const [identity, expectedItem] of expectedByIdentity) {
        const actualItem = actualByIdentity.get(identity);
        if (!actualItem) continue;
        if (actualItem.contractHash !== expectedItem.contractHash) {
          pushFinding(
            findings,
            "warning",
            "lock-contract-stale",
            `Lock contract hash for "${identity}" does not match the active catalog contract.`,
            lockPath,
          );
        }
        if (
          JSON.stringify(actualItem.sourceFiles ?? []) !==
          JSON.stringify(expectedItem.sourceFiles ?? [])
        ) {
          pushFinding(
            findings,
            "warning",
            "lock-source-files-stale",
            `Lock sourceFiles for "${identity}" do not match the active catalog contract.`,
            lockPath,
          );
        }
      }
    } catch (error) {
      pushFinding(
        findings,
        "warning",
        "lock-invalid",
        error instanceof Error ? error.message : String(error),
        lockPath,
      );
    }
  } else if (options.strict) {
    pushFinding(
      findings,
      "warning",
      "lock-missing",
      `${PROJECT_LOCK_NAME} is required in strict audit mode.`,
      lockPath,
    );
  }

  const themes = items.filter((item) => item.themePreview);
  if (!themes.some((item) => item.slug === config.system)) {
    pushFinding(
      findings,
      "error",
      "system-missing",
      `Configured system "${config.system}" does not exist in the catalog.`,
    );
  }

  const componentsJson = readComponentsJsonContract(directory, findings);
  const componentDirectories = componentsJson
    ? resolveComponentDirectories(directory, componentsJson.componentsAlias)
    : [];
  const projectFiles = walkProjectFiles(directory);
  const resolvedComponentSources = new Map<string, string[]>();
  const catalogComponentItems = new Map(
    items
      .filter((item) => item.kind === "component")
      .map((item) => [item.slug, item]),
  );
  const catalogComponents = new Set(catalogComponentItems.keys());
  let recipe: CatalogItem | undefined;
  if (config.recipe) {
    recipe = items.find((item) => item.kind === "recipe" && item.slug === config.recipe);
    if (!recipe) {
      pushFinding(
        findings,
        "error",
        "recipe-missing",
        `Configured recipe "${config.recipe}" does not exist in the catalog.`,
      );
    } else {
      if (!recipe.profiles?.includes(config.profile)) {
        pushFinding(
          findings,
          "error",
          "recipe-profile-mismatch",
          `Recipe "${recipe.slug}" does not support profile "${config.profile}".`,
        );
      }
      for (const component of [
        ...(recipe.components ?? []),
        ...(recipe.optionalComponents ?? []),
      ]) {
        if (!catalogComponents.has(component)) {
          pushFinding(
            findings,
            "error",
            "recipe-component-missing",
            `Recipe "${recipe.slug}" references missing component "${component}".`,
          );
        }
      }
      for (const component of recipe.components ?? []) {
        if (!config.components.includes(component)) {
          pushFinding(
            findings,
            "error",
            "recipe-component-unregistered",
            `Recipe "${recipe.slug}" requires component "${component}" in the project binding.`,
          );
        }
      }
    }
  }
  const recipeRequiredComponents = new Set(recipe?.components ?? []);
  for (const component of config.components) {
    const item = catalogComponentItems.get(component);
    if (!item) {
      pushFinding(
        findings,
        "error",
        "component-missing",
        `Configured component "${component}" does not exist in the catalog.`,
      );
      continue;
    }
    const sourceFiles = projectFiles.filter((path) =>
      matchesComponentSource(path, item, componentDirectories),
    );
    resolvedComponentSources.set(component, sourceFiles);
    if (sourceFiles.length === 0) {
      pushFinding(
        findings,
        "error",
        "component-source-missing",
        `Configured component "${component}" has no matching vendored source file in the project.`,
      );
      continue;
    }

    // A config can include a deliberately narrowed auxiliary component family
    // (for example Button without MagneticButton). Only Recipe-required
    // components promise the complete composition contract, so sidecar
    // completeness is scoped to that set. `sourceFiles` remains optional for
    // older remote Catalogs; this never asserts source/API equivalence or
    // overwrites adopt-mode adaptations.
    if (!recipeRequiredComponents.has(component)) continue;
    const expectedFamily = item.sourceFiles ?? (item.sourceFile ? [item.sourceFile] : []);
    const missingFamilyFiles = expectedFamily.slice(1).filter(
      (sourceFile) =>
        !hasVendoredFamilySource(projectFiles, componentDirectories, sourceFile, component),
    );
    if (missingFamilyFiles.length > 0) {
      pushFinding(
        findings,
        "warning",
        "component-source-family-incomplete",
        `Configured component "${component}" is missing vendored family source file(s): ${missingFamilyFiles.join(", ")}. The primary source exists, but inspect and copy/adapt the missing sidecars before relying on the component family.`,
      );
    }
  }

  const packagePath = resolve(directory, "package.json");
  let packageJson: Record<string, unknown> = {};
  if (existsSync(packagePath)) {
    try {
      const value: unknown = JSON.parse(readFileSync(packagePath, "utf8"));
      if (typeof value !== "object" || value === null || Array.isArray(value)) {
        throw new Error("expected a JSON object");
      }
      packageJson = value as Record<string, unknown>;
    } catch (error) {
      pushFinding(
        findings,
        "error",
        "package-json-invalid",
        `Cannot parse package.json: ${error instanceof Error ? error.message : String(error)}.`,
        packagePath,
      );
    }
  }

  if (!hasMajor(dependencyVersion(packageJson, "react"), 19)) {
    pushFinding(
      findings,
      "error",
      "react-missing",
      "React 19 must be declared in dependencies or devDependencies.",
      packagePath,
    );
  }
  if (!hasMajor(dependencyVersion(packageJson, "tailwindcss"), 4)) {
    pushFinding(
      findings,
      "error",
      "tailwind-v4-missing",
      "Tailwind CSS v4 must be declared in dependencies or devDependencies.",
      packagePath,
    );
  }
  if (!dependencyVersion(packageJson, "typescript")) {
    pushFinding(
      findings,
      "error",
      "typescript-missing",
      "TypeScript must be declared in dependencies or devDependencies.",
      packagePath,
    );
  }
  const profileRuntime = {
    "next-app": { dependency: "next", code: "next-missing" },
    "vite-app": { dependency: "vite", code: "vite-missing" },
    "electron-renderer": {
      dependency: "electron",
      code: "electron-missing",
    },
  }[config.profile];
  if (!dependencyVersion(packageJson, profileRuntime.dependency)) {
    pushFinding(
      findings,
      "error",
      profileRuntime.code,
      `${profileRuntime.dependency} must be declared for profile "${config.profile}".`,
      packagePath,
    );
  }

  const usesAgentWorkbench =
    recipe?.slug === "agent-workbench" ||
    config.components.some((slug) =>
      AGENT_WORKBENCH_FAMILY.includes(slug as (typeof AGENT_WORKBENCH_FAMILY)[number]),
    );

  if (usesAgentWorkbench) {
    for (const slug of AGENT_WORKBENCH_FAMILY) {
      const candidates = resolvedComponentSources.get(slug) ?? [];
      if (
        candidates.length > 0 &&
        !candidates.some((path) =>
          stripJsTsComments(readFileSync(path, "utf8")).includes("--wb-"),
        )
      ) {
        pushFinding(
          findings,
          "error",
          "workbench-token-missing",
          `Vendored Agent Workbench component "${slug}" has no matching primary implementation with an active --wb-* token reference.`,
          candidates[0],
        );
      }
    }

    const cssSources = projectFiles
      .filter((path) => extname(path) === ".css")
      .map((path) => stripCssComments(readFileSync(path, "utf8")));
    const hasWorkbenchSurface = cssSources.some((source) =>
      /--wb-surface\s*:/.test(source),
    );
    const themeImport = new RegExp(
      `@import[^;\\n]*\\/themes\\/${escapeRegExp(config.system)}\\.css[^;\\n]*;`,
      "i",
    );
    const importsThemeKit = cssSources.some((source) => themeImport.test(source));
    if (!hasWorkbenchSurface && !importsThemeKit) {
      pushFinding(
        findings,
        "error",
        "workbench-theme-token-missing",
        `No active --wb-surface declaration or @import for /themes/${config.system}.css was found.`,
      );
    }
  }

  return finish(directory, findings, options.strict);
}

function finish(
  directory: string,
  findings: AuditFinding[],
  strict = false,
): AuditResult {
  const errors = findings.filter((finding) => finding.severity === "error").length;
  const warnings = findings.filter((finding) => finding.severity === "warning").length;
  return {
    ok: errors === 0 && (!strict || warnings === 0),
    directory,
    findings,
    summary: { errors, warnings },
  };
}
