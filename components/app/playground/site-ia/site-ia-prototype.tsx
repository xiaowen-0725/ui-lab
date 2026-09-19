"use client";

import { Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { CopyButton } from "@/components/app/docs/copy-button";
import { InstallCommand } from "@/components/app/docs/install-command";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { RADII } from "@/lib/atoms/shape";
import { cn } from "@/lib/utils";
import {
  EMPTY_STATE,
  findItem,
  mergeSiteIaState,
  parseSiteIaState,
  queryString,
  resolveSiteIaView,
  visibleItems,
  type Capability,
  type ItemId,
  type Layer,
  type Purpose,
  type SiteIaItem,
  type SiteIaState,
} from "./model";
import {
  BenchLadders,
  ButtonSample,
  ControlCluster,
  ItemSample,
  StatefulButtonSample,
  tokenText,
} from "./samples";

function useSiteIaState() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const state = useMemo(
    () => parseSiteIaState(new URLSearchParams(searchParams.toString())),
    [searchParams],
  );

  const go = (patch: Partial<SiteIaState>) => {
    const next = mergeSiteIaState(state, patch);
    const query = queryString(next);
    router.replace(query ? `${pathname}?${query}` : pathname);
  };

  const resetHall = () => {
    router.replace(pathname);
  };

  return { state, go, resetHall, pathname };
}

function CapabilityPills({
  capabilities,
}: {
  capabilities: readonly Capability[];
}) {
  const t = useTranslations("siteIa");
  return (
    <ul className="flex flex-wrap gap-1.5">
      {capabilities.map((capability) => (
        <li
          key={capability}
          className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground"
        >
          {capability === "preview"
            ? t("capPreview")
            : capability === "tune"
              ? t("capTune")
              : t("capInstall")}
        </li>
      ))}
    </ul>
  );
}

function PrototypeLocaleSwitch() {
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("siteIa");
  const next = locale === "zh" ? "en" : "zh";
  const query = searchParams.toString();

  return (
    <button
      type="button"
      onClick={() => {
        router.replace(query ? `${pathname}?${query}` : pathname, { locale: next });
      }}
      aria-label={locale === "zh" ? t("localeToEn") : t("localeToZh")}
      className="h-9 rounded-2xl border border-border px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
    >
      {locale === "zh" ? "EN" : "中文"}
    </button>
  );
}

function PrototypeChrome({
  room,
  onHall,
  onBench,
}: {
  room: SiteIaState["room"];
  onHall: () => void;
  onBench: () => void;
}) {
  const t = useTranslations("siteIa");
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSearchOpen(true);
  };

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-5xl items-center gap-3 px-4">
        <p className="shrink-0 text-sm font-semibold tracking-tight">{t("brand")}</p>
        <nav className="flex items-center gap-1" aria-label={t("brand")}>
          <button
            type="button"
            onClick={onHall}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm",
              room === "hall"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t("hall")}
          </button>
          <button
            type="button"
            onClick={onBench}
            className={cn(
              "rounded-full px-3 py-1.5 text-sm",
              room === "bench"
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t("bench")}
          </button>
        </nav>
        <form onSubmit={onSubmit} className="relative ml-auto hidden min-w-0 flex-1 sm:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchAria")}
            className="h-9 w-full rounded-full border border-border bg-card px-9 text-sm outline-none placeholder:text-muted-foreground focus:border-foreground/40"
          />
        </form>
        <button
          type="button"
          className="ml-auto grid h-9 w-9 place-items-center rounded-2xl border border-border text-muted-foreground sm:hidden"
          onClick={() => setSearchOpen((open) => !open)}
          aria-label={t("searchAria")}
        >
          <Search className="h-4 w-4" />
        </button>
        <PrototypeLocaleSwitch />
        <span className="hidden rounded-full border border-border px-2 py-1 text-[10px] text-muted-foreground md:inline">
          {t("prototypeBadge")}
        </span>
        <Link
          href="/"
          className="hidden text-xs text-muted-foreground hover:text-foreground sm:inline"
        >
          {t("exit")}
        </Link>
      </div>
      {searchOpen ? (
        <p className="mx-auto max-w-5xl px-4 pb-3 text-xs leading-5 text-muted-foreground">
          {t("searchHint")}
        </p>
      ) : null}
    </header>
  );
}

function GateView({
  onUnknown,
  onPurpose,
  onTune,
}: {
  onUnknown: () => void;
  onPurpose: () => void;
  onTune: () => void;
}) {
  const t = useTranslations("siteIa");
  const [radius, setRadius] = useState("10px");

  return (
    <div className="space-y-10">
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t("evidenceEyebrow")}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">{t("tagline")}</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card/60 p-4">
          <p className="text-xs text-muted-foreground">{t("evidenceMotion")}</p>
          <div className="mt-4 flex justify-center">
            <ButtonSample compact />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-4">
          <p className="text-xs text-muted-foreground">{t("evidenceNoun")}</p>
          <p className="mt-3 text-sm font-medium">{t("items.button.name")}</p>
          <p className="mt-1 text-xs text-muted-foreground">{t("evidenceNounAliases")}</p>
          <div className="mt-4 flex justify-center">
            <ButtonSample compact />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card/60 p-4">
          <p className="text-xs text-muted-foreground">{t("evidenceSystem")}</p>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => setRadius("10px")}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs",
                radius === "10px"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground",
              )}
            >
              {t("radiusMd")}
            </button>
            <button
              type="button"
              onClick={() => setRadius("12.5px")}
              className={cn(
                "rounded-full border px-2.5 py-1 text-xs",
                radius === "12.5px"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border text-muted-foreground",
              )}
            >
              {t("radiusLg")}
            </button>
          </div>
          <div className="mt-4 flex justify-center">
            <ControlCluster radius={radius} compact />
          </div>
        </div>
      </div>
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {t("doorsEyebrow")}
        </p>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          <button
            type="button"
            onClick={onUnknown}
            className="rounded-2xl border border-border bg-background p-5 text-left hover:border-foreground/30"
          >
            <h2 className="text-base font-semibold">{t("doorUnknownTitle")}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("doorUnknownDesc")}</p>
          </button>
          <button
            type="button"
            onClick={onPurpose}
            className="rounded-2xl border border-border bg-background p-5 text-left hover:border-foreground/30"
          >
            <h2 className="text-base font-semibold">{t("doorPurposeTitle")}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("doorPurposeDesc")}</p>
          </button>
          <button
            type="button"
            onClick={onTune}
            className="rounded-2xl border border-border bg-background p-5 text-left hover:border-foreground/30"
          >
            <h2 className="text-base font-semibold">{t("doorTuneTitle")}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("doorTuneDesc")}</p>
          </button>
        </div>
      </div>
    </div>
  );
}

function TypeChips({
  layer,
  onLayer,
}: {
  layer: Layer;
  onLayer: (layer: Layer) => void;
}) {
  const t = useTranslations("siteIa");
  const chips: Layer[] = ["noun", "motion", "system"];
  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <button
          key={chip}
          type="button"
          onClick={() => onLayer(chip)}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm",
            chip === layer
              ? "border-foreground bg-foreground text-background"
              : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          {chip === "noun" ? t("typeNoun") : chip === "motion" ? t("typeMotion") : t("typeSystem")}
        </button>
      ))}
    </div>
  );
}

function ItemCard({
  item,
  onOpen,
}: {
  item: SiteIaItem;
  onOpen: () => void;
}) {
  const t = useTranslations("siteIa");
  const locale = useLocale();
  const name = t(`items.${item.id}.name`);
  const nameEn = t(`items.${item.id}.nameEn`);

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-card/50 p-4">
      <div className="grid min-h-28 place-items-center rounded-xl border border-border/70 bg-background px-3 py-4">
        <ItemSample id={item.id} compact />
      </div>
      <h3 className="mt-4 text-sm font-semibold">
        {locale === "zh" ? name : nameEn}
        {locale === "zh" ? (
          <span className="ml-2 text-xs font-normal text-muted-foreground">{nameEn}</span>
        ) : null}
      </h3>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{t(`items.${item.id}.aliases`)}</p>
      <div className="mt-3">
        <CapabilityPills capabilities={item.capabilities} />
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="mt-4 self-start text-sm font-medium underline-offset-4 hover:underline"
      >
        {t("openItem")}
      </button>
    </article>
  );
}

function CompareView({
  state,
  onBack,
  onLayer,
  onOpen,
}: {
  state: SiteIaState;
  onBack: () => void;
  onLayer: (layer: Layer) => void;
  onOpen: (id: ItemId) => void;
}) {
  const t = useTranslations("siteIa");
  const layer = state.layer ?? "noun";
  const items = visibleItems({ ...state, layer });

  return (
    <div className="space-y-6">
      <button type="button" onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">
        {t("back")}
      </button>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {state.task === "purpose" ? t(`purpose${capitalize(state.purpose ?? "submit")}`) : t("doorUnknownTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("pickType")}</p>
      </div>
      <TypeChips layer={layer} onLayer={onLayer} />
      <p className="text-xs text-muted-foreground">{t("typeHint")} {t("compareHint")}</p>
      {items.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-4 py-8 text-sm text-muted-foreground">
          {t("emptyFilter")}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onOpen={() => onOpen(item.id)} />
          ))}
        </div>
      )}
    </div>
  );
}

function capitalize(value: string) {
  return value.slice(0, 1).toUpperCase() + value.slice(1);
}

function PurposePickView({
  onBack,
  onPurpose,
}: {
  onBack: () => void;
  onPurpose: (purpose: Purpose) => void;
}) {
  const t = useTranslations("siteIa");
  const purposes: Purpose[] = ["submit", "open", "swap"];

  return (
    <div className="space-y-6">
      <button type="button" onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">
        {t("back")}
      </button>
      <h1 className="text-2xl font-semibold tracking-tight">{t("purposeTitle")}</h1>
      <div className="grid gap-3 md:grid-cols-3">
        {purposes.map((purpose) => (
          <button
            key={purpose}
            type="button"
            onClick={() => onPurpose(purpose)}
            className="rounded-2xl border border-border bg-background p-5 text-left hover:border-foreground/30"
          >
            <h2 className="text-base font-semibold">{t(`purpose${capitalize(purpose)}`)}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {t(`purpose${capitalize(purpose)}Desc`)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}

function SpecimenView({
  itemId,
  onBack,
  onBench,
}: {
  itemId: ItemId;
  onBack: () => void;
  onBench: () => void;
}) {
  const t = useTranslations("siteIa");
  const locale = useLocale();
  const item = findItem(itemId);
  const name = t(`items.${item.id}.name`);
  const nameEn = t(`items.${item.id}.nameEn`);
  const take =
    item.takeKind === "install"
      ? t("takeInstall")
      : item.takeKind === "theme"
        ? t("takeTheme")
        : t("takeToken");

  return (
    <div className="space-y-8">
      <button type="button" onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">
        {t("back")}
      </button>
      <div>
        <p className="text-xs text-muted-foreground">
          {item.layer === "noun" ? t("typeNoun") : item.layer === "motion" ? t("typeMotion") : t("typeSystem")}
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {locale === "zh" ? name : nameEn}
          <span className="ml-2 text-base font-normal text-muted-foreground">
            {locale === "zh" ? nameEn : name}
          </span>
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("aliases")}：{t(`items.${item.id}.aliases`)}
        </p>
        {item.notNeighbor ? (
          <p className="mt-1 text-sm text-muted-foreground">
            {t("notNeighbor")} {t(`items.${item.id}.notNeighbor`)}
          </p>
        ) : null}
        <div className="mt-3">
          <CapabilityPills capabilities={item.capabilities} />
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-border p-4 md:col-span-2">
          <p className="text-xs font-medium text-muted-foreground">{t("see")}</p>
          <div className="mt-4 grid min-h-40 place-items-center">
            <ItemSample id={item.id} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground">{t("try")}</p>
            <div className="mt-4">
              {item.id === "button" ? <StatefulButtonSample /> : <ItemSample id={item.id} />}
            </div>
            {item.layer === "system" ? (
              <button
                type="button"
                onClick={onBench}
                className="mt-4 text-sm font-medium underline-offset-4 hover:underline"
              >
                {t("goBench")}
              </button>
            ) : null}
          </div>
          <div className="rounded-2xl border border-border p-4">
            <p className="text-xs font-medium text-muted-foreground">{t("take")}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{take}</p>
            {item.installSlug ? (
              <div className="mt-3">
                <InstallCommand slug={item.installSlug} />
              </div>
            ) : (
              <div className="mt-3 flex items-start gap-2 rounded-xl border border-border bg-card p-3">
                <pre className="flex-1 overflow-x-auto font-mono text-[11px] leading-5">
                  {tokenText(item.id)}
                </pre>
                <CopyButton text={tokenText(item.id)} eventName="copy_site_ia_token" eventLabel={item.id} />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function BenchView({
  itemId,
  onBack,
}: {
  itemId: ItemId | null;
  onBack: () => void;
}) {
  const t = useTranslations("siteIa");
  const kind = itemId === "shadow" ? "shadow" : "radius";
  const [radiusSlug, setRadiusSlug] = useState("md");
  const [shadowSlug, setShadowSlug] = useState<"hairline" | "raised" | "floating">(
    itemId === "shadow" ? "floating" : "raised",
  );
  const radius = RADII.find((atom) => atom.slug === radiusSlug) ?? RADII[3];
  const copyValue = kind === "radius" ? `${radius.slug}: ${radius.value}` : shadowSlug;

  return (
    <div className="space-y-6">
      <button type="button" onClick={onBack} className="text-sm text-muted-foreground hover:text-foreground">
        {t("back")}
      </button>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{t("benchTitle")}</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{t("benchLead")}</p>
      </div>
      <BenchLadders
        kind={kind}
        radiusSlug={radiusSlug}
        shadowSlug={shadowSlug}
        onRadius={setRadiusSlug}
        onShadow={setShadowSlug}
      />
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-muted-foreground">{t("benchAccept")}</span>
        <CopyButton text={copyValue} eventName="copy_site_ia_bench" eventLabel={kind} />
      </div>
      {itemId === "graphite" ? (
        <div className="rounded-2xl border border-border p-4">
          <p className="text-sm text-muted-foreground">{t("takeTheme")}</p>
          <div className="mt-3">
            <InstallCommand slug="theme-graphite" />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SiteIaPrototype() {
  const t = useTranslations("siteIa");
  const { state, go, resetHall } = useSiteIaState();
  const view = resolveSiteIaView(state);

  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col overflow-auto bg-background text-foreground">
      <PrototypeChrome
        room={state.room === "bench" || view === "bench" ? "bench" : "hall"}
        onHall={resetHall}
        onBench={() => go({ ...EMPTY_STATE, room: "bench" })}
      />
      <p className="border-b border-border px-4 py-2 text-center text-xs leading-5 text-muted-foreground">
        {t("prototypeNote")}
      </p>
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8">
        {view === "gate" ? (
          <GateView
            onUnknown={() => go({ ...EMPTY_STATE, task: "unknown", layer: "noun" })}
            onPurpose={() => go({ ...EMPTY_STATE, task: "purpose" })}
            onTune={() => go({ ...EMPTY_STATE, room: "bench", task: "tune" })}
          />
        ) : null}
        {view === "purpose-pick" ? (
          <PurposePickView
            onBack={resetHall}
            onPurpose={(purpose) => go({ purpose, layer: "noun", item: null })}
          />
        ) : null}
        {view === "compare" ? (
          <CompareView
            state={state}
            onBack={() => {
              if (state.task === "purpose" && state.purpose) {
                go({ purpose: null, layer: null, item: null });
                return;
              }
              resetHall();
            }}
            onLayer={(layer) => go({ layer, item: null })}
            onOpen={(item) => go({ item })}
          />
        ) : null}
        {view === "specimen" && state.item ? (
          <SpecimenView
            itemId={state.item}
            onBack={() => go({ item: null })}
            onBench={() => go({ room: "bench", task: "tune" })}
          />
        ) : null}
        {view === "bench" ? (
          <BenchView itemId={state.item} onBack={resetHall} />
        ) : null}
      </main>
    </div>
  );
}
