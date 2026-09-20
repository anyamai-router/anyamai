"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { GithubLogo, X } from "@phosphor-icons/react";
import { Logo } from "./logo";

const LINKS = [
  { label: "Product", href: "#product" },
  { label: "Features", href: "#features" },
  { label: "Docs", href: "#developers" },
  { label: "Open Source", href: "#pricing" },
];

export function SiteNav() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 12;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className={`mx-auto max-w-[1200px] px-6 transition-all duration-300 ${
          scrolled ? "h-14" : "h-[72px]"
        }`}
      >
        <nav
          aria-label="Main"
          className={`flex h-full items-center justify-between rounded-full border px-4 pl-5 transition-colors duration-300 ${
            scrolled
              ? "border-edge bg-[#050807]/75 shadow-[0_10px_40px_-18px_rgba(0,0,0,0.9)] backdrop-blur-xl"
              : "border-transparent"
          }`}
        >
          <a href="#top" aria-label="AnyamAI home">
            <Logo />
          </a>

          <ul className="hidden items-center gap-0.5 whitespace-nowrap md:flex">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="rounded-full px-3 py-2 text-[13px] text-fog transition-colors hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/anyamai-router/anyamai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AnyamAI on GitHub"
              className="hidden h-9 w-9 items-center justify-center rounded-full text-fog transition-colors hover:bg-white/[0.05] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint sm:flex"
            >
              <GithubLogo size={18} weight="duotone" />
            </a>
            <a
              href="#pricing"
              className="hidden h-9 items-center rounded-full bg-gradient-to-r from-em-deep to-em px-4.5 text-[13.5px] font-medium text-white shadow-glow-sm transition-transform active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint sm:inline-flex"
            >
              Get AnyamAI
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav-panel"
              aria-haspopup="dialog"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-edge text-fog transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint md:hidden"
            >
              <X size={17} weight="bold" className={open ? "block" : "hidden"} />
              <span className={`${open ? "hidden" : "block space-y-[3px]"}`}>
                <span className="block h-[1.5px] w-3.5 bg-current" />
                <span className="block h-[1.5px] w-3.5 bg-current" />
              </span>
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            ref={panelRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto max-w-[1200px] px-6 md:hidden"
          >
            <div className="rounded-2xl border border-edge bg-panel/95 p-2 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.9)] backdrop-blur-xl">
              {LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-[15px] text-fog transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="https://github.com/anyamai-router/anyamai"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-[15px] text-fog transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                <GithubLogo size={17} weight="duotone" /> GitHub / Source
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}