import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";
import {
  INSPIRATION_BRANDS,
  type InspirationBrand,
} from "@/lib/inspiration-brands";

const BRAND_BY_SLUG = new Map<string, InspirationBrand>(
  INSPIRATION_BRANDS.map((brand) => [brand.slug, brand]),
);

export function getInspirationBrandBySlug(
  slug: string,
): InspirationBrand | undefined {
  return BRAND_BY_SLUG.get(slug);
}

export async function readInspirationBrandDocument(
  slug: string,
): Promise<string> {
  const brand = getInspirationBrandBySlug(slug);
  if (!brand) throw new Error(`Unknown inspiration brand: ${slug}`);

  const contentRoot = path.resolve(
    process.cwd(),
    "content/inspiration/brands",
  );
  const documentPath = path.resolve(process.cwd(), brand.documentPath);
  const relativePath = path.relative(contentRoot, documentPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    throw new Error(`Invalid inspiration brand document path: ${brand.slug}`);
  }

  return fs.readFile(documentPath, "utf8");
}
