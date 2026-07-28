import { canonicalSha256 } from "@/lib/contracts/canonical-json";
import { CODEX_DESKTOP_V1 } from "./codex-desktop-v1";
import type { SystemPreset } from "./types";

export { CODEX_DESKTOP_THEME_KIT } from "@/lib/theme-kits/codex-desktop";
export { CODEX_DESKTOP_V1 } from "./codex-desktop-v1";
export { assertValidSystemPreset, parseSystemPreset } from "./schema";
export type { SystemPreset } from "./types";

export const SYSTEM_PRESETS: readonly SystemPreset[] = Object.freeze([
  CODEX_DESKTOP_V1,
]);

export function findSystemPreset(slug: string): SystemPreset | undefined {
  return SYSTEM_PRESETS.find((preset) => preset.slug === slug);
}

/**
 * The immutable behavior contract intentionally excludes human-facing copy.
 * Capability labels are copy too; only their wiring is contract-relevant.
 */
export function systemPresetContractPayload(preset: SystemPreset) {
  return {
    schemaVersion: preset.schemaVersion,
    slug: preset.slug,
    version: preset.version,
    status: preset.status,
    profiles: preset.profiles,
    themeKit: preset.themeKit,
    compatibleRecipes: preset.compatibleRecipes,
    capabilities: preset.capabilities.map(({ slug, required, components }) => ({
      slug,
      required,
      components,
    })),
    componentAllowlist: preset.componentAllowlist,
    safeOverrideKeys: preset.safeOverrideKeys,
    lockedVisual: preset.lockedVisual,
    assets: preset.assets,
    referencePack: preset.referencePack,
    required: preset.required,
    forbidden: preset.forbidden,
  };
}

export function systemPresetContractHash(preset: SystemPreset): string {
  return canonicalSha256(systemPresetContractPayload(preset));
}
