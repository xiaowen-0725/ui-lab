"use client";

import { useTranslations } from "next-intl";
import type { CSSProperties, ReactNode } from "react";
import { CopyButton } from "@/components/app/docs/copy-button";
import { Button } from "@/components/motion/button";
import { Input } from "@/components/motion/input";
import {
  DENSITIES,
  lineCssValue,
  RADII,
  SHADOWS,
  spacingCssValue,
  typeScaleCssValue,
  type DensityAtom,
  type LineAtom,
  type RadiusAtom,
  type ShadowAtom,
  type SpacingAtom,
  type TypeScaleAtom,
} from "@/lib/atoms";
import type { Locale } from "@/i18n/routing";
import { REGISTRY_NAMESPACE } from "@/lib/site";
import { THEMES, type ColorTheme } from "@/lib/themes";
import { cn } from "@/lib/utils";

export type Capability = "preview" | "adjust" | "install";
export type BenchColor = "graphite" | "violet" | "teal" | "amber" | "rose";

export const BENCH_COLORS: readonly {
  id: BenchColor;
  theme: ColorTheme;
  kit: boolean;
}[] = [
  { id: "graphite", theme: "default", kit: true },
  { id: "violet", theme: "violet", kit: false },
  { id: "teal", theme: "teal", kit: false },
  { id: "amber", theme: "amber", kit: false },
  { id: "rose", theme: "rose", kit: false },
];

export function requireAtom<T extends { slug: string }>(
  list: readonly T[],
  slug: string,
): T {
  const found = list.find((item) => item.slug === slug);
  if (!found) throw new Error(`Expected atom "${slug}" to exist.`);
  return found;
}

export const RADIUS_LG = requireAtom(RADII, "lg");
export const SHADOW_RAISED = requireAtom(SHADOWS, "raised");
export const DENSITY_STANDARD = requireAtom(DENSITIES, "standard");

export function atomName(
  atom: { name: string; nameZh: string },
  locale: Locale,
): string {
  return locale === "zh" ? atom.nameZh : atom.name;
}

export function installCommand(slug: string): string {
  return `npx shadcn add ${REGISTRY_NAMESPACE}/${slug}`;
}

export function colorThemeOf(color: BenchColor): ColorTheme {
  if (color === "graphite") return "default";
  return color;
}

export function radiusTokenText(radius: RadiusAtom): string {
  return `--radius-${radius.slug}: ${radius.value};`;
}

export function shadowTokenText(shadow: ShadowAtom): string {
  return [
    `--shadow-${shadow.slug}-light: ${shadow.light};`,
    `--shadow-${shadow.slug}-dark: ${shadow.dark};`,
  ].join("\n");
}

export function colorTokenText(color: BenchColor): string {
  const theme = THEMES[colorThemeOf(color)];
  return [
    `--primary: ${theme.light["--primary"]};`,
    `--primary-foreground: ${theme.light["--primary-foreground"]};`,
    `.dark {`,
    `  --primary: ${theme.dark["--primary"]};`,
    `  --primary-foreground: ${theme.dark["--primary-foreground"]};`,
    `}`,
  ].join("\n");
}

export function densityTokenText(density: DensityAtom): string {
  return [
    `--space-density-${density.slug}-row: ${density.rowHeight}px;`,
    `--space-density-${density.slug}-padding: ${density.padding}px;`,
  ].join("\n");
}

export function spacingTokenText(spacing: SpacingAtom): string {
  return `--space-${spacing.slug}: ${spacingCssValue(spacing.pixels)};`;
}

export function lineTokenText(line: LineAtom): string {
  return [
    `/* ${line.property} */`,
    lineCssValue(line, "light"),
    `.dark {`,
    `  ${lineCssValue(line, "dark").replaceAll("\n", "\n  ")}`,
    `}`,
  ].join("\n");
}

export function typeTokenText(step: TypeScaleAtom): string {
  return typeScaleCssValue(step);
}

export function benchTokenText(
  radius: RadiusAtom,
  shadow: ShadowAtom,
  color: BenchColor,
  density: DensityAtom,
): string {
  return [
    "/* The steps on this bench — atoms + theme --primary */",
    radiusTokenText(radius),
    shadowTokenText(shadow),
    colorTokenText(color),
    densityTokenText(density),
  ].join("\n");
}

export function CapabilityRow({ items }: { items: readonly Capability[] }) {
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

export function TakeRow({
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

export function HallCard({
  name,
  nameEn,
  aliases,
  capabilities,
  sample,
  takeaway,
  footer,
}: {
  name: string;
  nameEn?: string;
  aliases: string;
  capabilities: readonly Capability[];
  sample: ReactNode;
  takeaway: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <article className="flex h-full min-w-0 flex-col rounded-2xl border border-border bg-card p-5">
      <h3 className="text-base font-medium leading-snug text-foreground">
        {name}
        {nameEn ? (
          <span className="ml-2 text-sm font-normal text-muted-foreground">
            {nameEn}
          </span>
        ) : null}
      </h3>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{aliases}</p>
      <div className="mt-4 min-h-[120px]">{sample}</div>
      <div className="mt-4">
        <CapabilityRow items={capabilities} />
      </div>
      <div className="mt-4">{takeaway}</div>
      {footer ? <div className="mt-auto pt-3">{footer}</div> : null}
    </article>
  );
}

export function Specimen({
  radius,
  shadow,
  color,
  density,
}: {
  radius: RadiusAtom;
  shadow?: ShadowAtom;
  color?: BenchColor;
  density?: DensityAtom;
}) {
  const t = useTranslations("labPresentation");
  const theme = color ? THEMES[colorThemeOf(color)] : null;
  const pad = density?.padding ?? 16;
  const row = density?.rowHeight ?? 40;
  const style = {
    "--lab-radius": radius.value,
    "--lab-shadow": shadow?.light,
    "--lab-shadow-dark": shadow?.dark,
    "--lab-pad": `${pad}px`,
    "--lab-row": `${row}px`,
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
    padding: pad,
    gap: pad,
  } as CSSProperties;

  return (
    <div
      className={cn(
        "flex flex-col border border-border bg-background",
        shadow && "dark:[box-shadow:var(--lab-shadow-dark)]",
        theme &&
          "dark:[--primary:var(--lab-primary-dark)] dark:[--primary-foreground:var(--lab-primary-fg-dark)]",
      )}
      style={style}
    >
      <span
        className="inline-flex w-fit items-center border border-border bg-card px-2 text-xs text-muted-foreground"
        style={{ borderRadius: radius.value, height: Math.max(24, row - 12) }}
      >
        {t("benchSampleBadge")}
      </span>
      <Input
        label={t("benchSampleInput")}
        defaultValue={t("benchSampleValue")}
        classNames={{
          field: "rounded-[var(--lab-radius)]",
          root: "gap-1",
        }}
      />
      <Button
        className="rounded-[var(--lab-radius)]"
        style={{ height: row }}
      >
        {t("benchSampleButton")}
      </Button>
    </div>
  );
}

export function SpacingSpecimen({ spacing }: { spacing: SpacingAtom }) {
  return (
    <div className="flex items-center" style={{ gap: spacing.pixels }}>
      <span className="h-8 w-8 rounded-md bg-foreground" />
      <span className="h-8 w-8 rounded-md bg-foreground/35" />
      <span className="text-xs text-muted-foreground">
        {spacingCssValue(spacing.pixels)}
      </span>
    </div>
  );
}

export function LineSpecimen({ line }: { line: LineAtom }) {
  const t = useTranslations("labPresentation");
  const style = {
    ...(line.property === "border" ? { border: line.light } : {}),
    ...(line.property === "box-shadow" ? { boxShadow: line.light } : {}),
    ...(line.property === "outline"
      ? { outline: line.light, outlineOffset: line.offset }
      : {}),
  } as CSSProperties;

  return (
    <div
      className="flex h-16 items-center justify-center rounded-lg bg-card px-3 text-sm text-foreground"
      style={style}
    >
      {t("benchSampleBadge")}
    </div>
  );
}

export function TypeSpecimen({ step }: { step: TypeScaleAtom }) {
  const t = useTranslations("labPresentation");
  return (
    <p
      className="text-foreground"
      style={{
        fontFamily: "inherit",
        fontSize: step.fontSize,
        lineHeight: step.lineHeight,
        letterSpacing: step.letterSpacing,
      }}
    >
      {t("typeSample")}
    </p>
  );
}

export function StepGroup({
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

export function StepChips({ children }: { children: ReactNode }) {
  return <div className="mt-2 flex flex-wrap gap-1.5">{children}</div>;
}

export function StepChip({
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
