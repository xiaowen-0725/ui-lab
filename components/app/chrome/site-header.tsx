"use client";

import { Star, SwatchBook } from "lucide-react";
import { useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/app/chrome/language-switcher";
import { MobileNav } from "@/components/app/chrome/mobile-nav";
import { SiteSearch } from "@/components/app/chrome/site-search";
import { GithubIcon } from "@/components/app/icons";
import { usePreferences } from "@/components/app/preferences/preferences-provider";
import { PressLink } from "@/components/app/press-link";
import { Tooltip } from "@/components/motion/tooltip";
import { Link, usePathname } from "@/i18n/navigation";
import { DOCS_HREF, isSpaceActive, NAV_SPACES } from "@/lib/nav";
import { REPO_URL } from "@/lib/site";
import { cn } from "@/lib/utils";

function formatStarCount(count: number) {
  if (count >= 1000) {
    const val = Math.round(count / 100) / 10;
    return `${val}k`;
  }
  return String(count);
}

export function SiteHeader({
  githubStarCount,
}: {
  githubStarCount: number | null;
}) {
  const t = useTranslations("nav");
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const { setPanelOpen } = usePreferences();
  const pathname = usePathname();
  const wideHeader =
    pathname.startsWith("/components") || pathname.startsWith("/dictionary");
  const formattedStarCount =
    typeof githubStarCount === "number"
      ? formatStarCount(githubStarCount)
      : null;

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 8);
  });

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 transition-[background,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-border bg-background/70 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <div
        className={cn(
          "relative flex h-14 items-center justify-between gap-4",
          wideHeader
            ? "w-full px-4 md:px-6 xl:px-8"
            : "mx-auto max-w-7xl px-4",
        )}
      >
        <div className="flex min-w-0 items-center gap-4">
          <MobileNav />
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 text-sm font-semibold tracking-tight text-foreground"
          >
            <Image
              src="/uilab-mark.png"
              alt=""
              aria-hidden="true"
              width={24}
              height={24}
              className="h-6 w-6 rounded-lg"
            />
            <span>{t("brand")}</span>
          </Link>
          <nav className="hidden items-center gap-0.5 lg:flex">
            {NAV_SPACES.map((space) => (
              <Link
                key={space.key}
                href={space.href}
                className={cn(
                  "whitespace-nowrap rounded-md px-2 py-1.5 text-sm transition-colors",
                  isSpaceActive(space, pathname)
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t(space.key)}
              </Link>
            ))}
          </nav>
        </div>

        <nav className="flex items-center gap-2">
          <SiteSearch className="w-9 justify-center px-0 sm:w-36 sm:justify-start sm:px-3 xl:w-56" />
          <Link
            href={DOCS_HREF}
            className={cn(
              "hidden rounded-md px-2 py-1.5 text-sm transition-colors sm:inline",
              pathname === DOCS_HREF || pathname.startsWith(`${DOCS_HREF}/`)
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t("docs")}
          </Link>
          <LanguageSwitcher className="hidden sm:flex" />
          <Tooltip content={t("customize")} side="bottom">
            <button
              type="button"
              onClick={() => setPanelOpen(true)}
              aria-label={t("customizeTheme")}
              className="hidden h-9 w-9 items-center justify-center rounded-2xl border border-border bg-card/20 text-muted-foreground transition-colors hover:text-foreground sm:flex"
            >
              <SwatchBook className="h-4 w-4" />
            </button>
          </Tooltip>
          <PressLink
            href={REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="group inline-flex items-center gap-1.5 rounded-2xl border border-border bg-card/20 px-3 py-2 text-xs font-medium text-foreground hover:border-(--color-border-strong)"
            aria-label={
              formattedStarCount
                ? t("starOnGithubCount", { count: formattedStarCount })
                : t("starOnGithub")
            }
          >
            <GithubIcon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{t("github")}</span>
            <span className="inline-flex items-center gap-0.5 text-muted-foreground">
              <Star className="h-3 w-3" />
              {formattedStarCount ? <span>{formattedStarCount}</span> : null}
            </span>
          </PressLink>
        </nav>
      </div>
    </header>
  );
}
