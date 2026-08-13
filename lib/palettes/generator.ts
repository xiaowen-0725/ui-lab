import { contrastRatio, normalizeHexColor, parseHexColor } from "@/lib/color";
import { hexToOklch, oklchToHex } from "@/lib/theme-kits/oklch";
import type { PaletteColors, PaletteEntry } from "./types";

export const RAMP_STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

export type RampStep = (typeof RAMP_STEPS)[number];
export type GeneratorScope = "basic" | "full";
export type GeneratorScheme =
  | "complementary"
  | "analogous"
  | "triadic"
  | "split"
  | "monochromatic";
export type GeneratorContrast = "AA" | "AAA";
export type GeneratorFormat = "hex" | "rgb" | "hsl" | "oklch";

export type GeneratorParams = {
  base: string;
  scope: GeneratorScope;
  scheme: GeneratorScheme;
  contrast: GeneratorContrast;
  format: GeneratorFormat;
};

export type ColorRamp = Record<RampStep, string>;

export type GeneratedPalette = {
  params: GeneratorParams;
  entry: PaletteEntry;
  ramps: {
    primary: ColorRamp;
    accent: ColorRamp;
    accent2: ColorRamp;
    neutral: ColorRamp;
  };
  semanticSteps: Record<keyof PaletteColors, `${"primary" | "accent" | "neutral"}-${RampStep}`>;
};

const DEFAULT_PARAMS: GeneratorParams = {
  base: "#3D7DFF",
  scope: "full",
  scheme: "analogous",
  contrast: "AAA",
  format: "hsl",
};

const LIGHTNESS: Record<RampStep, number> = {
  50: 0.97,
  100: 0.93,
  200: 0.86,
  300: 0.77,
  400: 0.68,
  500: 0.59,
  600: 0.5,
  700: 0.42,
  800: 0.34,
  900: 0.26,
  950: 0.18,
};

const CHROMA_SHAPE: Record<RampStep, number> = {
  50: 0.12,
  100: 0.22,
  200: 0.38,
  300: 0.58,
  400: 0.82,
  500: 1,
  600: 0.94,
  700: 0.8,
  800: 0.62,
  900: 0.42,
  950: 0.25,
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function wrapHue(value: number) {
  return ((value % 360) + 360) % 360;
}

function linearRgb(l: number, c: number, h: number) {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;
  const ll = l_ ** 3;
  const mm = m_ ** 3;
  const ss = s_ ** 3;
  return {
    r: 4.0767416621 * ll - 3.3077115913 * mm + 0.2309699292 * ss,
    g: -1.2684380046 * ll + 2.6097574011 * mm - 0.3413193965 * ss,
    b: -0.0041960863 * ll - 0.7034186147 * mm + 1.707614701 * ss,
  };
}

function inSrgb(l: number, c: number, h: number) {
  const rgb = linearRgb(l, c, h);
  return [rgb.r, rgb.g, rgb.b].every((channel) => channel >= -0.00001 && channel <= 1.00001);
}

function clampChroma(l: number, c: number, h: number) {
  if (inSrgb(l, c, h)) return c;
  let low = 0;
  let high = c;
  for (let index = 0; index < 16; index += 1) {
    const candidate = (low + high) / 2;
    if (inSrgb(l, candidate, h)) low = candidate;
    else high = candidate;
  }
  return low;
}

function maxChroma(l: number, h: number) {
  return clampChroma(l, 0.4, h);
}

function createRamp(hue: number, chromaPercentage: number, chromaFactor = 1): ColorRamp {
  return Object.fromEntries(
    RAMP_STEPS.map((step) => {
      const l = LIGHTNESS[step];
      const desired =
        maxChroma(l, hue) * chromaPercentage * CHROMA_SHAPE[step] * chromaFactor;
      return [step, oklchToHex(l, desired, hue)];
    }),
  ) as ColorRamp;
}

function schemeHues(baseHue: number, scheme: GeneratorScheme) {
  const offsets: Record<GeneratorScheme, [number, number]> = {
    complementary: [180, 60],
    analogous: [32, -32],
    triadic: [120, 240],
    split: [150, 210],
    monochromatic: [0, 0],
  };
  const [accent, accent2] = offsets[scheme];
  return [wrapHue(baseHue + accent), wrapHue(baseHue + accent2)] as const;
}

function closestStep(
  ramp: ColorRamp,
  predicate: (value: string) => boolean,
  order: readonly RampStep[],
) {
  return order.find((step) => predicate(ramp[step])) ?? order[order.length - 1] ?? 950;
}

function semanticPair(
  ramp: ColorRamp,
  background: string,
  minimum: number,
  preference: "dark" | "light",
) {
  const order =
    preference === "dark"
      ? ([500, 600, 700, 800, 900, 950] as const)
      : ([500, 400, 300, 200, 100, 50] as const);
  const step = closestStep(ramp, (value) => contrastRatio(value, background) >= minimum, order);
  return { value: ramp[step], step };
}

function formatName(scheme: GeneratorScheme) {
  return scheme
    .split("-")
    .map((part) => `${part[0]?.toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

export function generatePalette(
  input: Partial<GeneratorParams> = {},
): GeneratedPalette {
  const params: GeneratorParams = {
    ...DEFAULT_PARAMS,
    ...input,
    base: normalizeHexColor(input.base ?? DEFAULT_PARAMS.base) ?? DEFAULT_PARAMS.base,
  };
  const base = hexToOklch(params.base);
  const hue = base?.h ?? 260;
  const baseChroma = base?.c ?? 0;
  const chromaPercentage =
    baseChroma < 0.005
      ? 0
      : clamp(baseChroma / maxChroma(base?.l ?? 0.59, hue), 0.18, 1);
  const [accentHue, accent2Hue] = schemeHues(hue, params.scheme);
  const primary = createRamp(hue, chromaPercentage);
  if (base && base.c >= 0.005 && base.l >= 0.35 && base.l <= 0.75) {
    primary[500] = params.base;
  }
  const accent = createRamp(
    accentHue,
    chromaPercentage,
    params.scheme === "monochromatic" ? 0.66 : 0.82,
  );
  const accent2 = createRamp(
    accent2Hue,
    chromaPercentage,
    params.scheme === "monochromatic" ? 0.38 : 0.72,
  );
  const neutral = createRamp(hue, Math.min(0.12, chromaPercentage * 0.12), 1);
  // Preserve a small safety margin through notation rounding and browser parsing.
  const minimum = (params.contrast === "AAA" ? 7 : 4.5) + 0.15;
  const bg = neutral[50];
  const surface = neutral[50];
  const border = neutral[200];
  const text = { value: neutral[950], step: 950 as const };
  const muted = semanticPair(neutral, bg, minimum, "dark");
  const primaryFill = semanticPair(primary, primary[50], minimum, "dark");
  const primaryFg = semanticPair(primary, primaryFill.value, minimum, "light");
  const colors: PaletteColors = {
    bg,
    surface,
    border,
    text: text.value,
    muted: muted.value,
    primary: primaryFill.value,
    primaryFg: primaryFg.value,
    accent: accent[500],
  };
  const schemeName = formatName(params.scheme);
  const schemeNameZh: Record<GeneratorScheme, string> = {
    complementary: "互补色",
    analogous: "类似色",
    triadic: "三角色",
    split: "分裂互补",
    monochromatic: "单色",
  };
  const entry: PaletteEntry = {
    slug: "generated",
    name: `${schemeName} ${params.base}`,
    nameZh: `${schemeNameZh[params.scheme]} ${params.base}`,
    group: "vivid",
    aliases: [schemeName, params.base, "OKLCH"],
    description: `A clean-room OKLCH palette generated from ${params.base} with ${params.scheme} accents and enforced WCAG ${params.contrast} semantic pairs.`,
    descriptionZh: `从 ${params.base} 生成的 OKLCH 配色，采用${schemeNameZh[params.scheme]}关系，并强制语义文字组合达到 WCAG ${params.contrast}。`,
    bestFor: `${params.scope === "full" ? "Full" : "Basic"} product color systems and fast brand exploration`,
    bestForZh: `${params.scope === "full" ? "完整" : "基础"}产品色彩系统与品牌方向探索`,
    promptEn: `Use ${params.base} as the brand seed. Build perceptually even OKLCH ramps with a ${params.scheme} harmony. Enforce WCAG ${params.contrast} for body-text semantic pairs. Use generated semantic roles rather than raw colors.`,
    promptZh: `以 ${params.base} 为品牌种子，用 OKLCH 生成感知均匀色阶，采用${schemeNameZh[params.scheme]}关系，并强制正文语义组合达到 WCAG ${params.contrast}。组件只使用语义角色，不直接借用原始色阶。`,
    recipe: [
      "Generate in OKLCH and clamp every step to sRGB.",
      `Use ${params.scheme} harmony for accents.`,
      `Enforce WCAG ${params.contrast} by moving semantic lightness steps.`,
      "Reserve the brand hue for interactive emphasis.",
      "Keep secondary actions neutral.",
    ],
    recipeZh: [
      "在 OKLCH 中生成，并将每一档限制在 sRGB 色域内。",
      `使用${schemeNameZh[params.scheme]}关系生成强调色。`,
      `通过移动语义色阶明度强制达到 WCAG ${params.contrast}。`,
      "品牌色只承担交互强调。",
      "次要操作保持中性。",
    ],
    colors,
  };

  return {
    params,
    entry,
    ramps: { primary, accent, accent2, neutral },
    semanticSteps: {
      bg: "neutral-50",
      surface: "neutral-50",
      border: "neutral-200",
      text: `neutral-${text.step}`,
      muted: `neutral-${muted.step}`,
      primary: `primary-${primaryFill.step}`,
      primaryFg: `primary-${primaryFg.step}`,
      accent: "accent-500",
    },
  };
}

function hexToRgbNotation(hex: string) {
  const rgb = parseHexColor(hex);
  return rgb ? `rgb(${rgb.r} ${rgb.g} ${rgb.b})` : hex;
}

function hexToHslNotation(hex: string) {
  const rgb = parseHexColor(hex);
  if (!rgb) return hex;
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;
  let hue = 0;
  if (delta !== 0) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  return `hsl(${Math.round(wrapHue(hue))} ${Math.round(saturation * 100)}% ${Math.round(lightness * 100)}%)`;
}

export function formatColor(hex: string, format: GeneratorFormat) {
  if (format === "hex") return hex.toUpperCase();
  if (format === "rgb") return hexToRgbNotation(hex);
  if (format === "hsl") return hexToHslNotation(hex);
  const value = hexToOklch(hex);
  return value
    ? `oklch(${value.l.toFixed(3)} ${value.c.toFixed(3)} ${(value.h ?? 0).toFixed(1)})`
    : hex;
}

export function formatGeneratedPaletteCss(
  generated: GeneratedPalette,
  format: GeneratorFormat = generated.params.format,
) {
  const rampNames = ["primary", "accent", "accent2", "neutral"] as const;
  const rampLines = rampNames.flatMap((name) =>
    RAMP_STEPS.map(
      (step) =>
        `  --color-${name.replace("accent2", "accent-2")}-${step}: ${formatColor(generated.ramps[name][step], format)};`,
    ),
  );
  const c = generated.entry.colors;
  const semanticLines = [
    ["background", c.bg],
    ["foreground", c.text],
    ["card", c.surface],
    ["border", c.border],
    ["muted-foreground", c.muted],
    ["primary", c.primary],
    ["primary-foreground", c.primaryFg],
    ["accent", c.accent],
  ].map(([name, value]) => `  --${name}: ${formatColor(value, format)};`);
  const lines = generated.params.scope === "full" ? [...rampLines, "", ...semanticLines] : semanticLines;
  return `:root {\n${lines.join("\n")}\n}\n`;
}

export function generatorParamsToSearch(params: GeneratorParams) {
  return new URLSearchParams({
    b: params.base.replace(/^#/, "").toUpperCase(),
    m: params.scope,
    s: params.scheme,
    c: params.contrast,
    f: params.format,
  });
}

function oneOf<T extends string>(value: string | null, options: readonly T[], fallback: T) {
  return options.includes(value as T) ? (value as T) : fallback;
}

export function parseGeneratorParams(search: URLSearchParams): GeneratorParams {
  return {
    base: normalizeHexColor(search.get("b") ?? "") ?? DEFAULT_PARAMS.base,
    scope: oneOf(search.get("m"), ["basic", "full"] as const, DEFAULT_PARAMS.scope),
    scheme: oneOf(
      search.get("s"),
      ["complementary", "analogous", "triadic", "split", "monochromatic"] as const,
      DEFAULT_PARAMS.scheme,
    ),
    contrast: oneOf(search.get("c"), ["AA", "AAA"] as const, DEFAULT_PARAMS.contrast),
    format: oneOf(
      search.get("f"),
      ["hex", "rgb", "hsl", "oklch"] as const,
      DEFAULT_PARAMS.format,
    ),
  };
}
