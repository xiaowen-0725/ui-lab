"use client";

import { useLocale, useTranslations } from "next-intl";
import { AnimatedIconsSection } from "@/components/app/atoms/animated-icons";
import { AtomCard } from "@/components/app/atoms/atom-card";
import { AtomExportActions } from "@/components/app/atoms/atom-export-actions";
import { CopyValue } from "@/components/app/atoms/copy-value";
import { IconLibraryLinks } from "@/components/app/atoms/icon-library-links";
import type { IconLibrary } from "@/components/app/atoms/icon-library-links";
import type { Locale } from "@/i18n/routing";
import { createIconsExports, ICON_STYLES } from "@/lib/atoms";
import type { IconStyleAtom } from "@/lib/atoms";
import { cn } from "@/lib/utils";

type IconShape = "home" | "search" | "gear" | "heart" | "star";

const ICON_SHAPES: readonly IconShape[] = ["home", "search", "gear", "heart", "star"];
const ICONS_EXPORTS = createIconsExports(ICON_STYLES);

const STATIC_ICON_LIBRARIES: readonly IconLibrary[] = [
  {
    name: "Lucide",
    href: "https://lucide.dev",
    desc: "MIT · outline 1.5px, already bundled in this lab (the animated icons use it too).",
    descZh: "MIT · 线性 1.5px，本 lab 已内置（动效图标也基于它）",
  },
  {
    name: "Heroicons",
    href: "https://heroicons.com",
    desc: "MIT · by the Tailwind team; ships outline + solid (filled) sets.",
    descZh: "MIT · Tailwind 团队出品，线性 + 面性(solid)两套",
  },
  {
    name: "Phosphor",
    href: "https://phosphoricons.com",
    desc: "MIT · six weights including duotone, fill, and thin — the widest range of voices.",
    descZh: "MIT · 6 种字重含 duotone/fill/thin，图标口音最全",
  },
  {
    name: "Tabler Icons",
    href: "https://tabler.io/icons",
    desc: "MIT · 5,000+ bold 2px outline icons.",
    descZh: "MIT · 5000+ 粗线(2px)线性图标",
  },
  {
    name: "Pixelarticons",
    href: "https://pixelarticons.com",
    desc: "MIT · pixel-art style (matches the Pixel voice above).",
    descZh: "MIT · 像素风（对应上面的 Pixel 口音）",
  },
  {
    name: "Iconify",
    href: "https://iconify.design",
    desc: "Aggregator — search 200k+ icons across every set in one place (licenses vary per set).",
    descZh: "聚合器，一站检索 200k+ 图标跨所有图标集（各集许可不一）",
  },
];

const FILLED_PATHS: Record<IconShape, string> = {
  home: "M2.5 10.25 12 2.5l9.5 7.75v10.25a1 1 0 0 1-1 1h-5.75v-6.75h-5.5v6.75H3.5a1 1 0 0 1-1-1V10.25Z",
  search: "M10.5 3a7.5 7.5 0 1 0 4.58 13.44l4.24 4.24a1.25 1.25 0 0 0 1.77-1.77l-4.24-4.24A7.5 7.5 0 0 0 10.5 3Z",
  gear: "M10.1 2h3.8l.55 2.35 2.05 1.2 2.3-.7 1.9 3.3-1.75 1.65v2.4l1.75 1.65-1.9 3.3-2.3-.7-2.05 1.2L13.9 20h-3.8l-.55-2.35-2.05-1.2-2.3.7-1.9-3.3 1.75-1.65V9.8L3.3 8.15l1.9-3.3 2.3.7 2.05-1.2L10.1 2Zm1.9 6.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
  heart: "M12 21s-8.5-4.9-8.5-11.2A4.8 4.8 0 0 1 12 6.75a4.8 4.8 0 0 1 8.5 3.05C20.5 16.1 12 21 12 21Z",
  star: "m12 2.5 2.9 5.88 6.49.95-4.7 4.58 1.11 6.47L12 18.32l-5.8 3.06 1.11-6.47-4.7-4.58 6.49-.95L12 2.5Z",
};

const SECONDARY_PATHS: Record<IconShape, string> = {
  home: "M1.5 10.5 12 1.75l10.5 8.75-2 2L12 5.45 3.5 12.5l-2-2Z",
  search: "M10.5 1.5a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z",
  gear: "M12 6.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z",
  heart: "M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Z",
  star: "M12 1.5a10.5 10.5 0 1 0 0 21 10.5 10.5 0 0 0 0-21Z",
};

const PIXEL_RECTS: Record<IconShape, readonly [number, number, number, number][]> = {
  home: [
    [7, 1, 2, 2], [5, 3, 6, 2], [3, 5, 10, 2], [3, 7, 2, 7], [11, 7, 2, 7],
    [5, 12, 2, 2], [9, 9, 2, 5],
  ],
  search: [
    [5, 1, 6, 2], [3, 3, 2, 2], [11, 3, 2, 6], [3, 5, 2, 4], [5, 9, 6, 2],
    [10, 10, 2, 2], [12, 12, 2, 2], [14, 14, 2, 2],
  ],
  gear: [
    [6, 1, 4, 2], [3, 3, 10, 2], [1, 6, 4, 4], [5, 5, 6, 2], [5, 9, 6, 2],
    [11, 6, 4, 4], [3, 11, 10, 2], [6, 13, 4, 2], [7, 7, 2, 2],
  ],
  heart: [
    [3, 2, 4, 2], [9, 2, 4, 2], [1, 4, 14, 4], [3, 8, 10, 2], [5, 10, 6, 2],
    [7, 12, 2, 2],
  ],
  star: [
    [7, 1, 2, 4], [1, 5, 14, 2], [3, 7, 10, 2], [5, 9, 6, 2], [3, 11, 4, 2],
    [9, 11, 4, 2], [1, 13, 4, 2], [11, 13, 4, 2],
  ],
};

function StrokeShape({ shape }: { shape: IconShape }) {
  if (shape === "home") {
    return <path d="M3 10.5 12 3l9 7.5v9.25a1.25 1.25 0 0 1-1.25 1.25h-5.5v-6.5h-4.5V21h-5.5A1.25 1.25 0 0 1 3 19.75V10.5Z" />;
  }
  if (shape === "search") {
    return (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.25 15.25 5 5" />
      </>
    );
  }
  if (shape === "gear") {
    return (
      <>
        <circle cx="12" cy="12" r="3.25" />
        <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.28 5.28 7.4 7.4M16.6 16.6l2.12 2.12M18.72 5.28 16.6 7.4M7.4 16.6l-2.12 2.12" />
        <circle cx="12" cy="12" r="7.25" />
      </>
    );
  }
  if (shape === "heart") {
    return <path d="M12 21s-8.5-4.9-8.5-11.2A4.8 4.8 0 0 1 12 6.75a4.8 4.8 0 0 1 8.5 3.05C20.5 16.1 12 21 12 21Z" />;
  }
  return <path d="m12 2.5 2.9 5.88 6.49.95-4.7 4.58 1.11 6.47L12 18.32l-5.8 3.06 1.11-6.47-4.7-4.58 6.49-.95L12 2.5Z" />;
}

function IconGlyph({ entry, shape }: { entry: IconStyleAtom; shape: IconShape }) {
  const rendering = entry.rendering;
  if (rendering.mode === "pixel") {
    return (
      <svg aria-hidden="true" viewBox="0 0 16 16" className="h-6 w-6" shapeRendering="crispEdges">
        {PIXEL_RECTS[shape].map(([x, y, width, height]) => (
          <rect key={`${x}-${y}-${width}-${height}`} x={x} y={y} width={width} height={height} fill="currentColor" />
        ))}
      </svg>
    );
  }

  if (rendering.mode === "fill") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
        <path d={FILLED_PATHS[shape]} fill="currentColor" fillRule="evenodd" />
      </svg>
    );
  }

  if (rendering.mode === "duotone") {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24" className="h-6 w-6">
        <path d={SECONDARY_PATHS[shape]} fill="currentColor" opacity={rendering.secondaryOpacity} />
        <path d={FILLED_PATHS[shape]} fill="currentColor" fillRule="evenodd" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={rendering.strokeWidth}
      strokeLinecap={rendering.linecap}
      strokeLinejoin={rendering.linejoin}
    >
      <StrokeShape shape={shape} />
    </svg>
  );
}

function IconRow({ entry }: { entry: IconStyleAtom }) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {ICON_SHAPES.map((shape) => (
        <span
          key={shape}
          className="flex aspect-square items-center justify-center rounded-xl border border-border bg-background/50 text-foreground"
        >
          <IconGlyph entry={entry} shape={shape} />
        </span>
      ))}
    </div>
  );
}

export function IconsExplorer({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("atoms");

  return (
    <div className={cn("flex flex-col gap-12", className)}>
      <section aria-labelledby="icons-comparator-title">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
          {t("comparator")}
        </p>
        <h2 id="icons-comparator-title" className="mt-2 text-2xl font-semibold text-foreground">
          {t("iconsComparatorTitle")}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {t("iconsComparatorHint")}
        </p>
        <div className="mt-6 overflow-hidden rounded-3xl border border-border bg-card/20">
          {ICON_STYLES.map((entry, index) => {
            const spec = locale === "zh" ? entry.specZh : entry.spec;
            return (
              <div
                key={entry.slug}
                className={`grid gap-4 p-4 lg:grid-cols-[10rem_minmax(0,1fr)_24rem] lg:items-center ${
                  index > 0 ? "border-t border-border" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {locale === "zh" ? entry.nameZh : entry.name}
                  </p>
                  <p className="mt-1 text-[0.65rem] text-muted-foreground">
                    {locale === "zh" ? entry.name : entry.nameZh}
                  </p>
                </div>
                <IconRow entry={entry} />
                <CopyValue value={spec} label={`icon-spec-comparator-${entry.slug}`} />
              </div>
            );
          })}
        </div>
        <p className="mt-4 rounded-2xl border border-border bg-card/20 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
          {t("iconsAntiSlop")}
        </p>
      </section>

      <section aria-labelledby="icons-values-title">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {t("entryList")}
            </p>
            <h2 id="icons-values-title" className="mt-2 text-2xl font-semibold text-foreground">
              {t("iconsValuesTitle")}
            </h2>
          </div>
          <AtomExportActions bundle={ICONS_EXPORTS} category="icons" />
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {ICON_STYLES.map((entry) => {
            const spec = locale === "zh" ? entry.specZh : entry.spec;
            return (
              <AtomCard
                key={entry.slug}
                id={entry.slug}
                {...entry}
                sample={<IconRow entry={entry} />}
                valueLabel={t("iconSpecLabel")}
                value={<CopyValue value={spec} label={`icon-spec-${entry.slug}`} />}
              />
            );
          })}
        </div>
        <IconLibraryLinks
          title={t("iconStyleMoreTitle")}
          hint={t("iconStyleMoreHint")}
          libraries={STATIC_ICON_LIBRARIES}
        />
      </section>

      <AnimatedIconsSection />
    </div>
  );
}
