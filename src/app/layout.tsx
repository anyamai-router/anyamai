import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MotionProvider } from "@/components/motion-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "AnyamAI - Build your own AI Router",
    template: "%s | AnyamAI",
  },
  description:
    "The open-source AI Router. Complete, self-hosted AI routing infrastructure built in Rust. Free to use, self-hosted, and community-driven.",
  metadataBase: new URL("https://anyam.ai"),
  keywords: ["AI router", "AI gateway", "LLM gateway", "OpenAI compatible", "self-hosted AI"],
  authors: [{ name: "AnyamAI" }],
  creator: "AnyamAI",
  alternates: { canonical: "https://anyam.ai" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "AnyamAI - Build your own AI Router",
    description:
      "One API. Multiple AI providers. Fully under your control. Self-hosted and OpenAI-compatible.",
    type: "website",
    url: "https://anyam.ai",
    siteName: "AnyamAI",
  },
  twitter: {
    card: "summary_large_image",
    title: "AnyamAI - Build your own AI Router",
    description: "One API. Multiple AI providers. Fully under your control. Self-hosted and OpenAI-compatible.",
  },
};

export const viewport = {
  themeColor: "#050807",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans text-[#eaf3ee]">
        <a
          href="#main"
          className="sr-only left-4 top-4 z-[100] rounded-full bg-mint px-4 py-2 text-[13px] font-medium text-ink focus:not-sr-only focus:fixed focus:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        >
          Skip to content
        </a>
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}