"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
	INSPIRATION_BRANDS,
	INSPIRATION_SITES,
	INSPIRATION_SOURCES,
} from "@/lib/inspiration";
import { cn } from "@/lib/utils";

const ITEMS = [
  {
    key: "sources",
    href: "/inspiration",
    count: INSPIRATION_SOURCES.length,
  },
  {
    key: "sites",
    href: "/inspiration/sites",
    count: INSPIRATION_SITES.length,
  },
  {
    key: "brands",
    href: "/inspiration/brands",
    count: INSPIRATION_BRANDS.length,
  },
] as const;

/** Local navigation between the three inspiration-library collections. */
export function InspirationSubnav({ className }: { className?: string }) {
  const pathname = usePathname();
  const t = useTranslations("inspiration.subnav");

  return (
    <nav
      aria-label={t("label")}
      className={cn(
        "inline-flex rounded-2xl border border-border bg-card/20 p-1",
        className,
      )}
    >
      {ITEMS.map((item) => {
        const active =
          item.key === "sources"
            ? pathname === "/inspiration"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.key}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-sm transition-colors",
              active
                ? "bg-card text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t(item.key)}
            <span className="font-mono text-[0.65rem] text-muted-foreground">
              {item.count}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
