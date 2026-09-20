"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotionSafe } from "@/components/use-reduced-motion-safe";
import { Reveal } from "@/components/reveal";

type Tab = "providers" | "models" | "routes" | "policies" | "requests" | "usage" | "health";

const TABS: { id: Tab; label: string }[] = [
  { id: "providers", label: "Providers" },
  { id: "models", label: "Models" },
  { id: "routes", label: "Routes" },
  { id: "policies", label: "Policies" },
  { id: "requests", label: "Requests" },
  { id: "usage", label: "Usage" },
  { id: "health", label: "Health" },
];

const PROVIDERS = [
  { name: "OpenAI", region: "us-east-1", ms: "48ms", online: true },
  { name: "Anthropic", region: "us-west-2", ms: "61ms", online: true },
  { name: "Gemini", region: "global", ms: "57ms", online: true },
  { name: "Groq", region: "us-west-1", ms: "29ms", online: true },
  { name: "DeepSeek", region: "cn-east", ms: "74ms", online: true },
  { name: "Ollama", region: "self-hosted", ms: "12ms", online: true },
];

const MODELS = [
  { model: "gpt-4o", provider: "OpenAI", ms: "48ms" },
  { model: "claude-sonnet-4", provider: "Anthropic", ms: "61ms" },
  { model: "gemini-2.5-pro", provider: "Gemini", ms: "57ms" },
  { model: "llama-3.3-70b", provider: "Groq", ms: "29ms" },
  { model: "deepseek-r1", provider: "DeepSeek", ms: "74ms" },
  { model: "qwen32b", provider: "Ollama", ms: "12ms" },
];

const ROUTES = [
  { name: "chat/default", target: "OpenAI · gpt-4o", strategy: "cost-first", score: "0.94", ok: true },
  { name: "chat/fallback", target: "Anthropic · claude-sonnet-4", strategy: "priority", score: "0.91", ok: true },
  { name: "embed/lowest-cost", target: "Groq · llama-3.3-70b", strategy: "lowest-cost", score: "0.88", ok: true },
  { name: "vision/priority", target: "OpenAI · gpt-4o", strategy: "priority", score: "0.90", ok: true },
  { name: "code/latency", target: "Groq · llama-3.3-70b", strategy: "lowest-latency", score: "0.86", ok: true },
];

const POLICIES = [
  { rule: "max_cost_per_request < $0.01", on: true },
  { rule: "region = us-east", on: true },
  { rule: "min_reliability 0.98", on: true },
  { rule: "block models: dalle", on: false },
  { rule: "retry_count = 2", on: true },
];

const REQUESTS = [
  { id: "#48219", route: "chat/default", provider: "OpenAI", tokens: "1.1k", ms: "214ms", code: 200 },
  { id: "#48218", route: "code/latency", provider: "Groq", tokens: "3.4k", ms: "410ms", code: 200 },
  { id: "#48217", route: "chat/default", provider: "Anthropic", tokens: "880", ms: "263ms", code: 200 },
  { id: "#48216", route: "embed/lowest-cost", provider: "Groq", tokens: "512", ms: "92ms", code: 200 },
  { id: "#48215", route: "code/latency", provider: "Groq", tokens: "2.2k", ms: "401ms", code: 200 },
  { id: "#48214", route: "chat/default", provider: "Anthropic", tokens: "1.9k", ms: "258ms", code: 429 },
];

const USAGE = [
  { label: "requests today", value: "48.2k" },
  { label: "tokens today", value: "16.4M" },
  { label: "est. cost today", value: "$184.30" },
  { label: "active routes", value: "12" },
];

const HEALTH = [
  { name: "OpenAI", ms: "48ms", state: "circuit closed" },
  { name: "Anthropic", ms: "61ms", state: "circuit closed" },
  { name: "Gemini", ms: "57ms", state: "circuit closed" },
  { name: "Groq", ms: "29ms", state: "circuit closed" },
  { name: "DeepSeek", ms: "74ms", state: "half-open" },
  { name: "Ollama", ms: "12ms", state: "circuit closed" },
];

function Switch({ on }: { on: boolean }) {
  return (
    <span
      role="switch"
      aria-checked={on}
      aria-hidden="true"
      className={`flex h-4 w-7 items-center rounded-full px-0.5 ${
        on ? "bg-em/35" : "bg-white/[0.08]"
      }`}
    >
      <span
        className={`h-3 w-3 rounded-full ${on ? "ml-auto bg-mint shadow-glow-sm" : "bg-dusk/60"}`}
      />
    </span>
  );
}

function Dot({ ok }: { ok: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`h-1.5 w-1.5 shrink-0 rounded-full ${ok ? "bg-em shadow-glow-sm" : "bg-dusk/70"}`}
    />
  );
}

function Panel({
  children,
  tabId,
}: {
  children: React.ReactNode;
  tabId: string;
}) {
  const reduce = useReducedMotionSafe();
  return (
    <motion.div
      role="tabpanel"
      id={`ctl-panel-${tabId}`}
      aria-labelledby={`ctl-tab-${tabId}`}
      initial={reduce ? false : { opacity: 0, y: 8 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      exit={reduce ? undefined : { opacity: 0, y: -8 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const row = "flex items-center justify-between gap-4 px-3.5 py-3";

export function ControlPlane() {
  const [tab, setTab] = useState<Tab>("routes");

  return (
    <section id="control" className="relative">
      <div className="mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
        <Reveal className="max-w-[820px]">
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-tighter text-white sm:text-5xl lg:text-6xl">
            Control your AI infrastructure{" "}
            <span className="text-mint">from one place.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.12} className="mt-12 lg:mt-14">
          <div className="overflow-hidden rounded-2xl border border-edge bg-panel/70 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.85)]">
            {/* Chrome */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-edge-soft bg-[#080c0a] px-5 py-3.5 sm:px-7">
              <div className="flex items-center gap-3">
                <span className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white/[0.08]" />
                </span>
                <span className="font-mono text-[10.5px] tracking-[0.14em] text-dusk">
                  anyamai · control plane
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div className="hidden rounded-full border border-edge bg-panel-2 px-3 py-1.5 font-mono text-[9.5px] text-fog sm:flex">
                  <span className="mr-1.5 text-dusk">search:</span>
                  <span className="text-white">routes...</span>
                </div>
                <span className="flex items-center gap-2 rounded-full border border-em/25 bg-em/10 px-3 py-1.5 font-mono text-[9.5px] tracking-[0.12em] text-mint">
                  <Dot ok />
                  SYSTEM HEALTHY
                </span>
              </div>
            </div>

            {/* Tabs */}
            <div
              role="tablist"
              aria-label="Control plane sections"
              className="scrollbar-none flex overflow-x-auto border-b border-edge-soft px-3 sm:px-5"
            >
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  id={`ctl-tab-${t.id}`}
                  aria-selected={tab === t.id}
                  aria-controls={`ctl-panel-${t.id}`}
                  onClick={() => setTab(t.id)}
                  className={`relative shrink-0 px-3 py-3.5 font-mono text-[11px] tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-inset sm:px-4 ${
                    tab === t.id ? "text-mint" : "text-dusk hover:text-fog"
                  }`}
                >
                  {t.label}
                  {tab === t.id && (
                    <motion.span
                      layoutId="ctl-tab"
                      className="absolute inset-x-2 bottom-0 h-px bg-gradient-to-r from-em to-mint"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="min-h-[320px] overflow-x-auto bg-route-grid p-4 sm:p-6">
              <AnimatePresence mode="wait">
                {tab === "providers" && (
                  <Panel key="providers" tabId="providers">
                    <div className="divide-y divide-edge-soft rounded-xl border border-edge bg-[#0a0e0c]">
                      {PROVIDERS.map((p) => (
                        <div key={p.name} className={row}>
                          <span className="flex items-center gap-2.5">
                            <Dot ok={p.online} />
                            <span className="font-mono text-[11.5px] text-white">{p.name}</span>
                            <span className="hidden font-mono text-[9.5px] text-dusk sm:inline">
                              {p.region}
                            </span>
                          </span>
                          <span className="flex items-center gap-4">
                            <span className="font-mono text-[10.5px] text-fog">{p.ms}</span>
                            <Switch on />
                          </span>
                        </div>
                      ))}
                    </div>
                  </Panel>
                )}

                {tab === "models" && (
                  <Panel key="models" tabId="models">
                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      {MODELS.map((m) => (
                        <div
                          key={m.model}
                          className="flex items-center justify-between rounded-xl border border-edge bg-[#0a0e0c] px-4 py-3"
                        >
                          <div>
                            <p className="font-mono text-[11.5px] text-white">{m.model}</p>
                            <p className="font-mono text-[9.5px] text-dusk">{m.provider}</p>
                          </div>
                          <span className="flex items-center gap-2 font-mono text-[10px] text-fog">
                            <Dot ok />
                            {m.ms}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Panel>
                )}

                {tab === "routes" && (
                  <Panel key="routes" tabId="routes">
                    <div className="divide-y divide-edge-soft rounded-xl border border-edge bg-[#0a0e0c]">
                      {ROUTES.map((r) => (
                        <div key={r.name} className={row}>
                          <span className="flex items-center gap-2.5">
                            <Dot ok={r.ok} />
                            <span className="font-mono text-[11.5px] text-white">{r.name}</span>
                          </span>
                          <span className="flex items-center gap-3 sm:gap-6">
                            <span className="hidden font-mono text-[10px] text-fog md:inline">
                              {r.target}
                            </span>
                            <span className="hidden font-mono text-[9.5px] text-dusk sm:inline">
                              {r.strategy}
                            </span>
                            <span className="font-mono text-[10.5px] text-mint">{r.score}</span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </Panel>
                )}

                {tab === "policies" && (
                  <Panel key="policies" tabId="policies">
                    <div className="divide-y divide-edge-soft rounded-xl border border-edge bg-[#0a0e0c]">
                      {POLICIES.map((p) => (
                        <div key={p.rule} className={row}>
                          <span className="font-mono text-[11.5px] text-fog">{p.rule}</span>
                          <Switch on={p.on} />
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      aria-label="Add policy (demo — no action)"
                      onClick={() => {}}
                      className="mt-3 rounded-full border border-dashed border-edge px-4 py-2 font-mono text-[10.5px] text-dusk transition-colors hover:border-em/35 hover:text-fog focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
                    >
                      + add policy
                    </button>
                  </Panel>
                )}

                {tab === "requests" && (
                  <Panel key="requests" tabId="requests">
                    <div className="rounded-xl border border-edge bg-[#0a0e0c] font-mono">
                      <div className="grid grid-cols-[52px_1fr_1fr_76px_64px_56px] gap-3 border-b border-edge-soft px-4 py-2.5 text-[9px] tracking-[0.14em] text-dusk">
                        <span>ID</span>
                        <span>ROUTE</span>
                        <span className="hidden sm:block">PROVIDER</span>
                        <span>TOKENS</span>
                        <span>LATENCY</span>
                        <span>STATUS</span>
                      </div>
                      {REQUESTS.map((r) => (
                        <div
                          key={r.id}
                          className="grid grid-cols-[52px_1fr_1fr_76px_64px_56px] items-center gap-3 border-b border-edge-soft px-4 py-2.5 text-[10px] last:border-b-0"
                        >
                          <span className="text-dusk">{r.id}</span>
                          <span className="truncate text-fog">{r.route}</span>
                          <span className="hidden truncate text-fog sm:block">{r.provider}</span>
                          <span className="text-fog">{r.tokens}</span>
                          <span className="text-fog">{r.ms}</span>
                          <span
                            className={r.code === 200 ? "flex gap-1.5 items-center text-mint" : "flex gap-1.5 items-center text-dusk"}
                          >
                            <Dot ok={r.code === 200} />
                            {r.code}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Panel>
                )}

                {tab === "usage" && (
                  <Panel key="usage" tabId="usage">
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {USAGE.map((u) => (
                        <div
                          key={u.label}
                          className="rounded-xl border border-edge bg-[#0a0e0c] px-4 py-4"
                        >
                          <p className="font-mono text-[9.5px] tracking-[0.16em] text-dusk">
                            {u.label}
                          </p>
                          <p className="mt-1.5 font-mono text-xl font-medium text-white">
                            {u.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-xl border border-edge bg-[#0a0e0c] p-4">
                      <p className="font-mono text-[9.5px] tracking-[0.16em] text-dusk">
                        TRAFFIC · LAST 24H
                      </p>
                      <svg viewBox="0 0 560 90" className="mt-3 w-full" aria-hidden="true" fill="none">
                        <defs>
                          <linearGradient id="ctl-bars" x1="0" y1="0" x2="0" y2="90" gradientUnits="userSpaceOnUse">
                            <stop stopColor="rgba(76,240,180,0.4)" />
                            <stop offset="1" stopColor="rgba(76,240,180,0)" />
                          </linearGradient>
                        </defs>
                        <path
                          d="M 4 70 L 50 62 L 96 66 L 142 48 L 188 54 L 234 40 L 280 44 L 326 28 L 372 34 L 418 22 L 464 30 L 510 16 L 556 20"
                          stroke="#4cf0b4"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 4 70 L 50 62 L 96 66 L 142 48 L 188 54 L 234 40 L 280 44 L 326 28 L 372 34 L 418 22 L 464 30 L 510 16 L 556 20 L 556 90 L 4 90 Z"
                          fill="url(#ctl-bars)"
                        />
                      </svg>
                    </div>
                  </Panel>
                )}

                {tab === "health" && (
                  <Panel key="health" tabId="health">
                    <div className="divide-y divide-edge-soft rounded-xl border border-edge bg-[#0a0e0c]">
                      {HEALTH.map((h) => (
                        <div key={h.name} className={row}>
                          <span className="flex items-center gap-2.5">
                            <Dot ok={h.state !== "half-open"} />
                            <span className="font-mono text-[11.5px] text-white">{h.name}</span>
                          </span>
                          <span className="flex items-center gap-5">
                            <span className="font-mono text-[10.5px] text-fog">{h.ms}</span>
                            <span
                              className={`font-mono text-[9.5px] tracking-[0.1em] ${
                                h.state === "half-open" ? "text-dusk" : "text-mint"
                              }`}
                            >
                              {h.state.toUpperCase()}
                            </span>
                          </span>
                        </div>
                      ))}
                    </div>
                  </Panel>
                )}
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}