"use client";

// PROTOTYPE — See a noun, replay a motion, twist one token step, copy the
// same source. Delete after the presentation question is settled.

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { CopyValue, useCopyFeedback } from "@/components/app/atoms/copy-value";
import { BouncyAccordion } from "@/components/motion/bouncy-accordion";
import { Button } from "@/components/motion/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/motion/tabs";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import {
  RADII,
  SHADOWS,
  springJsValue,
} from "@/lib/atoms";
import { SPRING_PRESS } from "@/lib/ease";
import { useResolvedDark } from "@/lib/hooks/use-resolved-dark";
import { localizedName } from "@/lib/i18n-content";
import { REGISTRY_NAMESPACE } from "@/lib/site";
import { cn } from "@/lib/utils";

type View = "home" | "noun" | "use" | "bench";

const VIEWS: readonly View[] = ["home", "noun", "use", "bench"];

const ACCENT_STEPS = [
  {
    slug: "graphite",
    name: "Graphite",
    nameZh: "石墨",
    aliases: ["primary", "主色"],
    swatch: "var(--primary)",
    onSwatch: "var(--primary-foreground)",
  },
  {
    slug: "cyan",
    name: "Cyan",
    nameZh: "青",
    aliases: ["accent", "点缀"],
    swatch: "oklch(72% 0.18 195)",
    onSwatch: "oklch(22% 0.04 195)",
  },
  {
    slug: "violet",
    name: "Violet",
    nameZh: "紫",
    aliases: ["secondary accent", "第二点缀"],
    swatch: "oklch(68% 0.22 295)",
    onSwatch: "#ffffff",
  },
  {
    slug: "terracotta",
    name: "Terracotta",
    nameZh: "陶土",
    aliases: ["warm", "暖色"],
    swatch: "oklch(62% 0.14 40)",
    onSwatch: "#ffffff",
  },
] as const;

const DEFAULTS = {
  radius: "lg",
  shadow: "raised",
  accent: "graphite",
} as const;

const ACCORDION_ALIASES = [
  "Accordion",
  "Collapse",
  "Disclosure",
  "Details",
  "ShowyHideyThing",
] as const;

function parseView(value: string | null): View {
  if (value && VIEWS.includes(value as View)) return value as View;
  return "home";
}

function Capability({
  preview,
  tune,
  install,
}: {
  preview?: boolean;
  tune?: boolean;
  install?: boolean;
}) {
  const t = useTranslations("labPresentationPrototype");
  return (
    <ul className="flex flex-wrap gap-1.5">
      {preview ? (
        <li className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] text-muted-foreground">
          {t("capabilityPreview")}
        </li>
      ) : null}
      {tune ? (
        <li className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] text-muted-foreground">
          {t("capabilityTune")}
        </li>
      ) : null}
      {install ? (
        <li className="rounded-full border border-border px-2 py-0.5 text-[0.65rem] text-muted-foreground">
          {t("capabilityInstall")}
        </li>
      ) : null}
    </ul>
  );
}

function PressProof() {
  const t = useTranslations("labPresentationPrototype");
  const reducedMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const pressValue = springJsValue(SPRING_PRESS);

  return (
    <div className="flex h-full flex-col justify-between gap-5">
      <div>
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t("motionTitle")}
        </p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          {t("motionName")}
          <span className="ml-2 font-mono text-sm font-normal text-muted-foreground">
            {t("motionNameEn")}
          </span>
        </h3>
        <p className="mt-1 font-mono text-xs text-muted-foreground">
          {t("motionPrimitive")}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("motionHint")}
        </p>
      </div>

      <div className="flex items-center justify-center rounded-2xl border border-border bg-background/70 py-8">
        {reducedMotion ? (
          <span className="h-12 w-12 rounded-xl bg-foreground/90" />
        ) : (
          <motion.span
            key={run}
            className="h-12 w-12 rounded-xl bg-foreground"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 0.93, 1] }}
            transition={SPRING_PRESS}
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={() => setRun((value) => value + 1)}
          >
            {t("motionReplay")}
          </Button>
          <Button type="button" size="sm">
            {t("sceneButton")}
          </Button>
        </div>
        <CopyValue value={pressValue} label="spring-press" />
        <Capability preview tune install />
      </div>
    </div>
  );
}

function NounProof({ onOpen }: { onOpen: () => void }) {
  const t = useTranslations("labPresentationPrototype");

  return (
    <div className="flex h-full flex-col justify-between gap-5">
      <div>
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t("nounTitle")}
        </p>
        <h3 className="mt-2 text-lg font-semibold tracking-tight text-foreground">
          {t("nounName")}
          <span className="ml-2 font-mono text-sm font-normal text-muted-foreground">
            {t("nounNameEn")}
          </span>
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {t("nounHint")}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          <span className="text-foreground">{t("nounAlso")}</span>
          {" · "}
          {ACCORDION_ALIASES.join(" · ")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="text-foreground">{t("nounNot")}</span>
          {" · "}
          {t("nounNeighbor")}
        </p>
      </div>
      <MiniAccordion />
      <div className="flex flex-col gap-3">
        <Button type="button" size="sm" variant="secondary" onClick={onOpen}>
          {t("openTask")}
        </Button>
        <Capability preview install />
      </div>
    </div>
  );
}

function MiniAccordion() {
  const t = useTranslations("labPresentationPrototype");
  return (
    <BouncyAccordion
      defaultValue="one"
      items={[
        {
          id: "one",
          title: t("accordionItem1"),
          description: t("accordionBody1"),
        },
        {
          id: "two",
          title: t("accordionItem2"),
          description: t("accordionBody2"),
        },
      ]}
    />
  );
}

function NeighborTabs() {
  const t = useTranslations("labPresentationPrototype");
  return (
    <Tabs defaultValue="a" variant="pill">
      <TabsList>
        <TabsTrigger value="a">{t("tabsPanelA")}</TabsTrigger>
        <TabsTrigger value="b">{t("tabsPanelB")}</TabsTrigger>
        <TabsTrigger value="c">{t("tabsPanelC")}</TabsTrigger>
      </TabsList>
      <TabsContent value="a">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("tabsBody")}
        </p>
      </TabsContent>
      <TabsContent value="b">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("tabsBody")}
        </p>
      </TabsContent>
      <TabsContent value="c">
        <p className="text-sm leading-relaxed text-muted-foreground">
          {t("tabsBody")}
        </p>
      </TabsContent>
    </Tabs>
  );
}

function TokenScene({
  radius,
  shadow,
  accent,
}: {
  radius: string;
  shadow: string;
  accent: string;
}) {
  const t = useTranslations("labPresentationPrototype");
  return (
    <div
      className="border border-border bg-card p-5 sm:p-6"
      style={{
        borderRadius: radius,
        boxShadow: shadow,
      }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {t("sceneTitle")}
          </h3>
          <p className="mt-1 max-w-md text-sm leading-relaxed text-muted-foreground">
            {t("sceneBody")}
          </p>
        </div>
        <span
          className="border border-border px-2.5 py-1 text-xs text-muted-foreground"
          style={{ borderRadius: radius }}
        >
          {t("sceneBadge")}
        </span>
      </div>
      <label className="mt-5 block text-xs font-medium text-muted-foreground">
        {t("sceneInput")}
        <input
          readOnly
          value={t("sceneInput")}
          className="mt-2 h-10 w-full border border-border bg-background px-3 text-sm text-foreground outline-none"
          style={{ borderRadius: radius }}
        />
      </label>
      <button
        type="button"
        className="mt-4 h-10 px-4 text-sm font-semibold"
        style={{
          borderRadius: radius,
          background: accent,
          color: "var(--lab-on-accent, var(--primary-foreground))",
        }}
      >
        {t("sceneButton")}
      </button>
    </div>
  );
}

function StepButton({
  active,
  onClick,
  label,
  preview,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  preview?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex h-10 items-center justify-center border px-2 font-mono text-xs transition-colors",
        active
          ? "border-(--color-border-strong) bg-card text-foreground"
          : "border-border text-muted-foreground hover:text-foreground",
      )}
      style={preview ? { borderRadius: preview } : undefined}
    >
      {label}
    </button>
  );
}

function TokenBench({
  compact,
  radiusSlug,
  shadowSlug,
  accentSlug,
  onRadius,
  onShadow,
  onAccent,
  onReset,
}: {
  compact?: boolean;
  radiusSlug: string;
  shadowSlug: string;
  accentSlug: string;
  onRadius: (slug: string) => void;
  onShadow: (slug: string) => void;
  onAccent: (slug: string) => void;
  onReset: () => void;
}) {
  const t = useTranslations("labPresentationPrototype");
  const locale = useLocale() as Locale;
  const dark = useResolvedDark();
  const { copiedLabel, copyValue } = useCopyFeedback();
  const radius = RADII.find((entry) => entry.slug === radiusSlug) ?? RADII[0];
  const shadow = SHADOWS.find((entry) => entry.slug === shadowSlug) ?? SHADOWS[0];
  const accent =
    ACCENT_STEPS.find((entry) => entry.slug === accentSlug) ?? ACCENT_STEPS[0];

  if (!radius || !shadow || !accent) return null;

  const shadowValue = dark ? shadow.dark : shadow.light;
  const tokenBlock = [
    `radius-${radius.slug}: ${radius.value}`,
    `shadow-${shadow.slug}: ${shadowValue}`,
    `accent-${accent.slug}: ${accent.swatch}`,
  ].join("\n");

  return (
    <div
      className="flex flex-col gap-5"
      style={{ ["--lab-on-accent" as string]: accent.onSwatch }}
    >
      <TokenScene
        radius={radius.value}
        shadow={shadowValue}
        accent={accent.swatch}
      />
      <div className={cn("grid gap-4", compact ? "grid-cols-1" : "lg:grid-cols-3")}>
        <fieldset>
          <legend className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {t("radiusLabel")}
          </legend>
          <div className="mt-2 grid grid-cols-4 gap-2">
            {RADII.map((entry) => (
              <StepButton
                key={entry.slug}
                active={entry.slug === radius.slug}
                onClick={() => onRadius(entry.slug)}
                label={entry.slug}
                preview={entry.value}
              />
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {t("shadowLabel")}
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
            {SHADOWS.map((entry) => (
              <StepButton
                key={entry.slug}
                active={entry.slug === shadow.slug}
                onClick={() => onShadow(entry.slug)}
                label={entry.slug}
              />
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {t("accentLabel")}
          </legend>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {ACCENT_STEPS.map((entry) => {
              const active = entry.slug === accent.slug;
              return (
                <button
                  key={entry.slug}
                  type="button"
                  onClick={() => onAccent(entry.slug)}
                  aria-pressed={active}
                  className={cn(
                    "flex h-10 items-center gap-2 border px-2 text-left text-xs transition-colors",
                    active
                      ? "border-(--color-border-strong) bg-card text-foreground"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span
                    className="h-4 w-4 shrink-0 rounded-full border border-border"
                    style={{ background: entry.swatch }}
                  />
                  <span className="font-mono">{localizedName(entry, locale)}</span>
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>
      <div>
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t("tokenBlockLabel")}
        </p>
        <p className="mt-1 font-mono text-sm text-foreground">
          {radius.slug} · {shadow.slug} · {accent.slug}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => copyValue(tokenBlock, "lab-token-block")}
          >
            {copiedLabel === "lab-token-block"
              ? t("copiedTokens")
              : t("copyTokens")}
          </Button>
          <Button type="button" size="sm" variant="ghost" onClick={onReset}>
            {t("reset")}
          </Button>
        </div>
        <CopyValue
          value={tokenBlock}
          label="lab-token-preview"
          className="mt-3"
        />
      </div>
    </div>
  );
}

function InstallPanel() {
  const t = useTranslations("labPresentationPrototype");
  const command = `npx shadcn add ${REGISTRY_NAMESPACE}/bouncy-accordion`;

  return (
    <div className="rounded-2xl border border-border bg-card/40 p-5">
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {t("installLabel")}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {t("installHint")}
      </p>
      <CopyValue value={command} label="install-bouncy-accordion" className="mt-3" />
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link
          href="/components/motion/bouncy-accordion"
          className="text-foreground underline-offset-4 hover:underline"
        >
          {t("openSource")}
        </Link>
        <Link
          href="/atoms"
          className="text-muted-foreground underline-offset-4 hover:underline"
        >
          {t("openAtoms")}
        </Link>
      </div>
    </div>
  );
}

export function LabPresentationPrototype() {
  const t = useTranslations("labPresentationPrototype");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const view = parseView(searchParams.get("view"));
  const [radiusSlug, setRadiusSlug] = useState<string>(DEFAULTS.radius);
  const [shadowSlug, setShadowSlug] = useState<string>(DEFAULTS.shadow);
  const [accentSlug, setAccentSlug] = useState<string>(DEFAULTS.accent);

  const setView = (next: View) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "home") params.delete("view");
    else params.set("view", next);
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const resetTokens = () => {
    setRadiusSlug(DEFAULTS.radius);
    setShadowSlug(DEFAULTS.shadow);
    setAccentSlug(DEFAULTS.accent);
  };

  const bench = (
    <TokenBench
      compact={view === "home"}
      radiusSlug={radiusSlug}
      shadowSlug={shadowSlug}
      accentSlug={accentSlug}
      onRadius={setRadiusSlug}
      onShadow={setShadowSlug}
      onAccent={setAccentSlug}
      onReset={resetTokens}
    />
  );

  return (
    <div className="relative">
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-24 md:pt-28">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {t("badge")}
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
          {t("line")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {t("question")}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">{t("notStudio")}</p>

        {view !== "home" ? (
          <div className="mt-6">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setView("home")}
            >
              {t("backHome")}
            </Button>
          </div>
        ) : null}

        {view === "home" ? (
          <div className="mt-10 flex flex-col gap-12">
            <section aria-labelledby="lab-proofs-title">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {t("proofsEyebrow")}
              </p>
              <h2
                id="lab-proofs-title"
                className="mt-2 text-2xl font-semibold text-foreground"
              >
                {t("proofsTitle")}
              </h2>
              <div className="mt-6 grid gap-4 lg:grid-cols-3">
                <article className="rounded-3xl border border-border bg-card/30 p-5">
                  <PressProof />
                </article>
                <article className="rounded-3xl border border-border bg-card/30 p-5">
                  <NounProof onOpen={() => setView("noun")} />
                </article>
                <article className="rounded-3xl border border-border bg-card/30 p-5">
                  <p className="text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                    {t("systemTitle")}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t("systemHint")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("systemCurrent")}
                  </p>
                  <div className="mt-4">{bench}</div>
                  <div className="mt-4">
                    <Capability preview tune />
                  </div>
                </article>
              </div>
            </section>

            <section aria-labelledby="lab-tasks-title">
              <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {t("tasksEyebrow")}
              </p>
              <h2
                id="lab-tasks-title"
                className="mt-2 text-2xl font-semibold text-foreground"
              >
                {t("tasksTitle")}
              </h2>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {(
                  [
                    ["noun", "taskUnknown", "taskUnknownDesc"],
                    ["use", "taskUse", "taskUseDesc"],
                    ["bench", "taskTune", "taskTuneDesc"],
                  ] as const
                ).map(([next, titleKey, descKey]) => (
                  <button
                    key={next}
                    type="button"
                    onClick={() => setView(next)}
                    className="rounded-3xl border border-border bg-card/30 p-5 text-left transition-colors hover:bg-card/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <h3 className="text-base font-semibold text-foreground">
                      {t(titleKey)}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t(descKey)}
                    </p>
                    <span className="mt-4 inline-block text-sm text-foreground">
                      {t("openTask")}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : null}

        {view === "noun" || view === "use" ? (
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,20rem)]">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {view === "noun" ? t("nounViewTitle") : t("useViewTitle")}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {view === "noun" ? t("nounViewIntro") : t("useViewIntro")}
              </p>
              <div className="mt-6 rounded-3xl border border-border bg-card/30 p-5">
                <MiniAccordion />
              </div>
              {view === "noun" ? (
                <div className="mt-6 rounded-3xl border border-dashed border-border p-5">
                  <p className="text-xs font-medium text-foreground">
                    {t("nounNot")} · {t("nounNeighbor")}
                  </p>
                  <div className="mt-4">
                    <NeighborTabs />
                  </div>
                </div>
              ) : null}
            </div>
            <aside className="flex flex-col gap-4">
              <div className="rounded-2xl border border-border p-5">
                <p className="text-xs text-muted-foreground">{t("nounAlso")}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">
                  {ACCORDION_ALIASES.join(" · ")}
                </p>
                <Capability preview install />
              </div>
              <InstallPanel />
            </aside>
          </div>
        ) : null}

        {view === "bench" ? (
          <div className="mt-10 flex flex-col gap-8">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">
                {t("tuneViewTitle")}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {t("tuneViewIntro")}
              </p>
            </div>
            {bench}
            <Capability preview tune />
            <InstallPanel />
          </div>
        ) : null}
      </section>
    </div>
  );
}
