import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="pt-16">{children}</div>
      <Footer />
    </main>
  );
}
