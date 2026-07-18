"use client";

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";
import { ComponentSample } from "@/components/app/studio/component-sample";
import { StudioExportBar } from "@/components/app/studio/studio-export-bar";
import { WorkbenchStage } from "@/components/app/layouts/workbench-stage";
import type { Locale } from "@/i18n/routing";
import {
  composeDesignSystem,
  defaultSurfaceForScheme,
  normalizeStudioConfig,
  resolveStudioTokens,
  STUDIO_ACCENTS,
  STUDIO_DENSITIES,
  STUDIO_ELEVATIONS,
  STUDIO_FONT_PAIRINGS,
  STUDIO_RADII,
  STUDIO_STARTER_PRESETS,
  STUDIO_SURFACES,
  studioConfigFromSearchParams,
  studioConfigToEntry,
  studioConfigToSearchParams,
  type StudioConfig,
  type StudioScheme,
} from "@/lib/studio";
import { cn } from "@/lib/utils";

type SegmentOption = { value: string; label: string };

function SegmentedDial({
  label,
  value,
  options,
  onChange,
  className,
}: {
  label: string;
  value: string;
  options: readonly SegmentOption[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="text-xs font-semibold text-foreground">{label}</legend>
      <div
        className="mt-2 grid rounded-xl border border-border bg-card/20 p-1"
        style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            aria-pressed={value === option.value}
            className={cn(
              "min-h-8 rounded-lg px-1.5 text-[11px] font-medium transition-colors",
              value === option.value
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

const PRESET_FIELDS = [
  "scheme",
  "accent",
  "surface",
  "radius",
  "elevation",
  "fontPairing",
  "density",
] as const;

function presetMatches(config: StudioConfig, preset: StudioConfig): boolean {
  return PRESET_FIELDS.every((field) => config[field] === preset[field]);
}

export function StudioExplorer({
  value,
  defaultValue,
  onChange,
  className,
}: {
  value?: StudioConfig;
  defaultValue?: StudioConfig;
  onChange?: (config: StudioConfig) => void;
  className?: string;
} = {}) {
  const t = useTranslations("studio");
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const urlQuery = searchParams.toString();
  const [internalConfig, setInternalConfig] = useState<StudioConfig>(() =>
    defaultValue
      ? normalizeStudioConfig(defaultValue)
      : studioConfigFromSearchParams(new URLSearchParams(urlQuery)),
  );
  const config = useMemo(
    () => normalizeStudioConfig(value ?? internalConfig),
    [value, internalConfig],
  );
  const currentQueryRef = useRef(urlQuery);
  const syncingFromUrlRef = useRef(false);

  useEffect(() => {
    if (urlQuery === currentQueryRef.current) return;
    syncingFromUrlRef.current = true;
    currentQueryRef.current = urlQuery;
    const nextConfig = studioConfigFromSearchParams(new URLSearchParams(urlQuery));
    if (value === undefined) setInternalConfig(nextConfig);
    onChange?.(nextConfig);
  }, [urlQuery, value, onChange]);

  useEffect(() => {
    if (syncingFromUrlRef.current) {
      syncingFromUrlRef.current = false;
      return;
    }

    const nextQuery = studioConfigToSearchParams(config).toString();
    if (nextQuery === currentQueryRef.current) return;
    currentQueryRef.current = nextQuery;
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}?${nextQuery}${window.location.hash}`,
    );
  }, [config]);

  const entry = useMemo(() => studioConfigToEntry(config), [config]);
  const tokens = useMemo(() => resolveStudioTokens(config), [config]);
  const exports = useMemo(() => composeDesignSystem(config), [config]);
  const surfaces = STUDIO_SURFACES.filter((surface) => surface.scheme === config.scheme);
  const localName = (entry: { name: string; nameZh: string }) =>
    locale === "zh" ? entry.nameZh : entry.name;

  const updateConfig = (
    next: StudioConfig | ((current: StudioConfig) => StudioConfig),
  ) => {
    const nextConfig = typeof next === "function" ? next(config) : next;
    if (value === undefined) setInternalConfig(nextConfig);
    onChange?.(nextConfig);
  };

  const setField = <Key extends keyof StudioConfig>(
    field: Key,
    value: StudioConfig[Key],
  ) => {
    updateConfig((current) => ({ ...current, [field]: value }));
  };

  const setScheme = (scheme: StudioScheme) => {
    updateConfig((current) => ({
      ...current,
      scheme,
      surface: defaultSurfaceForScheme(scheme),
    }));
  };

  const sampleCopy = {
    title: t("sampleTitle"),
    hint: t("sampleHint"),
    primary: t("samplePrimary"),
    secondary: t("sampleSecondary"),
    cardTitle: t("sampleCardTitle"),
    cardBody: t("sampleCardBody"),
    inputPlaceholder: t("sampleInput"),
    badge: t("sampleBadge"),
    rowTitle: t("sampleRowTitle"),
    rowMeta: t("sampleRowMeta"),
  };

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="grid gap-6 lg:grid-cols-[22.5rem_minmax(0,1fr)] lg:items-start">
        <aside className="rounded-3xl border border-border bg-card/20 p-5 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto">
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("presets")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {STUDIO_STARTER_PRESETS.map((preset) => (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() =>
                    updateConfig({
                      ...preset.config,
                      ...(config.name ? { name: config.name } : {}),
                    })
                  }
                  aria-pressed={presetMatches(config, preset.config)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
                    presetMatches(config, preset.config)
                      ? "border-(--color-border-strong) bg-background text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: preset.config.accent }}
                  />
                  {localName(preset)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-6 border-border border-t pt-6">
            <SegmentedDial
              label={t("scheme")}
              value={config.scheme}
              options={[
                { value: "light", label: t("schemeLight") },
                { value: "dark", label: t("schemeDark") },
              ]}
              onChange={(value) => setScheme(value as StudioScheme)}
            />

            <fieldset>
              <legend className="text-xs font-semibold text-foreground">{t("accent")}</legend>
              <div className="mt-2 grid grid-cols-6 gap-2.5">
                {STUDIO_ACCENTS.map((accent) => (
                  <button
                    key={accent}
                    type="button"
                    onClick={() => setField("accent", accent)}
                    aria-label={t("accentOption", { color: accent })}
                    aria-pressed={config.accent === accent}
                    className={cn(
                      "aspect-square rounded-lg border border-black/10 transition-shadow dark:border-white/10",
                      config.accent === accent &&
                        "ring-1 ring-foreground ring-offset-2 ring-offset-background",
                    )}
                    style={{ background: accent }}
                  />
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="text-xs font-semibold text-foreground">{t("surface")}</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {surfaces.map((surface) => (
                  <button
                    key={surface.key}
                    type="button"
                    onClick={() => setField("surface", surface.key)}
                    aria-pressed={config.surface === surface.key}
                    className={cn(
                      "flex items-center gap-2 rounded-xl border p-2 text-left text-xs transition-colors",
                      config.surface === surface.key
                        ? "border-(--color-border-strong) bg-background text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-7 w-7 shrink-0 overflow-hidden rounded-lg border"
                      style={{ borderColor: surface.hairline }}
                    >
                      <span className="w-1/2" style={{ background: surface.canvas }} />
                      <span className="w-1/2" style={{ background: surface.surface }} />
                    </span>
                    {localName(surface)}
                  </button>
                ))}
              </div>
            </fieldset>

            <SegmentedDial
              label={t("radius")}
              value={config.radius}
              options={STUDIO_RADII.map((radius) => ({
                value: radius.slug,
                label: t(`radiusOption.${radius.slug}`),
              }))}
              onChange={(value) => setField("radius", value)}
            />

            <SegmentedDial
              label={t("elevation")}
              value={config.elevation}
              options={STUDIO_ELEVATIONS.map((elevation) => ({
                value: elevation.slug,
                label: t(`elevationOption.${elevation.slug}`),
              }))}
              onChange={(value) => setField("elevation", value)}
            />

            <fieldset>
              <legend className="text-xs font-semibold text-foreground">{t("font")}</legend>
              <div className="mt-2 flex flex-col gap-2">
                {STUDIO_FONT_PAIRINGS.map((font) => (
                  <button
                    key={font.slug}
                    type="button"
                    onClick={() => setField("fontPairing", font.slug)}
                    aria-pressed={config.fontPairing === font.slug}
                    className={cn(
                      "flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left transition-colors",
                      config.fontPairing === font.slug
                        ? "border-(--color-border-strong) bg-background text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="text-xs font-medium">{localName(font)}</span>
                    <span
                      className="text-sm text-foreground"
                      style={{ fontFamily: font.display }}
                      aria-hidden="true"
                    >
                      Aa 字
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>

            <SegmentedDial
              label={t("density")}
              value={config.density}
              options={STUDIO_DENSITIES.map((density) => ({
                value: density.slug,
                label: localName(density),
              }))}
              onChange={(value) => setField("density", value)}
            />
          </div>
        </aside>

        <div className="min-w-0 space-y-5">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">{t("previewTitle")}</h2>
              <span className="text-xs text-muted-foreground">{t("previewLive")}</span>
            </div>
            {/* Intentionally no React key: WorkbenchStage keeps its interaction state while its inline skin variables swap. */}
            <WorkbenchStage entry={entry} activeAnatomy={null} />
          </div>

          <ComponentSample
            config={config}
            skin={entry.skin}
            tokens={tokens}
            copy={sampleCopy}
          />
        </div>
      </div>

      <StudioExportBar
        name={config.name ?? ""}
        bundle={exports}
        onNameChange={(name) => setField("name", name || undefined)}
      />
    </div>
  );
}
