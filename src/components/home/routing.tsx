"use client";

import { useId } from "react";
import { CheckCircle, PhoneCall } from "@phosphor-icons/react";
import { Reveal } from "@/components/reveal";
import { PulseLine } from "@/components/pulse-line";

const FACTORS = ["Reliability", "Latency", "Cost", "Health"];

function VLine({ delay, dur }: { delay: number; dur: number }) {
  const gid = `rv-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 2 44" className="h-9 w-2" aria-hidden="true" fill="none">
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#4cf0b4" />
        </linearGradient>
      </defs>
      <PulseLine d="M 1 2 C 1 14, 1 30, 1 42" gradId={gid} baseOpacity={0.55} duration={dur} delay={delay} />
    </svg>
  );
}

const WHY = [
  { label: "Healthy", detail: "no recent failures" },
  { label: "Low latency", detail: "within policy floor" },
  { label: "Cost within policy", detail: "budget respected" },
  { label: "Highest routing score", detail: "0.94 of 1.0" },
];

export function Routing() {
  return (
    <section id="routing" className="relative">
      <div className="mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
        <Reveal className="max-w-[820px]">
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-tighter text-white sm:text-5xl lg:text-6xl">
            Route every request{" "}
            <span className="bg-gradient-to-r from-mint to-em bg-clip-text text-transparent">
              intelligently
            </span>
            .
          </h2>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-6 lg:mt-14 lg:grid-cols-2">
          {/* Flow */}
          <Reveal className="h-full">
            <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-edge bg-panel/60 p-8">
              <div className="flex flex-col items-center">
                <div className="rounded-full border border-edge bg-panel-2 px-5 py-2.5">
                  <span className="font-mono text-[11px] tracking-[0.16em] text-white">
                    REQUEST
                  </span>
                </div>
                <VLine delay={0} dur={2.2} />
                <div className="rounded-2xl border border-em/35 bg-gradient-to-b from-em/15 to-transparent px-6 py-4 text-center shadow-glow-sm">
                  <span className="font-mono text-[11.5px] font-semibold tracking-[0.14em] text-mint">
                    ANYAMAI
                  </span>
                  <span className="block font-mono text-[9.5px] tracking-[0.2em] text-fog/70">
                    POLICY ENGINE
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                  {FACTORS.map((f) => (
                    <span
                      key={f}
                      className="rounded-full border border-edge bg-panel-2 px-3 py-1.5 font-mono text-[10px] tracking-[0.1em] text-fog"
                    >
                      {f}
                    </span>
                  ))}
                </div>
                <VLine delay={0.8} dur={2.6} />
                <div className="flex items-center gap-3 rounded-full border border-em/40 bg-gradient-to-r from-em/25 to-mint/15 px-6 py-2.5 shadow-glow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-mint animate-breathe" />
                  <span className="font-mono text-[11px] font-medium tracking-[0.14em] text-mint">
                    SELECTED ROUTE
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Decision panel */}
          <Reveal delay={0.1} className="h-full">
            <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-edge bg-panel/60">
              <div className="flex items-center justify-between border-b border-edge-soft px-6 py-3.5">
                <span className="font-mono text-[10.5px] tracking-[0.22em] text-dusk">
                  ROUTING DECISION
                </span>
                <span className="flex items-center gap-2 font-mono text-[10.5px] text-dusk">
                  <span className="h-1.5 w-1.5 rounded-full bg-em shadow-glow-sm" />
                  live
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-6 p-6 sm:p-8">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-dusk">
                    SELECTED ROUTE
                  </p>
                  <div className="mt-2.5 flex items-center justify-between gap-4 rounded-xl border border-edge bg-panel-2 px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-em/15 text-em" aria-hidden="true">
                        <PhoneCall size={14} weight="bold" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="font-mono text-[13px] font-semibold text-white">
                          OpenAI · gpt-4o
                        </p>
                        <p className="font-mono text-[9.5px] text-dusk">us-east-1 · stable</p>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-mint">48ms</span>
                  </div>
                </div>

                <div>
                  <p className="font-mono text-[10px] tracking-[0.2em] text-dusk">WHY</p>
                  <ul className="mt-2.5 space-y-2">
                    {WHY.map((w) => (
                      <li key={w.label}>
                        <div className="flex items-center justify-between gap-4 rounded-lg border border-transparent bg-white/[0.02] px-3.5 py-2.5 transition-colors hover:border-edge">
                          <span className="flex items-center gap-2.5">
                            <CheckCircle size={15} weight="bold" className="text-mint" />
                            <span className="text-[13px] text-[#dfece6]">{w.label}</span>
                          </span>
                          <span className="font-mono text-[10px] text-dusk">{w.detail}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-auto flex items-center justify-between border-t border-edge-soft pt-5">
                  <span className="font-mono text-[10.5px] tracking-[0.16em] text-dusk">
                    POLICY · COST-FIRST
                  </span>
                  <span className="font-mono text-[15px] font-medium text-mint text-glow">
                    score 0.94
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}