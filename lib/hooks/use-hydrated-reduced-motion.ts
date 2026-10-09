"use client";

import { useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";
const subscribe = (notify: () => void) => {
  if (typeof window.matchMedia !== "function") return () => {};
  const media = window.matchMedia(query);
  media.addEventListener("change", notify);
  return () => media.removeEventListener("change", notify);
};
const clientSnapshot = () =>
  typeof window.matchMedia === "function" ? window.matchMedia(query).matches : null;
const serverSnapshot = () => null;
const subscribeHydration = () => () => {};

/** Match the unknown server preference during hydration, then apply the
 * browser preference. Motion supplies the fallback preference; an explicit
 * subscription also handles changes after mount in Motion 11. */
export function useHydratedReducedMotion() {
  const reduced = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribeHydration, () => true, () => false);
  const live = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  return hydrated ? (live ?? reduced) : null;
}
