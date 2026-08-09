// Unified AI-facing catalog: aggregates every visual-vocabulary module
// (components, atoms, icon styles/motions, styles, palettes, design systems,
// and application recipes) into one flat list of CatalogItem so `/catalog.json`,
// `/llms.txt`, and `/llms-full.txt` can expose the whole vocabulary — not
// just components — to AI agents. Each aggregator below is isolated behind
// try/catch so one module failing to build never takes down the others.

import {
  BACKGROUND_FADES,
  BACKGROUNDS,
  BREAKPOINTS,
  createBackgroundsExports,
  createLinesExports,
  createMotionExports,
  createShapeExports,
  createSpacingExports,
  createTypographyExports,
  DENSITIES,
  FONT_PAIRS,
  ICON_MOTIONS,
  ICON_STYLES,
  LAYERS,
  LINES,
  MOTION_CURVES,
  MOTION_DURATIONS,
  MOTION_SPRINGS,
  RADII,
  SHADOWS,
  SPACING_SCALE,
  TYPE_SCALE,
} from "@/lib/atoms";
import { DESIGN_SYSTEMS } from "@/lib/layouts";
import { PALETTES, paletteToCss } from "@/lib/palettes";
import {
  type ApplicationProfile,
  RECIPES,
  type RecipeAsset,
  type RecipeResponsiveRule,
  type RecipeSection,
  type RecipeSlot,
  type RecipeState,
} from "@/lib/recipes";
import { allComponents } from "@/lib/registry";
import { buildIndex } from "@/lib/registry-server";
import { SITE_URL } from "@/lib/site";
import { STYLES } from "@/lib/styles";
import { findThemeKit, type ThemeKit, type ThemeMode } from "@/lib/theme-kits";

export type CatalogKind =
  | "component"
  | "atom-set"
  | "icon-style"
  | "icon-motion"
  | "style"
  | "palette"
  | "design-system"
  | "recipe";

export type CatalogFetch = {
  method: "shadcn" | "copy-prompt" | "copy-tokens" | "endpoint";
  /** A directly runnable command, e.g. a shadcn `add` install command. */
  command?: string;
  /** Fetch address (e.g. component detail JSON). */
  endpoint?: string;
  /** Small inlineable payload (prompt text / token block) — for llms-full and future CLI `show`. */
  value?: string;
};

export type CatalogItem = {
  kind: CatalogKind;
  /** Sub-grouping within a kind. */
  category: string;
  slug: string;
  name: string;
  nameZh: string;
  aliases: readonly string[];
  /** EN: what it is / when to use it. */
  description: string;
  descriptionZh: string;
  /** EN "say this to AI" prompt. */
  prompt?: string;
  promptZh?: string;
  /** Absolute URL to the live sample. */
  pageUrl: string;
  fetch: CatalogFetch;
  /** Registry source hint used by consumer audits; present on component items. */
  sourceFile?: string;
  /** Complete registry-owned source family for a component. This deliberately
   * includes only the entry file and explicit `extraFiles`, never recursively
   * collected shared lib dependencies. Consumer audits use it to catch an
   * incomplete vendoring copy without requiring source identity. */
  sourceFiles?: readonly string[];
  /** Present only for items backed by a lib/theme-kits ThemeKit (design
   * systems and the graphite baseline): a
   * small per-mode token subset an AI agent or UI can render as a swatch
   * without fetching the full theme CSS. */
  themePreview?: {
    modes: readonly ThemeMode[];
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  /** Application Kit metadata, present only when kind is `recipe`. */
  profiles?: readonly ApplicationProfile[];
  recommendedSystem?: string;
  entryComponent?: string;
  components?: readonly string[];
  optionalComponents?: readonly string[];
  slots?: readonly RecipeSlot[];
  states?: readonly RecipeState[];
  responsive?: readonly RecipeResponsiveRule[];
  assets?: readonly RecipeAsset[];
  sections?: readonly RecipeSection[];
  required?: readonly string[];
  forbidden?: readonly string[];
};

async function buildComponentItems(): Promise<CatalogItem[]> {
  const index = await buildIndex();
  // buildIndex() shapes the public registry endpoint and carries only its
  // English fields, so the Chinese names and keywords are read back off the
  // registry itself. Without this every component reached agents with its
  // English name in nameZh and no aliases at all — searching the catalog for
  // 「网点」 or any Chinese name found nothing, while atoms, styles and
  // palettes matched fine.
  const entries = new Map(
    allComponents().map((entry) => [`${entry.category.slug}/${entry.slug}`, entry]),
  );

  return index.components.map((component): CatalogItem => {
    const entry = entries.get(`${component.category}/${component.slug}`);

    return {
      kind: "component",
      category: component.category,
      slug: component.slug,
      name: component.name,
      nameZh: entry?.nameZh ?? component.name,
      aliases: entry?.keywords ?? [],
      description: component.description,
      descriptionZh: entry?.descriptionZh ?? component.description,
      pageUrl: component.page_url,
      fetch: {
        method: "shadcn",
        command: `npx shadcn@latest add ${SITE_URL}/r/${component.slug}.json`,
        endpoint: component.detail_url,
      },
      sourceFile: entry?.file,
      sourceFiles: entry ? [entry.file, ...(entry.extraFiles ?? [])] : undefined,
    };
  });
}

type AtomSetSpec = {
  slug: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  designMarkdown: string;
};

function buildAtomSetItems(): CatalogItem[] {
  const sets: AtomSetSpec[] = [
    {
      slug: "motion",
      name: "Motion tokens",
      nameZh: "动效 token",
      description: "Bézier curves, springs, and durations for consistent motion.",
      descriptionZh: "统一动效用的贝塞尔曲线、弹簧与时长。",
      designMarkdown: createMotionExports(MOTION_CURVES, MOTION_SPRINGS, MOTION_DURATIONS)
        .designMarkdown,
    },
    {
      slug: "shape",
      name: "Shape tokens",
      nameZh: "圆角与阴影 token",
      description: "A radius scale, elevation shadows, and z-index layers for consistent surfaces.",
      descriptionZh: "统一表面质感用的圆角尺度、分层阴影与 z-index 层叠阶梯。",
      designMarkdown: createShapeExports(RADII, SHADOWS, LAYERS).designMarkdown,
    },
    {
      slug: "typography",
      name: "Typography tokens",
      nameZh: "字体排印 token",
      description: "Font pairings and a type scale for consistent text.",
      descriptionZh: "统一文字排版用的字体搭配与字号尺度。",
      designMarkdown: createTypographyExports(FONT_PAIRS, TYPE_SCALE).designMarkdown,
    },
    {
      slug: "spacing",
      name: "Spacing tokens",
      nameZh: "间距 token",
      description:
        "A spacing scale, density presets, and responsive breakpoints for a consistent layout rhythm.",
      descriptionZh: "统一布局节奏用的间距尺度、密度预设与响应式断点。",
      designMarkdown: createSpacingExports(SPACING_SCALE, DENSITIES, BREAKPOINTS)
        .designMarkdown,
    },
    {
      slug: "lines",
      name: "Line tokens",
      nameZh: "描边 token",
      description: "Hairlines, borders, and outlines for consistent dividers.",
      descriptionZh: "统一分割用的发丝线、边框与描边。",
      designMarkdown: createLinesExports(LINES).designMarkdown,
    },
    {
      slug: "backgrounds",
      name: "Background tokens",
      nameZh: "背景质感 token",
      description:
        "Static CSS background recipes for texture, plus fade masks that keep a texture from reading as wallpaper.",
      descriptionZh:
        "用于增加质感的静态 CSS 背景配方，外加让底纹不显得像壁纸的淡出遮罩。",
      designMarkdown: createBackgroundsExports(BACKGROUNDS, BACKGROUND_FADES)
        .designMarkdown,
    },
  ];

  return sets.map((set): CatalogItem => ({
    kind: "atom-set",
    category: "atoms",
    slug: set.slug,
    name: set.name,
    nameZh: set.nameZh,
    aliases: [],
    description: set.description,
    descriptionZh: set.descriptionZh,
    pageUrl: `${SITE_URL}/atoms?cat=${set.slug}`,
    fetch: { method: "copy-tokens", value: set.designMarkdown },
  }));
}

function buildIconStyleItems(): CatalogItem[] {
  return ICON_STYLES.map((entry): CatalogItem => ({
    kind: "icon-style",
    category: "icons",
    slug: entry.slug,
    name: entry.name,
    nameZh: entry.nameZh,
    aliases: entry.aliases,
    description: entry.whenUse,
    descriptionZh: entry.whenUseZh,
    prompt: entry.spec,
    promptZh: entry.specZh,
    pageUrl: `${SITE_URL}/atoms?cat=icons#${entry.slug}`,
    fetch: { method: "copy-prompt", value: entry.spec },
  }));
}

function buildIconMotionItems(): CatalogItem[] {
  return ICON_MOTIONS.map((entry): CatalogItem => ({
    kind: "icon-motion",
    category: "icons",
    slug: entry.slug,
    name: entry.name,
    nameZh: entry.nameZh,
    aliases: entry.aliases,
    description: entry.whenUse,
    descriptionZh: entry.whenUseZh,
    prompt: entry.prompt,
    promptZh: entry.promptZh,
    pageUrl: `${SITE_URL}/atoms?cat=icons#${entry.slug}`,
    fetch: {
      method: "shadcn",
      command: `npx shadcn@latest add ${SITE_URL}/r/animated-icon.json`,
      endpoint: `${SITE_URL}/r/animated-icon`,
      value: `Install the animated-icon component, then apply this pattern to ANY lucide icon (there are 1500+):\n<AnimatedIcon variant="${entry.slug}" icon={AnyLucideIcon} />\n\nInteraction: ${entry.prompt}`,
    },
  }));
}

function buildStyleItems(): CatalogItem[] {
  return STYLES.map((entry): CatalogItem => ({
    kind: "style",
    category: entry.group ?? "styles",
    slug: entry.slug,
    name: entry.name,
    nameZh: entry.nameZh,
    aliases: entry.aliases,
    description: entry.description,
    descriptionZh: entry.descriptionZh,
    prompt: entry.promptEn,
    promptZh: entry.promptZh,
    pageUrl: `${SITE_URL}/styles?style=${entry.slug}`,
    fetch: { method: "copy-prompt", value: entry.promptEn },
  }));
}

function buildPaletteItems(): CatalogItem[] {
  return PALETTES.map((entry): CatalogItem => ({
    kind: "palette",
    category: entry.group ?? "palettes",
    slug: entry.slug,
    name: entry.name,
    nameZh: entry.nameZh,
    aliases: entry.aliases,
    description: entry.description,
    descriptionZh: entry.descriptionZh,
    prompt: entry.promptEn,
    promptZh: entry.promptZh,
    pageUrl: `${SITE_URL}/palettes?palette=${entry.slug}`,
    fetch: { method: "copy-tokens", value: paletteToCss(entry) },
  }));
}

// ~20-key per-mode subset of a ThemeKit's tokens, small enough for an AI
// agent to render a swatch/preview inline without fetching the full CSS.
const THEME_PREVIEW_SHADCN_KEYS = [
  "background",
  "foreground",
  "card",
  "muted-foreground",
  "border",
  "primary",
  "primary-foreground",
  "success",
  "danger",
  "warning",
] as const;
const THEME_PREVIEW_WB_KEYS = ["wb-surface", "wb-accent", "wb-hairline"] as const;
const THEME_PREVIEW_CHART_KEYS = [
  "chart-1",
  "chart-2",
  "chart-3",
  "chart-4",
  "chart-5",
  "chart-6",
] as const;

function themePreviewSubset(kit: ThemeKit, mode: ThemeMode): Record<string, string> | undefined {
  const tokenSet = kit[mode];
  if (!tokenSet) return undefined;

  const subset: Record<string, string> = {};
  for (const key of THEME_PREVIEW_SHADCN_KEYS) {
    const value = tokenSet.shadcn[key];
    if (value) subset[key] = value;
  }
  for (const key of THEME_PREVIEW_WB_KEYS) {
    const value = tokenSet.wb[key];
    if (value) subset[key] = value;
  }
  for (const key of THEME_PREVIEW_CHART_KEYS) {
    const value = tokenSet.charts[key];
    if (value) subset[key] = value;
  }
  subset["font-sans"] = kit.statics["font-sans"];
  return subset;
}

/**
 * If `slug` matches a lib/theme-kits ThemeKit (design-system slugs and
 * design-system keys are drawn from the same slug space, incl. the graphite
 * baseline. This points the item's fetch at the theme registry item/CSS endpoint
 * and attaches a themePreview. Otherwise returns `fetch` unchanged.
 */
function withThemeKitFetch(
  slug: string,
  fetch: CatalogFetch,
): { fetch: CatalogFetch; themePreview?: CatalogItem["themePreview"] } {
  const kit = findThemeKit(slug);
  if (!kit) return { fetch };

  return {
    fetch: {
      ...fetch,
      command: `npx shadcn@latest add ${SITE_URL}/r/theme-${kit.slug}.json`,
      endpoint: `${SITE_URL}/themes/${kit.slug}.css`,
    },
    themePreview: {
      modes: kit.modes,
      light: kit.modes.includes("light") ? themePreviewSubset(kit, "light") : undefined,
      dark: kit.modes.includes("dark") ? themePreviewSubset(kit, "dark") : undefined,
    },
  };
}

function buildDesignSystemItems(): CatalogItem[] {
  return DESIGN_SYSTEMS.map((entry): CatalogItem => {
    const { fetch, themePreview } = withThemeKitFetch(entry.slug, {
      method: "copy-tokens",
      value: entry.designMd,
    });
    return {
      kind: "design-system",
      category: "workbench",
      slug: entry.slug,
      name: entry.name,
      nameZh: entry.nameZh,
      aliases: entry.aliases,
      description: entry.description,
      descriptionZh: entry.descriptionZh,
      prompt: entry.promptEn,
      promptZh: entry.promptZh,
      pageUrl: `${SITE_URL}/layouts?ds=${entry.slug}`,
      fetch,
      themePreview,
    };
  });
}

function buildRecipeItems(): CatalogItem[] {
  return RECIPES.map((recipe): CatalogItem => ({
    kind: "recipe",
    category: recipe.category,
    slug: recipe.slug,
    name: recipe.name,
    nameZh: recipe.nameZh,
    aliases: recipe.aliases,
    description: recipe.description,
    descriptionZh: recipe.descriptionZh,
    pageUrl: `${SITE_URL}${recipe.pagePath}`,
    fetch: {
      method: "endpoint",
      endpoint: `${SITE_URL}/catalog.json`,
    },
    profiles: recipe.profiles,
    recommendedSystem: recipe.recommendedSystem,
    entryComponent: recipe.entryComponent,
    components: recipe.components,
    optionalComponents: recipe.optionalComponents,
    slots: recipe.slots,
    states: recipe.states,
    responsive: recipe.responsive,
    assets: recipe.assets,
    sections: recipe.sections,
    required: recipe.required,
    forbidden: recipe.forbidden,
  }));
}

/**
 * Aggregates every vocabulary kind into one flat catalog. Each
 * aggregator is isolated: if one module throws (bad data, missing export),
 * we log and skip it rather than failing the whole catalog.
 */
export async function buildCatalog(): Promise<CatalogItem[]> {
  const items: CatalogItem[] = [];

  const builders: Array<{ label: string; run: () => CatalogItem[] | Promise<CatalogItem[]> }> = [
    { label: "component", run: buildComponentItems },
    { label: "atom-set", run: buildAtomSetItems },
    { label: "icon-style", run: buildIconStyleItems },
    { label: "icon-motion", run: buildIconMotionItems },
    { label: "style", run: buildStyleItems },
    { label: "palette", run: buildPaletteItems },
    { label: "design-system", run: buildDesignSystemItems },
    { label: "recipe", run: buildRecipeItems },
  ];

  for (const builder of builders) {
    try {
      items.push(...(await builder.run()));
    } catch (error) {
      console.warn(`[catalog] failed to build "${builder.label}" items:`, error);
    }
  }

  return items;
}
