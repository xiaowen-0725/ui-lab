"use client";

import { useTranslations } from "next-intl";
import type { CSSProperties } from "react";
import { EASE_OUT_CSS } from "@/lib/ease";
import type { StyleSkin } from "@/lib/styles";
import { cn } from "@/lib/utils";

// Skins swap by animating the CSS properties themselves (color/border/radius/
// shadow only — no displacement), so the same DOM morphs between styles and
// reduced-motion needs no special gating.
const SKIN_TRANSITION = [
  "background",
  "color",
  "border",
  "border-radius",
  "box-shadow",
  "letter-spacing",
]
  .map((prop) => `${prop} 320ms ${EASE_OUT_CSS}`)
  .join(", ");

const headingWeight = "var(--st-heading-weight)" as CSSProperties["fontWeight"];

const cardStyle: CSSProperties = {
  background: "var(--st-card-bg)",
  border: "var(--st-card-border)",
  borderRadius: "var(--st-radius-lg)",
  boxShadow: "var(--st-shadow)",
  backdropFilter: "var(--st-card-blur)",
  // Cards may sit on a bg that clashes with the page fg (e.g. yellow cards on
  // a violet page) — skins can override text colors inside cards only.
  color: "var(--st-card-fg, inherit)",
  transition: SKIN_TRANSITION,
};

const mutedStyle: CSSProperties = {
  color: "var(--st-muted)",
  transition: SKIN_TRANSITION,
};

const cardMutedStyle: CSSProperties = {
  color: "var(--st-card-muted, var(--st-muted))",
  transition: SKIN_TRANSITION,
};

const badgeStyle: CSSProperties = {
  background: "var(--st-badge-bg)",
  color: "var(--st-badge-fg)",
  border: "var(--st-badge-border)",
  borderRadius: "var(--st-radius-sm)",
  letterSpacing: "var(--st-badge-tracking)",
  textTransform: "var(--st-badge-transform)" as CSSProperties["textTransform"],
  transition: SKIN_TRANSITION,
};

const primaryBtnStyle: CSSProperties = {
  background: "var(--st-btn-primary-bg)",
  color: "var(--st-btn-primary-fg)",
  border: "var(--st-btn-primary-border)",
  borderRadius: "var(--st-radius-sm)",
  boxShadow: "var(--st-btn-primary-shadow)",
  transition: SKIN_TRANSITION,
};

const secondaryBtnStyle: CSSProperties = {
  background: "var(--st-btn-secondary-bg)",
  color: "var(--st-btn-secondary-fg)",
  border: "var(--st-btn-secondary-border)",
  borderRadius: "var(--st-radius-sm)",
  boxShadow: "var(--st-btn-primary-shadow)",
  transition: SKIN_TRANSITION,
};

/** The fixed landing-card scene every skin dresses — the comparison canvas
 * shared by the styles and palettes explorers. */
export function StyleDemo({
  skin,
  className,
}: {
  skin: StyleSkin;
  className?: string;
}) {
  const t = useTranslations("styles");

  return (
    <div
      style={{
        ...(skin.vars as CSSProperties),
        background: "var(--st-page-bg)",
        color: "var(--st-page-fg)",
        fontFamily: "var(--st-font, inherit)",
        transition: SKIN_TRANSITION,
      }}
      className={cn(
        "relative isolate overflow-hidden rounded-3xl border border-border",
        className,
      )}
    >
      {/* Backdrop layers stay mounted and crossfade so skins morph instead of popping. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            opacity: skin.backdrop === "aurora" ? 1 : 0,
            transition: `opacity 480ms ${EASE_OUT_CSS}`,
          }}
        >
          <div className="absolute -left-16 -top-20 h-64 w-64 rounded-full bg-cyan-400/40 blur-3xl" />
          <div className="absolute right-0 top-10 h-72 w-72 rounded-full bg-violet-500/40 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-fuchsia-400/30 blur-3xl" />
        </div>
        <div
          className="absolute inset-0"
          style={{
            opacity: skin.backdrop === "grid" ? 1 : 0,
            transition: `opacity 480ms ${EASE_OUT_CSS}`,
            backgroundImage:
              "linear-gradient(color-mix(in srgb, var(--st-accent) 18%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in srgb, var(--st-accent) 18%, transparent) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "linear-gradient(to bottom, transparent 25%, black 90%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            opacity: skin.backdrop === "scanlines" ? 1 : 0,
            transition: `opacity 480ms ${EASE_OUT_CSS}`,
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.28) 0px, rgba(0, 0, 0, 0.28) 1px, transparent 1px, transparent 3px)",
          }}
        />
      </div>

      <div className="flex flex-col gap-8 p-6 sm:p-10">
        <div
          className="flex items-center justify-between pb-4"
          style={{ borderBottom: "var(--st-divider)", transition: SKIN_TRANSITION }}
        >
          <div
            className="flex items-center gap-2 text-sm"
            style={{ fontWeight: headingWeight }}
          >
            <span
              className="h-3.5 w-3.5"
              style={{
                background: "var(--st-accent)",
                borderRadius: "var(--st-radius-sm)",
                transition: SKIN_TRANSITION,
              }}
            />
            {t("demoBrand")}
          </div>
          <div className="hidden items-center gap-5 text-xs sm:flex" style={mutedStyle}>
            <span>{t("demoNavProduct")}</span>
            <span>{t("demoNavPricing")}</span>
            <span>{t("demoNavDocs")}</span>
          </div>
          <button
            type="button"
            className="inline-flex h-8 items-center px-3 text-xs font-semibold"
            style={secondaryBtnStyle}
          >
            {t("demoNavCta")}
          </button>
        </div>

        <div className="flex max-w-md flex-col items-start gap-4">
          <span
            className="inline-flex px-2.5 py-1 text-[0.7rem] font-semibold"
            style={badgeStyle}
          >
            {t("demoBadge")}
          </span>
          <h3
            className="text-3xl leading-tight sm:text-4xl"
            style={{
              fontWeight: headingWeight,
              letterSpacing: "var(--st-heading-tracking)",
              fontFamily: "var(--st-heading-font, inherit)",
              textTransform:
                "var(--st-heading-transform, none)" as CSSProperties["textTransform"],
              transition: SKIN_TRANSITION,
            }}
          >
            {t("demoTitle")}
          </h3>
          <p className="text-sm leading-relaxed" style={mutedStyle}>
            {t("demoSubtitle")}
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex h-10 items-center px-5 text-sm font-semibold"
              style={primaryBtnStyle}
            >
              {t("demoPrimary")}
            </button>
            <button
              type="button"
              className="inline-flex h-10 items-center px-5 text-sm font-semibold"
              style={secondaryBtnStyle}
            >
              {t("demoSecondary")}
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div
            className={cn(
              "flex flex-col gap-1.5 p-5",
              skin.layout === "bento" && "sm:col-span-2 sm:row-span-2 sm:justify-end",
            )}
            style={cardStyle}
          >
            <span className="text-sm" style={{ fontWeight: headingWeight }}>
              {t("demoCardOneTitle")}
            </span>
            <span className="text-xs leading-relaxed" style={cardMutedStyle}>
              {t("demoCardOneBody")}
            </span>
          </div>
          <div className="flex flex-col gap-1.5 p-5" style={cardStyle}>
            <span className="text-sm" style={{ fontWeight: headingWeight }}>
              {t("demoCardTwoTitle")}
            </span>
            <span className="text-xs leading-relaxed" style={cardMutedStyle}>
              {t("demoCardTwoBody")}
            </span>
          </div>
          <div className="flex flex-col gap-1.5 p-5" style={cardStyle}>
            <span
              className="text-3xl leading-none"
              style={{
                color: "var(--st-accent)",
                fontWeight: headingWeight,
                transition: SKIN_TRANSITION,
              }}
            >
              {t("demoStatValue")}
            </span>
            <span className="text-xs" style={cardMutedStyle}>
              {t("demoStatLabel")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
