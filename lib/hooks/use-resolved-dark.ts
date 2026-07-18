"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * SSR-safe resolved dark-mode flag. `resolvedTheme` from next-themes is
 * `undefined` on the server and on the first client render, so reading it
 * directly (e.g. `resolvedTheme !== "light"`) makes theme-dependent text or
 * attributes differ between the server render and hydration — a hard React
 * hydration mismatch. This reports `false` (light, matching the light-default
 * server HTML) until mount, then switches to the real theme.
 */
export function useResolvedDark(): boolean {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted && resolvedTheme === "dark";
}
