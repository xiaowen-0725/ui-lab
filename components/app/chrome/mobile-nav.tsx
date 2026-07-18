"use client";

import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { usePathname } from "@/i18n/navigation";
import { useEffect, useState } from "react";
import { SidebarNav } from "@/components/app/chrome/site-sidebar";
import { BottomSheet } from "@/components/motion/bottom-sheet";
import { Button } from "@/components/motion/button";
import { NAV_TOP, isSpaceActive } from "@/lib/nav";
import { cn } from "@/lib/utils";

/** Mobile nav: a header hamburger that opens the sidebar list in UI Lab's own bottom sheet. */
export function MobileNav() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Covers navigation that doesn't go through a sheet link (back/forward).
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger — close the sheet on any route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </Button>
      <BottomSheet
        open={open}
        onOpenChange={setOpen}
        title="Menu"
        snapPoints={[0.85]}
      >
        <div className="flex flex-col gap-5 pt-2">
          <nav className="flex flex-wrap gap-1">
            {NAV_TOP.map((item) => {
              if (item.kind === "space") {
                const { space } = item;
                return (
                  <Link
                    key={space.key}
                    href={space.href}
                    onClick={() => setOpen(false)}
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
                <div
                  key={item.key}
                  className="my-1 w-full border-y border-border/60 py-2"
                >
                  <p className="px-3 text-xs font-medium text-muted-foreground">
                    {t(item.key)}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-1 pl-2">
                    {item.children.map((space) => (
                      <Link
                        key={space.key}
                        href={space.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "rounded-md px-3 py-1.5 text-sm transition-colors",
                          isSpaceActive(space, pathname)
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {t(space.key)}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
      </BottomSheet>
    </div>
  );
}
