import { NextResponse } from "next/server";
import { findThemeKit, THEME_KITS, themeKitToCss } from "@/lib/theme-kits";

export const dynamic = "force-static";

export function generateStaticParams() {
  return THEME_KITS.map((kit) => ({ slug: `${kit.slug}.css` }));
}

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  if (!slug.endsWith(".css")) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const kitSlug = slug.replace(/\.css$/, "");
  const kit = findThemeKit(kitSlug);
  if (!kit) return NextResponse.json({ error: "not_found" }, { status: 404 });

  return new Response(themeKitToCss(kit), {
    headers: {
      "content-type": "text/css; charset=utf-8",
      "cache-control": "public, max-age=300, s-maxage=3600",
      "access-control-allow-origin": "*",
      "access-control-allow-methods": "GET, OPTIONS",
    },
  });
}
