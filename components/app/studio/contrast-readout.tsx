"use client";

import { useTranslations } from "next-intl";
import { contrastRatio, mixHex } from "@/lib/color";

export function ContrastReadout({
  ink,
  canvas,
  accent,
  accentFg,
  raised,
  glass,
  surfaceAlpha,
}: {
  ink: string;
  canvas: string;
  accent: string;
  accentFg: string;
  raised: string;
  glass: boolean;
  surfaceAlpha: number;
}) {
  const t = useTranslations("studio");

  const rows = [
    { key: "body-canvas", label: t("contrastBodyCanvas"), ratio: contrastRatio(ink, canvas) },
    { key: "accent", label: t("contrastAccent"), ratio: contrastRatio(accentFg, accent) },
    ...(glass
      ? [
          {
            key: "body-glass",
            label: t("contrastBodyGlass"),
            ratio: contrastRatio(ink, mixHex(raised, canvas, surfaceAlpha)),
          },
        ]
      : []),
  ];

  return (
    <div className="rounded-3xl border border-border bg-card/20 p-4">
      <p className="text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {t("contrastTitle")}
      </p>
      <div className="mt-3 flex flex-col gap-2">
        {rows.map((row) => {
          const badge = row.ratio >= 7 ? "AAA" : row.ratio >= 4.5 ? "AA" : `✗ ${t("contrastFail")}`;
          const badgeClass =
            row.ratio >= 4.5 ? "text-(--color-success)" : "text-(--color-danger)";
          return (
            <div key={row.key} className="flex items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground">{row.label}</span>
              <span className="flex items-center gap-2 font-medium text-foreground">
                <span className="tabular-nums">{row.ratio.toFixed(1)}:1</span>
                <span className={badgeClass}>{badge}</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
