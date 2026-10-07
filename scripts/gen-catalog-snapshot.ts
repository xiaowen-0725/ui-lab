import { readFileSync, writeFileSync } from "node:fs";
import { validateCatalog } from "../cli/src/catalog-source";

const snapshotUrl = new URL("../cli/catalog.snapshot.json", import.meta.url);

export function assertSnapshotMatches(value: unknown, items: unknown) {
  const frozen = validateCatalog(value);
  if (JSON.stringify(frozen) !== JSON.stringify(items)) {
    throw new Error("Catalog snapshot is stale. Run bun run cli:snapshot and commit cli/catalog.snapshot.json.");
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== "--check") || args.length > 1) throw new Error("Usage: bun scripts/gen-catalog-snapshot.ts [--check]");
  const check = args.includes("--check");
  const value = check ? JSON.parse(readFileSync(snapshotUrl, "utf8")) : undefined;
  const frozen = check ? validateCatalog(value) : undefined;
  // Rebuild with the committed snapshot's origin, independently of CI/Vercel
  // deployment variables. Live endpoint URLs are checked by check:catalog-site.
  if (frozen) {
    const first = frozen[0];
    if (!first) throw new Error("Catalog snapshot is empty");
    process.env.NEXT_PUBLIC_SITE_URL = new URL(first.pageUrl).origin;
  }
  const { buildCatalog } = await import("../lib/catalog");
  const items = await buildCatalog();
  if (frozen) {
    assertSnapshotMatches(value, items);
    console.log(`Catalog snapshot matches ${items.length} current items (generatedAt excluded).`);
    return;
  }
  const snapshot = {
    generatedAt: new Date().toISOString(),
    count: items.length,
    items,
  };
  writeFileSync(
    snapshotUrl,
    `${JSON.stringify(snapshot, null, 2)}\n`,
  );
  console.log(`Wrote ${items.length} catalog items to cli/catalog.snapshot.json`);
}

if (import.meta.main) main();
