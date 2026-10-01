"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { DICTIONARY_SECTIONS, isSpaceActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

export function DictionaryNav() {
  const pathname = usePathname();
  const t = useTranslations("nav");

  return (
    <nav aria-label={t("dictionary")} className="mb-8 flex gap-1 md:mb-0 md:flex-col">
      {DICTIONARY_SECTIONS.map((section) => {
        const active = isSpaceActive(section, pathname);
        return (
          <Link
            key={section.key}
            href={section.href}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-foreground/[0.06] font-medium text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            {t(section.key)}
          </Link>
        );
      })}
    </nav>
  );
}
