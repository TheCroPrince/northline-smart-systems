import { ContactCta } from "@/components/marketing/ContactCta";
import { Hero } from "@/components/marketing/Hero";
import { Services } from "@/components/marketing/Services";
import { SmartSystemsAtAGlance } from "@/components/marketing/SmartSystemsAtAGlance";

export default function Home() {
  return (
    <main id="main" className="min-h-screen">
      <Hero />
      <SmartSystemsAtAGlance />
      <Services />
      <ContactCta />
    </main>
  );
}
