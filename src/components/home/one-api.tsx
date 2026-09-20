import { Reveal } from "@/components/reveal";
import { LogoMark } from "@/components/logo";

const PROVIDERS = [
  { name: "OpenAI", model: "gpt-4o", ms: "48ms" },
  { name: "Anthropic", model: "claude-sonnet-4", ms: "61ms" },
  { name: "Gemini", model: "gemini-2.5-pro", ms: "57ms" },
  { name: "Groq", model: "llama-3.3-70b", ms: "29ms" },
  { name: "DeepSeek", model: "deepseek-r1", ms: "74ms" },
  { name: "Ollama", model: "local", ms: "12ms" },
];

export function OneApi() {
  return (
    <section id="product" className="relative">
      <div className="mx-auto max-w-[1200px] px-6 py-20 lg:py-28">
        <Reveal className="max-w-[820px]">
          <h2 className="text-4xl font-semibold leading-[1.08] tracking-tighter text-white sm:text-5xl lg:text-6xl">
            One API.{" "}
            <span className="text-mint">Every provider you need.</span>
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-fog">
            Expose one OpenAI-compatible endpoint. Register any model or
            provider. Your application never changes.
          </p>
        </Reveal>

        <Reveal delay={0.12} className="mt-12 lg:mt-14">
          <div className="overflow-hidden rounded-2xl border border-edge bg-panel/60">
            <div className="flex items-center justify-between gap-4 border-b border-edge-soft px-5 py-3.5 sm:px-7">
              <div className="flex items-center gap-3 font-mono text-[11px] text-fog">
                <span className="text-dusk">$</span>
                <span className="text-white">POST /v1/chat/completions</span>
              </div>
              <div className="font-mono flex items-center gap-2 text-[10.5px] text-dusk">
                <span className="h-1.5 w-1.5 rounded-full bg-em shadow-glow-sm" />
                <span>
                  <span className="text-mint">200</span> OK
                </span>
              </div>
            </div>

            <div className="relative bg-route-grid p-6 sm:p-10">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(520px 300px at 50% 50%, rgba(16,185,129,0.08), transparent 70%)",
                }}
              />
              <div className="relative grid items-center gap-8 lg:grid-cols-[auto_1fr_auto]">
                <div className="flex items-center justify-center">
                  <div className="flex items-center gap-3 rounded-2xl border border-edge bg-panel-2 px-5 py-3.5">
                    <span className="font-mono text-[11px] tracking-[0.12em] text-white">
                      YOUR APPLICATION
                    </span>
                  </div>
                </div>

                <div className="hidden items-center gap-2 lg:flex">
                  <div className="h-px flex-1 bg-gradient-to-r from-em/60 to-mint/60" />
                  <svg viewBox="0 0 12 12" className="h-3 w-3 text-mint" aria-hidden="true">
                    <path d="M1 6 H10 M6 1 L10 6 L6 11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="h-px w-4 bg-gradient-to-r from-mint/60 to-em/50" />
                </div>

                <div className="flex items-center justify-center">
                  <div className="relative flex flex-col items-center gap-1 rounded-2xl border border-em/35 bg-gradient-to-b from-em/15 to-mint/10 px-7 py-5 shadow-glow">
                    <LogoMark className="h-5 w-5" />
                    <span className="font-mono text-[12px] font-semibold tracking-[0.16em] text-mint">
                      ANYAMAI
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-fog/70">
                      ONE ENDPOINT · ROUTER
                    </span>
                  </div>
                </div>

                <div className="hidden items-center gap-2 lg:flex">
                  <div className="h-px w-4 bg-gradient-to-l from-em/60 to-mint/60" />
                  <svg viewBox="0 0 12 12" className="h-3 w-3 text-mint" aria-hidden="true">
                    <path d="M1 6 H10 M6 1 L10 6 L6 11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="h-px flex-1 bg-gradient-to-l from-em/60 to-mint/60" />
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {PROVIDERS.map((p) => (
                    <div
                      key={p.name}
                      className="rounded-xl border border-edge bg-panel-2/90 px-3.5 py-3 transition-colors duration-300 hover:border-em/35"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono text-[11px] font-medium text-white">
                          {p.name}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-em shadow-glow-sm" />
                          <span className="font-mono text-[9px] text-dusk">{p.ms}</span>
                        </span>
                      </div>
                      <p className="mt-1.5 truncate font-mono text-[9.5px] text-fog/70">
                        {p.model}
                      </p>
                    </div>
                  ))}
                  <div className="flex items-center justify-center rounded-xl border border-dashed border-edge px-3.5 py-3">
                    <span className="font-mono text-[10px] tracking-[0.08em] text-dusk">
                      + OPENAI-COMPATIBLE API
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-edge-soft bg-[#080c0a] px-6 py-4 sm:px-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] tracking-[0.14em] text-dusk">LIVE REQUEST</span>
                <span className="font-mono text-[10px] text-mint">› 200 OK · 48ms</span>
              </div>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-black/30 px-3 py-2.5 font-mono text-[11px] leading-relaxed text-fog">
                <span className="text-dusk">{`{`}</span>
                <span className="text-white">{"  "}model</span>
                <span className="text-dusk">: </span>
                <span className="text-mint">&quot;gpt-4o&quot;</span>
                <span className="text-dusk">,</span>
                {`
`}
                <span className="text-white">  messages</span>
                <span className="text-dusk">: </span>
                <span className="text-fog/70">[{` role: "user"` }]</span>
                <span className="text-dusk">{`
}`}</span>
              </pre>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}