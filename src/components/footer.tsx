import { Logo } from "./logo";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Routing", href: "#routing" },
      { label: "Control Plane", href: "#control" },
      { label: "Open Source", href: "#pricing" },
    ],
  },
  {
    title: "Developer",
    links: [
      { label: "Documentation", href: "#developers" },
      { label: "Self-hosting", href: "#self-hosted" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-edge-soft">
      <div className="mx-auto max-w-[1200px] px-6 py-14">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-4 max-w-[30ch] text-[14px] leading-relaxed text-fog">
              A self-hosted AI router and gateway. One API, multiple providers,
              fully under your control.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-[10px] tracking-[0.22em] text-dusk">
                {col.title.toUpperCase()}
              </p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[14px] text-fog transition-colors hover:text-mint"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-dusk">SOURCE</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="https://github.com/anyamai-router/anyamai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-fog transition-colors hover:text-mint"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/anyamai-router/anyamai/tree/main/LICENSE"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-fog transition-colors hover:text-mint"
                >
                  License
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-edge-soft pt-6 sm:flex-row sm:items-center">
          <p className="font-mono text-[11px] tracking-[0.12em] text-dusk">
            AnyamAI - Build your own AI Router.
          </p>
          <p className="font-mono text-[11px] text-dusk">
            © 2026 AnyamAI · MIT License · Open Source
          </p>
        </div>
      </div>
    </footer>
  );
}