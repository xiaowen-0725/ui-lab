import { buildCatalog, type CatalogItem, type CatalogKind } from "@/lib/catalog";
import { REGISTRY_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

const GROUP_LABELS: Record<CatalogKind, string> = {
  component: "Components",
  "atom-set": "Atom Tokens",
  "icon-style": "Icon Styles",
  "icon-motion": "Icon Motions",
  style: "Styles",
  palette: "Palettes",
  "studio-preset": "Studio Presets",
  "design-system": "Design Systems",
  recipe: "Application Recipes",
};

const GROUP_ORDER: CatalogKind[] = [
  "component",
  "atom-set",
  "icon-style",
  "icon-motion",
  "style",
  "palette",
  "studio-preset",
  "design-system",
  "recipe",
];

function fetchHint(item: CatalogItem): string {
  if (
    item.themePreview &&
    (item.kind === "design-system" || item.kind === "studio-preset")
  ) {
    return `theme: ui-lab theme ${item.slug}`;
  }
  switch (item.fetch.method) {
    case "shadcn":
      return `install: ${item.fetch.command}`;
    case "copy-prompt":
      return "· copy prompt";
    case "copy-tokens":
    case "endpoint":
      return "· via catalog.json";
    default:
      return "";
  }
}

export async function GET() {
  const items = await buildCatalog();
  const lines: string[] = [];

  lines.push(`# ${REGISTRY_NAME}`);
  lines.push("");
  lines.push("> Full visual-vocabulary catalog for AI agents.");
  lines.push("");
  lines.push("## Endpoints");
  lines.push("");
  lines.push(`- Full catalog (JSON): ${SITE_URL}/catalog.json`);
  lines.push(`- Full catalog with inlined prompts/tokens (text/plain): ${SITE_URL}/llms-full.txt`);
  lines.push(`- Component registry (JSON): ${SITE_URL}/r/registry.json`);
  lines.push("");

  for (const kind of GROUP_ORDER) {
    const group = items.filter((item) => item.kind === kind);
    if (group.length === 0) continue;

    lines.push(`## ${GROUP_LABELS[kind]}`);
    lines.push("");
    for (const item of group) {
      const hint = fetchHint(item);
      lines.push(`- [${item.name}](${item.pageUrl}) — ${item.description}${hint ? ` ${hint}` : ""}`);
    }
    lines.push("");
  }

  lines.push("## Usage for agents");
  lines.push("");
  lines.push("1. Components install directly with the shadcn CLI: run the `install` command shown next to each component (`npx shadcn@latest add <url>`).");
  lines.push("2. Recipes describe a compatible profile, Theme Kit, entry component, component set, and required/forbidden constraints. Use `ui-lab init`, then `ui-lab compose <recipe>` to produce an install plan without executing external commands.");
  lines.push("3. Design Systems and Studio Presets backed by Theme Kits install through `ui-lab theme <slug>`; inspect the selected kit before applying its shadcn command or CSS endpoint.");
  lines.push("4. Other vocabulary (atom tokens, icon styles/motions, styles, palettes) has no CLI installer — fetch `/catalog.json`, find the item by `slug`, and read `fetch.value` for the ready-to-use prompt or token block. Or open its `pageUrl` to see the live sample first.");
  lines.push("5. To fetch every item's inlined `fetch.value` in one request instead of round-tripping through JSON, read `/llms-full.txt`.");
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=3600",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
    },
  });
}
