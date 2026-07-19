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
  | "studio-preset";

export type CatalogFetch = {
  method: "shadcn" | "copy-prompt" | "copy-tokens" | "endpoint";
  command?: string;
  endpoint?: string;
  value?: string;
};

export type CatalogItem = {
  kind: CatalogKind;
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
};

type CatalogSnapshot = {
  generatedAt: string;
  count: number;
  items: CatalogItem[];
};

type LoadCatalogOptions = {
  registry?: string;
};

type LoadCatalogResult = {
  items: CatalogItem[];
  source: string;
};

const REGISTRY_FETCH_TIMEOUT_MS = 3000;

function readSnapshot(): CatalogSnapshot {
  const url = new URL("../catalog.snapshot.json", import.meta.url);
  return JSON.parse(readFileSync(url, "utf8"));
}

function normalizeRegistryUrl(url: string): string {
  return url.replace(/\/+$/, "");
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
    if (!body || !Array.isArray(body.items)) {
      throw new Error("response JSON missing an \"items\" array");
    }
    return body.items as CatalogItem[];
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Loads the catalog either from a live registry deployment or, by default
 * (the project isn't deployed yet), from the bundled snapshot. A registry
 * fetch failure of any kind (timeout, network error, non-2xx, bad JSON)
 * never throws — it always falls back to the snapshot.
 */
export async function loadCatalog(opts?: LoadCatalogOptions): Promise<LoadCatalogResult> {
  const registryUrl = opts?.registry ?? process.env.UILAB_REGISTRY;

  if (registryUrl) {
    const url = normalizeRegistryUrl(registryUrl);
    try {
      const items = await fetchFromRegistry(url);
      console.error(`Using live registry: ${url}`);
      return { items, source: `registry:${url}` };
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      console.error(
        `Warning: could not reach registry at ${url} (${reason}) — falling back to bundled snapshot.`,
      );
    }
  }

  const snapshot = readSnapshot();
  console.error(
    `Using bundled snapshot (generated ${snapshot.generatedAt}, ${snapshot.count} items).`,
  );
  return { items: snapshot.items, source: "snapshot" };
}
