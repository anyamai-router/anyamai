import { Reveal } from "@/components/reveal";
import { LogoMark } from "@/components/logo";

const PROVIDERS = ["OpenAI", "Anthropic", "Gemini", "Groq"];

function Node({ label, dim }: { label: string; dim?: boolean }) {
  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 ${
        dim
          ? "border-edge bg-panel/60 text-dusk"
          : "border-edge bg-panel-2 text-white"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dim ? "bg-dusk/60" : "bg-em shadow-glow-sm"}`} />
      <span className="font-mono text-[11px] tracking-[0.12em]">{label}</span>
    </div>
  );
}

export function Problem() {
  return (
    <section id="problem" className="relative">
      <div className="mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
        <Reveal className="mx-auto max-w-[820px] text-center">
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-tighter text-white sm:text-5xl lg:text-6xl">
            AI is fragmented.
            <br />
            <span className="bg-gradient-to-r from-mint to-em bg-clip-text text-transparent">
              Your application doesn&apos;t have to be.
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-[52ch] text-lg leading-relaxed text-fog">
            Multiple providers, models, API keys, price structures, and failure
            modes. AnyamAI sits between your app and all of them.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-14 lg:mt-16">
          <div className="overflow-hidden rounded-2xl border border-edge bg-panel/60">
            <div className="grid lg:grid-cols-2">
              {/* BEFORE */}
              <div className="p-7 sm:p-9">
                <p className="font-mono text-[10.5px] tracking-[0.24em] text-dusk">
                  BEFORE
                </p>
                <div className="mt-6 flex flex-col items-center gap-0">
                  <Node label="YOUR APPLICATION" />
                  <div className="h-9 w-px border-l border-dashed border-edge" />
                  <div className="flex flex-col items-center gap-3">
                    {PROVIDERS.map((p, i) => (
                      <div key={p} className="flex flex-col items-center">
                        <div className="flex items-center gap-2 opacity-60 grayscale">
                          <Node label={p.toUpperCase()} dim />
                          <span className="text-dusk/70">
                            {i === 2 ? (
                              <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                                <path d="M2 2 L10 10 M10 2 L2 10" stroke="#5c6b62" strokeWidth="1.6" strokeLinecap="round" />
                              </svg>
                            ) : (
                              <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                                <path d="M2 2 L10 10 M10 2 L2 10" stroke="#35433b" strokeWidth="1.6" strokeLinecap="round" />
                              </svg>
                            )}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 font-mono text-[10.5px] leading-relaxed text-dusk/80">
                    app talks to every provider
                    <br />
                    on its own
                  </div>
                </div>
              </div>

              {/* AFTER */}
              <div className="relative border-t border-edge bg-route-grid p-7 sm:p-9 lg:border-l lg:border-t-0">
                <div className="pointer-events-none absolute inset-0 rounded-none bg-[radial-gradient(320px_240px_at_50%_28%,rgba(16,185,129,0.12),transparent_70%)]" />
                <p className="font-mono text-[10.5px] tracking-[0.24em] text-em">
                  AFTER ANYAMAI
                </p>
                <div className="relative mt-6 flex flex-col items-center gap-0">
                  <Node label="YOUR APPLICATION" />
                  <div className="h-9 w-px bg-gradient-to-b from-em/70 to-mint/70" />
                  <div className="flex items-center gap-3 rounded-full border border-em/30 bg-gradient-to-r from-em/20 to-mint/15 px-5 py-2 shadow-glow-sm">
                    <LogoMark className="h-4.5 w-4.5" />
                    <span className="font-mono text-[11px] font-semibold tracking-[0.14em] text-mint">
                      ANYAMAI
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-3">
                    {PROVIDERS.map((_, i) => (
                      <div key={i} className="flex flex-col items-center">
                        <div className="h-6 w-px bg-gradient-to-b from-mint/70 to-em/60" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-0 flex flex-wrap justify-center gap-3">
                    {PROVIDERS.map((p) => (
                      <div
                        key={p}
                        className="flex items-center gap-2 rounded-full border border-edge bg-panel-2 px-3.5 py-2"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-em shadow-glow-sm" />
                        <span className="font-mono text-[10.5px] tracking-[0.1em] text-white">
                          {p.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 font-mono text-[10.5px] leading-relaxed text-fog/70">
                    one gateway in front of everything
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}