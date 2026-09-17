"use client";

import { Bell, Copy, Home, Mail, Settings } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { ActionSwapButton } from "@/components/motion/action-swap";
import { AnimatedBadge } from "@/components/motion/animated-badge";
import { AnimatedIcon } from "@/components/motion/animated-icon";
import { BouncyAccordion } from "@/components/motion/bouncy-accordion";
import { BottomSheet } from "@/components/motion/bottom-sheet";
import { Button } from "@/components/motion/button";
import { Checkbox } from "@/components/motion/checkbox";
import { Dock, DockItem } from "@/components/motion/dock";
import { Drawer } from "@/components/motion/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/motion/dropdown-menu";
import { ExpandableButton } from "@/components/motion/expandable-control";
import { ExpandingCard } from "@/components/motion/expanding-card";
import {
  FileTree,
  FileTreeFile,
  FileTreeFolder,
} from "@/components/motion/file-tree";
import { GlareHover } from "@/components/motion/glare-hover";
import { Input } from "@/components/motion/input";
import { Loader } from "@/components/motion/loader";
import { Marquee } from "@/components/motion/marquee";
import { NumberTicker } from "@/components/motion/number-ticker";
import { OTPInput } from "@/components/motion/otp-input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/motion/popover";
import { RadioGroup, RadioGroupItem } from "@/components/motion/radio";
import { RangeSlider } from "@/components/motion/range-slider";
import { ScrollHint } from "@/components/motion/scroll-hint";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/motion/select";
import { SharedLayoutBg } from "@/components/motion/shared-layout-bg";
import { Skeleton } from "@/components/motion/skeleton";
import { StarBorder } from "@/components/motion/star-border";
import { Switch } from "@/components/motion/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/motion/tabs";
import { TextScramble } from "@/components/motion/text-scramble";
import { ThemeToggle } from "@/components/motion/theme-toggle";
import { TiltCard } from "@/components/motion/tilt-card";
import { Tooltip } from "@/components/motion/tooltip";
import { WheelPicker } from "@/components/motion/wheel-picker";
import {
  curveCssValue,
  DENSITIES,
  durationCssValue,
  LINES,
  MOTION_CURVES,
  MOTION_DURATIONS,
  MOTION_SPRINGS,
  RADII,
  SHADOWS,
  SPACING_SCALE,
  springJsValue,
  TYPE_SCALE,
  type DensityAtom,
  type LineAtom,
  type MotionCurveAtom,
  type MotionDurationAtom,
  type MotionSpringAtom,
  type RadiusAtom,
  type ShadowAtom,
  type SpacingAtom,
  type TypeScaleAtom,
} from "@/lib/atoms";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { localizedName } from "@/lib/i18n-content";
import { allComponents } from "@/lib/registry";
import {
  atomName,
  BENCH_COLORS,
  type BenchColor,
  CapabilityRow,
  colorTokenText,
  DENSITY_STANDARD,
  densityTokenText,
  HallCard,
  installCommand,
  LineSpecimen,
  lineTokenText,
  RADIUS_LG,
  requireAtom,
  radiusTokenText,
  SHADOW_RAISED,
  shadowTokenText,
  SpacingSpecimen,
  spacingTokenText,
  Specimen,
  StepChip,
  StepGroup,
  TakeRow,
  TypeSpecimen,
  typeTokenText,
} from "./lab-presentation-ui";

function componentEntry(slug: string) {
  return allComponents().find((item) => item.slug === slug);
}

function NounLink({
  href,
  children,
}: {
  href: string;
  children: string;
}) {
  return (
    <Link
      href={href}
      className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
    >
      {children}
    </Link>
  );
}

export function MotionHall() {
  const t = useTranslations("labPresentation");
  const locale = useLocale() as Locale;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-medium text-foreground">{t("hallMotion")}</h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
        {t("hallMotionLede")}
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {MOTION_SPRINGS.map((atom) => (
          <HallCard
            key={`spring-${atom.slug}`}
            name={atomName(atom, locale)}
            nameEn={locale === "zh" ? atom.name : atom.nameZh}
            aliases={atom.aliases.join(" · ")}
            capabilities={["preview"]}
            sample={<SpringReplay atom={atom} />}
            takeaway={
              <TakeRow
                label={t("motionTakeToken")}
                text={`/* atoms/${atom.slug} */\n${springJsValue(atom.value)}`}
                eventLabel={`lab-spring-${atom.slug}`}
              />
            }
            footer={<NounLink href="/atoms?cat=motion">{t("motionAtomsLink")}</NounLink>}
          />
        ))}
        {MOTION_CURVES.map((atom) => (
          <HallCard
            key={`curve-${atom.slug}`}
            name={atomName(atom, locale)}
            nameEn={locale === "zh" ? atom.name : atom.nameZh}
            aliases={atom.aliases.join(" · ")}
            capabilities={["preview"]}
            sample={<CurveReplay atom={atom} />}
            takeaway={
              <TakeRow
                label={t("motionTakeToken")}
                text={`/* atoms/${atom.slug} */\n${curveCssValue(atom.value)}`}
                eventLabel={`lab-curve-${atom.slug}`}
              />
            }
            footer={<NounLink href="/atoms?cat=motion">{t("motionAtomsLink")}</NounLink>}
          />
        ))}
        {MOTION_DURATIONS.map((atom) => (
          <HallCard
            key={`duration-${atom.slug}`}
            name={atomName(atom, locale)}
            nameEn={locale === "zh" ? atom.name : atom.nameZh}
            aliases={atom.aliases.join(" · ")}
            capabilities={["preview"]}
            sample={<DurationReplay atom={atom} />}
            takeaway={
              <TakeRow
                label={t("motionTakeToken")}
                text={`/* atoms/${atom.slug} */\n${durationCssValue(atom.milliseconds)}`}
                eventLabel={`lab-duration-${atom.slug}`}
              />
            }
            footer={<NounLink href="/atoms?cat=motion">{t("motionAtomsLink")}</NounLink>}
          />
        ))}
      </div>
    </section>
  );
}

function ReplayButton({ onClick }: { onClick: () => void }) {
  const t = useTranslations("labPresentation");
  return (
    <Button variant="ghost" size="sm" onClick={onClick}>
      {t("replay")}
    </Button>
  );
}

function SpringReplay({ atom }: { atom: MotionSpringAtom }) {
  const reduce = useReducedMotion();
  const [key, setKey] = useState(0);
  const transition = reduce
    ? { duration: 0.15 }
    : { type: "spring" as const, ...atom.value };

  return (
    <div className="flex flex-col items-start gap-3">
      <motion.div
        key={`${atom.slug}-${key}`}
        initial={reduce ? { opacity: 0.4 } : { x: -28, scale: 0.86 }}
        animate={{ x: 0, scale: 1, opacity: 1 }}
        transition={transition}
        className="h-10 w-10 rounded-lg bg-foreground"
      />
      <ReplayButton onClick={() => setKey((n) => n + 1)} />
    </div>
  );
}

function CurveReplay({ atom }: { atom: MotionCurveAtom }) {
  const reduce = useReducedMotion();
  const [key, setKey] = useState(0);

  return (
    <div className="flex flex-col items-start gap-3">
      <motion.div
        key={`${atom.slug}-${key}`}
        initial={reduce ? { opacity: 0.4 } : { x: 0 }}
        animate={reduce ? { opacity: 1 } : { x: 56 }}
        transition={
          reduce ? { duration: 0.15 } : { duration: 0.55, ease: atom.value }
        }
        className="h-10 w-10 rounded-lg bg-foreground"
      />
      <ReplayButton onClick={() => setKey((n) => n + 1)} />
    </div>
  );
}

function DurationReplay({ atom }: { atom: MotionDurationAtom }) {
  const reduce = useReducedMotion();
  const [key, setKey] = useState(0);
  const seconds = atom.milliseconds / 1000;

  return (
    <div className="flex flex-col items-start gap-3">
      <motion.div
        key={`${atom.slug}-${key}`}
        initial={{ opacity: 0.15 }}
        animate={{ opacity: 1 }}
        transition={reduce ? { duration: 0.12 } : { duration: seconds }}
        className="h-10 w-10 rounded-lg bg-foreground"
      />
      <ReplayButton onClick={() => setKey((n) => n + 1)} />
    </div>
  );
}

export function NounHall() {
  const t = useTranslations("labPresentation");

  return (
    <section className="mt-14">
      <h2 className="text-lg font-medium text-foreground">{t("hallNoun")}</h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
        {t("hallNounLede")}
      </p>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <NounCard
          slug="bouncy-accordion"
          aliases={t("aliasAccordion")}
          neighbor={t("nounNeighbor")}
          sample={<AccordionSample />}
        />
        <NounCard
          slug="tabs"
          aliases={t("aliasTabs")}
          neighbor={t("neighborTabs")}
          sample={<TabsSample />}
        />
        <NounCard
          slug="switch"
          aliases={t("aliasSwitch")}
          neighbor={t("neighborSwitch")}
          sample={<SwitchSample />}
        />
        <NounCard
          slug="checkbox"
          aliases={t("aliasCheckbox")}
          neighbor={t("neighborCheckbox")}
          sample={<CheckboxSample />}
        />
        <NounCard
          slug="radio"
          aliases={t("aliasRadio")}
          neighbor={t("neighborRadio")}
          sample={<RadioSample />}
        />
        <NounCard
          slug="select"
          aliases={t("aliasSelect")}
          neighbor={t("neighborSelect")}
          sample={<SelectSample />}
        />
        <NounCard
          slug="input"
          aliases={t("aliasInput")}
          sample={<Input defaultValue={t("benchSampleValue")} />}
        />
        <NounCard
          slug="button"
          aliases={t("aliasButton")}
          sample={<Button>{t("motionPress")}</Button>}
        />
        <NounCard
          slug="tooltip"
          aliases={t("aliasTooltip")}
          sample={
            <Tooltip content={t("tooltipBody")}>
              <Button variant="secondary" size="sm">
                {t("tooltipTrigger")}
              </Button>
            </Tooltip>
          }
        />
        <NounCard
          slug="animated-badge"
          aliases={t("aliasBadge")}
          sample={<BadgeSample />}
        />
        <NounCard
          slug="range-slider"
          aliases={t("aliasSlider")}
          sample={<RangeSlider defaultValue={40} aria-label={t("sliderAria")} />}
        />
        <NounCard
          slug="drawer"
          aliases={t("aliasDrawer")}
          neighbor={t("neighborDrawer")}
          sample={<DrawerSample />}
        />
        <NounCard
          slug="skeleton"
          aliases={t("aliasSkeleton")}
          sample={
            <div className="space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-8 w-full" />
            </div>
          }
        />
        <NounCard
          slug="loader"
          aliases={t("aliasLoader")}
          sample={<Loader variant="spinner" size={32} />}
        />
        <NounCard
          slug="text-scramble"
          aliases={t("aliasScramble")}
          sample={<ScrambleSample />}
        />
        <NounCard
          slug="number"
          installSlug="number-ticker"
          aliases={t("aliasTicker")}
          sample={<TickerSample />}
        />
        <NounCard
          slug="theme-toggle"
          aliases={t("aliasTheme")}
          sample={<ThemeToggle />}
        />
        <NounCard
          slug="marquee"
          aliases={t("aliasMarquee")}
          sample={<MarqueeSample />}
        />
        <NounCard
          slug="tilt-card"
          aliases={t("aliasTilt")}
          sample={<TiltSample />}
        />
        <NounCard
          slug="popover"
          aliases={t("aliasPopover")}
          neighbor={t("neighborPopover")}
          sample={<PopoverSample />}
        />
        <NounCard
          slug="dropdown-menu"
          aliases={t("aliasMenu")}
          neighbor={t("neighborMenu")}
          sample={<MenuSample />}
        />
        <NounCard
          slug="star-border"
          aliases={t("aliasStar")}
          sample={
            <StarBorder className="inline-flex">
              <span className="rounded-lg bg-card px-3 py-2 text-sm text-foreground">
                {t("benchSampleBadge")}
              </span>
            </StarBorder>
          }
        />
        <NounCard
          slug="glare-hover"
          aliases={t("aliasGlare")}
          sample={<GlareSample />}
        />
        <NounCard
          slug="expanding-card"
          aliases={t("aliasExpanding")}
          sample={<ExpandingSample />}
        />
        <NounCard
          slug="expandable-control"
          aliases={t("aliasExpandable")}
          sample={
            <ExpandableButton
              icon={<Bell className="size-4" />}
              label={t("chipNotify")}
            />
          }
        />
        <NounCard
          slug="action-swap"
          aliases={t("aliasSwap")}
          sample={<SwapSample />}
        />
        <NounCard
          slug="animated-icon"
          aliases={t("aliasIcon")}
          sample={<AnimatedIcon variant="bounce" icon={Settings} />}
        />
        <NounCard
          slug="scroll-hint"
          aliases={t("aliasHint")}
          sample={<ScrollHint variant="mouse" label={t("scrollMore")} />}
        />
        <NounCard
          slug="wheel-picker"
          aliases={t("aliasWheel")}
          sample={<WheelSample />}
        />
        <NounCard
          slug="dock"
          aliases={t("aliasDock")}
          sample={<DockSample />}
        />
        <NounCard
          slug="bottom-sheet"
          aliases={t("aliasSheet")}
          neighbor={t("neighborSheet")}
          sample={<SheetSample />}
        />
        <NounCard
          slug="otp-input"
          aliases={t("aliasOtp")}
          neighbor={t("neighborOtp")}
          sample={
            <OTPInput
              length={4}
              defaultValue="2048"
              label={t("otpLabel")}
              hint={t("otpHint")}
            />
          }
        />
        <NounCard
          slug="file-tree"
          aliases={t("aliasTree")}
          sample={<TreeSample />}
        />
        <NounCard
          slug="shared-layout-bg"
          aliases={t("aliasShared")}
          sample={<SharedSample />}
        />
      </div>
    </section>
  );
}

function NounCard({
  slug,
  installSlug,
  aliases,
  neighbor,
  sample,
}: {
  slug: string;
  installSlug?: string;
  aliases: string;
  neighbor?: string;
  sample: React.ReactNode;
}) {
  const t = useTranslations("labPresentation");
  const locale = useLocale() as Locale;
  const entry = componentEntry(slug);
  const name = entry ? localizedName(entry, locale) : slug;
  const nameEn = entry
    ? locale === "zh"
      ? entry.name
      : (entry.nameZh ?? entry.name)
    : undefined;
  const command = installCommand(installSlug ?? slug);
  const pageHref = entry
    ? `/components/${entry.category.slug}/${slug}`
    : `/components/motion/${slug}`;

  return (
    <HallCard
      name={name}
      nameEn={nameEn}
      aliases={neighbor ? `${aliases} · ${neighbor}` : aliases}
      capabilities={["preview", "install"]}
      sample={sample}
      takeaway={
        <TakeRow
          label={t("nounTake")}
          text={command}
          eventLabel={`lab-install-${installSlug ?? slug}`}
        />
      }
      footer={<NounLink href={pageHref}>{t("nounPageLink")}</NounLink>}
    />
  );
}

function AccordionSample() {
  const t = useTranslations("labPresentation");
  return (
    <BouncyAccordion
      defaultValue="when"
      className="[&_button]:min-h-12 [&_button]:px-4"
      items={[
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
      ]}
    />
  );
}

function TabsSample() {
  const t = useTranslations("labPresentation");
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">{t("useTabOverview")}</TabsTrigger>
        <TabsTrigger value="billing">{t("useTabBilling")}</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="text-sm text-muted-foreground">
        {t("useTabOverviewBody")}
      </TabsContent>
      <TabsContent value="billing" className="text-sm text-muted-foreground">
        {t("useTabBillingBody")}
      </TabsContent>
    </Tabs>
  );
}

function SwitchSample() {
  const t = useTranslations("labPresentation");
  const [on, setOn] = useState(true);
  return (
    <Switch checked={on} onCheckedChange={setOn} label={t("switchLabel")} />
  );
}

function CheckboxSample() {
  const t = useTranslations("labPresentation");
  const [on, setOn] = useState(true);
  return (
    <Checkbox checked={on} onCheckedChange={setOn} label={t("checkboxLabel")} />
  );
}

function RadioSample() {
  const t = useTranslations("labPresentation");
  return (
    <RadioGroup defaultValue="a">
      <RadioGroupItem value="a" label={t("radioA")} />
      <RadioGroupItem value="b" label={t("radioB")} />
    </RadioGroup>
  );
}

function SelectSample() {
  const t = useTranslations("labPresentation");
  return (
    <Select defaultValue="graphite">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="graphite">{t("color_graphite")}</SelectItem>
        <SelectItem value="violet">{t("color_violet")}</SelectItem>
        <SelectItem value="teal">{t("color_teal")}</SelectItem>
      </SelectContent>
    </Select>
  );
}

function BadgeSample() {
  const t = useTranslations("labPresentation");
  const statuses = ["info", "success", "warning"] as const;
  const [index, setIndex] = useState(0);
  const status = statuses[index % statuses.length];
  return (
    <button type="button" onClick={() => setIndex((n) => n + 1)}>
      <AnimatedBadge status={status} contentKey={status}>
        {t(`badge_${status}`)}
      </AnimatedBadge>
    </button>
  );
}

function DrawerSample() {
  const t = useTranslations("labPresentation");
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button size="sm" onClick={() => setOpen(true)}>
        {t("drawerOpen")}
      </Button>
      <Drawer open={open} onOpenChange={setOpen} ariaLabel={t("drawerTitle")}>
        <div className="flex h-full flex-col p-5">
          <p className="text-base font-medium text-foreground">{t("drawerTitle")}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("drawerBody")}
          </p>
          <Button
            className="mt-auto"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            {t("drawerClose")}
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

function ScrambleSample() {
  const t = useTranslations("labPresentation");
  const texts = [t("scrambleA"), t("scrambleB")];
  const [index, setIndex] = useState(0);
  return (
    <div className="flex flex-col items-start gap-3">
      <TextScramble
        key={index}
        text={texts[index % texts.length]}
        trigger="view"
        className="text-sm font-medium text-foreground"
      />
      <ReplayButton onClick={() => setIndex((n) => n + 1)} />
    </div>
  );
}

function TickerSample() {
  const [value, setValue] = useState(1280);
  return (
    <div className="flex flex-col items-start gap-3">
      <NumberTicker value={value} startOnView={false} className="text-2xl" />
      <ReplayButton onClick={() => setValue((n) => n + 240)} />
    </div>
  );
}

function MarqueeSample() {
  const t = useTranslations("labPresentation");
  const words = [t("marqueeA"), t("marqueeB"), t("marqueeC"), t("marqueeD")];
  return (
    <Marquee speed={28} className="max-w-full">
      {words.map((word) => (
        <span
          key={word}
          className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
        >
          {word}
        </span>
      ))}
    </Marquee>
  );
}

function TiltSample() {
  const t = useTranslations("labPresentation");
  return (
    <TiltCard className="w-full max-w-56">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-medium text-foreground">{t("tiltTitle")}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {t("tiltBody")}
        </p>
      </div>
    </TiltCard>
  );
}

function PopoverSample() {
  const t = useTranslations("labPresentation");
  return (
    <Popover side="bottom" align="start">
      <PopoverTrigger>
        <Button variant="secondary" size="sm">
          {t("popoverOpen")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56">
        <p className="text-sm text-foreground">{t("popoverBody")}</p>
      </PopoverContent>
    </Popover>
  );
}

function MenuSample() {
  const t = useTranslations("labPresentation");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>{t("menuOpen")}</DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>{t("useTabOverview")}</DropdownMenuItem>
        <DropdownMenuItem>{t("useTabBilling")}</DropdownMenuItem>
        <DropdownMenuItem>{t("useTabMembers")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function GlareSample() {
  const t = useTranslations("labPresentation");
  return (
    <GlareHover className="w-full max-w-56">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="text-sm font-medium text-foreground">{t("glareTitle")}</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          {t("glareBody")}
        </p>
      </div>
    </GlareHover>
  );
}

function ExpandingSample() {
  const t = useTranslations("labPresentation");
  return (
    <ExpandingCard
      title={t("expandTitle")}
      summary={t("expandSummary")}
      expandHint={t("expandHint")}
    >
      <p className="text-sm leading-6 text-muted-foreground">{t("expandBody")}</p>
    </ExpandingCard>
  );
}

function SwapSample() {
  const t = useTranslations("labPresentation");
  return (
    <ActionSwapButton
      items={[
        { id: "copy", label: t("swapCopy"), icon: <Copy className="h-4 w-4" /> },
        { id: "copied", label: t("swapCopied") },
      ]}
    />
  );
}

function WheelSample() {
  const t = useTranslations("labPresentation");
  return (
    <WheelPicker
      options={[t("color_graphite"), t("color_violet"), t("color_teal")]}
      defaultValue={t("color_graphite")}
      visibleCount={3}
      aria-label={t("wheelAria")}
      className="w-40"
    />
  );
}

function DockSample() {
  const t = useTranslations("labPresentation");
  const [active, setActive] = useState("home");
  return (
    <Dock size={36}>
      <DockItem
        aria-label={t("dockHome")}
        active={active === "home"}
        onClick={() => setActive("home")}
      >
        <Home className="h-4 w-4" />
      </DockItem>
      <DockItem
        aria-label={t("dockMail")}
        active={active === "mail"}
        onClick={() => setActive("mail")}
      >
        <Mail className="h-4 w-4" />
      </DockItem>
      <DockItem
        aria-label={t("dockMore")}
        active={active === "more"}
        onClick={() => setActive("more")}
      >
        <Settings className="h-4 w-4" />
      </DockItem>
    </Dock>
  );
}

function SheetSample() {
  const t = useTranslations("labPresentation");
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button size="sm" onClick={() => setOpen(true)}>
        {t("sheetOpen")}
      </Button>
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        snapPoints={[0.38, 0.72]}
        title={t("sheetTitle")}
        description={t("sheetBody")}
      >
        <p className="text-sm leading-6 text-muted-foreground">{t("sheetBody")}</p>
      </BottomSheet>
    </div>
  );
}

function TreeSample() {
  const t = useTranslations("labPresentation");
  return (
    <FileTree defaultExpandedIds={["src"]} ariaLabel={t("treeAria")}>
      <FileTreeFolder value="src" name="src">
        <FileTreeFile value="button" name="button.tsx" />
        <FileTreeFile value="input" name="input.tsx" />
      </FileTreeFolder>
    </FileTree>
  );
}

function SharedSample() {
  const t = useTranslations("labPresentation");
  const rows = [
    { id: "inbox", title: t("layoutInbox") },
    { id: "drafts", title: t("layoutDrafts") },
    { id: "more", title: t("dockMore") },
  ];
  return (
    <SharedLayoutBg>
      {rows.map((row) => (
        <button
          key={row.id}
          type="button"
          className="w-full px-2 py-2 text-left text-sm text-foreground"
        >
          {row.title}
        </button>
      ))}
    </SharedLayoutBg>
  );
}

export function SystemHall() {
  const t = useTranslations("labPresentation");
  const locale = useLocale() as Locale;
  const [radius, setRadius] = useState<RadiusAtom>(RADIUS_LG);
  const [shadow, setShadow] = useState<ShadowAtom>(SHADOW_RAISED);
  const [color, setColor] = useState<BenchColor>("graphite");
  const [density, setDensity] = useState<DensityAtom>(DENSITY_STANDARD);
  const [spacing, setSpacing] = useState<SpacingAtom>(() =>
    requireAtom(SPACING_SCALE, "base"),
  );
  const [line, setLine] = useState<LineAtom>(() => requireAtom(LINES, "border"));
  const [typeStep, setTypeStep] = useState<TypeScaleAtom>(() =>
    requireAtom(TYPE_SCALE, "title"),
  );

  return (
    <section className="mt-14">
      <h2 className="text-lg font-medium text-foreground">{t("hallSystem")}</h2>
      <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
        {t("hallSystemLede")}
      </p>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <SystemLadder
          title={t("systemRadius")}
          aliases={t("systemRadiusAliases")}
          takeLabel={t("systemTake")}
          text={radiusTokenText(radius)}
          eventLabel="lab-hall-radius"
          chips={
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
          }
        >
          <Specimen radius={radius} />
        </SystemLadder>
        <SystemLadder
          title={t("systemShadow")}
          aliases={t("systemShadowAliases")}
          takeLabel={t("systemTake")}
          text={shadowTokenText(shadow)}
          eventLabel="lab-hall-shadow"
          chips={
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
          }
        >
          <Specimen radius={RADIUS_LG} shadow={shadow} />
        </SystemLadder>
        <SystemLadder
          title={t("systemColor")}
          aliases={t("systemColorAliases")}
          takeLabel={t("systemTake")}
          text={colorTokenText(color)}
          eventLabel="lab-hall-color"
          chips={
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
          }
        >
          <Specimen radius={RADIUS_LG} color={color} />
        </SystemLadder>
        <SystemLadder
          title={t("systemDensity")}
          aliases={t("systemDensityAliases")}
          takeLabel={t("systemTake")}
          text={densityTokenText(density)}
          eventLabel="lab-hall-density"
          chips={
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
          }
        >
          <Specimen radius={RADIUS_LG} density={density} />
        </SystemLadder>
        <SystemLadder
          title={t("systemSpacing")}
          aliases={t("systemSpacingAliases")}
          takeLabel={t("systemTake")}
          text={spacingTokenText(spacing)}
          eventLabel="lab-hall-spacing"
          chips={
            <StepGroup label={t("benchSpacing")}>
              {SPACING_SCALE.map((step) => (
                <StepChip
                  key={step.slug}
                  pressed={spacing.slug === step.slug}
                  onClick={() => setSpacing(step)}
                >
                  {atomName(step, locale)}
                </StepChip>
              ))}
            </StepGroup>
          }
        >
          <SpacingSpecimen spacing={spacing} />
        </SystemLadder>
        <SystemLadder
          title={t("systemLine")}
          aliases={t("systemLineAliases")}
          takeLabel={t("systemTake")}
          text={lineTokenText(line)}
          eventLabel="lab-hall-line"
          chips={
            <StepGroup label={t("benchLine")}>
              {LINES.map((step) => (
                <StepChip
                  key={step.slug}
                  pressed={line.slug === step.slug}
                  onClick={() => setLine(step)}
                >
                  {atomName(step, locale)}
                </StepChip>
              ))}
            </StepGroup>
          }
        >
          <LineSpecimen line={line} />
        </SystemLadder>
        <SystemLadder
          title={t("systemType")}
          aliases={t("systemTypeAliases")}
          takeLabel={t("systemTake")}
          text={typeTokenText(typeStep)}
          eventLabel="lab-hall-type"
          chips={
            <StepGroup label={t("benchType")}>
              {TYPE_SCALE.map((step) => (
                <StepChip
                  key={step.slug}
                  pressed={typeStep.slug === step.slug}
                  onClick={() => setTypeStep(step)}
                >
                  {atomName(step, locale)}
                </StepChip>
              ))}
            </StepGroup>
          }
        >
          <TypeSpecimen step={typeStep} />
        </SystemLadder>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        <NounLink href="/atoms?cat=shape">{t("benchAtomsLink")}</NounLink>
      </p>
    </section>
  );
}

function SystemLadder({
  title,
  aliases,
  chips,
  children,
  takeLabel,
  text,
  eventLabel,
}: {
  title: string;
  aliases: string;
  chips: React.ReactNode;
  children: React.ReactNode;
  takeLabel: string;
  text: string;
  eventLabel: string;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <h3 className="text-base font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-xs text-muted-foreground">{aliases}</p>
      <div className="mt-4">{chips}</div>
      <div className="mt-4">{children}</div>
      <div className="mt-4">
        <CapabilityRow items={["preview", "adjust"]} />
      </div>
      <div className="mt-4">
        <TakeRow label={takeLabel} text={text} eventLabel={eventLabel} />
      </div>
    </article>
  );
}
