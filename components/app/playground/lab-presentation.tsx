"use client";

// THROW AWAY after the presentation question is settled.
// Overall-feel preview of the lab. Official homepage stays three live proofs.

import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useCallback, useState } from "react";
import { PressLink } from "@/components/app/press-link";
import { Button } from "@/components/motion/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { DENSITIES, RADII, SHADOWS, type DensityAtom, type RadiusAtom, type ShadowAtom } from "@/lib/atoms";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { REGISTRY_NAMESPACE } from "@/lib/site";
import {
  MotionHall,
  NounHall,
  SystemHall,
} from "./lab-presentation-halls";
import {
  atomName,
  BENCH_COLORS,
  type BenchColor,
  benchTokenText,
  CapabilityRow,
  DENSITY_STANDARD,
  RADIUS_LG,
  SHADOW_RAISED,
  Specimen,
  StepChip,
  StepGroup,
  TakeRow,
} from "./lab-presentation-ui";

type LabView = "home" | "noun" | "use" | "bench";

const ACCORDION_INSTALL = `npx shadcn add ${REGISTRY_NAMESPACE}/bouncy-accordion`;
const THEME_KIT_INSTALL = `npx shadcn add ${REGISTRY_NAMESPACE}/theme-graphite`;

function parseView(value: string | null): LabView {
  if (value === "noun" || value === "use" || value === "bench") return value;
  return "home";
}

export function LabPresentation({ initialView }: { initialView?: string }) {
  const t = useTranslations("labPresentation");
  const searchParams = useSearchParams();
  const view = parseView(searchParams.get("view") ?? initialView ?? null);

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 pt-24 md:pt-28">
      {view === "home" ? <HomeView /> : null}
      {view === "noun" ? <NounView /> : null}
      {view === "use" ? <UseView /> : null}
      {view === "bench" ? <BenchView /> : null}
      <p className="sr-only">{t("notThis")}</p>
    </section>
  );
}

function HomeView() {
  const t = useTranslations("labPresentation");

  return (
    <div>
      <PageIntro
        badge={t("badge")}
        title={t("headline")}
        lede={t("lede")}
        note={t("galleryNote")}
      />
      <MotionHall />
      <NounHall />
      <SystemHall />
      <div className="mt-14">
        <h2 className="text-sm font-medium text-foreground">{t("tasksTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("tasksLede")}</p>
        <ul className="mt-4 divide-y divide-border border-y border-border">
          <TaskRow
            href="/playground/lab-presentation?view=noun"
            title={t("taskNoun")}
            description={t("taskNounDesc")}
          />
          <TaskRow
            href="/playground/lab-presentation?view=use"
            title={t("taskUse")}
            description={t("taskUseDesc")}
          />
          <TaskRow
            href="/playground/lab-presentation?view=bench"
            title={t("taskBench")}
            description={t("taskBenchDesc")}
          />
        </ul>
      </div>
    </div>
  );
}

function NounView() {
  const t = useTranslations("labPresentation");
  return (
    <ViewShell title={t("nounViewTitle")} lede={t("nounViewLede")}>
      <NounHall />
    </ViewShell>
  );
}

function UseView() {
  const t = useTranslations("labPresentation");

  return (
    <ViewShell title={t("useViewTitle")} lede={t("useViewLede")}>
      <div className="grid gap-4 md:grid-cols-2">
        <article className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-base font-medium text-foreground">
            {t("useWhenTitle")}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("useWhenBody")}
          </p>
          <div className="mt-4">
            <TakeRow
              label={t("useIfAccordion")}
              text={ACCORDION_INSTALL}
              eventLabel="lab-use-accordion"
            />
          </div>
        </article>
        <article className="rounded-2xl border border-border bg-card p-5">
          <h3 className="text-base font-medium text-foreground">
            {t("useNotTitle")}
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("useNotBody")}
          </p>
          <div className="mt-4">
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">{t("useTabOverview")}</TabsTrigger>
                <TabsTrigger value="billing">{t("useTabBilling")}</TabsTrigger>
                <TabsTrigger value="members">{t("useTabMembers")}</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="text-sm text-muted-foreground">
                {t("useTabOverviewBody")}
              </TabsContent>
              <TabsContent value="billing" className="text-sm text-muted-foreground">
                {t("useTabBillingBody")}
              </TabsContent>
              <TabsContent value="members" className="text-sm text-muted-foreground">
                {t("useTabMembersBody")}
              </TabsContent>
            </Tabs>
          </div>
          <Link
            href="/components/motion/tabs"
            className="mt-4 inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {t("useIfTabs")}
          </Link>
        </article>
      </div>
    </ViewShell>
  );
}

function BenchView() {
  const t = useTranslations("labPresentation");
  const locale = useLocale() as Locale;
  const [radius, setRadius] = useState<RadiusAtom>(RADIUS_LG);
  const [shadow, setShadow] = useState<ShadowAtom>(SHADOW_RAISED);
  const [color, setColor] = useState<BenchColor>("graphite");
  const [density, setDensity] = useState<DensityAtom>(DENSITY_STANDARD);

  const reset = useCallback(() => {
    setRadius(RADIUS_LG);
    setShadow(SHADOW_RAISED);
    setColor("graphite");
    setDensity(DENSITY_STANDARD);
  }, []);

  const current = [
    atomName(radius, locale),
    atomName(shadow, locale),
    t(`color_${color}`),
    atomName(density, locale),
  ].join(" · ");
  const graphite = color === "graphite";

  return (
    <ViewShell title={t("benchTitle")} lede={t("benchLede")}>
      <CapabilityRow items={["preview", "adjust"]} />

      <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-5">
          <StepGroup label={t("benchRadius")}>
            {RADII.map((step) => (
              <StepChip
                key={step.slug}
                pressed={radius.slug === step.slug}
                onClick={() => setRadius(step)}
              >
                {atomName(step, locale)}
              </StepChip>
            ))}
          </StepGroup>
          <StepGroup label={t("benchShadow")}>
            {SHADOWS.map((step) => (
              <StepChip
                key={step.slug}
                pressed={shadow.slug === step.slug}
                onClick={() => setShadow(step)}
              >
                {atomName(step, locale)}
              </StepChip>
            ))}
          </StepGroup>
          <StepGroup label={t("benchColor")}>
            {BENCH_COLORS.map((step) => (
              <StepChip
                key={step.id}
                pressed={color === step.id}
                onClick={() => setColor(step.id)}
              >
                {t(`color_${step.id}`)}
              </StepChip>
            ))}
          </StepGroup>
          <StepGroup label={t("benchDensity")}>
            {DENSITIES.map((step) => (
              <StepChip
                key={step.slug}
                pressed={density.slug === step.slug}
                onClick={() => setDensity(step)}
              >
                {atomName(step, locale)}
              </StepChip>
            ))}
          </StepGroup>
        </div>

        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{t("benchSampleTitle")}</p>
          <div className="mt-2">
            <Specimen
              radius={radius}
              shadow={shadow}
              color={color}
              density={density}
            />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {t("benchCurrent")}: {current}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <TakeRow
          label={t("benchTake")}
          text={benchTokenText(radius, shadow, color, density)}
          eventLabel="lab-bench-tokens"
        />
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="ghost" size="sm" onClick={reset}>
            {t("benchReset")}
          </Button>
          <Link
            href="/atoms?cat=shape"
            className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {t("benchAtomsLink")}
          </Link>
        </div>
        {graphite ? (
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mt-0 text-sm leading-6 text-muted-foreground">
              {t("benchThemeKit")}
            </p>
            <div className="mt-3">
              <TakeRow
                label={t("benchThemeKitTake")}
                text={THEME_KIT_INSTALL}
                eventLabel="lab-theme-graphite"
              />
            </div>
          </div>
        ) : (
          <p className="text-sm leading-6 text-muted-foreground">
            {t("benchThemeNote")}
          </p>
        )}
      </div>
    </ViewShell>
  );
}

function PageIntro({
  badge,
  title,
  lede,
  note,
}: {
  badge: string;
  title: string;
  lede: string;
  note: string;
}) {
  const t = useTranslations("labPresentation");
  return (
    <header className="max-w-2xl">
      <p className="text-xs text-muted-foreground">{badge}</p>
      <p className="mt-2 text-xs text-muted-foreground">{t("flow")}</p>
      <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl">
        {title}
      </h1>
      <p className="mt-4 text-sm leading-7 text-muted-foreground md:text-base">
        {lede}
      </p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{note}</p>
    </header>
  );
}

function ViewShell({
  title,
  lede,
  children,
}: {
  title: string;
  lede: string;
  children: ReactNode;
}) {
  const t = useTranslations("labPresentation");
  return (
    <div>
      <Link
        href="/playground/lab-presentation"
        className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
      >
        {t("backProofs")}
      </Link>
      <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-foreground">
        {title}
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
        {lede}
      </p>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function TaskRow({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  const t = useTranslations("labPresentation");
  return (
    <li>
      <PressLink
        href={href}
        className="flex items-baseline justify-between gap-4 py-4 text-foreground"
      >
        <span>
          <span className="block text-sm font-medium">{title}</span>
          <span className="mt-1 block text-sm text-muted-foreground">
            {description}
          </span>
        </span>
        <span className="shrink-0 text-sm text-muted-foreground">
          {t("taskOpen")}
        </span>
      </PressLink>
    </li>
  );
}
