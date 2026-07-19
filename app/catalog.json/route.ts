import { buildCatalog } from "@/lib/catalog";
import { REGISTRY_NAME, SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export async function GET() {
  const items = await buildCatalog();
  const body = {
    name: REGISTRY_NAME,
    description: "Full visual-vocabulary catalog for AI agents.",
    site: SITE_URL,
    count: items.length,
    items,
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=3600",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
    },
  });
}
