"use client";

import { useReducedMotion } from "motion/react";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;

/** Match the unknown server preference during hydration, then apply the
 * browser preference. Keep motion's media-query hook as the preference source. */
export function useHydratedReducedMotion() {
  const reduced = useReducedMotion();
  const hydrated = useSyncExternalStore(subscribe, clientSnapshot, serverSnapshot);
  return hydrated ? reduced : null;
}
