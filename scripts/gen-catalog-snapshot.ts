import { writeFileSync } from "node:fs";
import { buildCatalog } from "@/lib/catalog";

async function main() {
  const items = await buildCatalog();
  const snapshot = {
    generatedAt: new Date().toISOString(),
    count: items.length,
    items,
  };
  writeFileSync(
    new URL("../cli/catalog.snapshot.json", import.meta.url),
    `${JSON.stringify(snapshot, null, 2)}\n`,
  );
  console.log(`Wrote ${items.length} catalog items to cli/catalog.snapshot.json`);
}

main();
