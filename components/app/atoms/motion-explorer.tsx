"use client";

import { RotateCcw } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { AtomCard } from "@/components/app/atoms/atom-card";
import { AtomExportActions } from "@/components/app/atoms/atom-export-actions";
import { CopyValue } from "@/components/app/atoms/copy-value";
import type { Locale } from "@/i18n/routing";
import {
  curveCssValue,
  createMotionExports,
  durationCssValue,
  MOTION_CURVES,
  MOTION_DURATIONS,
  MOTION_SPRINGS,
  springJsValue,
} from "@/lib/atoms";
import type { MotionCurveAtom, MotionSpringAtom } from "@/lib/atoms";

const MOTION_EXPORTS = createMotionExports(
  MOTION_CURVES,
  MOTION_SPRINGS,
  MOTION_DURATIONS,
);

function CurveGraph({ curve }: { curve: MotionCurveAtom["value"] }) {
  const [x1, y1, x2, y2] = curve;
  const left = 8;
  const bottom = 72;
  const size = 64;
  const path = `M ${left} ${bottom} C ${left + x1 * size} ${bottom - y1 * size}, ${left + x2 * size} ${bottom - y2 * size}, ${left + size} ${bottom - size}`;

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 80 80"
      className="h-20 w-20 shrink-0"
    >
      <path d="M 8 8 V 72 H 72" fill="none" stroke="currentColor" opacity="0.16" />
      <path d="M 8 72 L 72 8" fill="none" stroke="currentColor" opacity="0.1" />
      <path
        d={path}
        fill="none"
        stroke="var(--accent)"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
      <circle cx={left} cy={bottom} r="2.5" fill="var(--accent)" />
      <circle cx={left + size} cy={bottom - size} r="2.5" fill="var(--accent)" />
    </svg>
  );
}

function StaticEndpoints() {
  const t = useTranslations("atoms");

  return (
    <div className="relative h-10">
      <span className="sr-only">{t("reducedMotionStatic")}</span>
      <span className="absolute left-0 top-2 h-6 w-6 rounded-lg border border-border bg-card" />
      <span className="absolute right-0 top-2 h-6 w-6 rounded-lg bg-accent" />
    </div>
  );
}

function CurveTrack({ entry, run }: { entry: MotionCurveAtom; run: number }) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return <StaticEndpoints />;

  return (
    <div className="relative h-10 overflow-hidden">
      <span className="absolute inset-x-3 top-5 h-px bg-border" />
      <motion.span
        key={run}
        className="absolute left-1 top-2 h-6 w-6 rounded-lg bg-accent shadow-sm"
        initial={{ x: 0, opacity: 0.55 }}
        animate={{ x: 120, opacity: 1 }}
        transition={{ duration: 0.8, ease: entry.value }}
      />
    </div>
  );
}

function SpringTrack({ entry, run }: { entry: MotionSpringAtom; run: number }) {
  const reducedMotion = useReducedMotion();
  if (reducedMotion) return <StaticEndpoints />;

  return (
    <div className="relative h-12 overflow-hidden">
      <span className="absolute inset-x-3 top-6 h-px bg-border" />
      <motion.span
        key={run}
        className="absolute left-1 top-2 flex h-8 w-10 items-center justify-center rounded-lg border border-(--color-border-strong) bg-card text-[0.55rem] font-semibold uppercase tracking-wider text-foreground shadow-sm"
        initial={{ x: 0, opacity: 0.5, scale: 0.94 }}
        animate={{ x: 112, opacity: 1, scale: 1 }}
        transition={{ type: "spring", ...entry.value }}
      >
        {entry.slug.slice(0, 2)}
      </motion.span>
    </div>
  );
}

export function MotionExplorer() {
  const locale = useLocale() as Locale;
  const t = useTranslations("atoms");
  const [allRun, setAllRun] = useState(0);
  const [individualRuns, setIndividualRuns] = useState<Record<string, number>>({});

  const replay = (slug: string) => {
    setIndividualRuns((runs) => ({ ...runs, [slug]: (runs[slug] ?? 0) + 1 }));
  };
  const runFor = (slug: string) => allRun * 1000 + (individualRuns[slug] ?? 0);

  return (
    <div className="flex flex-col gap-12">
      <section aria-labelledby="motion-comparator-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("comparator")}
            </p>
            <h2 id="motion-comparator-title" className="mt-2 text-2xl font-semibold text-foreground">
              {t("motionComparatorTitle")}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t("motionComparatorHint")}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAllRun((run) => run + 1)}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:border-(--color-border-strong)"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            {t("replayAll")}
          </button>
        </div>

        <div className="mt-6 rounded-3xl border border-border bg-card/20 p-4 sm:p-6">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {t("curves")}
          </p>
          <div className="mt-3 grid gap-3 lg:grid-cols-3">
            {MOTION_CURVES.map((entry) => (
              <button
                key={entry.slug}
                type="button"
                onClick={() => replay(entry.slug)}
                aria-label={t("replayOne", {
                  name: locale === "zh" ? entry.nameZh : entry.name,
                })}
                className="rounded-2xl border border-border bg-background/45 p-4 text-left transition-colors hover:border-(--color-border-strong)"
              >
                <div className="flex items-center gap-3">
                  <CurveGraph curve={entry.value} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {locale === "zh" ? entry.nameZh : entry.name}
                    </p>
                    <code className="mt-1 block truncate text-[0.65rem] text-muted-foreground">
                      {curveCssValue(entry.value)}
                    </code>
                    <div className="mt-2">
                      <CurveTrack entry={entry} run={runFor(entry.slug)} />
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <p className="mt-7 text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {t("springs")}
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {MOTION_SPRINGS.map((entry) => (
              <button
                key={entry.slug}
                type="button"
                onClick={() => replay(entry.slug)}
                aria-label={t("replayOne", {
                  name: locale === "zh" ? entry.nameZh : entry.name,
                })}
                className="rounded-2xl border border-border bg-background/45 p-4 text-left transition-colors hover:border-(--color-border-strong)"
              >
                <p className="text-sm font-semibold text-foreground">
                  {locale === "zh" ? entry.nameZh : entry.name}
                </p>
                <p className="mt-1 text-[0.65rem] text-muted-foreground">
                  k {entry.value.stiffness} · d {entry.value.damping} · m {entry.value.mass}
                </p>
                <div className="mt-2">
                  <SpringTrack entry={entry} run={runFor(entry.slug)} />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="motion-values-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("entryList")}
            </p>
            <h2 id="motion-values-title" className="mt-2 text-2xl font-semibold text-foreground">
              {t("motionValuesTitle")}
            </h2>
          </div>
          <AtomExportActions bundle={MOTION_EXPORTS} category="motion" />
        </div>

        <h3 className="mt-6 text-sm font-semibold text-foreground">{t("curves")}</h3>
        <div className="mt-3 grid gap-4 lg:grid-cols-3">
          {MOTION_CURVES.map((entry) => (
            <AtomCard
              key={entry.slug}
              id={entry.slug}
              {...entry}
              sample={
                <div className="flex items-center justify-center">
                  <CurveGraph curve={entry.value} />
                </div>
              }
              value={
                <CopyValue
                  value={curveCssValue(entry.value)}
                  label={`motion-curve-${entry.slug}`}
                />
              }
            />
          ))}
        </div>

        <h3 className="mt-8 text-sm font-semibold text-foreground">{t("springs")}</h3>
        <div className="mt-3 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {MOTION_SPRINGS.map((entry) => (
            <AtomCard
              key={entry.slug}
              id={entry.slug}
              {...entry}
              sample={<SpringTrack entry={entry} run={runFor(entry.slug)} />}
              value={
                <CopyValue
                  value={springJsValue(entry.value)}
                  label={`motion-spring-${entry.slug}`}
                />
              }
            />
          ))}
        </div>

        <h3 className="mt-8 text-sm font-semibold text-foreground">{t("durations")}</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {MOTION_DURATIONS.map((entry) => (
            <AtomCard
              key={entry.slug}
              id={entry.slug}
              {...entry}
              sample={
                <div className="flex h-16 items-center">
                  <span
                    className="block h-2 rounded-full bg-accent"
                    style={{ width: `${Math.max(18, entry.milliseconds / 3)}px` }}
                  />
                </div>
              }
              value={
                <CopyValue
                  value={durationCssValue(entry.milliseconds)}
                  label={`motion-duration-${entry.slug}`}
                />
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
