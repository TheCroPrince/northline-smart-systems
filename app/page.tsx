import type { Metadata } from "next";
import { ConsultationModal } from "@/components/consultation/ConsultationModal";
import { ContactCta } from "@/components/marketing/ContactCta";
import { Faq } from "@/components/marketing/Faq";
import { Footer } from "@/components/marketing/Footer";
import { Hero } from "@/components/marketing/Hero";
import { OperationalIntelligence } from "@/components/marketing/OperationalIntelligence";
import { PortalPreview } from "@/components/marketing/PortalPreview";
import { Process } from "@/components/marketing/Process";
import { ProjectGallery } from "@/components/marketing/ProjectGallery";
import { Services } from "@/components/marketing/Services";
import { SmartSystemsAtAGlance } from "@/components/marketing/SmartSystemsAtAGlance";
import { StickyNav } from "@/components/marketing/StickyNav";
import { Testimonials } from "@/components/marketing/Testimonials";
import { siteConfig, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Organization structured data — honest fields only (name, url, logo, the
 * markets the copy already commits to, and what the company does). No address,
 * phone, or email is invented; add those once real business details exist.
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteConfig.name,
  alternateName: siteConfig.shortName,
  url: siteUrl,
  logo: `${siteUrl}/apple-icon.png`,
  description: siteConfig.description,
  slogan: siteConfig.tagline,
  areaServed: siteConfig.serviceAreas.map((name) => ({ "@type": "Country", name })),
  knowsAbout: [
    "Access control",
    "Surveillance and security",
    "Smart home and building automation",
    "Commercial networking",
    "EV charging",
    "Remote monitoring",
    "Structured cabling",
  ],
};

export default function Home() {
  return (
    <main id="main" className="min-h-screen">
      <script
        type="application/ld+json"
        // Static, developer-authored constant — safe to serialize.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <StickyNav />
      <Hero />
      <SmartSystemsAtAGlance />
      <Services />
      <OperationalIntelligence />
      <Process />
      <ProjectGallery />
      <PortalPreview />
      <Testimonials />
      <Faq />
      <ContactCta />
      <Footer />
      <ConsultationModal />
    </main>
  );
}
