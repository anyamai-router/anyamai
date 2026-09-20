"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/components/use-reduced-motion-safe";
import { HeroVisual } from "./hero-visual";

const EASE = [0.16, 1, 0.3, 1] as const;

function Fade({
  children,
  className,
  delay,
}: {
  children: React.ReactNode;
  className?: string;
  delay: number;
}) {
  const reduce = useReducedMotionSafe();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 26 }}
      animate={reduce ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={reduce ? { duration: 0 } : { duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="mx-auto max-w-[1200px] px-6 pt-24 pb-12 lg:pb-16">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_minmax(0,540px)] lg:gap-10">
          <div className="max-w-[600px]">
            <Fade delay={0.1}>
              <h1 className="text-5xl font-semibold leading-[1.04] tracking-tighter text-white sm:text-6xl xl:text-7xl">
                Build your own{" "}
                <span className="bg-gradient-to-r from-mint via-em to-em-deep bg-clip-text text-transparent">
                  AI Router
                </span>
                .
              </h1>
            </Fade>

            <Fade delay={0.22}>
              <p className="mt-6 max-w-[46ch] text-lg leading-relaxed text-fog">
                Route AI traffic across providers with intelligent policies,
                automatic fallback, health-aware routing, and full control over
                your infrastructure.
              </p>
            </Fade>

            <Fade delay={0.34}>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <a
                  href="#pricing"
                  className="inline-flex h-12 items-center rounded-full bg-gradient-to-r from-em-deep to-em px-6 text-[15px] font-medium text-white shadow-glow transition-transform duration-200 hover:brightness-110 active:scale-[0.98]"
                >
                  Get AnyamAI
                </a>
                <a
                  href="#developers"
                  className="inline-flex h-12 items-center rounded-full border border-edge bg-white/[0.02] px-6 text-[15px] font-medium text-[#d7e6de] transition-colors duration-200 hover:border-em/40 hover:text-white active:scale-[0.98]"
                >
                  View Documentation
                </a>
              </div>
            </Fade>

            <Fade delay={0.46}>
              <p className="font-mono mt-8 text-[11.5px] tracking-[0.14em] text-dusk">
                Self-hosted · OpenAI-compatible · Rust-powered
              </p>
            </Fade>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.25, ease: EASE }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>
    </section>
  );
}