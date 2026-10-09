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
  const workspace = pathname.startsWith("/apps");

  return (
    <>
      {!immersive && <SiteHeader githubStarCount={githubStarCount} />}
      <main
        className={cn(
          workspace && "flex h-dvh flex-col overflow-hidden pt-14",
          !workspace && !immersive && "pt-14 pb-32",
        )}
      >
        <SiteFrame>{children}</SiteFrame>
      </main>
      {!immersive && !workspace && <SiteDock />}
    </>
  );
}
