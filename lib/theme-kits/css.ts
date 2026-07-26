// Renders a ThemeKit into copy-paste-ready CSS: a :root block (light) and a
// .dark block, plus mode-independent statics folded into :root only.

import type { ThemeKit, ThemeTokenSet } from "./types";

function flatten(tokenSet: ThemeTokenSet): Record<string, string> {
  return { ...tokenSet.shadcn, ...tokenSet.wb, ...tokenSet.charts, ...tokenSet.extra };
}

function declarations(vars: Record<string, string>): string {
  return Object.entries(vars)
    .map(([key, value]) => `  --${key}: ${value};`)
    .join("\n");
}

function header(kit: ThemeKit): string {
  const lines = [
    "/**",
    ` * ${kit.name} · ${kit.nameZh} — UI Lab theme kit`,
    " *",
    ` * ${kit.description}`,
  ];
  if (kit.descriptionZh) lines.push(` * ${kit.descriptionZh}`);
  lines.push(" *");
  if (kit.modes.length === 2) {
    lines.push(" * Dual-mode kit — :root is light, .dark is dark.");
  } else {
    lines.push(
      ` * Single-mode kit — both selectors are pinned to its native ${kit.modes[0]};`,
      " * pair with `graphite` for true dual-mode.",
    );
  }
  if (kit.slug === "frost") {
    lines.push(
      " *",
      " * Frost's canvas is a translucent color — lay your own background layer",
      " * behind it so the aurora backdrop this system expects can show through.",
    );
  }
  lines.push(" *", ' * Paste below `@import "tailwindcss";`', " */");
  return lines.join("\n");
}

export function themeKitToCss(kit: ThemeKit): string {
  const lightSet = kit.light ?? kit.dark;
  const darkSet = kit.dark ?? kit.light;
  if (!lightSet || !darkSet) {
    throw new Error(`Theme kit "${kit.slug}" has no token set for either mode.`);
  }

  const rootVars = { ...flatten(lightSet), ...kit.statics };
  const darkVars = flatten(darkSet);

  return [
    header(kit),
    "",
    `:root {\n${declarations(rootVars)}\n}`,
    "",
    `.dark {\n${declarations(darkVars)}\n}`,
    "",
  ].join("\n");
}
