import type { WorkbenchSkin } from "./types";

export type WbSkinBase = {
  scheme: "light" | "dark";
  canvas: string;
  surface: string;
  raised: string;
  ink: string;
  inkSecondary: string;
  inkMuted: string;
  inkFaint: string;
  hairline: string;
  accent: string;
  accentFg?: string;
  success: string;
  danger: string;
  warning: string;
  fonts?: { body?: string; display?: string; mono?: string };
};

function alpha(color: string, percentage: number) {
  return `color-mix(in srgb, ${color} ${percentage}%, transparent)`;
}

/**
 * Expands a compact color foundation into the complete agent-workbench skin
 * contract. The ratios intentionally mirror the light and dark defaults in
 * globals.css so new systems retain the same depth and interaction hierarchy.
 */
export function makeWbSkin(
  base: WbSkinBase,
  overrides: Partial<Record<string, string>> = {},
): WorkbenchSkin {
  const dark = base.scheme === "dark";
  const accentFg = base.accentFg ?? "#fff";

  const vars: Record<string, string> = {
    "--wb-hover": alpha(base.ink, dark ? 10 : 5),
    "--wb-hover-subtle": alpha(base.ink, dark ? 5 : 3),
    "--wb-hover-strong": alpha(base.ink, 10),
    "--wb-hover-stronger": alpha(base.ink, dark ? 15 : 12),
    "--wb-inset": alpha(base.ink, 5),
    "--wb-inset-strong": alpha(base.ink, dark ? 10 : 8),
    "--wb-inset-subtle": alpha(base.ink, dark ? 5 : 3),
    "--wb-inset-faint": alpha(base.ink, dark ? 3 : 2),
    "--wb-code-inline": alpha(base.ink, dark ? 10 : 7),
    "--wb-code-block": alpha(base.ink, dark ? 5 : 4),
    "--wb-border": base.hairline,
    "--wb-border-subtle": alpha(base.hairline, dark ? 85 : 80),
    "--wb-border-strong": alpha(base.ink, 15),
    "--wb-border-emphasis": alpha(base.ink, 20),
    "--wb-divider": alpha(base.hairline, dark ? 75 : 65),
    "--wb-hairline": base.hairline,
    "--wb-hairline-soft": alpha(base.hairline, 90),
    "--wb-hairline-subtle": alpha(base.hairline, 75),
    "--wb-control-hairline": alpha(base.hairline, 80),
    "--wb-control-tick": alpha(base.ink, dark ? 30 : 20),
    "--wb-resize-handle": alpha(base.ink, dark ? 25 : 20),
    "--wb-surface": base.surface,
    "--wb-surface-translucent": alpha(base.surface, 60),
    "--wb-surface-raised": alpha(base.raised, 95),
    "--wb-surface-composer": alpha(base.raised, 90),
    "--wb-card": alpha(dark ? base.raised : base.ink, dark ? 50 : 3),
    "--wb-inverse": base.ink,
    "--wb-inverse-fg": base.canvas,
    "--wb-accent-fg": accentFg,
    "--wb-solid-control-fg": dark ? base.canvas : base.ink,
    "--wb-shimmer-dim": alpha(base.ink, 40),
    "--wb-shimmer-bright": alpha(base.ink, 90),
    "--wb-accent": base.accent,
    "--wb-success": base.success,
    "--wb-success-border": base.success,
    "--wb-danger": base.danger,
    "--wb-danger-strong": base.danger,
    "--wb-danger-surface": base.danger,
    "--wb-warning": base.warning,
    "--wb-warning-text": base.warning,
    "--wb-warning-hover": base.warning,
    "--wb-warning-surface": base.warning,
    ...overrides,
  };

  return {
    scheme: base.scheme,
    vars,
    siteVars: {
      "--background": base.canvas,
      "--foreground": base.ink,
      "--card": base.surface,
      "--secondary-foreground": base.inkSecondary,
      "--muted-foreground": base.inkMuted,
      "--faint-foreground": base.inkFaint,
      "--border": alpha(base.hairline, 60),
      "--border-strong": base.hairline,
      "--danger": base.danger,
      "--success": base.success,
      "--warning": base.warning,
    },
    fonts: base.fonts,
  };
}
