import Link from "next/link";
import { Container } from "@/components/ui/Container";

interface FooterLink {
  label: string;
  href: string;
  /** If set, opens the consultation modal (via document delegation). */
  book?: string;
}

interface FooterColumn {
  heading: string;
  links: readonly FooterLink[];
}

// Every link resolves to a real section anchor or portal route — no dead links.
const columns: readonly FooterColumn[] = [
  {
    heading: "Explore",
    links: [
      { label: "Systems", href: "#systems" },
      { label: "Capabilities", href: "#services" },
      { label: "Operations", href: "#operations" },
      { label: "Selected work", href: "#work" },
      { label: "Process", href: "#process" },
    ],
  },
  {
    heading: "Client portal",
    links: [
      { label: "Overview", href: "/portal" },
      { label: "Projects", href: "/portal/projects" },
      { label: "Devices", href: "/portal/devices" },
      { label: "Support", href: "/portal/support" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "Common questions", href: "#faq" },
      { label: "Book a consultation", href: "#contact", book: "consultation" },
      { label: "Talk to engineering", href: "#contact", book: "engineering" },
    ],
  },
];

function FooterAnchor({ link }: { link: FooterLink }) {
  const className =
    "text-sm text-text-mid transition-colors hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded";
  // Internal routes use next/link; in-page anchors use a plain anchor.
  // `book` links keep their #contact href as a no-JS fallback and open the modal.
  return link.href.startsWith("/") ? (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  ) : (
    <a href={link.href} data-book={link.book} className={className}>
      {link.label}
    </a>
  );
}

/**
 * Site footer — navigational, quiet legitimacy, legal footprint (COPY_VOICE §7).
 * Institutional tone: a small wordmark, the service-area and legal lines, and a
 * three-column sitemap of real links. Marketing-page only (the portal has its
 * own shell). Anchored on the deepest warm surface to close the page.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-ink-0">
      <Container className="py-16 sm:py-20">
        <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr] md:gap-8">
          {/* Brand block */}
          <div className="max-w-xs">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-2xl text-text-hi">Northline</span>
              <span className="font-display text-2xl italic text-accent-bright">
                smart systems
              </span>
            </div>
            <p className="mt-4 font-display text-lg italic text-text-mid">
              Designed systems. Quietly run.
            </p>
            <p className="mt-5 text-sm text-text-mid">
              Operating across Canada and the United States.
            </p>
          </div>

          {/* Sitemap columns */}
          {columns.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-mid">
                {column.heading}
              </p>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <FooterAnchor link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border-soft pt-6 text-xs text-text-mid sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} Northline Smart Systems. Licensing details available on
            request.
          </p>
          <p className="font-mono uppercase tracking-[0.1em]">
            Licensed · Insured · Bonded
          </p>
        </div>
      </Container>
    </footer>
  );
}
