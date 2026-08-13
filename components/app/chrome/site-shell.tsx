"use client";

import type { ReactNode } from "react";
import { usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { SiteDock } from "./site-dock";
import { SiteFrame } from "./site-frame";
import { SiteHeader } from "./site-header";

export function SiteShell({
  children,
  githubStarCount,
}: {
  children: ReactNode;
  githubStarCount: number | null;
}) {
  const pathname = usePathname();
  const immersive = pathname.startsWith("/palettes");

  return (
    <>
      {!immersive && <SiteHeader githubStarCount={githubStarCount} />}
      <main className={cn(!immersive && "pt-14 pb-32")}>
        <SiteFrame>{children}</SiteFrame>
      </main>
      {!immersive && <SiteDock />}
    </>
  );
}
