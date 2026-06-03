import { ContactCta } from "@/components/marketing/ContactCta";
import { Hero } from "@/components/marketing/Hero";
import { OperationalIntelligence } from "@/components/marketing/OperationalIntelligence";
import { PortalPreview } from "@/components/marketing/PortalPreview";
import { Process } from "@/components/marketing/Process";
import { ProjectGallery } from "@/components/marketing/ProjectGallery";
import { Services } from "@/components/marketing/Services";
import { SmartSystemsAtAGlance } from "@/components/marketing/SmartSystemsAtAGlance";
import { Testimonials } from "@/components/marketing/Testimonials";

export default function Home() {
  return (
    <main id="main" className="min-h-screen">
      <Hero />
      <SmartSystemsAtAGlance />
      <Services />
      <OperationalIntelligence />
      <Process />
      <ProjectGallery />
      <PortalPreview />
      <Testimonials />
      <ContactCta />
    </main>
  );
}
