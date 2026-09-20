"use client";

import { CheckCircle } from "@phosphor-icons/react";
import { Reveal } from "@/components/reveal";
import { LogoMark } from "@/components/logo";

const POINTS = [
  {
    title: "Self-hosted",
    body: "Your traffic and metadata stay inside your own network.",
  },
  {
    title: "No hosted gateway",
    body: "No dependency on a third-party proxy between you and your models.",
  },
  {
    title: "Fully open source",
    body: "MIT licensed — full source available on GitHub, free for any use.",
  },
  {
    title: "Credentials stay yours",
    body: "Provider keys live in your own config, never on our servers.",
  },
  {
    title: "Deploy anywhere",
    body: "Bare metal, a VPS, Kubernetes, or a single machine at home.",
  },
];

function Layer({
  label,
  sub,
  hero,
  connector,
}: {
  label: string;
  sub?: string;
  hero?: boolean;
  connector?: string;
}) {
  return (
    <>
      <div
        className={`flex w-full flex-col items-center rounded-2xl border px-5 py-4 text-center ${
          hero
            ? "border-em/40 bg-gradient-to-b from-em/15 to-mint/5 shadow-glow"
            : "border-edge bg-panel-2/80"
        }`}
      >
        <span className="flex items-center gap-2.5">
          {hero && <LogoMark className="h-4 w-4" />}
          <span
            className={`font-mono text-[11px] tracking-[0.16em] ${
              hero ? "font-semibold text-mint" : "text-white"
            }`}
          >
            {label}
          </span>
        </span>
        {sub && (
          <span className="mt-1 font-mono text-[9.5px] tracking-[0.14em] text-dusk">{sub}</span>
        )}
      </div>
      {connector && (
        <div className="flex w-full flex-col items-center">
          <div className="h-7 w-px bg-gradient-to-b from-em/50 to-mint/50" />
          <span className="font-mono text-[9px] tracking-[0.16em] text-dusk/80">{connector}</span>
        </div>
      )}
    </>
  );
}

export function SelfHosted() {
  return (
    <section id="self-hosted" className="relative">
      <div className="mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
        <Reveal className="max-w-[820px]">
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-tighter text-white sm:text-5xl lg:text-6xl">
            Your infrastructure.{" "}
            <span className="text-mint">Your keys. Your data.</span>
          </h2>
        </Reveal>

        <div className="mt-12 grid items-center gap-12 lg:mt-16 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="rounded-2xl border border-edge bg-panel/60 bg-route-grid px-7 py-8 sm:px-10">
              <div className="flex w-full flex-col items-center">
                <Layer label="YOUR APPLICATION" sub="calls /v1 as usual" />
                <Layer connector="HTTP · OPENAI-COMPATIBLE" label="YOUR SERVER" sub="any runtime you run" />
                <Layer connector="LOCAL PROCESS" hero label="ANYAMAI" sub="router · policies · health" />
                <Layer connector="OUTBOUND HTTPS" label="AI PROVIDERS" sub="openai · anthropic · gemini · groq · more" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <ul className="space-y-7">
              {POINTS.map((p) => (
                <li key={p.title} className="flex gap-4">
                  <CheckCircle size={20} weight="bold" className="mt-0.5 shrink-0 text-mint" />
                  <div>
                    <p className="text-[16px] font-semibold tracking-tight text-white">
                      {p.title}
                    </p>
                    <p className="mt-1 max-w-[42ch] text-[14px] leading-relaxed text-fog">
                      {p.body}
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