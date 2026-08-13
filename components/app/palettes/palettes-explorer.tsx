"use client";

import {
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  Pause,
  Play,
  SlidersHorizontal,
  WandSparkles,
  XCircle,
} from "lucide-react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { StyleDemo } from "@/components/app/styles/style-demo";
import { ShaderBackground } from "@/components/motion/shader-background";
import type { Locale } from "@/i18n/routing";
import { EASE_OUT, SPRING_LAYOUT, SPRING_PRESS, SPRING_SWAP } from "@/lib/ease";
import { useHoverCapable } from "@/lib/hooks/use-hover-capable";
import { localizedDescription, localizedName } from "@/lib/i18n-content";
import type { PaletteEntry } from "@/lib/palettes";
import {
  formatColor,
  formatGeneratedPaletteCss,
  type GeneratedPalette,
  type GeneratorParams,
  generatePalette,
  generatorParamsToSearch,
  PALETTES,
  type PaletteColors,
  type PaletteContrastPairId,
  type PaletteContrastResult,
  paletteContrastReport,
  paletteToCss,
  paletteToSkin,
  parseGeneratorParams,
  RAMP_STEPS,
} from "@/lib/palettes";
import { cn } from "@/lib/utils";

type WorkspaceMode = "browse" | "contrast" | "export" | "generate";
type MobileSurface = "preview" | "details";
type PaletteSource = "preset" | "generated";

const ROLE_LABEL_KEYS: Record<keyof PaletteColors, string> = {
  bg: "roleBg",
  surface: "roleSurface",
  border: "roleBorder",
  text: "roleText",
  muted: "roleMuted",
  primary: "rolePrimary",
  primaryFg: "rolePrimaryFg",
  accent: "roleAccent",
};

const ROLE_ORDER = Object.keys(ROLE_LABEL_KEYS) as (keyof PaletteColors)[];

const CONTRAST_PAIR_LABEL_KEYS: Record<PaletteContrastPairId, string> = {
  "text-on-background": "contrastTextOnBackground",
  "muted-on-background": "contrastMutedOnBackground",
  "text-on-surface": "contrastTextOnSurface",
  "primary-foreground-on-primary": "contrastTextOnPrimary",
};

const GENERATOR_SCHEMES = [
  "complementary",
  "analogous",
  "triadic",
  "split",
  "monochromatic",
] as const;

function GeneratorInspector({
  generated,
  onChange,
  className,
}: {
  generated: GeneratedPalette;
  onChange: (params: GeneratorParams) => void;
  className?: string;
}) {
  const t = useTranslations("palettes");
  const locale = useLocale() as Locale;
  const [baseDraft, setBaseDraft] = useState(generated.params.base);
  const css = formatGeneratedPaletteCss(generated);

  useEffect(() => setBaseDraft(generated.params.base), [generated.params.base]);

  const update = <Key extends keyof GeneratorParams>(
    key: Key,
    value: GeneratorParams[Key],
  ) => onChange({ ...generated.params, [key]: value });

  const commitBase = () => {
    const normalized = /^#?[0-9a-fA-F]{6}$/.test(baseDraft)
      ? `#${baseDraft.replace(/^#/, "").toUpperCase()}`
      : generated.params.base;
    setBaseDraft(normalized);
    update("base", normalized);
  };

  return (
    <aside
      className={cn(
        "flex flex-col overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#172235]/[0.94] text-white shadow-[0_32px_90px_rgb(12_22_38/0.38)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="border-b border-white/10 p-5 sm:p-6">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white/42">
          {t("generatorEyebrow")}
        </p>
        <div className="mt-2 flex items-center gap-2">
          <WandSparkles aria-hidden="true" className="size-5 text-blue-300" />
          <h2 className="text-lg font-semibold">{t("generatorTitle")}</h2>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-white/50">
          {t("generatorDescription")}
        </p>
      </div>

      <div className="grid gap-5 p-5 sm:p-6">
        <label className="block">
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white/45">
            {t("generatorBase")}
          </span>
          <div className="mt-2 flex gap-2">
            <input
              type="color"
              value={generated.params.base}
              onChange={(event) => update("base", event.target.value.toUpperCase())}
              aria-label={t("generatorBasePicker")}
              className="size-10 shrink-0 cursor-pointer rounded-lg border border-white/12 bg-white/[0.055] p-1"
            />
            <input
              value={baseDraft}
              onChange={(event) => setBaseDraft(event.target.value)}
              onBlur={commitBase}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
              }}
              aria-label={t("generatorBaseHex")}
              className="h-10 min-w-0 flex-1 rounded-lg border border-white/12 bg-white/[0.055] px-3 font-mono text-sm uppercase text-white outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            />
          </div>
        </label>

        <label className="block">
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white/45">
            {t("generatorScheme")}
          </span>
          <select
            value={generated.params.scheme}
            onChange={(event) =>
              update("scheme", event.target.value as GeneratorParams["scheme"])
            }
            className="mt-2 h-10 w-full rounded-lg border border-white/12 bg-white/[0.055] px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            {GENERATOR_SCHEMES.map((scheme) => (
              <option key={scheme} value={scheme} className="bg-slate-900">
                {t(`scheme${scheme[0]?.toUpperCase()}${scheme.slice(1)}`)}
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label>
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white/45">
              {t("generatorScope")}
            </span>
            <select
              value={generated.params.scope}
              onChange={(event) =>
                update("scope", event.target.value as GeneratorParams["scope"])
              }
              className="mt-2 h-10 w-full rounded-lg border border-white/12 bg-white/[0.055] px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <option value="basic" className="bg-slate-900">
                {t("scopeBasic")}
              </option>
              <option value="full" className="bg-slate-900">
                {t("scopeFull")}
              </option>
            </select>
          </label>
          <label>
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white/45">
              {t("generatorContrast")}
            </span>
            <select
              value={generated.params.contrast}
              onChange={(event) =>
                update("contrast", event.target.value as GeneratorParams["contrast"])
              }
              className="mt-2 h-10 w-full rounded-lg border border-white/12 bg-white/[0.055] px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <option value="AA" className="bg-slate-900">
                AA · 4.5:1
              </option>
              <option value="AAA" className="bg-slate-900">
                AAA · 7:1
              </option>
            </select>
          </label>
        </div>

        <fieldset>
          <legend className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white/45">
            {t("generatorFormat")}
          </legend>
          <div className="mt-2 grid grid-cols-4 rounded-lg border border-white/10 bg-white/[0.04] p-0.5">
            {(["hex", "rgb", "hsl", "oklch"] as const).map((format) => (
              <button
                key={format}
                type="button"
                onClick={() => update("format", format)}
                aria-pressed={generated.params.format === format}
                className={cn(
                  "rounded-md px-2 py-2 text-[0.65rem] uppercase transition-colors",
                  generated.params.format === format
                    ? "bg-white/12 text-white"
                    : "text-white/45 hover:text-white/75",
                )}
              >
                {format}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="border-t border-white/10 p-5 sm:p-6">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white/42">
          {t("generatorRamps")}
        </p>
        {generated.params.scope === "full" ? (
        <div className="mt-3 space-y-3">
          {(["primary", "accent", "accent2", "neutral"] as const).map((name) => (
            <div key={name}>
              <div className="mb-1 flex justify-between text-[0.6rem] text-white/38">
                <span>{t(`ramp${name[0]?.toUpperCase()}${name.slice(1)}`)}</span>
                <span>{RAMP_STEPS.length}</span>
              </div>
              <div className="flex overflow-hidden rounded-md border border-white/10">
                {RAMP_STEPS.map((step) => (
                  <span
                    key={step}
                    title={`${name}-${step}: ${formatColor(generated.ramps[name][step], generated.params.format)}`}
                    className="h-6 flex-1"
                    style={{ background: generated.ramps[name][step] }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        ) : (
          <div className="mt-3 grid grid-cols-4 gap-2">
            {ROLE_ORDER.map((role) => (
              <div key={role} className="min-w-0">
                <span
                  className="block aspect-square rounded-lg border border-white/10"
                  style={{ background: generated.entry.colors[role] }}
                />
                <span className="mt-1 block truncate text-[0.58rem] text-white/42">
                  {t(ROLE_LABEL_KEYS[role])}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-auto grid grid-cols-2 gap-2 p-5 pt-0 sm:p-6 sm:pt-0">
        <CopyAction
          value={locale === "zh" ? generated.entry.promptZh : generated.entry.promptEn}
          label={t("copyPrompt")}
        />
        <CopyAction value={css} label={t("copyCss")} />
      </div>
    </aside>
  );
}

function presenceMotion(shouldReduceMotion: boolean | null) {
  return {
    initial: {
      opacity: 0,
      transform: shouldReduceMotion ? "translateY(0px)" : "translateY(6px)",
    },
    animate: {
      opacity: 1,
      transform: "translateY(0px)",
      transition: { duration: 0.18, ease: EASE_OUT },
    },
    exit: {
      opacity: 0,
      transform: shouldReduceMotion ? "translateY(0px)" : "translateY(-3px)",
      transition: { duration: 0.12, ease: EASE_OUT },
    },
  };
}

function PaletteSettle({
  slug,
  children,
  className,
}: {
  slug: string;
  children: ReactNode;
  className?: string;
}) {
  const previousSlug = useRef(slug);
  const paletteChanged = previousSlug.current !== slug;

  useEffect(() => {
    previousSlug.current = slug;
  }, [slug]);

  return (
    <motion.div
      key={slug}
      data-palette-settle={slug}
      className={className}
      initial={paletteChanged ? { opacity: 0.82 } : false}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.22, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}

function CopyAction({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const t = useTranslations("palettes");
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const feedbackTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (feedbackTimer.current !== null) {
        window.clearTimeout(feedbackTimer.current);
      }
    },
    [],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }

    if (feedbackTimer.current !== null) {
      window.clearTimeout(feedbackTimer.current);
    }
    setCopied(true);
    feedbackTimer.current = window.setTimeout(() => {
      setCopied(false);
      feedbackTimer.current = null;
    }, 1400);
  };

  return (
    <motion.button
      type="button"
      onClick={copy}
      whileTap={{
        transform: shouldReduceMotion ? "scale(1)" : "scale(0.97)",
      }}
      transition={shouldReduceMotion ? { duration: 0 } : SPRING_PRESS}
      className={cn(
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-white/12 bg-white/[0.055] px-3 text-xs font-medium text-white/78 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
        className,
      )}
    >
      <span className="sr-only" aria-live="polite">
        {copied ? t("copied") : ""}
      </span>
      <AnimatePresence initial={false} mode="wait">
        <motion.span
          key={copied ? "copied" : "copy"}
          className="inline-flex items-center gap-2"
          initial={{
            opacity: 0,
            transform: shouldReduceMotion ? "translateY(0px)" : "translateY(4px)",
          }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          exit={{
            opacity: 0,
            transform: shouldReduceMotion ? "translateY(0px)" : "translateY(-3px)",
          }}
          transition={
            shouldReduceMotion ? { duration: 0.14, ease: EASE_OUT } : SPRING_SWAP
          }
        >
          {copied ? (
            <Check aria-hidden="true" className="size-3.5 text-emerald-300" />
          ) : (
            <Copy aria-hidden="true" className="size-3.5" />
          )}
          {copied ? t("copied") : label}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

function StatusMark({
  passes,
  label,
  className,
}: {
  passes: boolean;
  label: string;
  className?: string;
}) {
  const t = useTranslations("palettes");
  const Icon = passes ? CheckCircle2 : XCircle;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[0.68rem]",
        passes ? "text-emerald-300" : "text-rose-300",
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="text-white/55">{label}</span>
      <span>{passes ? t("passes") : t("fails")}</span>
    </span>
  );
}

function ContrastCanvas({
  result,
  className,
}: {
  result: PaletteContrastResult;
  className?: string;
}) {
  const t = useTranslations("palettes");

  return (
    <div
      className={cn(
        "grid min-h-[34rem] overflow-hidden rounded-[1.6rem] border border-white/35 shadow-[0_28px_80px_rgb(20_35_55/0.2)] sm:grid-cols-2",
        className,
      )}
    >
      {[
        { label: t("foreground"), color: result.foreground, text: result.background },
        { label: t("background"), color: result.background, text: result.foreground },
      ].map((side) => (
        <div
          key={side.label}
          className="flex min-h-64 flex-col justify-between p-7 sm:p-10"
          style={{ background: side.color, color: side.text }}
        >
          <span className="text-xs font-medium uppercase tracking-[0.18em] opacity-65">
            {side.label}
          </span>
          <div>
            <p className="font-mono text-2xl font-semibold sm:text-3xl">{side.color}</p>
            <p className="mt-3 max-w-xs text-sm leading-relaxed opacity-70">
              {t("contrastSample")}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function PairSelector({
  results,
  value,
  onChange,
  className,
}: {
  results: PaletteContrastResult[];
  value: PaletteContrastPairId;
  onChange: (value: PaletteContrastPairId) => void;
  className?: string;
}) {
  const t = useTranslations("palettes");

  return (
    <label className={cn("block", className)}>
      <span className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-white/45">
        {t("contrastPair")}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as PaletteContrastPairId)}
        className="mt-2 h-10 w-full rounded-lg border border-white/12 bg-white/[0.055] px-3 text-sm text-white outline-none focus-visible:ring-2 focus-visible:ring-white/70"
      >
        {results.map((result) => (
          <option key={result.id} value={result.id} className="bg-slate-900">
            {t(CONTRAST_PAIR_LABEL_KEYS[result.id])}
          </option>
        ))}
      </select>
    </label>
  );
}

function PaletteInspector({
  active,
  mode,
  results,
  selectedPair,
  onPairChange,
  promptLang,
  onPromptLangChange,
  cssOverride,
  className,
}: {
  active: PaletteEntry;
  mode: WorkspaceMode;
  results: PaletteContrastResult[];
  selectedPair: PaletteContrastPairId;
  onPairChange: (value: PaletteContrastPairId) => void;
  promptLang: "zh" | "en";
  onPromptLangChange: (value: "zh" | "en") => void;
  cssOverride?: string;
  className?: string;
}) {
  const t = useTranslations("palettes");
  const locale = useLocale() as Locale;
  const shouldReduceMotion = useReducedMotion();
  const canHover = useHoverCapable();
  const [copiedRole, setCopiedRole] = useState<keyof PaletteColors | null>(null);
  const roleFeedbackTimer = useRef<number | null>(null);
  const selected = results.find((result) => result.id === selectedPair) ?? results[0];
  const prompt = promptLang === "zh" ? active.promptZh : active.promptEn;
  const css = cssOverride ?? paletteToCss(active);

  useEffect(
    () => () => {
      if (roleFeedbackTimer.current !== null) {
        window.clearTimeout(roleFeedbackTimer.current);
      }
    },
    [],
  );

  const copyRole = async (role: keyof PaletteColors) => {
    try {
      await navigator.clipboard.writeText(active.colors[role]);
    } catch {
      return;
    }
    if (roleFeedbackTimer.current !== null) {
      window.clearTimeout(roleFeedbackTimer.current);
    }
    setCopiedRole(role);
    roleFeedbackTimer.current = window.setTimeout(() => {
      setCopiedRole(null);
      roleFeedbackTimer.current = null;
    }, 1400);
  };

  if (!selected) return null;

  return (
    <aside
      className={cn(
        "flex flex-col overflow-hidden rounded-[1.6rem] border border-white/10 bg-[#172235]/[0.94] text-white shadow-[0_32px_90px_rgb(12_22_38/0.38)] backdrop-blur-xl",
        className,
      )}
    >
      <div className="border-b border-white/10 p-5 sm:p-6">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white/42">
          {t("activePalette")}
        </p>
        <div className="mt-2 flex items-baseline gap-2">
          <h2 className="text-lg font-semibold">{localizedName(active, locale)}</h2>
          <span className="text-xs text-white/42">
            {locale === "zh" ? active.name : active.nameZh}
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-white/50">
          {localizedDescription(active, locale)}
        </p>
      </div>

      <div className="border-b border-white/10 p-5 sm:p-6">
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8 lg:grid-cols-4 xl:grid-cols-8">
          {ROLE_ORDER.map((role) => (
            <button
              key={role}
              type="button"
              onClick={() => copyRole(role)}
              className="group min-w-0 text-left focus-visible:outline-none"
              aria-label={`${t(ROLE_LABEL_KEYS[role])} ${active.colors[role]}`}
            >
              <motion.span
                aria-hidden="true"
                className="block aspect-square rounded-lg border border-white/15 shadow-inner group-focus-visible:ring-2 group-focus-visible:ring-white"
                whileHover={
                  canHover && !shouldReduceMotion
                    ? { transform: "scale(1.04)" }
                    : undefined
                }
                transition={{ duration: 0.15, ease: EASE_OUT }}
                style={{ background: active.colors[role] }}
              />
              <span className="mt-1.5 block truncate text-[0.62rem] text-white/55">
                {t(ROLE_LABEL_KEYS[role])}
              </span>
              <span
                aria-live="polite"
                className={cn(
                  "block truncate font-mono text-[0.55rem] uppercase transition-colors",
                  copiedRole === role ? "text-emerald-300" : "text-white/28",
                )}
              >
                {copiedRole === role ? t("copied") : active.colors[role]}
              </span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence initial={false} mode="wait">
        {mode === "export" ? (
          <motion.div
            key="export"
            className="flex flex-1 flex-col gap-5 p-5 sm:p-6"
            {...presenceMotion(shouldReduceMotion)}
          >
          <div className="flex items-center justify-between gap-3">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white/42">
              {t("exportTitle")}
            </p>
            <div className="flex rounded-lg border border-white/10 bg-white/[0.04] p-0.5">
              {(["zh", "en"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => onPromptLangChange(lang)}
                  aria-pressed={promptLang === lang}
                  className={cn(
                    "rounded-md px-2 py-1 text-[0.65rem] transition-colors",
                    promptLang === lang ? "bg-white/12 text-white" : "text-white/45",
                  )}
                >
                  {lang === "zh" ? t("langZh") : t("langEn")}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-black/15 p-4">
            <p className="line-clamp-6 text-xs leading-relaxed text-white/58">{prompt}</p>
            <CopyAction value={prompt} label={t("copyPrompt")} className="mt-4 w-full" />
          </div>
          <div className="rounded-xl border border-white/10 bg-black/15 p-4">
            <pre className="max-h-48 overflow-auto whitespace-pre-wrap font-mono text-[0.65rem] leading-relaxed text-white/45">
              {css}
            </pre>
            <CopyAction value={css} label={t("copyCss")} className="mt-4 w-full" />
          </div>
          </motion.div>
        ) : (
          <motion.div
            key={mode}
            className="flex flex-1 flex-col p-5 sm:p-6"
            {...presenceMotion(shouldReduceMotion)}
          >
          <PairSelector results={results} value={selectedPair} onChange={onPairChange} />

          <div className="mt-4 grid grid-cols-[1fr_auto] items-end gap-4 rounded-xl border border-white/10 bg-black/15 p-4">
            <div>
              <p className="font-mono text-3xl font-semibold tracking-tight sm:text-4xl">
                {selected.ratio.toFixed(2)}:1
              </p>
              <p className="mt-1 text-xs text-white/38">{t("contrastRatio")}</p>
            </div>
            <div className="flex -space-x-1" aria-hidden="true">
              <span
                className="size-8 rounded-full border-2 border-[#172235]"
                style={{ background: selected.foreground }}
              />
              <span
                className="size-8 rounded-full border-2 border-[#172235]"
                style={{ background: selected.background }}
              />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <StatusMark passes={selected.aaNormal} label={t("aaNormal")} />
            <StatusMark passes={selected.aaLarge} label={t("aaLarge")} />
            <StatusMark passes={selected.aaaNormal} label={t("aaaNormal")} />
            <StatusMark passes={selected.aaaLarge} label={t("aaaLarge")} />
          </div>

          <div className="mt-6 border-t border-white/10 pt-5">
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-white/42">
              {t("allContrastPairs")}
            </p>
            <div className="mt-2 divide-y divide-white/8">
              {results.map((result) => (
                <button
                  key={result.id}
                  type="button"
                  onClick={() => onPairChange(result.id)}
                  className={cn(
                    "grid w-full grid-cols-[1fr_auto_auto] items-center gap-3 py-2.5 text-left text-xs transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/60",
                    result.id === selectedPair ? "text-white" : "text-white/52",
                  )}
                >
                  <span className="truncate">{t(CONTRAST_PAIR_LABEL_KEYS[result.id])}</span>
                  <span className="font-mono tabular-nums">{result.ratio.toFixed(2)}:1</span>
                  {result.aaNormal ? (
                    <CheckCircle2 aria-label={t("passes")} className="size-3.5 text-emerald-300" />
                  ) : (
                    <XCircle aria-label={t("fails")} className="size-3.5 text-rose-300" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-2 pt-6">
            <CopyAction value={prompt} label={t("copyPrompt")} />
            <CopyAction value={css} label={t("copyCss")} />
          </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
}

export function PalettesExplorer({ className }: { className?: string }) {
  const t = useTranslations("palettes");
  const locale = useLocale() as Locale;
  const shouldReduceMotion = useReducedMotion();
  const searchParams = useSearchParams();
  const initialGeneratorParams = parseGeneratorParams(
    new URLSearchParams(searchParams.toString()),
  );
  const paramSlug = searchParams.get("palette");
  const initialSlug =
    (paramSlug && PALETTES.some((palette) => palette.slug === paramSlug)
      ? paramSlug
      : undefined) ??
    PALETTES.find((palette) => palette.slug === "business")?.slug ??
    PALETTES[0]?.slug;
  const [slug, setSlug] = useState(initialSlug);
  const [mode, setMode] = useState<WorkspaceMode>(
    searchParams.has("b") ? "generate" : "browse",
  );
  const [source, setSource] = useState<PaletteSource>(
    searchParams.has("b") ? "generated" : "preset",
  );
  const [generatorParams, setGeneratorParams] = useState(initialGeneratorParams);
  const [mobileSurface, setMobileSurface] = useState<MobileSurface>(
    searchParams.has("b") ? "details" : "preview",
  );
  const [selectedPair, setSelectedPair] = useState<PaletteContrastPairId>(
    "muted-on-background",
  );
  const [promptLang, setPromptLang] = useState<"zh" | "en">(
    locale === "zh" ? "zh" : "en",
  );
  const [isCycling, setIsCycling] = useState(false);
  const [staticBackground, setStaticBackground] = useState(false);

  useEffect(() => {
    if (paramSlug && PALETTES.some((palette) => palette.slug === paramSlug)) {
      setSlug(paramSlug);
    }
  }, [paramSlug]);

  useEffect(() => {
    const syncFromHistory = () => {
      const nextSearch = new URLSearchParams(window.location.search);
      if (nextSearch.has("b")) {
        setGeneratorParams(parseGeneratorParams(nextSearch));
        setSource("generated");
        setMode("generate");
        setMobileSurface("details");
        return;
      }
      const nextSlug = nextSearch.get("palette");
      if (nextSlug && PALETTES.some((palette) => palette.slug === nextSlug)) {
        setSlug(nextSlug);
      }
      setSource("preset");
      setMode("browse");
      setMobileSurface("preview");
    };
    window.addEventListener("popstate", syncFromHistory);
    return () => window.removeEventListener("popstate", syncFromHistory);
  }, []);

  useEffect(() => {
    if (!isCycling) return;
    const timer = window.setInterval(() => {
      setSlug((current) => {
        const index = PALETTES.findIndex((palette) => palette.slug === current);
        return PALETTES[(index + 1) % PALETTES.length]?.slug ?? current;
      });
    }, 2600);
    return () => window.clearInterval(timer);
  }, [isCycling]);

  const generated = generatePalette(generatorParams);
  const preset = PALETTES.find((palette) => palette.slug === slug) ?? PALETTES[0];
  if (!preset) return null;
  const isGenerated = source === "generated";
  const active = isGenerated ? generated.entry : preset;

  const activeIndex = PALETTES.findIndex((palette) => palette.slug === preset.slug);
  const contrastResults = paletteContrastReport(active);
  const activeContrast =
    contrastResults.find((result) => result.id === selectedPair) ?? contrastResults[0];

  const selectPalette = (nextSlug: string) => {
    setSlug(nextSlug);
    setIsCycling(false);
    window.history.replaceState(null, "", `?palette=${nextSlug}`);
  };

  const stepPalette = (direction: -1 | 1) => {
    const next = (activeIndex + direction + PALETTES.length) % PALETTES.length;
    const nextPalette = PALETTES[next];
    if (nextPalette) selectPalette(nextPalette.slug);
  };

  const selectMode = (nextMode: WorkspaceMode) => {
    setMode(nextMode);
    setIsCycling(false);
    setMobileSurface(nextMode === "export" || nextMode === "generate" ? "details" : "preview");
    if (nextMode === "generate") {
      setSource("generated");
      window.history.pushState(null, "", `?${generatorParamsToSearch(generatorParams)}`);
    } else if (nextMode === "browse") {
      setSource("preset");
      window.history.pushState(null, "", `?palette=${preset.slug}`);
    } else if (source === "generated") {
      window.history.replaceState(null, "", `?${generatorParamsToSearch(generatorParams)}`);
    }
  };

  const updateGenerator = (next: GeneratorParams) => {
    setSource("generated");
    setGeneratorParams(next);
    window.history.replaceState(null, "", `?${generatorParamsToSearch(next)}`);
  };

  return (
    <div className={cn("relative overflow-clip bg-[#dbe6f2]", className)}>
      <div className="pointer-events-none absolute inset-0">
        <ShaderBackground
          variant="mesh-gradient"
          colors={[
            active.colors.bg,
            active.colors.surface,
            active.colors.border,
            active.colors.primary,
            active.colors.accent,
          ]}
          distortion={0.38}
          swirl={0.22}
          grainMixer={0.12}
          grainOverlay={0.08}
          speed={staticBackground ? 0 : 0.12}
        />
        <div className="absolute inset-0 bg-white/55" />
      </div>

      <div className="relative mx-auto min-h-screen max-w-[100rem] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <header className="flex flex-col items-stretch gap-4 border-b border-slate-900/10 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <LayoutGroup id="palette-workspace-modes">
            <nav aria-label={t("workspaceModes")} className="flex items-center gap-1">
              {(["browse", "contrast", "export", "generate"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => selectMode(item)}
                  aria-pressed={mode === item}
                  className={cn(
                    "relative min-h-9 px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900",
                    mode === item
                      ? "text-slate-950"
                      : "text-slate-700/65 hover:text-slate-950",
                  )}
                >
                  {t(`mode${item[0]?.toUpperCase()}${item.slice(1)}`)}
                  {mode === item && (
                    <motion.span
                      layoutId="active-mode"
                      data-active-mode-indicator={item}
                      aria-hidden="true"
                      className="absolute inset-x-2 -bottom-4 h-0.5 bg-blue-600"
                      transition={shouldReduceMotion ? { duration: 0 } : SPRING_LAYOUT}
                    />
                  )}
                </button>
              ))}
            </nav>
          </LayoutGroup>

          <div className="flex flex-wrap items-center justify-start gap-2 sm:justify-end">
            {!isGenerated && (
            <motion.button
              type="button"
              onClick={() => setIsCycling((value) => !value)}
              aria-pressed={isCycling}
              whileTap={{
                transform: shouldReduceMotion ? "scale(1)" : "scale(0.97)",
              }}
              transition={{ duration: shouldReduceMotion ? 0 : 0.15, ease: EASE_OUT }}
              className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-slate-900/10 bg-white/45 px-3 text-xs font-medium text-slate-800 backdrop-blur hover:bg-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
            >
              {isCycling ? <Pause aria-hidden="true" className="size-3.5" /> : <Play aria-hidden="true" className="size-3.5" />}
              {isCycling ? t("stopCycle") : t("cyclePalettes")}
            </motion.button>
            )}
            <span className="font-mono text-xs text-slate-700/55">
              {isGenerated
                ? `${generatorParams.contrast} · ${generatorParams.format.toUpperCase()}`
                : `${String(activeIndex + 1).padStart(2, "0")} / ${PALETTES.length}`}
            </span>
            <label className="inline-flex min-h-9 cursor-pointer items-center gap-2 rounded-lg border border-slate-900/10 bg-white/45 px-3 text-xs text-slate-700 backdrop-blur">
              <span>{t("staticBackground")}</span>
              <input
                type="checkbox"
                checked={staticBackground}
                onChange={(event) => setStaticBackground(event.target.checked)}
                className="size-4 accent-blue-600"
              />
            </label>
          </div>
        </header>

        <div className="mt-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            {isGenerated ? (
              <div className="inline-flex items-center gap-2 rounded-lg border border-slate-900/10 bg-white/45 px-3 py-2 text-sm font-medium text-slate-900 backdrop-blur">
                <span
                  aria-hidden="true"
                  className="size-4 rounded-full border border-slate-900/10"
                  style={{ background: generatorParams.base }}
                />
                {t("generatedPalette")} · {generatorParams.base}
              </div>
            ) : (
            <div className="flex w-full min-w-0 items-center gap-2 sm:w-auto sm:flex-initial">
                <motion.button
                  type="button"
                  onClick={() => stepPalette(-1)}
                  aria-label={t("previousPalette")}
                  whileTap={{
                    transform: shouldReduceMotion ? "scale(1)" : "scale(0.97)",
                  }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.15, ease: EASE_OUT }}
                  className="grid size-9 place-items-center rounded-lg border border-slate-900/10 bg-white/45 text-slate-800 backdrop-blur hover:bg-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                  <ChevronLeft aria-hidden="true" className="size-4" />
                </motion.button>
                <select
                  value={active.slug}
                  onChange={(event) => selectPalette(event.target.value)}
                  aria-label={t("activePalette")}
                  className="h-9 min-w-0 max-w-[18rem] flex-1 rounded-lg border border-slate-900/10 bg-white/45 px-3 text-sm font-medium text-slate-900 outline-none backdrop-blur focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                  {PALETTES.map((palette, index) => (
                    <option key={palette.slug} value={palette.slug}>
                      {String(index + 1).padStart(2, "0")} {localizedName(palette, locale)} / {locale === "zh" ? palette.name : palette.nameZh}
                    </option>
                  ))}
                </select>
                <motion.button
                  type="button"
                  onClick={() => stepPalette(1)}
                  aria-label={t("nextPalette")}
                  whileTap={{
                    transform: shouldReduceMotion ? "scale(1)" : "scale(0.97)",
                  }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.15, ease: EASE_OUT }}
                  className="grid size-9 place-items-center rounded-lg border border-slate-900/10 bg-white/45 text-slate-800 backdrop-blur hover:bg-white/65 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900"
                >
                  <ChevronRight aria-hidden="true" className="size-4" />
                </motion.button>
            </div>
            )}
            <p className="w-full max-w-md text-left text-xs leading-relaxed text-slate-700/60 sm:w-auto sm:text-right">
              {locale === "zh" ? active.bestForZh : active.bestFor}
            </p>
          </div>

          <LayoutGroup id="palette-mobile-surface">
            <fieldset
              className="sticky top-3 z-20 mb-4 grid grid-cols-2 rounded-xl border border-slate-900/10 bg-white/72 p-1 shadow-[0_10px_30px_rgb(30_60_95/0.14)] backdrop-blur-xl lg:hidden"
            >
              <legend className="sr-only">{t("mobileViewSwitcher")}</legend>
              {(["preview", "details"] as const).map((surface) => {
                const Icon = surface === "preview" ? Eye : SlidersHorizontal;
                const selected = mobileSurface === surface;
                return (
                  <button
                    key={surface}
                    type="button"
                    onClick={() => setMobileSurface(surface)}
                    aria-pressed={selected}
                    className={cn(
                      "relative isolate inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900",
                      selected ? "text-slate-950" : "text-slate-600",
                    )}
                  >
                    {selected && (
                      <motion.span
                        layoutId="active-mobile-surface"
                        aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-lg bg-white shadow-sm"
                        transition={shouldReduceMotion ? { duration: 0 } : SPRING_LAYOUT}
                      />
                    )}
                    <Icon aria-hidden="true" className="size-4" />
                    {surface === "preview" ? t("mobilePreview") : t("mobileDetails")}
                  </button>
                );
              })}
            </fieldset>
          </LayoutGroup>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_26rem] xl:grid-cols-[minmax(0,1fr)_29rem]">
            <section
              aria-label={t("mobilePreview")}
              className={cn("min-w-0", mobileSurface === "details" && "max-lg:hidden")}
            >

            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={mode === "contrast" ? "contrast" : "preview"}
                data-workspace-view={mode === "contrast" ? "contrast" : "preview"}
                {...presenceMotion(shouldReduceMotion)}
              >
                <PaletteSettle
                  slug={
                    isGenerated
                      ? generatorParamsToSearch(generatorParams).toString()
                      : active.slug
                  }
                >
                  {mode === "contrast" && activeContrast ? (
                    <ContrastCanvas result={activeContrast} />
                  ) : (
                    <StyleDemo
                      skin={paletteToSkin(active)}
                      heroVisual={
                        <Image
                          src="/palettes/interface-layers.png"
                          alt=""
                          width={724}
                          height={543}
                          className="relative w-full max-w-md object-contain opacity-80 mix-blend-multiply"
                          style={{
                            filter:
                              "drop-shadow(0 20px 32px color-mix(in srgb, var(--st-accent) 22%, transparent))",
                          }}
                        />
                      }
                      className="min-h-[30rem] border-white/55 shadow-[0_28px_80px_rgb(20_35_55/0.2)] sm:min-h-[42rem] max-sm:[&>div:last-child]:gap-5 max-sm:[&>div:last-child]:p-5"
                    />
                  )}
                </PaletteSettle>
              </motion.div>
            </AnimatePresence>
          </section>

          {mode === "generate" ? (
            <GeneratorInspector
              generated={generated}
              onChange={updateGenerator}
              className={cn(
                "lg:min-h-[42rem]",
                mobileSurface === "preview" && "max-lg:hidden",
              )}
            />
          ) : (
          <PaletteInspector
            active={active}
            mode={mode}
            results={contrastResults}
            selectedPair={selectedPair}
            onPairChange={setSelectedPair}
            promptLang={promptLang}
            onPromptLangChange={setPromptLang}
            cssOverride={
              isGenerated ? formatGeneratedPaletteCss(generated) : undefined
            }
            className={cn(
              "lg:min-h-[42rem]",
              mobileSurface === "preview" && "max-lg:hidden",
            )}
          />
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
