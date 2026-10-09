import { assetSpacePath } from "@/lib/asset-paths";
import { findComponent } from "@/lib/registry";

// Top-level catalog doors. Header, mobile nav, and the homepage cards
// all render NAV_SPACES. Dictionary sections stay inside that door.

export type NavKey =
  | "dictionary"
  | "concepts"
  | "motion"
  | "components"
  | "blocks"
  | "pages"
  | "sites"
  | "themes"
  | "inspiration"
  | "apps";

export type NavSpace = {
  /** Label key under the "nav" messages namespace. */
  key: NavKey;
  href: string;
  /** Pathname prefixes that mark this space active. */
  match: readonly string[];
  /** Prefixes that must not activate this space. */
  exclude?: readonly string[];
};

export const NAV_SPACES: readonly NavSpace[] = [
  { key: "dictionary", href: "/dictionary", match: ["/dictionary", "/scroll"] },
  {
    key: "components",
    href: "/components",
    match: ["/components"],
    exclude: ["/components/blocks", "/components/sections", "/components/pages", "/components/sites"],
  },
  {
    key: "blocks",
    href: "/blocks",
    match: ["/blocks", "/components/blocks", "/components/sections", "/sections"],
  },
  { key: "pages", href: "/pages", match: ["/pages", "/components/pages", "/patterns"] },
  { key: "sites", href: "/sites", match: ["/sites", "/components/sites", "/layouts"] },
  {
    key: "themes",
    href: "/themes",
    match: ["/themes", "/styles", "/palettes", "/atoms"],
  },
  { key: "inspiration", href: "/inspiration", match: ["/inspiration"] },
  { key: "apps", href: "/apps", match: ["/apps"] },
];

export const DICTIONARY_SECTIONS: readonly NavSpace[] = [
  {
    key: "concepts",
    href: "/dictionary/concepts",
    match: ["/dictionary/concepts"],
  },
  {
    key: "motion",
    href: "/dictionary/motion",
    match: ["/dictionary/motion"],
  },
];

export const DOCS_HREF = "/docs";

export function isSpaceActive(space: NavSpace, pathname: string): boolean {
  const legacyDetail = pathname.match(/^\/components\/([^/]+)\/([^/]+)$/);
  if (legacyDetail) {
    const entry = findComponent(legacyDetail[1], legacyDetail[2]);
    if (entry) return space.href === assetSpacePath(entry.assetRole);
  }
  if (
    space.exclude?.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    )
  ) {
    return false;
  }
  return space.match.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
