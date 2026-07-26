// Theme Kit synthesis types — one selection produces a full dual-mode token
// CSS payload (shadcn semantics + 42 `--wb-*` + chart colors + motion/shape/
// spacing/type statics). All keys here are stored WITHOUT the leading `--`,
// mirroring the registry cssVars convention; css.ts adds `--` on render.

export type ThemeMode = "light" | "dark";

export type ThemeKitSource = "baseline" | "design-system" | "studio-preset";

export type ThemeTokenSet = {
  /** shadcn semantic tokens (background/foreground/primary/…) plus the UI Lab
   * extensions: border-strong, success, warning, danger, faint-foreground. */
  shadcn: Record<string, string>;
  /** The 42 `wb-*` agent-workbench tokens (key includes the `wb-` prefix). */
  wb: Record<string, string>;
  /** chart-1..chart-6, derived from the kit's accent. */
  charts: Record<string, string>;
  /** State-dependent, non-color values — e.g. shadow-hairline/raised/floating
   * and the bare `shadow` default. */
  extra: Record<string, string>;
};

export type ThemeKit = {
  slug: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  source: ThemeKitSource;
  modes: readonly ThemeMode[];
  light?: ThemeTokenSet;
  dark?: ThemeTokenSet;
  /** Mode-independent statics shared by both selectors: ease/duration curves,
   * the full radius/space ladders (+ bare defaults), the type scale, and the
   * font stacks. Rendered once, into `:root` only. */
  statics: Record<string, string>;
  fonts: { body: string; display: string; mono: string };
};
