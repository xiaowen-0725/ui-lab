import { NextResponse } from "next/server";
import {
  allRegistryTargets,
  allShadcnTargets,
  allThemeItemSlugs,
  buildEntry,
  buildShadcnItem,
  buildThemeItem,
  findCategoryBySlug,
} from "@/lib/registry-server";

export const dynamic = "force-static";

export function generateStaticParams() {
  return [
    ...allRegistryTargets().map((component) => ({ slug: component.slug })),
    ...allShadcnTargets().map((component) => ({ slug: `${component.slug}.json` })),
    ...allThemeItemSlugs().map((slug) => ({ slug })),
    ...allThemeItemSlugs().map((slug) => ({ slug: `${slug}.json` })),
  ];
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  const isShadcnItem = slug.endsWith(".json");
  const componentSlug = isShadcnItem ? slug.replace(/\.json$/, "") : slug;
  const cat = findCategoryBySlug(componentSlug);

  if (!cat) {
    if (componentSlug.startsWith("theme-")) {
      const themeItem = buildThemeItem(componentSlug.replace(/^theme-/, ""));
      if (themeItem) {
        return NextResponse.json(themeItem, {
          headers: {
            "cache-control": "public, max-age=300, s-maxage=3600",
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET, OPTIONS",
            "link": '</r/registry.json>; rel="collection"; type="application/json"',
          },
        });
      }
    }
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  if (isShadcnItem) {
    const item = await buildShadcnItem(cat.slug, componentSlug);
    if (!item) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json(item, {
      headers: {
        "cache-control": "public, max-age=300, s-maxage=3600",
        "access-control-allow-origin": "*",
        "access-control-allow-methods": "GET, OPTIONS",
        "link": '</r/registry.json>; rel="collection"; type="application/json"',
      },
    });
  }

  const entry = await buildEntry(cat.slug, componentSlug);
  if (!entry) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(entry, {
    headers: {
      "cache-control": "public, max-age=300, s-maxage=3600",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
      "link": `</r/${slug}/raw>; rel="alternate"; type="text/plain", </llms.txt>; rel="describedby"; type="text/plain"`,
    },
  });
}
