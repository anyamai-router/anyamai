"use client";

import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { Key, ShieldCheck } from "@phosphor-icons/react";

const RULES = [
  { rule: "max_cost < $0.01", on: true },
  { rule: "region = us-east", on: true },
  { rule: "min_reliability 0.98", on: true },
];

function Card({
  title,
  body,
  children,
  className,
}: {
  title: string;
  body: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`group flex flex-col rounded-2xl border border-edge bg-panel/70 p-6 transition-colors duration-300 hover:border-em/35 sm:p-7 ${
        className ?? ""
      }`}
    >
      <h3 className="text-[17px] font-semibold tracking-tight text-white">{title}</h3>
      <p className="mt-2 max-w-[40ch] text-[13.5px] leading-relaxed text-fog">{body}</p>
      <div className="mt-auto pt-6">{children}</div>
    </div>
  );
}

export function Bento() {
  return (
    <section id="features" className="relative">
      <div className="mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
        <Reveal className="max-w-[820px]">
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-tighter text-white sm:text-5xl lg:text-6xl">
            Everything you need to run AI traffic{" "}
            <span className="text-mint">in production.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-14 lg:grid-cols-12">
          {/* Intelligent Routing */}
          <Reveal className="sm:col-span-2 lg:col-span-6">
            <Card
              title="Intelligent Routing"
              body="Priority, weighted, round-robin, lowest-cost, lowest-latency, health-aware, and policy-based routing. Pick the strategy per route."
            >
              <div className="rounded-xl border border-edge bg-[#0d0f10] p-4">
                <svg viewBox="0 0 300 150" className="w-full" aria-hidden="true" fill="none">
                  <defs>
                    <linearGradient id="bento-r" x1="0" y1="0" x2="300" y2="150" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#059669" />
                      <stop offset="1" stopColor="#4cf0b4" />
                    </linearGradient>
                  </defs>
                  <path d="M 30 75 C 70 75 92 75 120 75" stroke="url(#bento-r)" strokeWidth="2" />
                  <path d="M 150 75 C 180 20 210 22 252 28" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                  <path d="M 150 75 C 185 75 215 75 252 75" stroke="url(#bento-r)" strokeWidth="2.2" />
                  <path d="M 150 75 C 180 128 210 126 252 122" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
                  <circle cx="150" cy="75" r="22" stroke="url(#bento-r)" strokeWidth="1.6" />
                  <circle cx="150" cy="75" r="8" fill="rgba(16,185,129,0.35)" />
                  <circle cx="30" cy="75" r="10" fill="rgba(255,255,255,0.9)" />
                  <rect x="240" y="20" width="52" height="16" rx="8" fill="rgba(255,255,255,0.05)" />
                  <rect x="240" y="67" width="52" height="16" rx="8" fill="rgba(16,185,129,0.18)" stroke="rgba(52,211,153,0.5)" />
                  <rect x="240" y="114" width="52" height="16" rx="8" fill="rgba(255,255,255,0.05)" />
                </svg>
                <div className="mt-3 flex items-center justify-between font-mono text-[9.5px] tracking-[0.14em] text-dusk">
                  <span>POLICY WEIGHT MAP</span>
                  <span className="text-mint">SELECTED → B</span>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* Automatic Fallback */}
          <Reveal delay={0.05} className="lg:col-span-3">
            <Card
              title="Automatic Fallback"
              body="When a provider fails, traffic moves to the next healthy route. No app changes, no dropped requests."
            >
              <div className="rounded-xl border border-edge bg-[#0d0f10] p-4">
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center gap-2 rounded-full border border-edge bg-panel-2 px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-dusk/70" />
                    <span className="font-mono text-[10px] text-dusk line-through decoration-dusk/40">
                      OpenAI
                    </span>
                    <span className="font-mono text-[9px] text-dusk">down</span>
                  </div>
                  <svg viewBox="0 0 160 26" className="w-32" aria-hidden="true" fill="none">
                    <path d="M 10 13 C 50 2, 110 24, 152 10" stroke="#4cf0b4" strokeWidth="1.4" strokeDasharray="3 4" strokeLinecap="round" />
                    <path d="M 146 10 L 152 10 L 148 6" stroke="#4cf0b4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex items-center gap-2 rounded-full border border-em/35 bg-em/10 px-3 py-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-mint shadow-glow-sm" />
                    <span className="font-mono text-[10px] text-mint">Anthropic</span>
                    <span className="font-mono text-[9px] text-fog/60">rerouted</span>
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* Policy Engine */}
          <Reveal delay={0.1} className="lg:col-span-3">
            <Card
              title="Policy Engine"
              body="Define hard constraints and preferences for deterministic, controllable routing."
            >
              <div className="space-y-2">
                {RULES.map((r) => (
                  <div
                    key={r.rule}
                    className="flex items-center justify-between gap-2 rounded-lg border border-edge bg-[#0d0f10] px-3 py-2.5"
                  >
                    <span className="font-mono text-[10px] text-fog">{r.rule}</span>
                    <span className="flex h-4 w-7 items-center rounded-full bg-em/30 px-0.5">
                      <span className="ml-auto h-3 w-3 rounded-full bg-mint shadow-glow-sm" />
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          {/* Provider Health */}
          <Reveal className="lg:col-span-3">
            <Card
              title="Provider Health"
              body="Latency, failures, availability, and circuit-breaker state tracked per route, live."
            >
              <div className="rounded-xl border border-edge bg-[#0d0f10] p-4">
                {/* mock latency widget */}
                <svg viewBox="0 0 200 64" className="w-full" aria-hidden="true" fill="none">
                  <defs>
                    <linearGradient id="bento-h" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
                      <stop stopColor="rgba(76,240,180,0.35)" />
                      <stop offset="1" stopColor="rgba(76,240,180,0)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 4 50 L 34 46 L 64 48 L 94 38 L 124 40 L 154 30 L 196 26"
                    stroke="#4cf0b4"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M 4 50 L 34 46 L 64 48 L 94 38 L 124 40 L 154 30 L 196 26 L 196 64 L 4 64 Z"
                    fill="url(#bento-h)"
                  />
                  <circle cx="196" cy="26" r="2.6" fill="#b6ffe3" />
                </svg>
                <div className="mt-3 flex items-center justify-between font-mono text-[9.5px] text-dusk">
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-em shadow-glow-sm" />
                    ALL ROUTES ONLINE
                  </span>
                  <span>
                    p50 <span className="text-fog">38ms</span> · p99 <span className="text-fog">210ms</span>
                  </span>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* Usage & Cost */}
          <Reveal delay={0.05} className="lg:col-span-3">
            <Card
              title="Usage & Cost"
              body="Request volume, tokens, estimated cost, and provider usage, all in one view."
            >
              <div className="rounded-xl border border-edge bg-[#0d0f10] p-4">
                {/* mock usage widget */}
                <div className="flex h-14 items-end gap-1.5">
                  {[34, 52, 40, 66, 58, 82, 47, 100, 71, 90, 62, 78].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-[3px] ${i === 7 ? "bg-gradient-to-t from-em to-mint" : "bg-em/25"}`}
                      style={{ height: `${h}%` }}
                    />
                  ))}
                </div>
                <div className="mt-3 flex items-center justify-between font-mono text-[9.5px] text-dusk">
                  <span>tokens 1.2M</span>
                  <span>
                    est. <span className="text-mint">$184.30</span>
                  </span>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* Security */}
          <Reveal delay={0.1} className="sm:col-span-2 lg:col-span-6">
            <Card
              title="Security"
              body="API keys, authentication, rate limiting, secret redaction, and controlled access at the gateway border."
            >
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-edge bg-[#0d0f10] p-4">
                  <div className="flex items-center gap-2 font-mono text-[9.5px] tracking-[0.14em] text-dusk">
                    <Key size={12} weight="bold" className="text-mint" />
                    SECRET REDACTION
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {["sk-openai-*****...*****8f2a", "sk-anth-*****...*****c47e", "sk-gem-*****...*****19b6"].map(
                      (k) => (
                        <div key={k} className="truncate rounded bg-white/[0.03] px-2.5 py-1.5 font-mono text-[9.5px] text-fog/70">
                          {k}
                        </div>
                      )
                    )}
                  </div>
                </div>
                <div className="rounded-xl border border-edge bg-[#0d0f10] p-4">
                  <div className="flex items-center gap-2 font-mono text-[9.5px] tracking-[0.14em] text-dusk">
                    <ShieldCheck size={12} weight="bold" className="text-mint" />
                    ACCESS CONTROL
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {["client key auth · enabled", "rate limit · 120 r / min", "audit log · streamed"].map((s) => (
                      <div key={s} className="flex items-center justify-between rounded bg-white/[0.03] px-2.5 py-1.5">
                        <span className="font-mono text-[9.5px] text-fog/70">{s}</span>
                        <span className="h-1 w-1 rounded-full bg-em" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}