/**
 * Testimonials — landing-page social proof. Source: MOCK_DATA_SCHEMA §5, adapted
 * for a photo-led marketing section (real headshots from the curated asset set).
 *
 * Voice follows COPY_VOICE §10: one to three grounded sentences, one concrete
 * detail each, no superlatives. Headshots are square (400px) crops at
 * `/Images/testimonials/<slug>.jpg`; larger `<slug>-2048.jpg` variants exist
 * on disk if a bigger crop is ever needed.
 */

export type TestimonialPersona =
  | "homeowner"
  | "property_manager"
  | "facilities"
  | "small_business"
  | "hospitality";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  persona: TestimonialPersona;
  quote: string;
  image: string;
  /** Marks the strongest set to surface on the homepage. */
  featured?: boolean;
}

export const testimonials: Testimonial[] = [
  {
    id: "tony-sterl",
    name: "Tony Sterl",
    role: "Homeowner · Toronto",
    persona: "homeowner",
    quote:
      "They integrated three brands my last installer said couldn't work together, then left a binder explaining how. A year in, I've called once.",
    image: "/Images/testimonials/tony-sterl-homeowner.jpg",
    featured: true,
  },
  {
    id: "justina-little",
    name: "Justina Little",
    role: "Facilities manager",
    persona: "facilities",
    quote:
      "One view of what's healthy and what needs a tech, across the whole building. The weekly report replaced a vendor we used to pay for.",
    image: "/Images/testimonials/justina-little.jpg",
    featured: true,
  },
  {
    id: "beko-covic",
    name: "Beko Covic",
    role: "Property manager",
    persona: "property_manager",
    quote:
      "The proposal came as a real document: drawings, model numbers, and a fixed total. We knew exactly what we were buying before we signed.",
    image: "/Images/testimonials/beko-covic.jpg",
    featured: true,
  },
  {
    id: "allison-kino",
    name: "Allison Kino",
    role: "Homeowner",
    persona: "homeowner",
    quote:
      "It just works, and when it doesn't, it tells me before I notice. The app is the one thing my family actually agrees on.",
    image: "/Images/testimonials/allison-kino.jpg",
  },
  {
    id: "greg-smith",
    name: "Greg Smith",
    role: "Small business owner",
    persona: "small_business",
    quote:
      "Cameras, access, and network, scoped once and installed clean. No surprise invoices, no half-finished corners.",
    image: "/Images/testimonials/greg-smith.jpg",
  },
  {
    id: "jordan-hansen",
    name: "Jordan Hansen",
    role: "Owner · three locations",
    persona: "hospitality",
    quote:
      "The same setup across all three rooms, monitored from one place. When a reader failed on a Friday night, it was handled before open.",
    image: "/Images/testimonials/jordan-hansen.jpg",
  },
];

/** The strongest set for the homepage (residential + commercial + management). */
export function getFeaturedTestimonials(): Testimonial[] {
  return testimonials.filter((t) => t.featured);
}
