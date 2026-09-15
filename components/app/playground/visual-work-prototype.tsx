"use client";

// PROTOTYPE — One staged visual-work flow: Explore → Refine, with Focus as a
// temporary preview mode. Delete after the product question is settled.

import {
  ArrowLeft,
  ArrowRight,
  BadgeInfo,
  Car,
  CarFront,
  Check,
  ChevronRight,
  CircleParking,
  Clock3,
  Code2,
  Copy,
  CreditCard,
  Eye,
  FileCode2,
  Lock,
  type LucideIcon,
  Maximize2,
  Monitor,
  MousePointer2,
  PanelRight,
  ScanLine,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/motion/button";
import { cn } from "@/lib/utils";

type WorkMode = "explore" | "refine" | "focus";
type Density = "compact" | "balanced" | "airy";
type IconChoice = "car" | "front" | "parking" | "info";
type CopyChoice = "manage" | "options" | "status";
type PreviewViewport = "desktop" | "mobile";
type Region = "header" | "summary" | "activity" | "actions";

type PrototypeState = {
  density: Density;
  icon: IconChoice;
  copy: CopyChoice;
  viewport: PreviewViewport;
  selectedRegion: Region;
  lockedRegions: Region[];
};

const ICONS: readonly {
  id: IconChoice;
  Icon: LucideIcon;
  labelKey: "iconCar" | "iconFront" | "iconParking" | "iconInfo";
}[] = [
  { id: "car", Icon: Car, labelKey: "iconCar" },
  { id: "front", Icon: CarFront, labelKey: "iconFront" },
  { id: "parking", Icon: CircleParking, labelKey: "iconParking" },
  { id: "info", Icon: BadgeInfo, labelKey: "iconInfo" },
];

const COPY_KEYS: Record<CopyChoice, "copyManage" | "copyOptions" | "copyStatus"> = {
  manage: "copyManage",
  options: "copyOptions",
  status: "copyStatus",
};

const DENSITY_GAPS: Record<Density, string> = {
  compact: "gap-2",
  balanced: "gap-4",
  airy: "gap-7",
};

const DENSITY_PADDING: Record<Density, string> = {
  compact: "p-3",
  balanced: "p-5",
  airy: "p-7",
};

function isWorkMode(value: string | null): value is WorkMode {
  return value === "explore" || value === "refine" || value === "focus";
}

function ReferenceThumbnail({ kind }: { kind: "hierarchy" | "status" }) {
  if (kind === "hierarchy") {
    return (
      <div className="grid h-20 grid-cols-[30%_1fr] gap-2 rounded-xl bg-[#171717] p-2.5">
        <div className="rounded-md border border-white/8 bg-white/4 p-1.5">
          <div className="h-1 w-7 rounded-full bg-white/30" />
          <div className="mt-2 h-1 w-10 rounded-full bg-white/10" />
          <div className="mt-1 h-1 w-6 rounded-full bg-white/10" />
        </div>
        <div className="rounded-md border border-white/8 bg-white/3 p-2">
          <div className="h-1.5 w-16 rounded-full bg-white/50" />
          <div className="mt-3 grid grid-cols-2 gap-1.5">
            <div className="h-4 rounded bg-white/8" />
            <div className="h-4 rounded bg-white/8" />
            <div className="h-4 rounded bg-white/8" />
            <div className="h-4 rounded bg-white/8" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-20 items-center justify-center rounded-xl bg-[#f4f0eb] p-3">
      <div className="w-full rounded-lg border border-[#ded7ce] bg-white p-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="h-1.5 w-16 rounded-full bg-[#20201f]/70" />
          <div className="rounded-full bg-[#d8f3df] px-2 py-1">
            <div className="h-1 w-8 rounded-full bg-[#247244]" />
          </div>
        </div>
        <div className="mt-2 h-1 w-24 rounded-full bg-[#20201f]/15" />
      </div>
    </div>
  );
}

function ReferencePanel({ compact = false }: { compact?: boolean }) {
  const t = useTranslations("visualWorkPrototype");

  return (
    <section className={cn("rounded-2xl border border-border bg-card/55", compact ? "p-3" : "p-4")}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {t("referencesEyebrow")}
          </p>
          <h2 className="mt-1 text-sm font-semibold text-foreground">{t("referencesTitle")}</h2>
        </div>
        <span className="rounded-full border border-border px-2 py-1 text-[10px] text-muted-foreground">
          2 {t("selected")}
        </span>
      </div>

      <div className={cn("mt-3 grid gap-3", compact ? "sm:grid-cols-2" : "grid-cols-1")}>
        <button type="button" className="rounded-xl border border-primary/35 bg-primary/5 p-2 text-left">
          <ReferenceThumbnail kind="hierarchy" />
          <div className="mt-2 flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-foreground">Linear</p>
              <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                {t("hierarchyReference")}
              </p>
            </div>
            <Check className="mt-0.5 h-3.5 w-3.5 text-primary" />
          </div>
        </button>

        <button type="button" className="rounded-xl border border-primary/35 bg-primary/5 p-2 text-left">
          <ReferenceThumbnail kind="status" />
          <div className="mt-2 flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-medium text-foreground">Stripe</p>
              <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">
                {t("statusReference")}
              </p>
            </div>
            <Check className="mt-0.5 h-3.5 w-3.5 text-primary" />
          </div>
        </button>
      </div>

      {!compact ? (
        <div className="mt-3 rounded-xl border border-dashed border-border px-3 py-3 text-xs leading-5 text-muted-foreground">
          <MousePointer2 className="mr-1.5 inline h-3.5 w-3.5" />
          {t("referenceHint")}
        </div>
      ) : null}
    </section>
  );
}

function RegionButton({
  id,
  selected,
  locked,
  onSelect,
  className,
  children,
}: {
  id: Region;
  selected: boolean;
  locked: boolean;
  onSelect: (region: Region) => void;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={cn(
        "relative w-full rounded-xl border text-left transition-[border-color,box-shadow]",
        selected
          ? "border-[#f36f45] shadow-[0_0_0_2px_rgb(243_111_69_/_0.18)]"
          : "border-[#deddd8] hover:border-[#aaa9a3]",
        className,
      )}
    >
      {locked ? (
        <span className="absolute right-2 top-2 z-10 rounded-full bg-[#232321] p-1 text-white">
          <Lock className="h-2.5 w-2.5" />
        </span>
      ) : null}
      {children}
    </button>
  );
}

function TargetPreview({
  state,
  density = state.density,
  onSelectRegion,
  compact = false,
}: {
  state: PrototypeState;
  density?: Density;
  onSelectRegion: (region: Region) => void;
  compact?: boolean;
}) {
  const t = useTranslations("visualWorkPrototype");
  const iconEntry = ICONS.find((entry) => entry.id === state.icon) ?? ICONS[1];
  const VehicleIcon = iconEntry.Icon;
  const locked = (region: Region) => state.lockedRegions.includes(region);
  const selected = (region: Region) => state.selectedRegion === region;

  return (
    <div
      className={cn(
        "mx-auto overflow-hidden rounded-[22px] border border-black/10 bg-[#f5f5f2] text-[#20201f] shadow-[0_22px_60px_rgb(15_15_14_/_0.12)]",
        state.viewport === "mobile" ? "max-w-[390px]" : "w-full",
        compact && "rounded-2xl shadow-sm",
      )}
    >
      <div className="flex h-11 items-center justify-between border-b border-black/8 bg-white/75 px-4">
        <div className="flex items-center gap-2">
          <span className="grid h-5 w-5 place-items-center rounded-md bg-[#232321] text-white">
            <CircleParking className="h-3 w-3" />
          </span>
          <span className="text-[11px] font-semibold tracking-[-0.01em]">Park OS</span>
          <ChevronRight className="h-3 w-3 text-black/30" />
          <span className="text-[10px] text-black/45">{t("vehicleArchive")}</span>
        </div>
        <span className="rounded-full border border-black/8 bg-white px-2 py-1 text-[9px] text-black/45">
          {t("realRuntime")}
        </span>
      </div>

      <div className={cn("grid", DENSITY_GAPS[density], DENSITY_PADDING[density])}>
        <RegionButton
          id="header"
          selected={selected("header")}
          locked={locked("header")}
          onSelect={onSelectRegion}
          className={cn("bg-white", compact ? "p-3" : "p-4")}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#ede7df] text-[#6a4939]">
                <VehicleIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="text-[9px] font-medium uppercase tracking-[0.16em] text-black/35">
                  {t("vehicleProfile")}
                </p>
                <h3 className={cn("mt-0.5 truncate font-semibold tracking-[-0.04em]", compact ? "text-base" : "text-xl")}>
                  {t("plateNumber")}
                </h3>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-[#daf2df] px-2.5 py-1 text-[10px] font-medium text-[#25673d]">
              {t("parkedDuration")}
            </span>
          </div>
        </RegionButton>

        <div
          className={cn(
            "grid",
            DENSITY_GAPS[density],
            state.viewport === "mobile" || compact ? "grid-cols-1" : "grid-cols-[minmax(0,1fr)_150px]",
          )}
        >
          <RegionButton
            id="summary"
            selected={selected("summary")}
            locked={locked("summary")}
            onSelect={onSelectRegion}
            className={cn("bg-white", compact ? "p-3" : "p-4")}
          >
            <p className="text-[10px] font-semibold text-black/80">{t("vehicleInfo")}</p>
            <div className={cn("mt-3 grid grid-cols-2", density === "compact" ? "gap-x-3 gap-y-2" : density === "balanced" ? "gap-x-5 gap-y-3" : "gap-x-7 gap-y-5")}>
              {[
                [t("owner"), t("ownerValue")],
                [t("phone"), t("phoneValue")],
                [t("vehicleType"), t("vehicleTypeValue")],
                [t("monthlyTicket"), t("monthlyTicketValue")],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-[9px] text-black/35">{label}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-black/75">{value}</p>
                </div>
              ))}
            </div>
          </RegionButton>

          <RegionButton
            id="actions"
            selected={selected("actions")}
            locked={locked("actions")}
            onSelect={onSelectRegion}
            className={cn("bg-[#232321] text-white", compact ? "p-3" : "p-4")}
          >
            <PanelRight className="h-4 w-4 text-white/45" />
            <p className="mt-5 text-[9px] uppercase tracking-[0.14em] text-white/40">
              {t("primaryAction")}
            </p>
            <p className="mt-1 text-xs font-medium">{t(COPY_KEYS[state.copy])}</p>
            <div className="mt-3 flex items-center gap-1 text-[9px] text-white/45">
              {t("openActionRail")}
              <ChevronRight className="h-3 w-3" />
            </div>
          </RegionButton>
        </div>

        <RegionButton
          id="activity"
          selected={selected("activity")}
          locked={locked("activity")}
          onSelect={onSelectRegion}
          className={cn("bg-white", compact ? "p-3" : "p-4")}
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-semibold text-black/80">{t("recentActivity")}</p>
            <span className="text-[9px] text-black/35">{t("today")}</span>
          </div>
          <div className={cn("mt-3 grid", density === "compact" ? "gap-2" : "gap-3")}>
            {[
              { Icon: ScanLine, title: t("enteredPark"), meta: "09:42 · North Gate" },
              { Icon: CreditCard, title: t("monthlyTicketApplied"), meta: "09:42 · ¥0.00" },
              { Icon: Clock3, title: t("parkingInProgress"), meta: "02:14:08" },
            ].map(({ Icon, title, meta }) => (
              <div key={title} className="flex items-center gap-3 border-t border-black/6 pt-2.5 first:border-0 first:pt-0">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#f2f1ed] text-black/45">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-medium text-black/70">{title}</p>
                  <p className="mt-0.5 truncate text-[9px] text-black/35">{meta}</p>
                </div>
              </div>
            ))}
          </div>
        </RegionButton>
      </div>
    </div>
  );
}

function DensityMiniature({ density }: { density: Density }) {
  const gaps = density === "compact" ? "gap-0.5" : density === "balanced" ? "gap-1" : "gap-1.5";
  return (
    <span className={cn("grid h-9 w-11 rounded-lg border border-current/15 p-1.5", gaps)}>
      <span className="h-1 rounded-full bg-current/50" />
      <span className="h-1 rounded-full bg-current/20" />
      <span className="h-1 rounded-full bg-current/20" />
    </span>
  );
}

function InspectorPanel({
  state,
  onChange,
  onToggleLock,
  onConfirm,
  confirmed,
  compact = false,
}: {
  state: PrototypeState;
  onChange: <K extends keyof PrototypeState>(key: K, value: PrototypeState[K]) => void;
  onToggleLock: () => void;
  onConfirm: () => void;
  confirmed: boolean;
  compact?: boolean;
}) {
  const t = useTranslations("visualWorkPrototype");
  const selectedLocked = state.lockedRegions.includes(state.selectedRegion);
  const selectedIcon = ICONS.find((entry) => entry.id === state.icon) ?? ICONS[1];
  const densityGap = state.density === "compact" ? "gap-3" : state.density === "balanced" ? "gap-6" : "gap-10";

  return (
    <section className={cn("rounded-2xl border border-border bg-card/70", compact ? "p-3" : "p-4")}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {t("inspectorEyebrow")}
          </p>
          <h2 className="mt-1 text-sm font-semibold text-foreground">
            {t(`region_${state.selectedRegion}`)}
          </h2>
        </div>
        <span className="rounded-md border border-border bg-background/70 px-2 py-1 font-mono text-[9px] text-muted-foreground">
          vehicle-detail.tsx
        </span>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-medium text-muted-foreground">{t("density")}</p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {(["compact", "balanced", "airy"] as const).map((density) => (
            <button
              key={density}
              type="button"
              onClick={() => onChange("density", density)}
              aria-pressed={state.density === density}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border px-1.5 py-2 text-[9px] transition-colors",
                state.density === density
                  ? "border-primary bg-primary/8 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <DensityMiniature density={density} />
              {t(`density_${density}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-medium text-muted-foreground">{t("vehicleIcon")}</p>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {ICONS.map(({ id, Icon, labelKey }) => (
            <button
              key={id}
              type="button"
              onClick={() => onChange("icon", id)}
              aria-label={t(labelKey)}
              aria-pressed={state.icon === id}
              className={cn(
                "grid h-10 place-items-center rounded-xl border transition-colors",
                state.icon === id
                  ? "border-primary bg-primary/8 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[10px] font-medium text-muted-foreground">{t("actionCopy")}</p>
        <div className="mt-2 grid gap-1.5">
          {(["manage", "options", "status"] as const).map((copy) => (
            <button
              key={copy}
              type="button"
              onClick={() => onChange("copy", copy)}
              aria-pressed={state.copy === copy}
              className={cn(
                "rounded-lg border px-3 py-2 text-left text-[11px] transition-colors",
                state.copy === copy
                  ? "border-primary bg-primary/8 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {t(COPY_KEYS[copy])}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border bg-background/60 p-3">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-foreground">
          <Code2 className="h-3.5 w-3.5" />
          {t("exactCode")}
        </div>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap font-mono text-[9px] leading-4 text-muted-foreground">{`<VehicleDetail
  density="${state.density}"
  icon={${selectedIcon.Icon.displayName ?? selectedIcon.Icon.name ?? "CarFront"}}
  actionLabel="${t(COPY_KEYS[state.copy])}"
  className="${densityGap}"
/>`}</pre>
      </div>

      <button
        type="button"
        onClick={onToggleLock}
        className={cn(
          "mt-3 flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-medium transition-colors",
          selectedLocked
            ? "border-foreground bg-foreground text-background"
            : "border-border text-foreground hover:bg-muted",
        )}
      >
        <Lock className="h-3.5 w-3.5" />
        {selectedLocked ? t("unlockRegion") : t("lockRegion")}
      </button>

      <Button onClick={onConfirm} className="mt-2 w-full" size="sm">
        {confirmed ? <Check className="h-3.5 w-3.5" /> : <FileCode2 className="h-3.5 w-3.5" />}
        {confirmed ? t("implementationConfirmed") : t("confirmImplementation")}
      </Button>
    </section>
  );
}

function PreviewFrame({
  state,
  onChange,
  title,
  compact = false,
  onFocus,
}: {
  state: PrototypeState;
  onChange: <K extends keyof PrototypeState>(key: K, value: PrototypeState[K]) => void;
  title: string;
  compact?: boolean;
  onFocus?: () => void;
}) {
  const t = useTranslations("visualWorkPrototype");
  return (
    <section className="min-w-0 rounded-2xl border border-border bg-[#11110f] p-2 shadow-[0_22px_80px_rgb(0_0_0_/_0.18)]">
      <div className="flex items-center justify-between gap-3 px-2 py-1.5 text-white/60">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#4fd280]" />
          <span className="text-[10px] font-medium">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          {onFocus ? (
            <button
              type="button"
              onClick={onFocus}
              className="flex h-7 items-center gap-1.5 rounded-lg px-2 text-[9px] text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <Maximize2 className="h-3 w-3" />
              {t("focusPreview")}
            </button>
          ) : null}
          <div className="flex items-center gap-1 rounded-lg bg-white/7 p-0.5">
            {(["desktop", "mobile"] as const).map((viewport) => {
              const Icon = viewport === "desktop" ? Monitor : Smartphone;
              return (
                <button
                  key={viewport}
                  type="button"
                  onClick={() => onChange("viewport", viewport)}
                  aria-label={t(`viewport_${viewport}`)}
                  aria-pressed={state.viewport === viewport}
                  className={cn(
                    "grid h-6 w-7 place-items-center rounded-md",
                    state.viewport === viewport ? "bg-white text-black" : "text-white/50",
                  )}
                >
                  <Icon className="h-3 w-3" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className={cn("overflow-auto rounded-xl bg-[#d9d9d4]", compact ? "p-2" : "p-3 sm:p-5")}>
        <TargetPreview
          state={state}
          onSelectRegion={(region) => onChange("selectedRegion", region)}
          compact={compact}
        />
      </div>
    </section>
  );
}

function StateStrip({ state, confirmed }: { state: PrototypeState; confirmed: boolean }) {
  const t = useTranslations("visualWorkPrototype");
  const selectedIcon = ICONS.find((entry) => entry.id === state.icon) ?? ICONS[1];
  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-xl border border-border bg-card/50 px-3 py-2 font-mono text-[9px] text-muted-foreground">
      <span className="flex items-center gap-1.5 text-foreground">
        <span className={cn("h-1.5 w-1.5 rounded-full", confirmed ? "bg-emerald-500" : "bg-amber-500")} />
        {confirmed ? t("stateConfirmed") : t("stateExploring")}
      </span>
      <span>region={state.selectedRegion}</span>
      <span>density={state.density}</span>
      <span>icon={selectedIcon.id}</span>
      <span>viewport={state.viewport}</span>
      <span>locked=[{state.lockedRegions.join(", ") || "—"}]</span>
    </div>
  );
}

function CockpitShell({
  state,
  onChange,
  onToggleLock,
  onConfirm,
  confirmed,
  onFocus,
}: ShellProps & { onFocus: () => void }) {
  const t = useTranslations("visualWorkPrototype");
  return (
    <div>
      <div className="grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)_270px]">
        <ReferencePanel />
        <PreviewFrame state={state} onChange={onChange} title={t("targetRuntime")} onFocus={onFocus} />
        <InspectorPanel
          state={state}
          onChange={onChange}
          onToggleLock={onToggleLock}
          onConfirm={onConfirm}
          confirmed={confirmed}
        />
      </div>
      <StateStrip state={state} confirmed={confirmed} />
    </div>
  );
}

function FocusShell({
  state,
  onChange,
  confirmed,
  onExit,
}: Pick<ShellProps, "state" | "onChange" | "confirmed"> & { onExit: () => void }) {
  const t = useTranslations("visualWorkPrototype");
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card/45 px-3 py-2.5">
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {t("exitFocus")}
        </button>
        <p className="text-[10px] text-muted-foreground">{t("focusHint")}</p>
      </div>
      <div className="min-h-[680px] rounded-3xl border border-border bg-[radial-gradient(circle_at_center,var(--color-muted)_1px,transparent_1px)] bg-size-[18px_18px] p-3 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-6xl">
          <PreviewFrame state={state} onChange={onChange} title={t("canvasRuntime")} />
        </div>
      </div>
      <StateStrip state={state} confirmed={confirmed} />
    </div>
  );
}

function CompareShell({
  state,
  onChange,
  onToggleLock,
  onConfirm,
  confirmed,
  onContinue,
}: ShellProps & { onContinue: () => void }) {
  const t = useTranslations("visualWorkPrototype");
  const candidates: readonly Density[] = ["compact", "balanced", "airy"];
  return (
    <div>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_260px]">
        <section className="rounded-2xl border border-border bg-card/35 p-3 sm:p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                {t("compareEyebrow")}
              </p>
              <h2 className="mt-1 text-sm font-semibold text-foreground">{t("compareTitle")}</h2>
            </div>
            <span className="text-[10px] text-muted-foreground">{t("compareHint")}</span>
          </div>
          <div className="mt-4 grid gap-3 lg:grid-cols-3">
            {candidates.map((density, index) => {
              const candidateState = { ...state, density };
              const active = state.density === density;
              return (
                <div
                  key={density}
                  className={cn(
                    "min-w-0 rounded-2xl border p-2 text-left transition-colors",
                    active ? "border-primary bg-primary/5" : "border-border hover:border-foreground/25",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => onChange("density", density)}
                    className="mb-2 flex w-full items-center justify-between rounded-lg px-1 py-1 text-left"
                  >
                    <span className="text-[10px] font-semibold text-foreground">
                      {String.fromCharCode(65 + index)} · {t(`density_${density}`)}
                    </span>
                    {active ? <Check className="h-3.5 w-3.5 text-primary" /> : null}
                  </button>
                  <div className="pointer-events-none rounded-xl bg-[#11110f] p-1.5">
                    <TargetPreview state={candidateState} density={density} onSelectRegion={() => undefined} compact />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex flex-col justify-between gap-3 rounded-xl border border-primary/20 bg-primary/5 px-3 py-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold text-foreground">
                {t("selectedCandidate")}: {t(`density_${state.density}`)}
              </p>
              <p className="mt-0.5 text-[10px] text-muted-foreground">{t("selectedCandidateHint")}</p>
            </div>
            <Button onClick={onContinue} size="sm" className="shrink-0">
              {t("continueToRefine")}
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        </section>
        <div className="grid content-start gap-4">
          <ReferencePanel />
          <InspectorPanel
            state={state}
            onChange={onChange}
            onToggleLock={onToggleLock}
            onConfirm={onConfirm}
            confirmed={confirmed}
            compact
          />
        </div>
      </div>
      <StateStrip state={state} confirmed={confirmed} />
    </div>
  );
}

type ShellProps = {
  state: PrototypeState;
  onChange: <K extends keyof PrototypeState>(key: K, value: PrototypeState[K]) => void;
  onToggleLock: () => void;
  onConfirm: () => void;
  confirmed: boolean;
};

function WorkflowNav({
  mode,
  onChange,
}: {
  mode: WorkMode;
  onChange: (mode: WorkMode) => void;
}) {
  const t = useTranslations("visualWorkPrototype");
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center rounded-full border border-border bg-background/60 p-1">
        {(["explore", "refine"] as const).map((step, index) => (
          <button
            key={step}
            type="button"
            onClick={() => onChange(step)}
            aria-pressed={mode === step}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-[10px] font-medium transition-colors",
              mode === step ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span
              className={cn(
                "grid h-4 w-4 place-items-center rounded-full text-[8px]",
                mode === step ? "bg-background/15" : "border border-border",
              )}
            >
              {index + 1}
            </span>
            {t(`mode_${step}`)}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => onChange(mode === "focus" ? "refine" : "focus")}
        aria-pressed={mode === "focus"}
        className={cn(
          "flex h-8 items-center gap-1.5 rounded-full border px-3 text-[10px] font-medium transition-colors",
          mode === "focus"
            ? "border-foreground bg-foreground text-background"
            : "border-border text-muted-foreground hover:text-foreground",
        )}
      >
        <Maximize2 className="h-3 w-3" />
        {t("mode_focus")}
      </button>
    </div>
  );
}

export function VisualWorkPrototype() {
  const t = useTranslations("visualWorkPrototype");
  const searchParams = useSearchParams();
  const requestedMode = searchParams.get("mode");
  const [mode, setMode] = useState<WorkMode>(() =>
    isWorkMode(requestedMode) ? requestedMode : "explore",
  );
  const [state, setState] = useState<PrototypeState>({
    density: "balanced",
    icon: "front",
    copy: "status",
    viewport: "desktop",
    selectedRegion: "summary",
    lockedRegions: ["header"],
  });
  const [confirmed, setConfirmed] = useState(false);

  const changeMode = (next: WorkMode) => {
    setMode(next);
    const params = new URLSearchParams(window.location.search);
    params.delete("variant");
    params.set("mode", next);
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  };

  const changeState = <K extends keyof PrototypeState>(key: K, value: PrototypeState[K]) => {
    setState((current) => ({ ...current, [key]: value }));
    setConfirmed(false);
  };

  const toggleSelectedLock = () => {
    setState((current) => ({
      ...current,
      lockedRegions: current.lockedRegions.includes(current.selectedRegion)
        ? current.lockedRegions.filter((region) => region !== current.selectedRegion)
        : [...current.lockedRegions, current.selectedRegion],
    }));
    setConfirmed(false);
  };

  const shellProps: ShellProps = {
    state,
    onChange: changeState,
    onToggleLock: toggleSelectedLock,
    onConfirm: () => setConfirmed(true),
    confirmed,
  };

  return (
    <div className="mx-auto w-full max-w-[1800px] px-3 pb-28 pt-5 sm:px-5 lg:px-7">
      <header className="mb-5 flex flex-col justify-between gap-4 rounded-2xl border border-border bg-card/35 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-primary/20 bg-primary/8 text-primary">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-amber-500/25 bg-amber-500/8 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-amber-600 dark:text-amber-400">
                {t("prototypeBadge")}
              </span>
              <span className="text-[10px] text-muted-foreground">{t("sessionId")}</span>
            </div>
            <h1 className="mt-1.5 text-lg font-semibold tracking-[-0.02em] text-foreground sm:text-xl">
              {t("title")}
            </h1>
            <p className="mt-1 max-w-3xl text-xs leading-5 text-muted-foreground">
              {t("question")}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-start gap-2 self-start sm:items-end sm:self-auto">
          <WorkflowNav mode={mode} onChange={changeMode} />
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 text-[10px] text-muted-foreground">
              <Eye className="h-3.5 w-3.5" />
              {t("codeBacked")}
            </span>
            <button
              type="button"
              onClick={async () => navigator.clipboard.writeText(window.location.href)}
              aria-label={t("copyUrl")}
              className="grid h-8 w-8 place-items-center rounded-full border border-border text-muted-foreground transition-colors hover:text-foreground"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {mode === "explore" ? (
        <CompareShell {...shellProps} onContinue={() => changeMode("refine")} />
      ) : null}
      {mode === "refine" ? (
        <CockpitShell {...shellProps} onFocus={() => changeMode("focus")} />
      ) : null}
      {mode === "focus" ? (
        <FocusShell
          state={state}
          onChange={changeState}
          confirmed={confirmed}
          onExit={() => changeMode("refine")}
        />
      ) : null}

      {confirmed ? (
        <div className="mt-4 flex flex-col justify-between gap-3 rounded-2xl border border-emerald-500/25 bg-emerald-500/7 px-4 py-3 sm:flex-row sm:items-center">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-emerald-500 text-white">
              <Check className="h-3.5 w-3.5" />
            </span>
            <div>
              <p className="text-xs font-semibold text-foreground">{t("confirmedTitle")}</p>
              <p className="mt-0.5 text-[10px] leading-4 text-muted-foreground">
                {t("confirmedDescription")}
              </p>
            </div>
          </div>
          <span className="rounded-lg border border-emerald-500/20 bg-background/50 px-3 py-2 font-mono text-[9px] text-emerald-700 dark:text-emerald-300">
            candidate.patch → current branch
          </span>
        </div>
      ) : null}
    </div>
  );
}
