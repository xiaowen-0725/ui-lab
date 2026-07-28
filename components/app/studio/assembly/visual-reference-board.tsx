"use client";

import {
  CheckCircle2,
  Clock3,
  ExternalLink,
  LockKeyhole,
} from "lucide-react";
import { useLocale } from "next-intl";
import { type CSSProperties, useState } from "react";
import { cn } from "@/lib/utils";

export type CalibrationSource = {
  id: string;
  role: "authoritative" | "supporting" | string;
  path?: string;
  width: number;
  height: number;
  theme: string;
  scope: string;
  comparisonUse: string;
  excludedFeatures?: readonly string[];
};

export type CandidateRegressionCase = {
  caseId: string;
  path: string;
  size: string;
  theme: string;
  calibrationSourceIds: readonly string[];
};

export type VisualReferenceBoardProps = {
  presetSlug: string;
  calibrationSources: readonly CalibrationSource[];
  candidateCases: readonly CandidateRegressionCase[];
  acceptanceStatus: "pending" | "approved";
  className?: string;
};

const comparisonCategories = [
  "layout",
  "typography",
  "color / surface",
  "component anatomy",
  "assets / icons",
  "state",
  "responsive",
  "focus / motion",
] as const;

const lightControlPlane = {
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
  "--wb-hairline": "rgb(24 24 24 / 0.10)",
  colorScheme: "light",
} as CSSProperties;

function StatusCell({
  label,
  value,
  available,
}: {
  label: string;
  value: string;
  available: boolean;
}) {
  const Icon = available ? CheckCircle2 : LockKeyhole;
  return (
    <div className="flex min-h-11 items-center justify-between gap-3 px-3 py-2">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground">
        <Icon className="h-3.5 w-3.5 text-[#4c7695]" strokeWidth={1.8} />
        {value}
      </span>
    </div>
  );
}

function CalibrationFigure({ source }: { source: CalibrationSource }) {
  return (
    <figure className="min-w-0 border-r border-border last:border-r-0">
      {source.path ? (
        <a href={source.path} target="_blank" rel="noopener">
          {/* Vendored calibration bytes must remain untransformed. */}
          {/* biome-ignore lint/performance/noImgElement: source image is evidence */}
          <img
            src={source.path}
            alt={`${source.id} calibration source`}
            className="aspect-[16/9] w-full bg-[#ededed] object-contain"
          />
        </a>
      ) : (
        <div className="flex aspect-[16/9] flex-col items-center justify-center gap-1 bg-[#f3f3f3] text-muted-foreground">
          <LockKeyhole className="h-5 w-5" strokeWidth={1.6} />
          <span className="text-[10px]">bytes private · hash-only</span>
        </div>
      )}
      <figcaption className="border-t border-border p-3">
        <div className="flex flex-wrap items-center gap-2">
          <strong className="text-xs font-medium">{source.id}</strong>
          <span className="border border-border bg-[#f3f3f3] px-1.5 py-0.5 text-[10px] text-muted-foreground">
            {source.role}
          </span>
        </div>
        <p className="mt-1 font-mono text-[10px] text-muted-foreground">
          {source.width}×{source.height} · {source.theme}
        </p>
        <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
          {source.scope}
        </p>
        {source.excludedFeatures?.length ? (
          <p className="mt-1 text-[10px] text-muted-foreground">
            Excluded: {source.excludedFeatures.join(", ")}
          </p>
        ) : null}
      </figcaption>
    </figure>
  );
}

export function VisualReferenceBoard({
  presetSlug,
  calibrationSources,
  candidateCases,
  acceptanceStatus,
  className,
}: VisualReferenceBoardProps) {
  const zh = useLocale() !== "en";
  const [selectedCaseId, setSelectedCaseId] = useState(
    candidateCases[0]?.caseId ?? "",
  );
  const selectedCase =
    candidateCases.find((item) => item.caseId === selectedCaseId) ??
    candidateCases[0];
  const mappedSources = selectedCase
    ? calibrationSources.filter((source) =>
        selectedCase.calibrationSourceIds.includes(source.id),
      )
    : [];
  const hasDifferentDimensions = Boolean(
    selectedCase &&
      mappedSources.some(
        (source) => `${source.width}x${source.height}` !== selectedCase.size,
      ),
  );
  const acceptanceApproved = acceptanceStatus === "approved";

  return (
    <section
      aria-labelledby="visual-reference-board-title"
      data-testid="visual-reference-board"
      style={lightControlPlane}
      className={cn(
        "scroll-mt-24 overflow-hidden rounded-md border border-border bg-background font-sans text-foreground shadow-none",
        className,
      )}
    >
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-3">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
            {presetSlug} · visual acceptance control
          </p>
          <h2 id="visual-reference-board-title" className="mt-1 text-sm font-semibold">
            {zh ? "Codex 视觉参考板" : "Codex visual reference board"}
          </h2>
          <p className="mt-1 max-w-3xl text-[11px] leading-4 text-muted-foreground">
            {zh
              ? "校准来源用于判断设计方向；候选回归截图只防止实现自身倒退。"
              : "Calibration sources establish design direction; candidate regression captures only protect the implementation from drifting backward."}
          </p>
        </div>
        <span className="border border-border bg-[#f3f3f3] px-2 py-1 font-mono text-[10px] text-muted-foreground">
          reference ≠ candidate
        </span>
      </header>

      <div className="grid divide-y divide-border border-b border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <StatusCell label="Calibration direction" value="approved" available />
        <StatusCell
          label="Acceptance master"
          value={acceptanceStatus}
          available={acceptanceApproved}
        />
        <StatusCell
          label="Checkout"
          value={acceptanceApproved ? "available" : "blocked"}
          available={acceptanceApproved}
        />
      </div>

      <div className="border-b border-border">
        <div className="flex items-center justify-between gap-3 bg-[#f9f9f9] px-3 py-2">
          <h3 className="text-xs font-medium">
            {zh ? "校准来源" : "Calibration sources"}
          </h3>
          <span className="text-[10px] text-muted-foreground">
            authoritative / supporting
          </span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3">
          {calibrationSources.map((source) => (
            <CalibrationFigure key={source.id} source={source} />
          ))}
        </div>
      </div>

      <div className="border-b border-border">
        <div className="flex items-center justify-between gap-3 bg-[#f9f9f9] px-3 py-2">
          <h3 className="text-xs font-medium">
            {zh ? "候选回归图与映射来源" : "Candidate regression and mapped sources"}
          </h3>
          <span className="text-[10px] text-muted-foreground">
            candidate-regression only
          </span>
        </div>
        <div role="tablist" aria-label="Candidate regression cases" className="flex gap-1 overflow-x-auto border-b border-border p-2">
          {candidateCases.map((item) => (
            <button
              key={item.caseId}
              type="button"
              role="tab"
              aria-selected={item.caseId === selectedCase?.caseId}
              onClick={() => setSelectedCaseId(item.caseId)}
              className={cn(
                "shrink-0 rounded-sm border border-transparent px-2 py-1 text-[11px] text-muted-foreground outline-none focus-visible:border-[#339cff]",
                item.caseId === selectedCase?.caseId &&
                  "border-[#b8dcf6] bg-[#e5f3ff] text-foreground",
              )}
            >
              {item.caseId}
            </button>
          ))}
        </div>

        {selectedCase ? (
          <div data-testid="reference-candidate-comparison" className="grid lg:grid-cols-2">
            <div className="border-b border-border p-3 lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <strong className="font-medium">
                  {zh ? "映射的校准来源" : "Mapped calibration sources"}
                </strong>
                <span className="text-muted-foreground">
                  {mappedSources.length} source{mappedSources.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {mappedSources.map((source) => (
                  <figure key={source.id} className="border border-border bg-[#f9f9f9]">
                    {source.path ? (
                      <a href={source.path} target="_blank" rel="noopener">
                        {/* biome-ignore lint/performance/noImgElement: source image is evidence */}
                        <img
                          src={source.path}
                          alt={`${source.id} mapped calibration source`}
                          className="aspect-[16/9] w-full object-contain"
                        />
                      </a>
                    ) : null}
                    <figcaption className="border-t border-border p-2 text-[10px]">
                      <p className="font-medium">{source.id}</p>
                      <p className="mt-0.5 text-muted-foreground">
                        {source.width}×{source.height} · {source.theme}
                      </p>
                    </figcaption>
                  </figure>
                ))}
              </div>
              <p className="mt-2 text-[10px] leading-4 text-muted-foreground">
                {mappedSources.map((source) => source.comparisonUse).join(" ")}
              </p>
            </div>

            <figure className="min-w-0 p-3">
              <figcaption className="mb-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <strong className="font-medium">{selectedCase.caseId}</strong>
                <span className="font-mono text-muted-foreground">
                  {selectedCase.size} · {selectedCase.theme}
                </span>
              </figcaption>
              <a href={selectedCase.path} target="_blank" rel="noopener">
                {/* Candidate bytes must remain untransformed. */}
                {/* biome-ignore lint/performance/noImgElement: candidate image is regression evidence */}
                <img
                  src={selectedCase.path}
                  alt={`${selectedCase.caseId} candidate regression capture`}
                  className="w-full border border-border bg-[#ededed] object-contain"
                />
              </a>
              <p className="mt-2 flex items-center gap-1 text-[10px] text-muted-foreground">
                <ExternalLink className="h-3 w-3" strokeWidth={1.8} />
                Source IDs: {selectedCase.calibrationSourceIds.join(", ")}
              </p>
            </figure>

            <div className="border-t border-border bg-[#f9f9f9] px-3 py-2 text-[11px] text-[#4c6373] lg:col-span-2">
              <p className="font-medium">
                Calibration only · no pixel/overlay claim
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                {hasDifferentDimensions
                  ? "Mapped sources differ in size, theme, or semantic state."
                  : "Matching size and theme still do not establish equivalent data, state, font rendering, or capture timing."}
              </p>
            </div>
          </div>
        ) : (
          <p className="px-3 py-4 text-xs text-muted-foreground">
            {zh ? "尚无候选截图。" : "No candidate captures available."}
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.46fr)]">
        <div className="border-b border-border p-3 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xs font-medium">
              {zh ? "差异分类" : "Difference classification"}
            </h3>
            <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
              <Clock3 className="h-3 w-3" strokeWidth={1.8} /> manual review
            </span>
          </div>
          <ul className="mt-2 grid divide-x divide-y divide-border border border-border sm:grid-cols-2 lg:grid-cols-4">
            {comparisonCategories.map((category) => (
              <li key={category} className="flex items-center justify-between gap-2 px-2 py-1.5 text-[10px]">
                <span>{category}</span>
                <span className="text-muted-foreground">
                  {acceptanceApproved ? "approved" : "pending"}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#f9f9f9] p-3 text-[11px] leading-4 text-muted-foreground">
          <p className="font-medium text-foreground">
            {zh ? "验收边界" : "Acceptance boundary"}
          </p>
          <p className="mt-1">
            {zh
              ? "候选回归截图未经用户明确批准，不能成为 acceptance golden，也不能解锁 Checkout。"
              : "A candidate regression capture cannot become an acceptance golden or unlock Checkout until the user explicitly approves it."}
          </p>
        </div>
      </div>
    </section>
  );
}
