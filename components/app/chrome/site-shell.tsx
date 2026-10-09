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
  const adminDemo = pathname.startsWith("/sites/admin-workspace-site/demo");

  return (
    <>
      {!immersive && !adminDemo && <SiteHeader githubStarCount={githubStarCount} />}
      <main
        className={cn(
          adminDemo && "h-dvh overflow-hidden",
          !adminDemo && !immersive && "pt-14 pb-32",
        )}
      >
        <SiteFrame>{children}</SiteFrame>
      </main>
      {!immersive && !adminDemo && <SiteDock />}
    </>
  );
}
