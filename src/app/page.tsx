import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { LiveDemo } from "@/components/landing/live-demo";
import { StrategyTemplates } from "@/components/landing/strategy-templates";
import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";
import { MarketTicker } from "@/components/landing/market-ticker";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <MarketTicker />
      <Navbar />
      <Hero />
      <Features />
      <LiveDemo />
      <StrategyTemplates />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
