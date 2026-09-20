"use client";

import { Reveal } from "@/components/reveal";
import { Stack, Database, PlugsConnected, Gauge, Eye } from "@phosphor-icons/react";

const CAPS = [
  {
    icon: Stack,
    title: "Complete",
    body: "Routing, fallback, health checks, policies, observability, and security in one binary.",
  },
  {
    icon: Database,
    title: "Self-hosted",
    body: "Runs on your infrastructure. No hosted gateway, no vendor lock-in.",
  },
  {
    icon: PlugsConnected,
    title: "OpenAI-compatible",
    body: "Your existing OpenAI SDK and code keep working. Minimal application changes.",
  },
  {
    icon: Gauge,
    title: "Performance-first",
    body: "Written in Rust. A gateway built for throughput, not a wrapper around another proxy.",
  },
  {
    icon: Eye,
    title: "Explainable",
    body: "Every routing decision is logged and explained, so you always know why a route was picked.",
  },
];

export function WhyAnyam() {
  return (
    <section id="why" className="relative">
      <div className="mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <h2 className="text-4xl font-semibold leading-[1.08] tracking-tighter text-white sm:text-5xl">
                Why <span className="text-mint">AnyamAI.</span>
              </h2>
              <p className="mt-5 max-w-[40ch] text-lg leading-relaxed text-fog">
                Built to be the control layer your AI stack is missing, not one
                more API to route around.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="divide-y divide-edge-soft border-y border-edge-soft">
              {CAPS.map((cap) => (
                <li key={cap.title} className="group flex gap-5 py-7">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-edge bg-panel-2 text-mint transition-colors duration-300 group-hover:border-em/40 group-hover:text-em">
                    <cap.icon size={18} weight="duotone" />
                  </span>
                  <div>
                    <p className="text-[17px] font-semibold tracking-tight text-white">
                      {cap.title}
                    </p>
                    <p className="mt-1.5 max-w-[46ch] text-[14px] leading-relaxed text-fog">
                      {cap.body}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}