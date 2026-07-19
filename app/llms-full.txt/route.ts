import { buildCatalog, type CatalogItem } from "@/lib/catalog";
import { REGISTRY_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/** Fence language for each item's inlined `fetch.value`. */
function fenceLang(item: CatalogItem): string {
  switch (item.kind) {
    case "atom-set":
    case "studio-preset":
      return "markdown";
    default:
      return "text";
  }
}

function renderItem(item: CatalogItem): string[] {
  const lines: string[] = [];
  lines.push(`### ${item.name} (${item.kind})`);
  // Machine endpoints stay English-normative (see AGENTS.md).
  lines.push(item.description);

  if (item.fetch.value === undefined) {
    // Components have no inlined value — their source lives behind the
    // shadcn registry endpoint, so the install command is the whole story.
    lines.push(`Fetch: ${item.fetch.command ?? item.fetch.endpoint ?? item.pageUrl}`);
    return lines;
  }

  lines.push("Fetch: copy the block below");
  lines.push(`\`\`\`${fenceLang(item)}`);
  lines.push(item.fetch.value);
  lines.push("```");
  return lines;
}

export async function GET() {
  const items = await buildCatalog();
  const lines: string[] = [];

  lines.push(`# ${REGISTRY_NAME} — full catalog`);
  lines.push("");
  lines.push("> Every visual-vocabulary item with its prompt or token block inlined, so an agent can read this one file instead of round-tripping through /catalog.json per item.");
  lines.push("");
  lines.push(`Site: ${SITE_URL}`);
  lines.push(`Count: ${items.length}`);
  lines.push("");

  for (const item of items) {
    lines.push(...renderItem(item));
    lines.push("");
  }

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=3600",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
    },
  });
}
