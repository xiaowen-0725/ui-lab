"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { MotionExplorer } from "@/components/app/atoms/motion-explorer";
import { ShapeExplorer } from "@/components/app/atoms/shape-explorer";
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
      </div>
    </div>
  );
}
