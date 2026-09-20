"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/components/use-reduced-motion-safe";

type PulseLineProps = {
  d: string;
  gradId: string;
  className?: string;
  baseOpacity?: number;
  duration?: number;
  delay?: number;
};

/**
 * A light-trail connector: a faint gradient strand plus a mint dash that
 * flows along the path on a seamless loop. Used inside an <svg> that owns
 * the gradient def referenced by `gradId`.
 */
export function PulseLine({
  d,
  gradId,
  className,
  baseOpacity = 0.5,
  duration = 3.4,
  delay = 0,
}: PulseLineProps) {
  const reduce = useReducedMotionSafe();
  return (
    <>
      <motion.path
        d={d}
        fill="none"
        stroke={`url(#${gradId})`}
        strokeWidth={2.4}
        strokeLinecap="round"
        className={className}
        style={{ opacity: baseOpacity }}
      />
      <motion.path
        d={d}
        fill="none"
        stroke="#8afad4"
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeDasharray="0.5 26"
        initial={{ strokeDashoffset: 0, opacity: 0 }}
        animate={
          reduce
            ? undefined
            : {
                strokeDashoffset: -53,
                opacity: [0, 0.85, 0.85, 0],
              }
        }
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "linear",
          times: [0, 0.18, 0.82, 1],
        }}
      />
    </>
  );
}