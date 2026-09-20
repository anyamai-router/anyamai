"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useReducedMotionSafe } from "@/components/use-reduced-motion-safe";
import { PulseLine } from "@/components/pulse-line";

type Chip = {
  name: string;
  ms: string;
  x: number;
  y: number;
};

const STRANDS: { id: string; d: string; dur: number; delay: number }[] = [
  { id: "req", d: "M 6 300 C 88 300 148 300 214 300", dur: 1.4, delay: 0.1 },
  { id: "openai", d: "M 240 300 C 214 214 152 148 104 96", dur: 1.7, delay: 0.45 },
  { id: "anth", d: "M 240 300 C 290 224 344 148 368 84", dur: 1.7, delay: 0.65 },
  { id: "gemini", d: "M 240 300 C 320 292 372 282 392 268", dur: 1.6, delay: 0.85 },
  { id: "groq", d: "M 240 300 C 322 366 356 412 352 448", dur: 1.7, delay: 1.05 },
  { id: "deek", d: "M 240 300 C 176 378 142 428 120 452", dur: 1.7, delay: 1.25 },
  { id: "ollama", d: "M 240 300 C 180 282 128 276 84 272", dur: 1.6, delay: 1.45 },
];

const CHIPS: Chip[] = [
  { name: "OpenAI", ms: "48ms", x: 21.7, y: 17.1 },
  { name: "Anthropic", ms: "61ms", x: 76.7, y: 15 },
  { name: "Gemini", ms: "57ms", x: 81.7, y: 47.9 },
  { name: "Groq", ms: "29ms", x: 73.3, y: 80 },
  { name: "DeepSeek", ms: "74ms", x: 25, y: 80.7 },
  { name: "Ollama", ms: "12ms", x: 17.5, y: 48.6 },
];

export function HeroVisual() {
  const reduce = useReducedMotionSafe();

  return (
    <div className="relative mx-auto w-full max-w-[540px]">
      <div className="absolute inset-0 scale-90 rounded-full bg-em/10 blur-[90px]" />
      <div className="relative aspect-[12/14] w-full">
        <svg
          viewBox="0 0 480 560"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
          fill="none"
        >
          <defs>
            <linearGradient id="hero-strand" x1="0" y1="0" x2="480" y2="560" gradientUnits="userSpaceOnUse">
              <stop stopColor="#059669" />
              <stop offset="0.6" stopColor="#10b981" />
              <stop offset="1" stopColor="#4cf0b4" />
            </linearGradient>
            <linearGradient id="hero-strand-dim" x1="0" y1="0" x2="480" y2="560" gradientUnits="userSpaceOnUse">
              <stop stopColor="#065f46" />
              <stop offset="1" stopColor="#10b981" />
            </linearGradient>
          </defs>

          <g opacity="0.5">
            <circle cx="240" cy="300" r="238" stroke="#1c2b24" strokeWidth="1" />
            <circle cx="240" cy="300" r="186" stroke="#1c2b24" strokeWidth="1" />
            <circle cx="240" cy="300" r="132" stroke="#173030" strokeWidth="1" />
          </g>

          {STRANDS.map((s) => (
            <PulseLine
              key={s.id}
              d={s.d}
              gradId={s.id === "req" ? "hero-strand-dim" : "hero-strand"}
              baseOpacity={s.id === "req" ? 0.85 : 0.42}
              duration={s.dur}
              delay={1.6 + s.delay}
            />
          ))}

          {STRANDS.map((s) => (
            <motion.path
              key={`draw-${s.id}`}
              d={s.d}
              fill="none"
              stroke={s.id === "req" ? "#8afad4" : "#34d399"}
              strokeWidth={1.6}
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0, opacity: 1 }}
              animate={
                reduce
                  ? { opacity: 1 }
                  : { pathLength: 1, opacity: [1, 1, 0] }
              }
              transition={
                reduce
                  ? undefined
                  : {
                      duration: s.dur,
                      delay: s.delay,
                      ease: "easeInOut",
                      times: [0, 0.7, 1],
                      repeat: 1,
                      repeatType: "reverse" as const,
                      repeatDelay: 0.6,
                    }
              }
            />
          ))}
          <motion.circle
            cx="6"
            cy="300"
            r="3"
            fill="#b6ffe3"
            initial={{ opacity: 0 }}
            animate={
              reduce
                ? undefined
                : { opacity: [0, 1, 1, 0] }
            }
            transition={{
              duration: 2.4,
              delay: 0.2,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.2, 0.8, 1],
            }}
            style={{ filter: "drop-shadow(0 0 6px rgba(76,240,180,0.9))" }}
          />
        </svg>

        {/* Core — premium hub */}
        <div
          className="absolute"
          style={{ left: "50%", top: "53.6%", transform: "translate(-50%, -50%)" }}
        >
          <div className="relative flex h-[128px] w-[128px] items-center justify-center rounded-full sm:h-[148px] sm:w-[148px]">
            <div className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.22),transparent_65%)] blur-[6px]" />
            <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.28),transparent_70%)] shadow-[0_0_40px_rgba(16,185,129,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]" />
            <div className="animate-spin-slow absolute inset-0 rounded-full border border-dashed border-em/30" />
            <div className="absolute inset-[3px] rounded-full border border-em/20" />
            <div className="absolute inset-2 rounded-full border border-em/25" />
            <div className="relative flex flex-col items-center gap-1 text-center">
              <Image
                src="/logo.png"
                alt="AnyamAI"
                width={28}
                height={28}
                className="h-7 w-7 object-contain"
              />
              <span className="font-mono text-[12px] font-semibold tracking-[0.18em] text-mint text-glow">
                ANYAMAI
              </span>
              <span className="font-mono text-[8.5px] tracking-[0.24em] text-dusk">
                ROUTING CORE
              </span>
            </div>
          </div>
        </div>

        {/* Request chip */}
        <div
          className="absolute left-0 top-[50%] hidden -translate-y-1/2 sm:block"
        >
          <div className="flex items-center gap-2 rounded-full border border-em/35 bg-panel/90 px-3 py-1.5 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-mint shadow-glow-sm animate-breathe" />
            <span className="font-mono text-[10px] font-medium tracking-[0.22em] text-mint">
              REQUEST
            </span>
          </div>
        </div>

        {/* Provider chips */}
        {CHIPS.map((chip) => (
          <div
            key={chip.name}
            className="absolute hidden sm:block"
            style={{ left: `${chip.x}%`, top: `${chip.y}%`, transform: "translate(-50%, -50%)" }}
          >
            <div className="flex items-center gap-2 rounded-full border border-edge bg-panel/90 px-3 py-1.5 backdrop-blur-sm shadow-[0_8px_30px_-14px_rgba(0,0,0,0.8)] transition-colors duration-300 hover:border-em/40">
              <span className="h-1.5 w-1.5 rounded-full bg-em shadow-glow-sm" />
              <span className="font-mono text-[11px] font-medium text-white">{chip.name}</span>
              <span className="font-mono text-[9.5px] text-dusk">{chip.ms}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}