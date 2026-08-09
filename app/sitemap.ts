import type { MetadataRoute } from "next";
import { INSPIRATION_BRANDS } from "@/lib/inspiration-brands";
import { INSPIRATION_SITES } from "@/lib/inspiration-sites";
import { allComponents, registry } from "@/lib/registry";
import { SITE_URL as SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE}/styles`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/palettes`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/sections`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/patterns`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/scroll`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/atoms`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/inspiration`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/inspiration/sites`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/inspiration/brands`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/docs/ai-agents`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/docs/motion-patterns`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/docs/theme`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/llms.txt`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = registry.map((c) => ({
    url: `${SITE}/components/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Component detail pages are the primary content. Machine endpoints
  // (/r/* JSON and raw text) are intentionally excluded from search.
  const componentPages: MetadataRoute.Sitemap = allComponents().map((c) => ({
    url: `${SITE}/components/${c.category.slug}/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const inspirationBrandPages: MetadataRoute.Sitemap = INSPIRATION_BRANDS.map((brand) => ({
    url: `${SITE}/inspiration/brands/${brand.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const inspirationSitePages: MetadataRoute.Sitemap = INSPIRATION_SITES.map((site) => ({
    url: `${SITE}/inspiration/sites/${site.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...categoryPages,
    ...componentPages,
    ...inspirationBrandPages,
    ...inspirationSitePages,
  ];
}
