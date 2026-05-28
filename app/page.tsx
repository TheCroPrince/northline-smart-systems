import { Hero } from "@/components/marketing/Hero";
import { Services } from "@/components/marketing/Services";
import { TrustStrip } from "@/components/marketing/TrustStrip";

export default function Home() {
  return (
    <main id="main" className="min-h-screen">
      <Hero />
      <Services />
      <TrustStrip />
    </main>
  );
}
