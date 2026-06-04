import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getFeaturedTestimonials, type Testimonial } from "@/lib/mock/testimonials";

/**
 * Testimonials — grounded social proof from real owners and managers. Three
 * cards (residential + commercial + property management), each a headshot,
 * a one- or two-sentence quote, name, and role.
 */
export function Testimonials() {
  const items = getFeaturedTestimonials();

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-heading"
      className="relative bg-bg-0 py-24 sm:py-28 lg:py-32"
    >
      <Container>
        <SectionHeading
          eyebrow="In their words"
          title={
            <span id="testimonials-heading">
              Trusted on both sides of the
              <span className="italic text-accent-bright"> property line.</span>
            </span>
          }
          subhead="Homeowners, building managers, and operators who live with Northline systems day to day."
          className="max-w-2xl"
        />

        <ul className="mt-14 grid grid-cols-1 gap-5 sm:mt-16 md:grid-cols-3">
          {items.map((item, index) => (
            <li key={item.id} className="h-full">
              <Reveal variant="rise" delay={index * 80} className="h-full">
                <TestimonialCard item={item} />
              </Reveal>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="flex h-full flex-col rounded-[1.5rem] border border-border-soft bg-surface p-7 shadow-[var(--shadow-card)]">
      <blockquote className="flex-1 text-base leading-relaxed text-text-hi">
        <span aria-hidden className="font-display text-3xl leading-none text-accent/50">
          &ldquo;
        </span>
        <p className="mt-2">{item.quote}</p>
      </blockquote>

      <figcaption className="mt-7 flex items-center gap-3 border-t border-border-soft pt-5">
        <span className="relative size-11 shrink-0 overflow-hidden rounded-full border border-border-soft">
          <Image
            src={item.image}
            alt={`${item.name}, ${item.role}`}
            fill
            sizes="44px"
            className="object-cover"
          />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-medium text-text-hi">{item.name}</span>
          <span className="block text-xs text-text-mid">{item.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
