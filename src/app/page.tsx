import { SiteNav } from "@/components/site-nav";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/home/hero";
import { Problem } from "@/components/home/problem";
import { OneApi } from "@/components/home/one-api";
import { Routing } from "@/components/home/routing";
import { Bento } from "@/components/home/bento";
import { ControlPlane } from "@/components/home/control-plane";
import { SelfHosted } from "@/components/home/self-hosted";
import { DevExperience } from "@/components/home/dev-experience";
import { WhyAnyam } from "@/components/home/why-anyam";
import { Pricing } from "@/components/home/pricing";
import { FinalCta } from "@/components/home/final-cta";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "AnyamAI",
    description:
      "The open-source AI Router. Complete, self-hosted AI routing infrastructure built in Rust.",
    url: "https://anyam.ai",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Linux, macOS, Windows",
    license: "https://github.com/anyamai/anyamai/blob/main/LICENSE",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <div className="flex min-h-full flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteNav />
      <main id="main" className="flex-1">
        <Hero />
        <Problem />
        <OneApi />
        <Routing />
        <Bento />
        <ControlPlane />
        <SelfHosted />
        <DevExperience />
        <WhyAnyam />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}