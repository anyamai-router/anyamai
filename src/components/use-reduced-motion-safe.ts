"use client";

import { useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Hydration-safe reduced-motion flag: false on the server and during the
 * first client render (so SSR and hydration match), true afterwards if the
 * user prefers reduced motion. Respects prefers-reduced-motion.
 */
export function useReducedMotionSafe() {
  const reduce = useReducedMotion();
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  return mounted && reduce;
}