// Single source of truth for the site's top-level spaces (导航真源).
// Every nav surface (desktop header, mobile nav, future docks/menus) renders
// from NAV_SPACES — add a new space here and all of them pick it up.

export type NavSpace = {
  /** Label key under the "nav" messages namespace. */
  key:
    | "components"
    | "blocks"
    | "styles"
    | "palettes"
    | "sections"
    | "scroll"
    | "layouts"
    | "atoms"
    | "studio"
    | "playground";
  /** Route the nav item links to. */
  href: string;
  /** Pathname prefix that marks this space active. */
  match: string;
  /** Sibling prefixes that must not activate this space (longest-match wins). */
  exclude?: readonly string[];
};

export const NAV_SPACES: readonly NavSpace[] = [
  {
    key: "components",
    href: "/components/motion",
    match: "/components",
    exclude: ["/components/blocks"],
  },
  { key: "blocks", href: "/components/blocks", match: "/components/blocks" },
  { key: "styles", href: "/styles", match: "/styles" },
  { key: "palettes", href: "/palettes", match: "/palettes" },
  { key: "sections", href: "/sections", match: "/sections" },
  { key: "scroll", href: "/scroll", match: "/scroll" },
  { key: "layouts", href: "/layouts", match: "/layouts" },
  { key: "atoms", href: "/atoms", match: "/atoms" },
  { key: "studio", href: "/studio", match: "/studio" },
  { key: "playground", href: "/playground", match: "/playground" },
];

export function isSpaceActive(space: NavSpace, pathname: string): boolean {
  if (!pathname.startsWith(space.match)) return false;
  return !space.exclude?.some((prefix) => pathname.startsWith(prefix));
}
