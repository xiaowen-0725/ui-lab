import pack from "@/content/system-presets/codex-desktop-v1/reference-pack.json";
import fixture from "@/content/system-presets/codex-desktop-v1/fixtures/parking-high-density-v1.json";
import { canonicalSha256 } from "@/lib/contracts/canonical-json";
import { CODEX_DESKTOP_THEME_KIT } from "@/lib/theme-kits/codex-desktop";
import { parseSystemPreset } from "./schema";
import type {
  ReferencePackStatus,
  ReferenceTheme,
  ReferenceViewport,
  SafeOverrideKey,
  SystemPreset,
  SystemPresetCapability,
  SystemPresetFixturePayload,
  SystemPresetReferenceCase,
} from "./types";

const capabilities = [
  {
    slug: "tasks",
    name: "Tasks",
    nameZh: "任务",
    required: true,
    components: [
      "agent-workbench",
      "thread-list",
      "agent-thread",
      "agent-composer",
    ],
  },
  {
    slug: "artifact",
    name: "Artifact",
    nameZh: "产物",
    required: true,
    components: ["artifact-panel"],
  },
  {
    slug: "board",
    name: "Board",
    nameZh: "看板",
    required: false,
    components: ["agent-inbox", "tabs"],
  },
  {
    slug: "connectors",
    name: "Connectors",
    nameZh: "连接器",
    required: false,
    components: ["settings-panel", "select", "switch"],
  },
  {
    slug: "settings",
    name: "Settings",
    nameZh: "设置",
    required: true,
    components: ["settings-panel", "popover", "morphing-modal"],
  },
] satisfies readonly SystemPresetCapability[];

const componentAllowlist = [
  ...new Set(capabilities.flatMap((item) => item.components)),
].sort();
const safeOverrideKeys = pack.safeOverrides as SafeOverrideKey[];

function themeStaticNumber(key: string): number {
  const value = CODEX_DESKTOP_THEME_KIT.statics[key];
  const parsed = value ? Number.parseFloat(value) : Number.NaN;
  if (!Number.isFinite(parsed)) {
    throw new Error(`Codex ThemeKit static "${key}" must be numeric.`);
  }
  return parsed;
}

function referencePackStatus(value: string): ReferencePackStatus {
  if (value === "review" || value === "approved") return value;
  throw new Error(`Unsupported reference pack status: ${value}`);
}

function referenceViewport(value: string): ReferenceViewport {
  if (value === "wide" || value === "collapse" || value === "narrow")
    return value;
  throw new Error(`Unsupported reference viewport: ${value}`);
}

function referenceTheme(value: string): ReferenceTheme {
  if (value === "light" || value === "dark") return value;
  throw new Error(`Unsupported reference theme: ${value}`);
}

function mapReferenceCase(
  item: (typeof pack.acceptanceCases)[number],
): SystemPresetReferenceCase {
  if (item.status !== "planned") {
    throw new Error(`Unsupported reference case status: ${item.status}`);
  }
  if (item.goldenCapture !== null) {
    throw new Error(
      `Phase 1 reference case "${item.id}" cannot have a golden capture.`,
    );
  }
  return {
    id: item.id,
    viewport: referenceViewport(item.viewport),
    size: item.size,
    scale: item.scale,
    theme: referenceTheme(item.theme),
    states: item.states,
    surfaces: item.surfaces,
    fixtureId: item.fixtureId,
    keyboardFocus: item.keyboardFocus,
    reducedMotion: item.reducedMotion,
    status: item.status,
    fontLoadingState: item.fontLoadingState,
    captureTiming: item.captureTiming,
    calibrationSourceIds: item.calibrationSourceIds,
    goldenCapture: null,
  };
}

export const CODEX_DESKTOP_V1 = parseSystemPreset({
  schemaVersion: 1,
  slug: "codex-desktop-v1",
  version: 1,
  status: "approved",
  approvedAt: pack.approvedAt,
  name: "Codex Desktop",
  nameZh: "Codex 桌面",
  aliases: ["codex", "desktop workbench"],
  description:
    "A complete UI Lab System Preset for Codex-calibrated desktop workbenches; Phase 1 acceptance goldens remain planned.",
  descriptionZh:
    "完整的 UI Lab Codex 桌面工作台系统预设；Phase 1 验收 golden 仍处于 planned 状态。",
  profiles: ["next-app", "vite-app", "electron-renderer"],
  themeKit: {
    slug: CODEX_DESKTOP_THEME_KIT.slug,
    contractHash: canonicalSha256(CODEX_DESKTOP_THEME_KIT),
  },
  compatibleRecipes: ["agent-workbench"],
  capabilities,
  componentAllowlist,
  safeOverrideKeys,
  lockedVisual: {
    typography: {
      families: CODEX_DESKTOP_THEME_KIT.fonts,
      assetIds: ["system-font"],
      weights: pack.observedFacts.typography.weights,
      scale: {
        display: {
          sizePx: themeStaticNumber("text-display"),
          lineHeight: themeStaticNumber("text-display-line-height"),
          letterSpacingEm: -0.02,
        },
        headline: {
          sizePx: themeStaticNumber("text-headline"),
          lineHeight: themeStaticNumber("text-headline-line-height"),
          letterSpacingEm: -0.01,
        },
        title: {
          sizePx: themeStaticNumber("text-title"),
          lineHeight: themeStaticNumber("text-title-line-height"),
          letterSpacingEm: -0.005,
        },
        body: {
          sizePx: themeStaticNumber("text-body"),
          lineHeight: themeStaticNumber("text-body-line-height"),
          letterSpacingEm: 0,
        },
        bodySm: {
          sizePx: themeStaticNumber("text-body-sm"),
          lineHeight: themeStaticNumber("text-body-sm-line-height"),
          letterSpacingEm: 0,
        },
        caption: {
          sizePx: themeStaticNumber("text-caption"),
          lineHeight: themeStaticNumber("text-caption-line-height"),
          letterSpacingEm: 0.01,
        },
      },
      numerals: {
        family: "mono",
        variant: "tabular-nums",
        usage: [
          "task counts",
          "elapsed time",
          "diff statistics",
          "viewport dimensions",
        ],
      },
      fallbackPolicy:
        "Use the ThemeKit platform font stacks; do not vendor proprietary branded fonts.",
    },
    icons: {
      family: pack.observedFacts.icons.family,
      package: "lucide-react",
      sizesPx: [12, 14, 16, 18, 20, 24],
      strokeWidthPx: pack.observedFacts.icons.strokePx,
      linecap: "round",
      linejoin: "round",
      opticalSizing:
        "Use 16px for standard controls, 12–14px for dense metadata, and 20–24px only for primary empty states.",
      defaultStyle: "outline",
      filledUsage:
        "Use filled icons only for the current selected destination or explicit binary state.",
      statusTreatment:
        "Keep status meaning in the semantic color token while preserving the Lucide outline anatomy.",
      forbiddenSubstitutions: [
        "emoji in place of interface icons",
        "text glyphs in place of Lucide icons",
        "icons from a second visual family",
      ],
    },
    surfaces: {
      roles: {
        canvas: "--wb-surface",
        sidebar: "--wb-surface-translucent",
        header: "--wb-surface",
        task: "--wb-surface",
        composer: "--wb-surface-composer",
        panel: "--wb-surface-raised",
        popover: "--popover",
        overlay: "--wb-surface-translucent",
      },
      hierarchy: [
        "canvas below sidebar and task surfaces",
        "composer above the active task surface",
        "panels and popovers above the workbench shell",
        "overlays above panels while preserving state visibility",
      ],
      componentAnatomy: {
        shell:
          "Three-region workbench shell with bounded navigation, task, and contextual panel areas.",
        sidebar:
          "Dense navigation rows, restrained selected state, and quiet project grouping.",
        task:
          "Thread and task state remain visible with compact rows and restrained dividers.",
        composer:
          "Bottom-anchored compact composer with explicit attachments, model state, and submit control.",
        panel:
          "Contextual artifact or settings panel with a clear boundary and compact controls.",
        overlay:
          "Mutually exclusive responsive overlay that preserves the underlying task context.",
      },
      maxBlurPx: 10,
      translucencyRule:
        "Use translucent surfaces only for sidebar, header, or responsive overlays; keep task content opaque.",
    },
    selection: {
      backgroundToken: "--accent",
      foregroundToken: "--accent-foreground",
      iconToken: "--muted-foreground",
      hoverToken: "--wb-hover",
      focusRingToken: "--ring",
      treatment: pack.observedFacts.selection,
      disabledOpacity: 0.45,
    },
    density: {
      baseUnitPx: pack.observedFacts.layout.spacingBasePx,
      spacingScalePx: [4, 8, 12, 16, 20, 24, 32],
      navigationRowPx: 32,
      toolbarPx: pack.observedFacts.layout.toolbarPx,
      toolbarSmallPx: pack.observedFacts.layout.toolbarSmPx,
      panePx: pack.observedFacts.layout.panePx,
      composerSingleLinePx:
        pack.observedFacts.geometry.composerSingleLinePx,
      threadContentMaxWidth: pack.observedFacts.layout.threadContentMaxWidth,
    },
    geometry: {
      radiusScalePx: [0, ...pack.observedFacts.geometry.radiusPx],
      controlRadiusPx: themeStaticNumber("radius-md"),
      panelRadiusPx: themeStaticNumber("radius-panel"),
      composerRadiusPx: themeStaticNumber("radius-xl"),
      fullRadiusPx: themeStaticNumber("radius-full"),
      borderWidthsPx: [0.5, 1],
    },
    shadows: {
      levels: pack.observedFacts.shadows,
      translucencyRule:
        "Use hairline and small shadows for controls; reserve larger levels for floating panels and overlays.",
      maxBlurPx: 10,
    },
    motion: {
      durationsMs: {
        press: 120,
        quick: themeStaticNumber("ease-duration-quick"),
        standard: themeStaticNumber("ease-duration-standard"),
        deliberate: themeStaticNumber("ease-duration-deliberate"),
      },
      curves: {
        standard: CODEX_DESKTOP_THEME_KIT.statics["ease-out"],
        snappy: CODEX_DESKTOP_THEME_KIT.statics["ease-snappy"],
      },
      properties: ["transform", "opacity", "color", "background-color"],
      reducedMotion: {
        removeTransform: true,
        preserveOpacity: true,
      },
    },
    responsive: {
      wide: {
        minWidthPx: 1200,
        behavior:
          "Keep navigation, task, and contextual panel visible as three bounded workbench regions.",
      },
      collapse: {
        minWidthPx: 768,
        maxWidthPx: 1199,
        behavior:
          "Collapse navigation first and present one contextual region at a time as an overlay.",
      },
      narrow: {
        maxWidthPx: 767,
        behavior:
          "Show one full-width task surface with explicit navigation between task, artifact, and settings.",
      },
      nativeChromePolicy:
        "Preserve native desktop chrome when requested; responsive collapse applies below the chrome boundary.",
    },
  },
  assets: [
    {
      kind: "font",
      id: "system-font",
      requirement:
        "Use the platform system font stack for body and display text.",
      required: true,
    },
    {
      kind: "icon",
      id: "lucide",
      requirement:
        "Use Lucide icons at the calibrated workbench size and stroke weight.",
      required: true,
    },
  ],
  referencePack: {
    id: pack.presetId,
    status: referencePackStatus(pack.status),
    contractHash: canonicalSha256(pack),
    fixture: {
      id: pack.fixturePack.id,
      version: pack.fixturePack.version,
      path: pack.fixturePack.path,
      fixtureHash: pack.fixturePack.sha256,
      payload: fixture as SystemPresetFixturePayload,
    },
    cases: pack.acceptanceCases.map(mapReferenceCase),
  },
  required: [
    "Use the complete Agent Workbench shell as the composition entry point.",
    "Use the calibrated Codex Desktop Theme Kit before adapting product content.",
    "Preserve native platform chrome when the confirmed order selects native chrome.",
    "Preserve the declared component anatomy, state visibility, and responsive behavior.",
  ],
  forbidden: [
    "Do not use high-saturation cyan simultaneously for selected backgrounds, text, and icons.",
    "Do not replace the workbench composition with unrelated generic dashboard cards.",
    "Do not use radii larger than the calibrated geometry without a confirmed safe override.",
    "Do not add unrelated gradients, glass effects, or ambient presentation layers.",
    "Do not mix Lucide with another icon family.",
    "Do not introduce a competing type scale or a proprietary font asset.",
    "Do not use decorative motion that hides application state.",
    "Do not mix components from an unapproved visual family.",
  ],
} satisfies SystemPreset);
