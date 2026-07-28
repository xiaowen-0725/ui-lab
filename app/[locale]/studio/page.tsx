import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { type CSSProperties, Suspense } from "react";
import { SiteFooter } from "@/components/app/chrome/site-footer";
import { AssemblyStudio } from "@/components/app/studio/assembly/assembly-studio";
import { StudioExplorer } from "@/components/app/studio/studio-explorer";
import referencePack from "@/content/system-presets/codex-desktop-v1/reference-pack.json";
import { loadVisualEvidence } from "@/lib/assembly-order/visual-evidence";
import { CODEX_DESKTOP_V1 } from "@/lib/system-presets/codex-desktop-v1";

const copy = {
  zh: {
    eyebrow: "Assembly Studio · 应用组装",
    title: "组装工坊",
    intro:
      "先用真实 Codex 校准来源确认设计方向，再选择业务能力并检查候选回归矩阵。只有用户明确批准 Acceptance Master 后，Checkout 才能生成不可变的 Confirmed Manifest。",
    workflowLabel: "组装订单流程",
    workflow: [
      "System Preset",
      "业务能力",
      "全应用预览",
      "Review / Checkout",
      "Confirmed Manifest",
    ],
    expertTitle: "专家 Token 实验",
    expertDescription:
      "用于独立试验颜色、字体、圆角等视觉原子。这里的自由组合不会执行完整应用预览、视觉验收门禁或 Checkout，因此不能生成应用级 Confirmed Manifest。",
    expertLoading: "正在载入 Token 实验室…",
  },
  en: {
    eyebrow: "Assembly Studio · Application composition",
    title: "Assembly Studio",
    intro:
      "Establish direction from real Codex calibration sources, then choose capabilities and inspect the candidate regression matrix. Checkout can produce an immutable Confirmed Manifest only after the user explicitly approves the Acceptance Master.",
    workflowLabel: "Assembly order workflow",
    workflow: [
      "System Preset",
      "Capabilities",
      "Full-app preview",
      "Review / Checkout",
      "Confirmed Manifest",
    ],
    expertTitle: "Expert token lab",
    expertDescription:
      "Use this secondary workspace to experiment with isolated visual atoms such as color, typography, and radius. Free-form token mixes do not run full-application previews, visual acceptance gates, or Checkout, so they cannot produce an application-level Confirmed Manifest.",
    expertLoading: "Loading the token lab…",
  },
};

const studioControlPlane = {
  "--background": "#ffffff",
  "--foreground": "#181818",
  "--card": "#ffffff",
  "--card-foreground": "#181818",
  "--muted": "#f3f3f3",
  "--muted-foreground": "#5d5d5d",
  "--border": "rgb(24 24 24 / 0.10)",
  "--border-strong": "rgb(24 24 24 / 0.16)",
  "--accent": "#e5f3ff",
  "--accent-foreground": "#181818",
  "--ring": "#339cff",
  "--wb-surface": "#ffffff",
  "--wb-surface-raised": "#f9f9f9",
  "--wb-surface-translucent": "rgb(243 243 243 / 0.92)",
  "--wb-surface-composer": "#ffffff",
  "--wb-hairline": "rgb(24 24 24 / 0.10)",
  "--wb-hover": "rgb(24 24 24 / 0.05)",
  colorScheme: "light",
} as CSSProperties;

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const content = locale === "en" ? copy.en : copy.zh;

  return {
    title: content.title,
    description: content.intro,
  };
}

export default async function StudioPage() {
  const locale = await getLocale();
  const content = locale === "en" ? copy.en : copy.zh;
  const visualEvidence = await loadVisualEvidence();
  const preset = CODEX_DESKTOP_V1;
  const evidence = visualEvidence.available
    ? {
        available: true,
        acceptanceStatus: visualEvidence.acceptanceStatus,
        ...(visualEvidence.acceptanceStatus === "pending"
          ? {
              reason:
                locale === "en"
                  ? "Candidate regression captures are complete, but the Acceptance Master still requires explicit user approval."
                  : "候选回归截图已完整，但 Acceptance Master 仍需用户明确批准。",
            }
          : {}),
        captures: visualEvidence.candidateCaptures.map((item) => ({
          caseId: item.caseId,
          path: `/system-presets/codex-desktop-v1/${item.path}`,
          sha256: item.sha256,
        })),
      }
    : {
        available: false,
        acceptanceStatus: "pending" as const,
        reason: visualEvidence.reason,
        captures: [],
      };
  const calibrationSources = referencePack.sources.map((source) => ({
    id: source.id,
    role:
      source.role === "authoritative"
        ? ("authoritative" as const)
        : ("supporting" as const),
    ...("path" in source && typeof source.path === "string"
      ? { path: source.path }
      : {}),
    width: source.width,
    height: source.height,
    theme: source.theme,
    scope: source.scope,
    comparisonUse: source.comparisonUse,
    ...("excludedFeatures" in source && Array.isArray(source.excludedFeatures)
      ? { excludedFeatures: source.excludedFeatures }
      : {}),
  }));
  const presetSummary = {
    slug: preset.slug,
    calibrationSources,
    profiles: preset.profiles,
    recipe: preset.compatibleRecipes[0] ?? "agent-workbench",
    capabilities: preset.capabilities.map((item) => ({
      slug: item.slug,
      name: item.name,
      required: item.required,
    })),
    cases: preset.referencePack.cases.map((item) => ({
      id: item.id,
      size: item.size,
      theme: item.theme,
      states: item.states,
      surfaces: item.surfaces,
      calibrationSourceIds: item.calibrationSourceIds,
    })),
  };

  return (
    <div
      style={studioControlPlane}
      className="relative bg-[#f3f3f3] font-sans text-[#181818]"
    >
      <main className="mx-auto max-w-[90rem] px-4 pb-20 pt-24 md:pt-28">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {content.eyebrow}
        </p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-[-0.02em] text-foreground md:text-4xl">
          {content.title}
        </h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-muted-foreground">
          {content.intro}
        </p>

        <ol
          aria-label={content.workflowLabel}
          className="mt-5 grid overflow-hidden rounded-md border border-border bg-background sm:grid-cols-5"
        >
          {content.workflow.map((step, index) => (
            <li
              key={step}
              className="flex min-h-12 items-center gap-2 border-border px-3 py-2 text-xs text-muted-foreground not-last:border-b sm:not-last:border-b-0 sm:not-last:border-r"
            >
              <span className="font-mono text-[0.65rem] text-foreground/55">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-medium text-foreground">{step}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10">
          <AssemblyStudio preset={presetSummary} evidence={evidence} />
        </div>

        <details className="mt-8 rounded-md border border-border bg-background p-4 md:p-5">
          <summary className="cursor-pointer text-sm font-medium text-foreground">
            {content.expertTitle}
          </summary>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">
            {content.expertDescription}
          </p>
          <div className="mt-6 border-t border-border pt-6">
            <Suspense
              fallback={
                <p className="text-sm text-muted-foreground">
                  {content.expertLoading}
                </p>
              }
            >
              <StudioExplorer />
            </Suspense>
          </div>
        </details>
      </main>
      <SiteFooter />
    </div>
  );
}
