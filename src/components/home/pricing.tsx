"use client";

import { CheckCircle } from "@phosphor-icons/react";
import { Reveal } from "@/components/reveal";

const INCLUDED = [
  "MIT licensed — free for commercial use",
  "Full source available on GitHub",
  "Self-hosted — your keys, your data",
  "Community-driven",
];

export function Pricing() {
  return (
    <section id="pricing" className="relative">
      <div className="mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
        <Reveal className="mx-auto max-w-[640px] text-center">
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-tighter text-white sm:text-5xl lg:text-6xl">
            100%{" "}
            <span className="bg-gradient-to-r from-mint to-em bg-clip-text text-transparent">
              open source.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-[44ch] text-lg leading-relaxed text-fog">
            MIT licensed. Free to use, self-hosted, and community-driven. No paywalls, no tiers.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-[520px] lg:mt-14">
          <div className="relative overflow-hidden rounded-3xl border border-em/25 bg-panel/80 px-6 py-10 text-center shadow-glow-lg sm:px-8">
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(420px 240px at 50% 0%, rgba(16,185,129,0.14), transparent 70%)",
              }}
            />
            <div className="relative">
              <p className="font-mono text-[11px] tracking-[0.24em] text-dusk">
                ANYAMAI · OPEN SOURCE
              </p>

              <p className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                Free
              </p>
              <p className="mt-2 font-mono text-[11px] tracking-[0.18em] text-mint">
                MIT LICENSE
              </p>

              <ul className="mx-auto mt-9 grid max-w-[320px] gap-3 text-left">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[14px] text-[#dfece6]">
                    <CheckCircle size={17} weight="bold" className="shrink-0 text-mint" />
                    {item}
                  </li>
                ))}
              </ul>

              <a
                href="https://github.com/anyamai-router/anyamai"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-9 inline-flex h-[52px] w-full items-center justify-center rounded-full bg-gradient-to-r from-em-deep to-em px-6 text-[15px] font-medium text-white shadow-glow transition-transform duration-200 hover:brightness-110 active:scale-[0.98]"
              >
                View on GitHub
              </a>

              <p className="mt-5 font-mono text-[10px] tracking-[0.14em] text-dusk">
                Clone · Build · Run — Docker ready
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}