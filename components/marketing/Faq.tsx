import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion, type FaqItem } from "./faq/FaqAccordion";

// Answers are verbatim from COPY_VOICE §11 (the trust-section drafts). Do not
// paraphrase: each is a complete 2–4 sentence unit, factual, no trailing CTA.
const faqs: readonly FaqItem[] = [
  {
    q: "How long does a typical install take?",
    a: "A mid-sized residential project runs 4 to 8 weeks from contract to handoff, depending on trades coordination. Commercial projects vary more widely; the design phase alone often takes that long. We commit to a calendar in the proposal and update it weekly.",
  },
  {
    q: "Do you work with the equipment I already have?",
    a: "Often, yes. During the consultation we audit what's installed and what's worth keeping. If something is past end-of-life or no longer supported, we'll tell you and explain why.",
  },
  {
    q: "How does pricing work?",
    a: "We don't price by the hour and we don't quote on the spot. After the consultation we send a written proposal: device list, drawings, labor, monitoring, and a fixed total. No surprises during install.",
  },
  {
    q: "What does ongoing monitoring cost?",
    a: "It depends on the size of the system and what you want covered. Health monitoring is included with every install for the first year. After that, residential plans typically start around $89 per month; commercial plans are scoped to the property.",
  },
  {
    q: "Who has access to my system's data?",
    a: "You do. So do the technicians assigned to your account. Aggregated event metadata stays within our operations infrastructure and is never sold or shared. We retain video footage on the schedule you set (default 14 days).",
  },
  {
    q: "Are you licensed in my province or state?",
    a: "We hold the relevant low-voltage and electrical licenses in every region we operate. The consultation includes a quick check on local permitting for any work that needs it.",
  },
  {
    q: "What happens if something breaks after the install is done?",
    a: "Equipment we install carries a 2-year workmanship warranty on top of the manufacturer warranty. Monitored systems get priority response: typically a remote check within 90 seconds, a site visit within the same business day for critical issues.",
  },
] as const;

/**
 * FAQ — a trust section disguised as a help section (COPY_VOICE §11). Sits
 * between Testimonials and the Contact CTA: answer the last objections right
 * before the ask. Left column holds the heading (sticky on desktop); the right
 * column is the accordion. Also emits FAQPage JSON-LD for rich results.
 */
export function Faq() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative bg-bg-1 py-24 sm:py-28 lg:py-32"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            eyebrow="FAQ"
            title={
              <span id="faq-heading">
                Things people ask
                <span className="italic text-accent-bright"> before signing.</span>
              </span>
            }
            subhead="If something here isn't covered, a consultation is the fastest way to a straight answer."
            className="max-w-md lg:sticky lg:top-24 lg:self-start"
          />

          <Reveal variant="fade">
            <FaqAccordion items={faqs} />
          </Reveal>
        </div>
      </Container>

      <script
        type="application/ld+json"
        // FAQPage structured data — answers are plain strings, safe to serialize.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </section>
  );
}
