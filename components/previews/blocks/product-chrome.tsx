"use client";

import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ProductScheme = "light" | "dark";

const LIGHT_VARS = {
  colorScheme: "light",
  "--background": "#ffffff",
  "--foreground": "#111113",
  "--card": "#ffffff",
  "--card-foreground": "#111113",
  "--muted": "#efeff1",
  "--muted-foreground": "#8a8a93",
  "--border": "rgba(17, 17, 19, 0.08)",
  "--border-strong": "rgba(17, 17, 19, 0.14)",
  "--popover": "#ffffff",
  "--popover-foreground": "#111113",
  "--primary": "#111113",
  "--primary-foreground": "#ffffff",
} as CSSProperties;

const DARK_VARS = {
  colorScheme: "dark",
  "--background": "#0a0a0a",
  "--foreground": "#f4f4f5",
  "--card": "#141414",
  "--card-foreground": "#f4f4f5",
  "--muted": "#1a1a1a",
  "--muted-foreground": "#8b8b8b",
  "--border": "rgba(255, 255, 255, 0.08)",
  "--border-strong": "rgba(255, 255, 255, 0.16)",
  "--popover": "#141414",
  "--popover-foreground": "#f4f4f5",
  "--primary": "#7c5cff",
  "--primary-foreground": "#ffffff",
  "--plan-accent": "#7c5cff",
} as CSSProperties;

export function ProductChrome({
  scheme,
  className,
  children,
}: {
  scheme: ProductScheme;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-product-chrome={scheme}
      className={cn(
        "w-full overflow-hidden rounded-[22px] border antialiased",
        scheme === "light"
          ? "border-[#e8e8ea] bg-[#f4f4f6] text-[#111113]"
          : "border-white/10 bg-[#0a0a0a] text-[#f4f4f5]",
        className,
      )}
      style={scheme === "light" ? LIGHT_VARS : DARK_VARS}
    >
      {children}
    </div>
  );
}
