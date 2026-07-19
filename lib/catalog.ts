// Unified AI-facing catalog: aggregates every visual-vocabulary module
// (components, atoms, icon styles/motions, styles, palettes, studio presets)
// into one flat list of CatalogItem so `/catalog.json`, `/llms.txt`, and
// `/llms-full.txt` can expose the whole vocabulary — not just components —
// to AI agents. Each aggregator below is isolated behind try/catch so one
// module failing to build never takes down the others.

import {
  BACKGROUNDS,
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
  LINES,
  MOTION_CURVES,
  MOTION_DURATIONS,
  MOTION_SPRINGS,
  RADII,
  SHADOWS,
  SPACING_SCALE,
  TYPE_SCALE,
} from "@/lib/atoms";
import { PALETTES } from "@/lib/palettes";
import { buildIndex } from "@/lib/registry-server";
import { SITE_URL } from "@/lib/site";
import { STYLES } from "@/lib/styles";
import {
  composeDesignSystem,
  STUDIO_STARTER_PRESETS,
  studioConfigToSearchParams,
} from "@/lib/studio";

export type CatalogKind =
  | "component"
  | "atom-set"
  | "icon-style"
  | "icon-motion"
  | "style"
  | "palette"
  | "studio-preset";

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
};

async function buildComponentItems(): Promise<CatalogItem[]> {
  const index = await buildIndex();
  return index.components.map((component): CatalogItem => ({
    kind: "component",
    category: component.category,
    slug: component.slug,
    name: component.name,
    // buildIndex()'s component entries don't carry nameZh/descriptionZh —
    // fall back to the English fields as instructed.
    nameZh: component.name,
    aliases: [],
    description: component.description,
    descriptionZh: component.description,
    pageUrl: component.page_url,
    fetch: {
      method: "shadcn",
      command: `npx shadcn@latest add ${SITE_URL}/r/${component.slug}`,
      endpoint: component.detail_url,
    },
  }));
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
      description: "A radius scale and elevation shadows for consistent surfaces.",
      descriptionZh: "统一表面质感用的圆角尺度与分层阴影。",
      designMarkdown: createShapeExports(RADII, SHADOWS).designMarkdown,
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
      description: "A spacing scale and density presets for a consistent layout rhythm.",
      descriptionZh: "统一布局节奏用的间距尺度与密度预设。",
      designMarkdown: createSpacingExports(SPACING_SCALE, DENSITIES).designMarkdown,
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
      description: "Static CSS background recipes for texture.",
      descriptionZh: "用于增加质感的静态 CSS 背景配方。",
      designMarkdown: createBackgroundsExports(BACKGROUNDS).designMarkdown,
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
      command: `npx shadcn@latest add ${SITE_URL}/r/animated-icon`,
      endpoint: `${SITE_URL}/r/animated-icon`,
      value: entry.prompt,
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
    fetch: { method: "copy-prompt", value: entry.promptEn },
  }));
}

function buildStudioPresetItems(): CatalogItem[] {
  return STUDIO_STARTER_PRESETS.map((preset): CatalogItem => {
    const bundle = composeDesignSystem(preset.config);
    const { accent, surface, fontPairing, scheme } = preset.config;
    const summary = `accent ${accent}, ${surface} surface, ${fontPairing} type, ${scheme} scheme`;
    return {
      kind: "studio-preset",
      category: "studio",
      slug: preset.key,
      name: preset.name,
      nameZh: preset.nameZh,
      aliases: [],
      description: `A ready-made design system: ${summary}.`,
      descriptionZh: `一套现成的设计系统：${summary}。`,
      pageUrl: `${SITE_URL}/studio?${studioConfigToSearchParams(preset.config).toString()}`,
      fetch: { method: "copy-tokens", value: bundle.designMd },
    };
  });
}

/**
 * Aggregates all seven vocabulary kinds into one flat catalog. Each
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
    { label: "studio-preset", run: buildStudioPresetItems },
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
