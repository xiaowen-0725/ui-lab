"use client";

import { ChevronDown, Star, SwatchBook } from "lucide-react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { type KeyboardEvent, useRef, useState } from "react";
import { GithubIcon } from "@/components/app/icons";
import { LanguageSwitcher } from "@/components/app/chrome/language-switcher";
import { MobileNav } from "@/components/app/chrome/mobile-nav";
import { usePreferences } from "@/components/app/preferences/preferences-provider";
import { PressLink } from "@/components/app/press-link";
import { SiteSearch } from "@/components/app/chrome/site-search";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/motion/popover";
import { Tooltip } from "@/components/motion/tooltip";
import { Link, usePathname } from "@/i18n/navigation";
import { NAV_TOP, isGroupActive, isSpaceActive } from "@/lib/nav";
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
  const reducedMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [vocabularyOpen, setVocabularyOpen] = useState(false);
  const vocabularyTriggerRef = useRef<HTMLButtonElement>(null);
  const vocabularyItemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const { setPanelOpen } = usePreferences();
  const pathname = usePathname();
  const isComponentsRoute = pathname.startsWith("/components");
  const formattedStarCount =
    typeof githubStarCount === "number"
      ? formatStarCount(githubStarCount)
      : null;

  useMotionValueEvent(scrollY, "change", (v) => {
    setScrolled(v > 8);
  });

  const focusVocabularyItem = (index: number) => {
    requestAnimationFrame(() => vocabularyItemRefs.current[index]?.focus());
  };

  const handleVocabularyTriggerKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    setVocabularyOpen(true);
    focusVocabularyItem(
      event.key === "ArrowDown" ? 0 : vocabularyItemRefs.current.length - 1,
    );
  };

  const handleVocabularyMenuKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
  ) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setVocabularyOpen(false);
      vocabularyTriggerRef.current?.focus();
      return;
    }

    const itemRefs = vocabularyItemRefs.current;
    const currentIndex = itemRefs.indexOf(
      document.activeElement as HTMLAnchorElement,
    );
    let nextIndex: number | null = null;

    if (event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % itemRefs.length;
    } else if (event.key === "ArrowUp") {
      nextIndex =
        (currentIndex - 1 + itemRefs.length) % itemRefs.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = itemRefs.length - 1;
    }

    if (nextIndex === null) return;
    event.preventDefault();
    itemRefs[nextIndex]?.focus();
  };

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
          isComponentsRoute
            ? "w-full px-4 md:px-6 xl:px-8"
            : "mx-auto max-w-7xl px-4",
        )}
      >
        <div className="flex items-center gap-4">
          <MobileNav />
          <Link
            href="/"
            className="group flex items-center gap-2.5 text-sm font-semibold tracking-tight text-foreground"
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
          <nav className="hidden items-center gap-0.5 md:flex">
            {NAV_TOP.map((item) => {
              if (item.kind === "space") {
                const { space } = item;
                return (
                  <Link
                    key={space.key}
                    href={space.href}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-sm transition-colors",
                      isSpaceActive(space, pathname)
                        ? "text-foreground"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t(space.key)}
                  </Link>
                );
              }

              return (
                <Popover
                  key={item.key}
                  open={vocabularyOpen}
                  onOpenChange={setVocabularyOpen}
                  side="bottom"
                  align="start"
                  sideOffset={8}
                  panelRadius={12}
                >
                  <PopoverTrigger>
                    <button
                      ref={vocabularyTriggerRef}
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={vocabularyOpen}
                      onKeyDown={handleVocabularyTriggerKeyDown}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm transition-colors",
                        isGroupActive(item.children, pathname)
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {t(item.key)}
                      <ChevronDown
                        aria-hidden="true"
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          vocabularyOpen && !reducedMotion && "rotate-180",
                        )}
                      />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent
                    role="menu"
                    aria-label={t(item.key)}
                    onKeyDown={handleVocabularyMenuKeyDown}
                    className="w-48 rounded-xl border border-border bg-popover p-1.5 shadow-lg"
                  >
                    {item.children.map((space, index) => (
                      <Link
                        key={space.key}
                        ref={(node) => {
                          vocabularyItemRefs.current[index] = node;
                        }}
                        role="menuitem"
                        href={space.href}
                        onClick={() => setVocabularyOpen(false)}
                        className={cn(
                          "block rounded-lg px-3 py-2 text-sm outline-none transition-colors hover:bg-muted focus-visible:bg-muted",
                          isSpaceActive(space, pathname)
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground focus-visible:text-foreground",
                        )}
                      >
                        {t(space.key)}
                      </Link>
                    ))}
                  </PopoverContent>
                </Popover>
              );
            })}
          </nav>
        </div>

        <nav className="flex items-center gap-2">
          <SiteSearch className="w-9 justify-center px-0 sm:w-44 sm:justify-start sm:px-3 lg:w-56" />
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
