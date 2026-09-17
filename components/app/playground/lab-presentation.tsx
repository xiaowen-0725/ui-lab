"use client";

// THROW AWAY after the presentation question is settled.
// Verifies: see → try → take the same source. Not a workshop, shelf, or generator.

import { motion, useReducedMotion } from "motion/react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  type CSSProperties,
  type ReactNode,
  useCallback,
  useState,
} from "react";
import { CopyButton } from "@/components/app/docs/copy-button";
import { PressLink } from "@/components/app/press-link";
import { BouncyAccordion } from "@/components/motion/bouncy-accordion";
import { Button } from "@/components/motion/button";
import { Input } from "@/components/motion/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/motion/tabs";
import {
  MOTION_SPRINGS,
  RADII,
  SHADOWS,
  springJsValue,
  type RadiusAtom,
  type ShadowAtom,
} from "@/lib/atoms";
import { SPRING_PRESS } from "@/lib/ease";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { REGISTRY_NAMESPACE } from "@/lib/site";
import { THEMES, type ColorTheme } from "@/lib/themes";
import { cn } from "@/lib/utils";

type LabView = "home" | "noun" | "use" | "bench";
type BenchColor = "graphite" | "violet";
type Capability = "preview" | "adjust" | "install";

const ACCORDION_INSTALL = `npx shadcn add ${REGISTRY_NAMESPACE}/bouncy-accordion`;
const THEME_KIT_INSTALL = `npx shadcn add ${REGISTRY_NAMESPACE}/theme-graphite`;
const PRESS_ATOM = requireAtom(MOTION_SPRINGS, "press");
const RADIUS_LG = requireAtom(RADII, "lg");
const RADIUS_NONE = requireAtom(RADII, "none");
const SHADOW_RAISED = requireAtom(SHADOWS, "raised");
const HOME_RADIUS_STEPS = [RADIUS_LG, RADIUS_NONE] as const;

const BENCH_COLORS: readonly {
  id: BenchColor;
  theme: ColorTheme;
  kit: boolean;
}[] = [
  { id: "graphite", theme: "default", kit: true },
  { id: "violet", theme: "violet", kit: false },
];

function requireAtom<T extends { slug: string }>(
  list: readonly T[],
  slug: string,
): T {
  const found = list.find((item) => item.slug === slug);
  if (!found) throw new Error(`Expected atom "${slug}" to exist.`);
  return found;
}

function parseView(value: string | null): LabView {
  if (value === "noun" || value === "use" || value === "bench") return value;
  return "home";
}

function atomName(
  atom: { name: string; nameZh: string },
  locale: Locale,
): string {
  return locale === "zh" ? atom.nameZh : atom.name;
}

function pressTokenText(): string {
  return `/* atoms/press · SPRING_PRESS */\n${springJsValue(PRESS_ATOM.value)}`;
}

function radiusTokenText(radius: RadiusAtom): string {
  return `--radius-${radius.slug}: ${radius.value};`;
}

function benchTokenText(
  radius: RadiusAtom,
  shadow: ShadowAtom,
  color: BenchColor,
): string {
  const theme = THEMES[colorThemeOf(color)];
  return [
    "/* The steps on this bench — atoms radius/shadow + theme --primary */",
    `--radius-${radius.slug}: ${radius.value};`,
    `--shadow-${shadow.slug}-light: ${shadow.light};`,
    `--shadow-${shadow.slug}-dark: ${shadow.dark};`,
    `--primary: ${theme.light["--primary"]};`,
    `--primary-foreground: ${theme.light["--primary-foreground"]};`,
    `.dark {`,
    `  --primary: ${theme.dark["--primary"]};`,
    `  --primary-foreground: ${theme.dark["--primary-foreground"]};`,
    `}`,
  ].join("\n");
}

function colorThemeOf(color: BenchColor): ColorTheme {
  return color === "violet" ? "violet" : "default";
}

export function LabPresentation({ initialView }: { initialView?: string }) {
  const t = useTranslations("labPresentation");
  const searchParams = useSearchParams();
  const view = parseView(searchParams.get("view") ?? initialView ?? null);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-24 md:pt-28">
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
  const locale = useLocale() as Locale;
  const [homeRadius, setHomeRadius] = useState<RadiusAtom>(RADIUS_LG);

  return (
    <div>
      <PageIntro
        badge={t("badge")}
        title={t("headline")}
        lede={t("lede")}
        note={t("notThis")}
      />

      <div className="mt-10 grid gap-4 md:grid-cols-3 md:items-stretch">
        <ProofCard
          layer={t("motionLayer")}
          name={t("motionName")}
          nameEn={t("motionNameEn")}
          aliases={PRESS_ATOM.aliases.join(" · ")}
          capabilities={["preview"]}
          sample={<PressProof />}
          takeaway={
            <TakeRow
              label={t("motionTake")}
              text={pressTokenText()}
              eventLabel="lab-press-spring"
            />
          }
          footer={
            <Link
              href="/atoms?cat=motion"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {t("motionAtomsLink")}
            </Link>
          }
        />

        <ProofCard
          layer={t("nounLayer")}
          name={t("nounName")}
          nameEn={t("nounNameEn")}
          aliases={t("nounAliases")}
          capabilities={["preview", "install"]}
          sample={<NounSample compact />}
          takeaway={
            <TakeRow
              label={t("nounTake")}
              text={ACCORDION_INSTALL}
              eventLabel="lab-accordion-install"
            />
          }
          footer={
            <Link
              href="/components/motion/bouncy-accordion"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {t("nounPageLink")}
            </Link>
          }
        />

        <ProofCard
          layer={t("systemLayer")}
          name={t("systemName")}
          nameEn={t("systemNameEn")}
          aliases={t("systemAliases")}
          capabilities={["preview", "adjust"]}
          sample={
            <div className="flex flex-col gap-3">
              <StepChips>
                {HOME_RADIUS_STEPS.map((step) => (
                  <StepChip
                    key={step.slug}
                    pressed={homeRadius.slug === step.slug}
                    onClick={() => setHomeRadius(step)}
                  >
                    {atomName(step, locale)}
                  </StepChip>
                ))}
              </StepChips>
              <Specimen radius={homeRadius} />
            </div>
          }
          takeaway={
            <TakeRow
              label={t("systemTake")}
              text={radiusTokenText(homeRadius)}
              eventLabel="lab-home-radius"
            />
          }
          footer={
            <Link
              href="/playground/lab-presentation?view=bench"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              {t("systemOpenBench")}
            </Link>
          }
        />
      </div>

      <div className="mt-12">
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
    <ViewShell
      title={t("nounViewTitle")}
      lede={t("nounViewLede")}
    >
      <div className="grid gap-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="min-w-0">
          <NounSample />
        </div>
        <div className="min-w-0 space-y-5">
          <NameBlock
            zh={t("nounName")}
            en={t("nounNameEn")}
            aliases={t("nounAliases")}
            neighbor={t("nounNeighbor")}
          />
          <CapabilityRow items={["preview", "install"]} />
          <TakeRow
            label={t("nounTake")}
            text={ACCORDION_INSTALL}
            eventLabel="lab-noun-install"
          />
          <Link
            href="/components/motion/bouncy-accordion"
            className="inline-block text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            {t("nounPageLink")}
          </Link>
          <details className="rounded-xl border border-border bg-card px-4 py-3">
            <summary className="cursor-pointer text-sm font-medium text-foreground">
              {t("nounPromptSummary")}
            </summary>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {t("nounPrompt")}
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              {t("nounPromptNote")}
            </p>
          </details>
        </div>
      </div>
    </ViewShell>
  );
}

function UseView() {
  const t = useTranslations("labPresentation");

  return (
    <ViewShell
      title={t("useViewTitle")}
      lede={t("useViewLede")}
    >
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

  const reset = useCallback(() => {
    setRadius(RADIUS_LG);
    setShadow(SHADOW_RAISED);
    setColor("graphite");
  }, []);

  const current = `${atomName(radius, locale)} · ${atomName(shadow, locale)} · ${t(`color_${color}`)}`;
  const graphite = color === "graphite";

  return (
    <ViewShell
      title={t("benchTitle")}
      lede={t("benchLede")}
    >
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
        </div>

        <div className="min-w-0">
          <p className="text-xs text-muted-foreground">{t("benchSampleTitle")}</p>
          <div className="mt-2">
            <Specimen radius={radius} shadow={shadow} color={color} />
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {t("benchCurrent")}: {current}
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <TakeRow
          label={t("benchTake")}
          text={benchTokenText(radius, shadow, color)}
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
            <p className="text-sm leading-6 text-muted-foreground">
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
            {t("benchVioletNote")}
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

function ProofCard({
  layer,
  name,
  nameEn,
  aliases,
  capabilities,
  sample,
  takeaway,
  footer,
}: {
  layer: string;
  name: string;
  nameEn: string;
  aliases: string;
  capabilities: readonly Capability[];
  sample: ReactNode;
  takeaway: ReactNode;
  footer: ReactNode;
}) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-border bg-card p-5">
      <p className="text-xs text-muted-foreground">{layer}</p>
      <h2 className="mt-2 text-lg font-medium leading-snug text-foreground">
        {name}
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          {nameEn}
        </span>
      </h2>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{aliases}</p>
      <div className="mt-4 min-h-[168px]">{sample}</div>
      <div className="mt-4">
        <CapabilityRow items={capabilities} />
      </div>
      <div className="mt-4">{takeaway}</div>
      <div className="mt-auto pt-4">{footer}</div>
    </article>
  );
}

function CapabilityRow({ items }: { items: readonly Capability[] }) {
  const t = useTranslations("labPresentation");
  const label: Record<Capability, string> = {
    preview: t("capPreview"),
    adjust: t("capAdjust"),
    install: t("capInstall"),
  };
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li
          key={item}
          className="rounded-md border border-border px-2 py-0.5 text-xs text-muted-foreground"
        >
          {label[item]}
        </li>
      ))}
    </ul>
  );
}

function TakeRow({
  label,
  text,
  eventLabel,
}: {
  label: string;
  text: string;
  eventLabel: string;
}) {
  return (
    <div className="min-w-0">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <CopyButton text={text} eventLabel={eventLabel} />
      </div>
      <pre className="mt-2 overflow-x-auto rounded-lg bg-muted/60 px-3 py-2 font-mono text-xs leading-5 text-foreground">
        {text}
      </pre>
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

function PressProof() {
  const t = useTranslations("labPresentation");
  const reduce = useReducedMotion();
  const [replay, setReplay] = useState(0);

  return (
    <div className="flex flex-col items-start gap-3">
      <motion.div
        key={replay}
        initial={reduce ? { opacity: 0.7 } : { scale: 0.93 }}
        animate={reduce ? { opacity: 1 } : { scale: 1 }}
        transition={reduce ? { duration: 0.15 } : SPRING_PRESS}
      >
        <Button>{t("motionPress")}</Button>
      </motion.div>
      <Button variant="ghost" size="sm" onClick={() => setReplay((n) => n + 1)}>
        {t("motionReplay")}
      </Button>
    </div>
  );
}

function NounSample({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("labPresentation");
  const items = [
    {
      id: "when",
      title: t("nounItemWhen"),
      description: t("nounItemWhenBody"),
    },
    {
      id: "vs",
      title: t("nounItemVs"),
      description: t("nounItemVsBody"),
    },
  ];

  return (
    <BouncyAccordion
      items={items}
      defaultValue="when"
      className={cn(compact && "[&_button]:min-h-12 [&_button]:px-4")}
    />
  );
}

function NameBlock({
  zh,
  en,
  aliases,
  neighbor,
}: {
  zh: string;
  en: string;
  aliases: string;
  neighbor: string;
}) {
  return (
    <div>
      <p className="text-xl font-medium text-foreground">{zh}</p>
      <p className="mt-1 text-sm text-muted-foreground">{en}</p>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{aliases}</p>
      <p className="mt-3 text-sm text-foreground">{neighbor}</p>
    </div>
  );
}

function Specimen({
  radius,
  shadow,
  color,
}: {
  radius: RadiusAtom;
  shadow?: ShadowAtom;
  color?: BenchColor;
}) {
  const t = useTranslations("labPresentation");
  const theme = color ? THEMES[colorThemeOf(color)] : null;
  const style = {
    "--lab-radius": radius.value,
    "--lab-shadow": shadow?.light,
    "--lab-shadow-dark": shadow?.dark,
    ...(theme
      ? {
          "--primary": theme.light["--primary"],
          "--primary-foreground": theme.light["--primary-foreground"],
          "--lab-primary-dark": theme.dark["--primary"],
          "--lab-primary-fg-dark": theme.dark["--primary-foreground"],
        }
      : {}),
    borderRadius: radius.value,
    boxShadow: shadow?.light,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "space-y-3 border border-border bg-background p-4",
        shadow && "dark:[box-shadow:var(--lab-shadow-dark)]",
        theme &&
          "dark:[--primary:var(--lab-primary-dark)] dark:[--primary-foreground:var(--lab-primary-fg-dark)]",
      )}
      style={style}
    >
      <span
        className="inline-flex items-center border border-border bg-card px-2 py-0.5 text-xs text-muted-foreground"
        style={{ borderRadius: radius.value }}
      >
        {t("benchSampleBadge")}
      </span>
      <Input
        label={t("benchSampleInput")}
        defaultValue={t("benchSampleValue")}
        classNames={{
          field: "rounded-[var(--lab-radius)]",
        }}
      />
      <Button className="rounded-[var(--lab-radius)]">
        {t("benchSampleButton")}
      </Button>
    </div>
  );
}

function StepGroup({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <StepChips>{children}</StepChips>
    </div>
  );
}

function StepChips({ children }: { children: ReactNode }) {
  return <div className="mt-2 flex flex-wrap gap-1.5">{children}</div>;
}

function StepChip({
  pressed,
  onClick,
  children,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "rounded-md border px-2.5 py-1 text-xs transition-colors",
        pressed
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
