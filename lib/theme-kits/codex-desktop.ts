import { baselineKit } from "./compose";
import type { ThemeKit, ThemeTokenSet } from "./types";

const FONTS = {
  body: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  display: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: 'ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
};

const MEASURED_SHADOWS = {
  "shadow-hairline": "0px 0px 0px .5px #0000001a",
  "shadow-sm": "0px 1px 2px -1px #00000014",
  "shadow-md": "0px 2px 4px -1px #00000014",
  "shadow-lg": "0px 4px 8px -2px #0000001a",
  "shadow-xl": "0px 8px 16px -4px #0000001f",
  "shadow-2xl": "0px 16px 32px -8px #00000030",
  "shadow-raised": "0px 1px 2px -1px #00000014",
  "shadow-floating": "0px 4px 8px -2px #0000001a",
  shadow: "0px 1px 2px -1px #00000014",
};

function cloneTokenSet(tokenSet: ThemeTokenSet): ThemeTokenSet {
  return {
    shadcn: { ...tokenSet.shadcn },
    wb: { ...tokenSet.wb },
    charts: { ...tokenSet.charts },
    extra: { ...tokenSet.extra },
  };
}

const baseline = baselineKit();
if (!baseline.light || !baseline.dark) {
  throw new Error("Expected the baseline kit to provide both theme modes.");
}

const light = cloneTokenSet(baseline.light);
Object.assign(light.shadcn, {
  background: "#fff",
  foreground: "#181818",
  card: "#f9f9f9",
  "card-foreground": "#181818",
  popover: "#fff",
  "popover-foreground": "#181818",
  primary: "#303030",
  "primary-foreground": "#fff",
  secondary: "#f9f9f9",
  "secondary-foreground": "#181818",
  muted: "#f3f3f3",
  "muted-foreground": "#5d5d5d",
  accent: "#e5f3ff",
  "accent-foreground": "#303030",
  border: "rgb(0 0 0 / 0.08)",
  input: "rgb(0 0 0 / 0.08)",
  ring: "#339cff",
  "border-strong": "rgb(0 0 0 / 0.12)",
});
Object.assign(light.wb, {
  "wb-surface": "#fff",
  "wb-surface-translucent": "rgb(249 249 249 / 0.82)",
  "wb-surface-raised": "#fff",
  "wb-surface-composer": "#fff",
  "wb-card": "#f9f9f9",
  "wb-inset-strong": "rgb(0 0 0 / 0.05)",
  "wb-border": "rgb(0 0 0 / 0.08)",
  "wb-border-subtle": "rgb(0 0 0 / 0.05)",
  "wb-border-strong": "rgb(0 0 0 / 0.12)",
  "wb-hairline": "rgb(0 0 0 / 0.08)",
  "wb-accent": "#339cff",
});
Object.assign(light.extra, MEASURED_SHADOWS);

const dark = cloneTokenSet(baseline.dark);
Object.assign(dark.shadcn, {
  background: "#181818",
  foreground: "#f3f3f3",
  card: "#212121",
  "card-foreground": "#f3f3f3",
  popover: "#212121",
  "popover-foreground": "#f3f3f3",
  primary: "#f3f3f3",
  "primary-foreground": "#181818",
  secondary: "#212121",
  "secondary-foreground": "#f3f3f3",
  muted: "#282828",
  "muted-foreground": "#afafaf",
  accent: "color-mix(in srgb, #339cff 18%, #212121)",
  "accent-foreground": "#f3f3f3",
  border: "rgb(255 255 255 / 0.08)",
  input: "rgb(255 255 255 / 0.08)",
  ring: "#339cff",
  "border-strong": "rgb(255 255 255 / 0.12)",
});
Object.assign(dark.wb, {
  "wb-surface": "#181818",
  "wb-surface-translucent": "rgb(24 24 24 / 0.82)",
  "wb-surface-raised": "#212121",
  "wb-surface-composer": "#212121",
  "wb-card": "#282828",
  "wb-inset-strong": "rgb(255 255 255 / 0.08)",
  "wb-border": "rgb(255 255 255 / 0.08)",
  "wb-border-subtle": "rgb(255 255 255 / 0.05)",
  "wb-border-strong": "rgb(255 255 255 / 0.12)",
  "wb-hairline": "rgb(255 255 255 / 0.08)",
  "wb-accent": "#339cff",
});
Object.assign(dark.extra, MEASURED_SHADOWS);

export const CODEX_DESKTOP_THEME_KIT: ThemeKit = {
  slug: "codex-desktop-v1",
  name: "Codex Desktop v1",
  nameZh: "Codex 桌面 v1",
  description:
    "UI Lab calibrated desktop-workbench system preset; it defines implementation tokens, not an OpenAI asset distribution.",
  descriptionZh: "由 UI Lab 校准的桌面工作台系统预设；定义实现 token，不分发 OpenAI 资产。",
  source: "system-preset",
  modes: ["light", "dark"],
  light,
  dark,
  statics: {
    ...baseline.statics,
    "font-sans": FONTS.body,
    "font-display": FONTS.display,
    "font-mono": FONTS.mono,
    "radius-none": "0px",
    "radius-xs": "4px",
    "radius-sm": "6px",
    "radius-md": "8px",
    "radius-lg": "10px",
    "radius-xl": "20px",
    "radius-2xl": "24px",
    "radius-full": "9999px",
    radius: "10px",
    "radius-hairline": "2px",
    "radius-panel": "12px",
    "text-display": "24px",
    "text-display-line-height": "1.2",
    "text-headline": "18px",
    "text-headline-line-height": "1.25",
    "text-title": "16px",
    "text-title-line-height": "1.3",
    "text-body": "14px",
    "text-body-line-height": "1.4",
    "text-body-sm": "12px",
    "text-body-sm-line-height": "1.35",
    "text-caption": "11px",
    "text-caption-line-height": "1.3",
    space: "8px",
    "space-row": "32px",
    "space-padding": "8px",
    "ease-out": "cubic-bezier(.19, 1, .22, 1)",
    "ease-swift-out": "cubic-bezier(.19, 1, .22, 1)",
    "ease-in-out": "cubic-bezier(.23, 1, .32, 1)",
    "ease-snappy": "cubic-bezier(.23, 1, .32, 1)",
    "ease-duration-quick": "150ms",
    "ease-duration-standard": "150ms",
    "ease-duration-deliberate": "300ms",
  },
  fonts: FONTS,
};
