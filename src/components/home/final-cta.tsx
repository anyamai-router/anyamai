import { Reveal } from "@/components/reveal";

function WovenBackdrop() {
  return (
    <svg
      viewBox="0 0 1200 640"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.14]"
      aria-hidden="true"
      fill="none"
    >
      <defs>
        <linearGradient id="fcta-g" x1="0" y1="0" x2="1200" y2="640" gradientUnits="userSpaceOnUse">
          <stop stopColor="#059669" />
          <stop offset="0.6" stopColor="#10b981" />
          <stop offset="1" stopColor="#4cf0b4" />
        </linearGradient>
      </defs>
      <g stroke="url(#fcta-g)" strokeWidth="1.4" strokeLinecap="round">
        <path d="M 600 320 C 520 180 360 120 240 100" />
        <path d="M 600 320 C 660 180 820 120 940 100" />
        <path d="M 600 320 C 540 460 400 540 260 560" />
        <path d="M 600 320 C 680 460 820 540 960 560" />
        <path d="M 60 320 C 200 300 420 300 560 314" />
        <path d="M 1140 320 C 1000 300 800 300 640 314" />
        <path d="M 600 20 C 590 120 600 240 600 300" />
        <path d="M 600 620 C 590 520 600 400 600 340" />
      </g>
    </svg>
  );
}

export function FinalCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[480px] -translate-y-1/2 bg-em/10 blur-[110px]" />
      <WovenBackdrop />
      <div className="relative mx-auto max-w-[1200px] px-6 py-28 text-center lg:py-40">
        <Reveal>
          <h2 className="mx-auto max-w-[16ch] text-4xl font-semibold leading-[1.06] tracking-tighter text-white sm:text-6xl">
            Your AI traffic.{" "}
            <span className="bg-gradient-to-r from-mint to-em bg-clip-text text-transparent">
              Your rules.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-[46ch] text-lg leading-relaxed text-fog">
            Build, deploy, and control your own AI Router with AnyamAI.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#pricing"
              className="inline-flex h-[52px] items-center rounded-full bg-gradient-to-r from-em-deep to-em px-7 text-[15px] font-medium text-white shadow-glow transition-transform duration-200 hover:brightness-110 active:scale-[0.98]"
            >
              Get AnyamAI
            </a>
            <a
              href="#developers"
              className="inline-flex h-[52px] items-center rounded-full border border-edge bg-white/[0.02] px-7 text-[15px] font-medium text-[#d7e6de] transition-colors duration-200 hover:border-em/40 hover:text-white active:scale-[0.98]"
            >
              Read the Docs
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}