import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { Testimonials } from "@/components/landing/testimonials";
import { CTA } from "@/components/landing/cta";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </main>
  );
}
