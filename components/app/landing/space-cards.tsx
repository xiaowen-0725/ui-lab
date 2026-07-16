"use client";

import { ArrowUpRight, Component, LayoutGrid, SlidersHorizontal } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { EASE_OUT_CSS } from "@/lib/ease";
import { NAV_SPACES, type NavSpace } from "@/lib/nav";
import { PALETTES } from "@/lib/palettes";
import { STYLES } from "@/lib/styles";

const SPACE_META: Record<
  NavSpace["key"],
  { icon: LucideIcon | null; descKey: string }
> = {
  components: { icon: Component, descKey: "spaceComponentsDesc" },
  blocks: { icon: LayoutGrid, descKey: "spaceBlocksDesc" },
  styles: { icon: null, descKey: "spaceStylesDesc" },
  palettes: { icon: null, descKey: "spacePalettesDesc" },
  playground: { icon: SlidersHorizontal, descKey: "spacePlaygroundDesc" },
};

/** The palettes card's icon slot: the lead palette's roles as a tiny quad. */
function PalettesMiniPreview() {
  const colors = PALETTES[0]?.colors;
  if (!colors) return null;
  return (
    <span
      aria-hidden="true"
      className="grid h-9 w-9 grid-cols-2 overflow-hidden rounded-lg border border-border"
    >
      <span style={{ background: colors.bg }} />
      <span style={{ background: colors.primary }} />
      <span style={{ background: colors.accent }} />
      <span style={{ background: colors.text }} />
    </span>
  );
}

// Cycle a handful of skins, not the whole catalog — the card is a teaser.
const PREVIEW_STYLES = STYLES.slice(0, 3);

/** The styles card's icon slot: three skins crossfading — the module's pitch in 36px. */
function StylesMiniPreview() {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % PREVIEW_STYLES.length);
    }, 2400);
    return () => clearInterval(id);
  }, [reducedMotion]);

  return (
    <span
      aria-hidden="true"
      className="relative flex h-9 w-9 overflow-hidden rounded-lg border border-border"
    >
      {PREVIEW_STYLES.map((style, i) => (
        <span
          key={style.slug}
          className="absolute inset-0"
          style={{
            background: style.skin.vars["--st-page-bg"],
            opacity: i === index ? 1 : 0,
            transition: `opacity 480ms ${EASE_OUT_CSS}`,
          }}
        >
          <span
            className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full"
            style={{ background: style.skin.vars["--st-accent"] }}
          />
        </span>
      ))}
    </span>
  );
}

/** Landing entry cards for the top-level spaces — the permanent extension point
 * for new themes: register a space in lib/nav.ts, add a desc message, done. */
export function SpaceCards() {
  const tNav = useTranslations("nav");
  const tLanding = useTranslations("landing");

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {NAV_SPACES.map((space) => {
        const meta = SPACE_META[space.key];
        const Icon = meta.icon;
        return (
          <Link
            key={space.key}
            href={space.href}
            className="group flex flex-col gap-4 rounded-3xl border border-border bg-card/20 p-6 transition-colors hover:border-(--color-border-strong)"
          >
            {Icon ? (
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card/40 text-muted-foreground transition-colors group-hover:text-foreground">
                <Icon className="h-4 w-4" />
              </span>
            ) : space.key === "palettes" ? (
              <PalettesMiniPreview />
            ) : (
              <StylesMiniPreview />
            )}
            <span>
              <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
                {tNav(space.key)}
                <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
              <span className="mt-1 block text-sm text-muted-foreground">
                {tLanding(meta.descKey)}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
