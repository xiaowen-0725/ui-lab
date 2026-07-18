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
    | "patterns"
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

export type NavTopItem =
  | { kind: "space"; space: NavSpace }
  | {
      kind: "group";
      key: "vocabulary";
      children: readonly NavSpace[];
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
  { key: "patterns", href: "/patterns", match: "/patterns" },
  { key: "atoms", href: "/atoms", match: "/atoms" },
  { key: "studio", href: "/studio", match: "/studio" },
  { key: "playground", href: "/playground", match: "/playground" },
];

function getNavSpace(key: NavSpace["key"]): NavSpace {
  const space = NAV_SPACES.find((item) => item.key === key);
  if (!space) throw new Error(`Unknown nav space: ${key}`);
  return space;
}

export const NAV_TOP: readonly NavTopItem[] = [
  { kind: "space", space: getNavSpace("components") },
  { kind: "space", space: getNavSpace("blocks") },
  {
    kind: "group",
    key: "vocabulary",
    children: [
      getNavSpace("styles"),
      getNavSpace("palettes"),
      getNavSpace("sections"),
      getNavSpace("scroll"),
      getNavSpace("layouts"),
      getNavSpace("patterns"),
      getNavSpace("atoms"),
    ],
  },
  { kind: "space", space: getNavSpace("studio") },
  { kind: "space", space: getNavSpace("playground") },
];

export function isSpaceActive(space: NavSpace, pathname: string): boolean {
  if (!pathname.startsWith(space.match)) return false;
  return !space.exclude?.some((prefix) => pathname.startsWith(prefix));
}

export function isGroupActive(
  children: readonly NavSpace[],
  pathname: string,
): boolean {
  return children.some((space) => isSpaceActive(space, pathname));
}
