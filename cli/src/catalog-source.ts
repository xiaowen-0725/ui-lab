import { readFileSync } from "node:fs";

// Own copy of the CatalogItem shape from the main repo's lib/catalog.ts.
// Deliberately NOT imported — the CLI stays decoupled from the Next app.
export type CatalogKind =
  | "component"
  | "atom-set"
  | "icon-style"
  | "icon-motion"
  | "style"
  | "palette"
  | "design-system"
  | "recipe"
  | "vocabulary"
  | "reference";

export type CatalogFetch = {
  method: "shadcn" | "copy-prompt" | "copy-tokens" | "endpoint";
  command?: string;
  endpoint?: string;
  value?: string;
};

export type CatalogItem = {
  kind: CatalogKind;
  related?: readonly { kind: CatalogKind; slug: string; relationship?: "example" | "dependency" }[];
  section?: { slug: string; variant: string };
  reference?: {
    url: string;
    rightsStatus: string;
    documentLicense?: string;
    provenance: readonly { url: string; kind: string }[];
    reviewedAt: string;
  };
  category: string;
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  description: string;
  descriptionZh: string;
  prompt?: string;
  promptZh?: string;
  pageUrl: string;
  fetch: CatalogFetch;
  assetRole?: "component" | "block" | "page" | "shell" | "site";
  installTargets?: readonly string[];
  installationFiles?: readonly string[];
  sourceVersion?: string;
  exportName?: string;
  sourceFile?: string;
  sourceFiles?: readonly string[];
  themePreview?: {
    modes: readonly ("light" | "dark")[];
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  profiles?: readonly ("next-app" | "vite-app" | "electron-renderer")[];
  recommendedSystem?: string;
  shellComponent?: string;
  pages?: readonly string[];
  entryComponent?: string;
  components?: readonly string[];
  optionalComponents?: readonly string[];
  slots?: readonly {
    name: string;
    description: string;
    descriptionZh: string;
    required: boolean;
  }[];
  states?: readonly {
    name: string;
    description: string;
    descriptionZh: string;
  }[];
  responsive?: readonly {
    viewport: "desktop" | "tablet" | "mobile";
    behavior: string;
    behaviorZh: string;
  }[];
  assets?: readonly {
    kind: "font" | "icon" | "image" | "illustration";
    requirement: string;
    requirementZh: string;
    required: boolean;
  }[];
  sections?: readonly {
    slug: string;
    variant: string;
    required: boolean;
  }[];
  required?: readonly string[];
  forbidden?: readonly string[];
};

type CatalogSnapshot = {
  generatedAt: string;
  count: number;
  items: CatalogItem[];
};

type LoadCatalogOptions = {
  registry?: string;
  /** Writing project state requires the explicitly requested source. */
  allowFallback?: boolean;
};

type LoadCatalogResult = {
  items: CatalogItem[];
  source: string;
};

const REGISTRY_FETCH_TIMEOUT_MS = 3000;

function readSnapshot(): CatalogSnapshot {
  const url = new URL("../catalog.snapshot.json", import.meta.url);
  const snapshot = JSON.parse(readFileSync(url, "utf8"));
  validateCatalog(snapshot);
  return snapshot;
}

function normalizeRegistryUrl(url: string): string {
  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol) || parsed.search || parsed.hash) {
    throw new Error("registry must be an HTTP(S) base URL without query or hash");
  }
  if (parsed.pathname.endsWith("/catalog.json")) {
    throw new Error("registry must be a base URL, without /catalog.json");
  }
  return parsed.toString().replace(/\/+$/, "");
}

const CATALOG_KINDS = new Set([
  "component", "atom-set", "icon-style", "icon-motion", "style", "palette",
  "design-system", "recipe", "vocabulary", "reference",
]);
const PROFILES = new Set(["next-app", "vite-app", "electron-renderer"]);

function invalidCatalog(path: string, message: string): never {
  throw new Error(`Invalid catalog: ${path} ${message}.`);
}

function object(value: unknown, path: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    invalidCatalog(path, "must be an object");
  }
  return value as Record<string, unknown>;
}

function string(value: unknown, path: string, nonEmpty = true): void {
  if (typeof value !== "string" || (nonEmpty && !value.trim())) {
    invalidCatalog(path, `must be a ${nonEmpty ? "non-empty " : ""}string`);
  }
}

function strings(value: unknown, path: string): string[] {
  if (!Array.isArray(value)) invalidCatalog(path, "must be a string array");
  value.forEach((entry, index) => string(entry, `${path}[${index}]`));
  return value as string[];
}

function url(value: unknown, path: string): void {
  string(value, path);
  try {
    if (!["http:", "https:"].includes(new URL(value as string).protocol)) throw new Error();
  } catch {
    invalidCatalog(path, "must be an HTTP(S) URL");
  }
}

function sourcePath(value: unknown, path: string): void {
  string(value, path);
  const text = value as string;
  if (text.startsWith("/") || text.includes("\\") || text.split("/").some((part) => part === ".." || part === "." || !part) || /^[a-z]+:/i.test(text)) {
    invalidCatalog(path, "must be a relative source path without traversal");
  }
}

/** Validate current contracts, preserving unknown additive metadata verbatim. */
export function validateCatalog(value: unknown): CatalogItem[] {
  const body = object(value, "response");
  if (!Array.isArray(body.items) || body.items.length === 0) {
    invalidCatalog("items", "must be a non-empty array");
  }
  if (body.count !== undefined && body.count !== body.items.length) {
    invalidCatalog("count", "must equal items.length");
  }
  const identities = new Set<string>();
  for (const [index, raw] of body.items.entries()) {
    const path = `items[${index}]`;
    const item = object(raw, path);
    if (!CATALOG_KINDS.has(item.kind as string)) invalidCatalog(`${path}.kind`, "is unsupported");
    if (item.sourceVersion !== undefined && (typeof item.sourceVersion !== "string" || !/^[a-f0-9]{64}$/.test(item.sourceVersion))) invalidCatalog(`${path}.sourceVersion`, "must be a SHA-256 source revision");
    if (item.exportName !== undefined) string(item.exportName, `${path}.exportName`);
    if (item.pages !== undefined) strings(item.pages, `${path}.pages`);
    if (item.shellComponent !== undefined) string(item.shellComponent, `${path}.shellComponent`);
    if (item.section !== undefined) {
      const section = object(item.section, `${path}.section`);
      string(section.slug, `${path}.section.slug`);
      string(section.variant, `${path}.section.variant`);
      if (item.kind !== "component" || item.assetRole !== "block") invalidCatalog(`${path}.section`, "requires a distributable block item");
    }
    if (item.related !== undefined) {
      if (!Array.isArray(item.related)) invalidCatalog(`${path}.related`, "must be an array");
      for (const [relationIndex, rawRelation] of item.related.entries()) {
        const relationPath = `${path}.related[${relationIndex}]`;
        const relation = object(rawRelation, relationPath);
        if (!CATALOG_KINDS.has(relation.kind as string)) invalidCatalog(`${relationPath}.kind`, "is unsupported");
        string(relation.slug, `${relationPath}.slug`);
      }
    }
    if (item.reference !== undefined) {
      const reference = object(item.reference, `${path}.reference`);
      url(reference.url, `${path}.reference.url`);
      string(reference.rightsStatus, `${path}.reference.rightsStatus`);
      string(reference.reviewedAt, `${path}.reference.reviewedAt`);
      if (reference.documentLicense !== undefined) string(reference.documentLicense, `${path}.reference.documentLicense`);
      if (!Array.isArray(reference.provenance)) invalidCatalog(`${path}.reference.provenance`, "must be an array");
      for (const [provenanceIndex, rawProvenance] of reference.provenance.entries()) {
        const provenancePath = `${path}.reference.provenance[${provenanceIndex}]`;
        const provenance = object(rawProvenance, provenancePath);
        url(provenance.url, `${provenancePath}.url`);
        string(provenance.kind, `${provenancePath}.kind`);
      }
    }
    for (const field of ["category", "slug", "name", "nameZh"]) string(item[field], `${path}.${field}`);
    for (const field of ["description", "descriptionZh"]) string(item[field], `${path}.${field}`, false);
    strings(item.aliases, `${path}.aliases`);
    const identity = `${item.kind}:${(item.slug as string).toLowerCase()}`;
    if (identities.has(identity)) invalidCatalog(path, `duplicates identity ${identity}`);
    identities.add(identity);
    url(item.pageUrl, `${path}.pageUrl`);
    for (const field of ["prompt", "promptZh"]) {
      if (item[field] !== undefined) string(item[field], `${path}.${field}`, false);
    }
    const fetch = object(item.fetch, `${path}.fetch`);
    if (!["shadcn", "copy-prompt", "copy-tokens", "endpoint"].includes(fetch.method as string)) {
      invalidCatalog(`${path}.fetch.method`, "is unsupported");
    }
    for (const field of ["command", "value"]) {
      if (fetch[field] !== undefined) string(fetch[field], `${path}.fetch.${field}`, false);
    }
    if (fetch.endpoint !== undefined) url(fetch.endpoint, `${path}.fetch.endpoint`);
    if (fetch.method === "shadcn") string(fetch.command, `${path}.fetch.command`);
    if (fetch.method === "endpoint") url(fetch.endpoint, `${path}.fetch.endpoint`);
    if (fetch.method === "copy-prompt" || fetch.method === "copy-tokens") string(fetch.value, `${path}.fetch.value`);
    // add/compose print this field for every component, even if a source sends
    // a different fetch method. A missing command must not create a binding.
    if (item.kind === "component") string(fetch.command, `${path}.fetch.command`);
    if (item.sourceFile !== undefined) sourcePath(item.sourceFile, `${path}.sourceFile`);
    if (item.assetRole !== undefined && !["component", "block", "page", "shell", "site"].includes(item.assetRole as string)) {
      invalidCatalog(`${path}.assetRole`, "is unsupported");
    }
    if (item.installTargets !== undefined) {
      const targets = strings(item.installTargets, `${path}.installTargets`);
      if (!targets.length || new Set(targets).size !== targets.length) {
        invalidCatalog(`${path}.installTargets`, "must contain unique installation targets");
      }
    }
    if (item.installationFiles !== undefined) {
      strings(item.installationFiles, `${path}.installationFiles`).forEach((file) => sourcePath(file, `${path}.installationFiles`));
    }
    if (item.sourceFiles !== undefined) {
      const family = strings(item.sourceFiles, `${path}.sourceFiles`);
      family.forEach((file) => sourcePath(file, `${path}.sourceFiles`));
      if (item.sourceFile !== undefined && !family.includes(item.sourceFile as string)) {
        invalidCatalog(`${path}.sourceFiles`, "must include sourceFile");
      }
    }
    if (item.installationFiles !== undefined) {
      const graph = item.installationFiles as string[];
      const family = item.sourceFiles as string[] | undefined;
      const requiredFiles = [...(family ?? []), ...(item.sourceFile ? [item.sourceFile as string] : [])];
      if (new Set(graph).size !== graph.length || requiredFiles.some((file) => !graph.includes(file))) {
        invalidCatalog(`${path}.installationFiles`, "must contain the owned source family without duplicate paths");
      }
    }
    if (item.profiles !== undefined) {
      const profiles = strings(item.profiles, `${path}.profiles`);
      if (profiles.length === 0 || profiles.some((profile) => !PROFILES.has(profile))) invalidCatalog(`${path}.profiles`, "contains unsupported or no profiles");
    }
    for (const field of ["recommendedSystem", "entryComponent"]) {
      if (item[field] !== undefined) string(item[field], `${path}.${field}`);
    }
    for (const field of ["components", "optionalComponents", "required", "forbidden"]) {
      if (item[field] !== undefined) strings(item[field], `${path}.${field}`);
    }
    if (item.themePreview !== undefined) {
      const theme = object(item.themePreview, `${path}.themePreview`);
      const modes = strings(theme.modes, `${path}.themePreview.modes`);
      if (!modes.length || new Set(modes).size !== modes.length || modes.some((mode) => mode !== "light" && mode !== "dark")) {
        invalidCatalog(`${path}.themePreview.modes`, "must contain unique light/dark modes");
      }
      for (const mode of new Set([...modes, ...["light", "dark"].filter((key) => theme[key] !== undefined)])) {
        const tokens = object(theme[mode], `${path}.themePreview.${mode}`);
        if (!Object.keys(tokens).length) invalidCatalog(`${path}.themePreview.${mode}`, "must contain tokens");
        for (const [key, token] of Object.entries(tokens)) string(token, `${path}.themePreview.${mode}.${key}`);
      }
    }
    for (const field of ["slots", "states", "responsive", "assets", "sections"]) {
      if (item[field] === undefined) continue;
      if (!Array.isArray(item[field])) invalidCatalog(`${path}.${field}`, "must be an array");
      for (const [entryIndex, rawEntry] of (item[field] as unknown[]).entries()) {
        const entryPath = `${path}.${field}[${entryIndex}]`;
        const entry = object(rawEntry, entryPath);
        const fields = field === "slots" || field === "states" ? ["name", "description", "descriptionZh"]
          : field === "responsive" ? ["viewport", "behavior", "behaviorZh"]
          : field === "assets" ? ["kind", "requirement", "requirementZh"] : ["slug", "variant"];
        for (const key of fields) string(entry[key], `${entryPath}.${key}`);
        if (["slots", "assets", "sections"].includes(field) && typeof entry.required !== "boolean") invalidCatalog(`${entryPath}.required`, "must be boolean");
        if (field === "responsive" && !["desktop", "tablet", "mobile"].includes(entry.viewport as string)) invalidCatalog(`${entryPath}.viewport`, "is unsupported");
        if (field === "assets" && !["font", "icon", "image", "illustration"].includes(entry.kind as string)) invalidCatalog(`${entryPath}.kind`, "is unsupported");
      }
    }
  }

  const items = body.items as CatalogItem[];
  const components = new Set(items.filter((item) => item.kind === "component").map((item) => item.slug));
  const themes = items.filter((item) => item.themePreview);
  const exactIdentities = new Set(items.map((item) => `${item.kind}:${item.slug}`));
  for (const item of items) {
    for (const relation of item.related ?? []) {
      if (!exactIdentities.has(`${relation.kind}:${relation.slug}`)) invalidCatalog(`${item.kind}:${item.slug}`, `references missing related item ${relation.kind}:${relation.slug}`);
    }
    for (const slug of [...(item.components ?? []), ...(item.pages ?? []), ...(item.shellComponent ? [item.shellComponent] : [])]) {
      if (!components.has(slug)) invalidCatalog(`${item.kind}:${item.slug}`, `references missing composition component ${slug}`);
    }
    for (const target of item.installTargets ?? []) {
      if (!components.has(target)) invalidCatalog(`${item.kind}:${item.slug}`, `references missing install target ${target}`);
    }
  }
  for (const recipe of items.filter((item) => item.kind === "recipe")) {
    const path = `recipe:${recipe.slug}`;
    if (!recipe.profiles?.length || !recipe.components?.length || !recipe.entryComponent || !recipe.recommendedSystem) {
      invalidCatalog(path, "requires profiles, components, entryComponent and recommendedSystem");
    }
    if (themes.filter((theme) => theme.slug === recipe.recommendedSystem).length !== 1) invalidCatalog(path, `references missing or ambiguous system ${recipe.recommendedSystem}`);
    if (!recipe.components.includes(recipe.entryComponent)) invalidCatalog(path, "entryComponent must be a required component");
    for (const slug of [...recipe.components, ...(recipe.optionalComponents ?? [])]) {
      if (!components.has(slug)) invalidCatalog(path, `references missing component ${slug}`);
    }
    for (const section of recipe.sections ?? []) {
      if (!items.some((item) => item.kind === "component" && item.section?.slug === section.slug && item.section.variant === section.variant)) invalidCatalog(path, `references missing section variant ${section.slug}/${section.variant}`);
    }
    const combined = [...recipe.components, ...(recipe.optionalComponents ?? [])];
    if (new Set(combined).size !== combined.length) invalidCatalog(path, "contains duplicate or overlapping component references");
  }
  return items;
}

async function fetchFromRegistry(url: string): Promise<CatalogItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REGISTRY_FETCH_TIMEOUT_MS);
  try {
    const response = await fetch(`${url}/catalog.json`, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const body = await response.json();
    return validateCatalog(body);
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Loads the catalog from the bundled snapshot by default (fast, offline, and
 * reliable), or from a live deployment when one is given via --registry <url>
 * / UILAB_REGISTRY (e.g. https://ui-lab-ten.vercel.app).
 * Read-only discovery may fall back with a source warning. Project writes
 * pass allowFallback=false and fail before touching any project files.
 */
export async function loadCatalog(opts?: LoadCatalogOptions): Promise<LoadCatalogResult> {
  const registryUrl = opts?.registry ?? process.env.UILAB_REGISTRY;

  if (registryUrl) {
    try {
      const url = normalizeRegistryUrl(registryUrl);
      const items = await fetchFromRegistry(url);
      console.error(`Using live registry: ${url}`);
      return { items, source: `registry:${url}` };
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      if (opts?.allowFallback === false) {
        throw new Error(`Cannot load requested registry ${registryUrl} (${reason}); project files were not changed.`);
      }
      console.error(
        `Warning: could not load registry at ${registryUrl} (${reason}) — falling back to bundled snapshot.`,
      );
    }
  }

  const snapshot = readSnapshot();
  console.error(
    `Using bundled snapshot (generated ${snapshot.generatedAt}, ${snapshot.count} items).`,
  );
  return { items: snapshot.items, source: "snapshot" };
}
