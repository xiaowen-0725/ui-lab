import {
  type AtomExportVariable,
  renderCssVariables,
  renderDesignMarkdown,
  renderTailwindTheme,
} from "@/lib/atoms/export";
import {
  normalizeStudioConfig,
  resolveStudioTokens,
} from "@/lib/studio/presets";
import { studioConfigToSkin } from "@/lib/studio/skin";
import type { StudioConfig, StudioExportBundle } from "@/lib/studio/types";

function recordVariables(record: Record<string, string>): AtomExportVariable[] {
  return Object.entries(record).map(([name, value]) => ({
    name: name as `--${string}`,
    value,
  }));
}

export function composeDesignSystem(config: StudioConfig): StudioExportBundle {
  const normalized = normalizeStudioConfig(config);
  const skin = studioConfigToSkin(normalized);
  const { surface, radius, elevation, fontPairing, density } =
    resolveStudioTokens(normalized);
  const shadow = elevation[normalized.scheme];
  const variables: AtomExportVariable[] = [
    ...recordVariables(skin.vars),
    ...recordVariables(skin.siteVars),
    { name: "--radius", value: radius.value },
    { name: "--shadow", value: shadow },
    { name: "--space", value: `${density.padding}px` },
    { name: "--space-row", value: `${density.rowHeight}px` },
    { name: "--space-padding", value: `${density.padding}px` },
    { name: "--font-display", value: fontPairing.display },
    { name: "--font-sans", value: fontPairing.body },
    { name: "--font-mono", value: fontPairing.mono },
  ];
  const rootCss = renderCssVariables(variables);
  const name = normalized.name ?? "My System";
  const colors = renderDesignMarkdown({
    title: "Colors",
    values: [
      { name: "canvas", value: surface.canvas },
      { name: "surface", value: surface.surface },
      { name: "raised", value: surface.raised },
      { name: "ink", value: surface.ink },
      { name: "ink-secondary", value: skin.siteVars["--secondary-foreground"] },
      { name: "ink-muted", value: skin.siteVars["--muted-foreground"] },
      { name: "ink-faint", value: skin.siteVars["--faint-foreground"] },
      { name: "hairline", value: surface.hairline },
      { name: "accent", value: normalized.accent },
      { name: "accent-foreground", value: skin.vars["--wb-accent-fg"] },
      { name: "success", value: skin.vars["--wb-success"] },
      { name: "danger", value: skin.vars["--wb-danger"] },
      { name: "warning", value: skin.vars["--wb-warning"] },
    ],
    rule: "Reserve the accent for focus, selection, and primary actions; semantic colors describe real state only.",
  });
  const typography = renderDesignMarkdown({
    title: "Typography",
    values: [
      { name: "display", value: fontPairing.display },
      { name: "body", value: fontPairing.body },
      { name: "mono", value: fontPairing.mono },
    ],
    rule: "Use this display, body, and monospace pairing throughout the product without introducing a competing family.",
  });
  const geometry = renderDesignMarkdown({
    title: "Radius, elevation & spacing",
    values: [
      { name: "radius", value: `${radius.name} · ${radius.value}` },
      { name: "elevation", value: `${elevation.name} · ${shadow}` },
      {
        name: "density",
        value: `${density.name} · ${density.rowHeight}px row / ${density.padding}px padding`,
      },
      { name: "border", value: normalized.border },
      { name: "surface", value: normalized.glass ? "frosted glass" : "solid" },
    ],
    rule: "Apply these atom values consistently; do not introduce off-scale radii, shadows, or spacing.",
  });

  return {
    css: normalized.scheme === "dark" ? rootCss.replace(/^:root/, ".dark") : rootCss,
    tailwind: renderTailwindTheme(variables),
    designMd: `---\nname: ${JSON.stringify(name)}\ndescription: ${JSON.stringify(
      "A custom Agent workbench design system composed in UI Lab Studio.",
    )}\n---\n\n# ${name}\n\n${colors}\n\n${typography}\n\n${geometry}\n\n## FORBIDDEN\n\nDo not add competing accent colors, off-scale geometry, heavy decorative effects, or motion that obscures task state.`,
  };
}
