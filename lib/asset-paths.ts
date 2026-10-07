import type { AssetRole } from "@/lib/registry";

export function assetPagePath(category: string, slug: string) {
  if (category === "pages" || category === "sites") return `/${category}/${slug}`;
  return `/components/${category}/${slug}`;
}
export function assetSpacePath(role: AssetRole) {
  if (role === "block") return "/blocks";
  if (role === "page") return "/pages";
  if (role === "site" || role === "shell") return "/sites";
  return "/components";
}
