import { useTranslations } from "next-intl";
import { PatternFrame, Region } from "./pattern-frame";

type PatternDemoProps = { className?: string };

const HOLY_GRAIL_REGIONS = [
  { area: "header", label: "header", className: "h-12" },
  { area: "nav", label: "nav" },
  { area: "main", label: "main1fr" },
  { area: "aside", label: "aside" },
  { area: "footer", label: "footer", className: "h-10" },
] as const;

export function CenteredDemo({ className }: PatternDemoProps) {
  const t = useTranslations("patterns.regions");

  return (
    <PatternFrame className={className}>
      <div className="flex h-full flex-col gap-2">
        <Region label={t("header")} className="h-12 shrink-0" />
        <div className="min-h-0 flex-1 px-4 sm:px-10">
          <Region
            label={t("main72")}
            className="mx-auto h-full max-w-[72ch]"
          />
        </div>
        <Region label={t("footer")} className="h-10 shrink-0" />
      </div>
    </PatternFrame>
  );
}

export function SidebarDemo({ className }: PatternDemoProps) {
  const t = useTranslations("patterns.regions");

  return (
    <PatternFrame className={className}>
      <div className="grid h-full grid-cols-1 gap-2 sm:grid-cols-[260px_minmax(0,1fr)]">
        <Region label={t("sidebar260")} className="hidden sm:flex" />
        <Region label={t("main1fr")} />
      </div>
    </PatternFrame>
  );
}

export function HolyGrailDemo({ className }: PatternDemoProps) {
  const t = useTranslations("patterns.regions");
  const regions = HOLY_GRAIL_REGIONS.map((region) => (
    <Region
      key={region.area}
      label={t(region.label)}
      className={"className" in region ? region.className : undefined}
      style={{ gridArea: region.area }}
    />
  ));

  return (
    <PatternFrame className={className}>
      <div
        className="grid h-full gap-2 sm:hidden"
        style={{
          gridTemplate: "auto auto 1fr auto auto / 1fr",
          gridTemplateAreas: '"header" "nav" "main" "aside" "footer"',
        }}
      >
        {regions}
      </div>
      <div
        className="hidden h-full gap-2 sm:grid"
        style={{
          gridTemplate: "auto 1fr auto / auto 1fr auto",
          gridTemplateAreas:
            '"header header header" "nav main aside" "footer footer footer"',
        }}
      >
        {regions}
      </div>
    </PatternFrame>
  );
}

export function SplitDemo({ className }: PatternDemoProps) {
  const t = useTranslations("patterns.regions");

  return (
    <PatternFrame className={className}>
      <div className="grid h-full grid-cols-1 gap-2 sm:grid-cols-2">
        <Region label={t("panel1fr")} />
        <Region label={t("panel1fr")} className="bg-card/45" />
      </div>
    </PatternFrame>
  );
}

export function ThreePaneDemo({ className }: PatternDemoProps) {
  const t = useTranslations("patterns.regions");

  return (
    <PatternFrame className={className}>
      <div className="grid h-full grid-cols-1 gap-2 sm:grid-cols-[64px_320px_minmax(0,1fr)]">
        <Region label={t("rail64")} className="hidden sm:flex" />
        <Region label={t("list320")} className="hidden sm:flex" />
        <Region label={t("detail1fr")} />
      </div>
    </PatternFrame>
  );
}

export function DashboardDemo({ className }: PatternDemoProps) {
  const t = useTranslations("patterns.regions");

  return (
    <PatternFrame className={className}>
      <div
        className="grid h-full gap-2"
        style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}
      >
        <Region
          label={t("primaryWidget")}
          className="min-h-28 sm:col-span-2 sm:row-span-2"
        />
        <Region label={t("widget")} />
        <Region label={t("widget")} />
        <Region label={t("widget")} />
        <Region label={t("widget")} />
      </div>
    </PatternFrame>
  );
}

export function ListDetailDemo({ className }: PatternDemoProps) {
  const t = useTranslations("patterns.regions");

  return (
    <PatternFrame className={className}>
      <div className="grid h-full grid-cols-1 gap-2 sm:grid-cols-[340px_minmax(0,1fr)]">
        <Region label={t("list340")} className="items-start pt-8">
          <span
            aria-hidden="true"
            className="absolute inset-x-3 bottom-3 top-16 flex flex-col gap-2"
          >
            {[0, 1, 2, 3, 4].map((item) => (
              <span
                key={item}
                className="h-7 rounded-md border border-border bg-background/70"
              />
            ))}
          </span>
        </Region>
        <Region label={t("detail1fr")} className="hidden sm:flex" />
      </div>
    </PatternFrame>
  );
}

export function CanvasDemo({ className }: PatternDemoProps) {
  const t = useTranslations("patterns.regions");

  return (
    <PatternFrame className={className}>
      <div className="relative h-full overflow-hidden rounded-xl border border-border bg-card/25">
        <Region
          label={t("canvasInset")}
          className="absolute inset-0 rounded-none border-0 bg-transparent shadow-none"
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-border)_1px,transparent_1px)] [background-size:24px_24px]"
          />
        </Region>
        <Region
          label={t("toolbar")}
          className="absolute left-4 top-4 h-12 w-28"
        />
        <Region
          label={t("inspector280")}
          className="absolute inset-x-3 bottom-3 h-24 sm:inset-x-auto sm:inset-y-4 sm:right-4 sm:h-auto sm:w-[280px]"
        />
      </div>
    </PatternFrame>
  );
}
