"use client";

import { useTranslations } from "next-intl";
import type { ReactNode, RefObject } from "react";
import { cn } from "@/lib/utils";

const SCROLL_FRAME_CLASSNAME =
  "relative h-[380px] overflow-y-auto overscroll-contain rounded-2xl border border-border bg-card/30 [scrollbar-color:var(--border)_transparent] [scrollbar-gutter:stable] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-foreground/20 [&::-webkit-scrollbar-track]:bg-transparent";

/** Shared device viewport. The same ref is both the scroll node and Motion root. */
export function ScrollFrame({
  containerRef,
  children,
  className,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  className?: string;
}) {
  const t = useTranslations("scroll");

  return (
    <div ref={containerRef} className={cn(SCROLL_FRAME_CLASSNAME, className)}>
      <div className="pointer-events-none sticky top-0 z-40 h-0 px-3 pt-3">
        <span className="inline-flex rounded-full border border-border bg-background/90 px-2.5 py-1 text-[0.65rem] font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
          {t("scrollInside")}
        </span>
      </div>
      {children}
    </div>
  );
}
