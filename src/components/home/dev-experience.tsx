"use client";

import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/components/use-reduced-motion-safe";
import { Reveal } from "@/components/reveal";

const BOOT: { text: string; tone: "cmd" | "ok" | "info" | "dim" }[] = [
  { text: "$ anyamai start", tone: "cmd" },
  { text: "[1/4] loading config ......... ok", tone: "info" },
  { text: "[2/4] connecting providers ... 5 online · 1 local", tone: "info" },
  { text: "[3/4] health checks .......... ok", tone: "info" },
  { text: "[4/4] gateway ready", tone: "ok" },
  { text: "", tone: "info" },
  { text: "listening on http://localhost:8080/v1", tone: "ok" },
  { text: "openai-compatible endpoint active", tone: "dim" },
];

const toneClass: Record<string, string> = {
  cmd: "text-white",
  ok: "text-mint",
  info: "text-fog",
  dim: "text-dusk",
};

export function DevExperience() {
  const reduce = useReducedMotionSafe();

  return (
    <section id="developers" className="relative">
      <div className="mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
        <Reveal className="max-w-[820px]">
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-tighter text-white sm:text-5xl lg:text-6xl">
            Drop it into <span className="text-mint">your stack.</span>
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-fog">
            A single OpenAI-compatible endpoint. A one-line start command. Run
            it next to your app and it just works.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:mt-14 lg:grid-cols-12">
          {/* Terminal */}
          <Reveal className="lg:col-span-7">
            <div className="h-full overflow-hidden rounded-2xl border border-edge bg-[#070b09] shadow-[0_30px_90px_-40px_rgba(0,0,0,0.9)]">
              <div className="flex items-center gap-3 border-b border-edge-soft px-5 py-3">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
                </span>
                <span className="font-mono text-[10.5px] tracking-[0.14em] text-dusk">
                  anyamai · bash
                </span>
              </div>
              <div className="min-h-[280px] p-5 font-mono text-[12px] leading-[1.9] sm:p-6">
                {BOOT.map((line, i) => (
                  <motion.p
                    key={i}
                    initial={reduce ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={reduce ? { duration: 0 } : { duration: 0.4, delay: 0.6 + i * 0.12 }}
                    className={toneClass[line.tone]}
                  >
                    {line.text}
                    {line.tone === "cmd" && (
                      <span className="ml-1 inline-block h-3.5 w-[7px] translate-y-[2px] animate-pulse bg-mint/80" />
                    )}
                  </motion.p>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right cards */}
          <div className="grid gap-4 lg:col-span-5">
            <Reveal delay={0.08}>
              <div className="rounded-2xl border border-edge bg-panel/70 p-6">
                <p className="font-mono text-[10px] tracking-[0.2em] text-dusk">ENDPOINT</p>
                <div className="mt-3 flex items-center justify-between rounded-xl border border-edge bg-[#0a0e0c] px-4 py-3.5">
                  <span className="font-mono text-[13px] text-white">
                    http://localhost:8080/v1
                  </span>
                  <span className="hidden font-mono text-[9.5px] text-dusk sm:block">
                    OPENAI-COMPATIBLE
                  </span>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-fog">
                  Point your existing OpenAI client at AnyamAI. Add providers
                  later without touching code.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="rounded-2xl border border-edge bg-panel/70 p-6">
                <p className="font-mono text-[10px] tracking-[0.2em] text-dusk">DOCKER</p>
                <div className="mt-3 rounded-xl border border-edge bg-[#0a0e0c] px-4 py-3.5 font-mono text-[12px]">
                  <p className="text-white">$ docker compose up -d</p>
                  <p className="mt-1 text-fog">[+] Running 1/1</p>
                  <p className="text-mint">✔ Container anyam-ai Started</p>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-fog">
                  Deploy the full gateway with one command on your own machine.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}