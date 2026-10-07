"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { BackgroundsExplorer } from "@/components/app/atoms/backgrounds-explorer";
import { IconsExplorer } from "@/components/app/atoms/icons-explorer";
import { LinesExplorer } from "@/components/app/atoms/lines-explorer";
import { MotionExplorer } from "@/components/app/atoms/motion-explorer";
import { ShapeExplorer } from "@/components/app/atoms/shape-explorer";
import { SpacingExplorer } from "@/components/app/atoms/spacing-explorer";
import { TypographyExplorer } from "@/components/app/atoms/typography-explorer";
import { ATOM_CATEGORIES } from "@/lib/atoms";
import type { AtomCategorySlug } from "@/lib/atoms";
import { cn } from "@/lib/utils";

function validCategory(value: string | null): value is AtomCategorySlug {
  return value !== null && ATOM_CATEGORIES.some((category) => category === value);
}

export function AtomsExplorer() {
  const t = useTranslations("atoms");
  const searchParams = useSearchParams();
  const paramCategory = searchParams.get("cat");
  const [category, setCategory] = useState<AtomCategorySlug>(() =>
    validCategory(paramCategory) ? paramCategory : "motion",
  );

  useEffect(() => {
    if (validCategory(paramCategory)) setCategory(paramCategory);
  }, [paramCategory]);

  // This explorer renders after the static Suspense fallback. Native fragment
  // scrolling can run before its cards exist, so replay it after each category commit.
  // biome-ignore lint/correctness/useExhaustiveDependencies: A category switch mounts a new card tree; replay its fragment after that commit.
  useEffect(() => {
    let frame = 0;
    const scrollToHash = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const raw = window.location.hash.slice(1);
        if (!raw) return;
        let id = raw;
        try { id = decodeURIComponent(raw); }
        catch { /* A malformed fragment has no matching decoded target. */ }
        document.getElementById(id)?.scrollIntoView({ behavior: "auto", block: "start" });
      });
    };
    scrollToHash();
    window.addEventListener("hashchange", scrollToHash);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", scrollToHash);
    };
  }, [category]);

  const selectCategory = (nextCategory: AtomCategorySlug) => {
    setCategory(nextCategory);
    window.history.replaceState(null, "", `?cat=${nextCategory}`);
  };

  return (
    <div>
      <fieldset
        className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/20 p-2"
      >
        <legend className="sr-only">{t("categorySwitcher")}</legend>
        {ATOM_CATEGORIES.map((entry) => (
          <button
            key={entry}
            type="button"
            onClick={() => selectCategory(entry)}
            aria-pressed={category === entry}
            className={cn(
              "rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
              category === entry
                ? "border-(--color-border-strong) bg-card text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            {t(`category.${entry}`)}
          </button>
        ))}
      </fieldset>

      <div className="mt-10">
        {category === "motion" ? <MotionExplorer /> : null}
        {category === "shape" ? <ShapeExplorer /> : null}
        {category === "typography" ? <TypographyExplorer /> : null}
        {category === "spacing" ? <SpacingExplorer /> : null}
        {category === "lines" ? <LinesExplorer /> : null}
        {category === "icons" ? <IconsExplorer /> : null}
        {category === "backgrounds" ? <BackgroundsExplorer /> : null}
      </div>
    </div>
  );
}
