"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { duration, ease } from "@/lib/motion";

const links = [
  { label: "Services", href: "#services" },
  { label: "Systems", href: "#systems" },
  { label: "Operations", href: "#operations" },
  { label: "Work", href: "#work" },
  { label: "Portal", href: "/portal" },
] as const;

/**
 * Sticky post-hero nav (PRD §7 acceptance). Hidden over the hero — which has
 * its own floating nav — then slides in once the user scrolls roughly a
 * viewport past it, and hides again on the way back up near the top.
 *
 * Mounted/unmounted via AnimatePresence so the off-screen links never sit in the
 * tab order; reduced motion drops the slide and just fades. Sits below the
 * consultation modal (z-40 < z-60). Marketing page only.
 */
export function StickyNav() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      // Reveal once the hero is mostly scrolled past.
      setVisible(window.scrollY > window.innerHeight * 0.85);
    };
    const onScroll = () => {
      if (!raf) raf = window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: "-100%" }}
          transition={{ duration: duration.fast / 1000, ease: ease.out }}
          className="fixed inset-x-0 top-0 z-40 border-b border-border/70 bg-bg-0/85 backdrop-blur-md"
        >
          <Container className="flex h-14 items-center justify-between gap-4">
            <a
              href="#hero"
              aria-label="Northline Smart Systems — back to top"
              className="flex items-baseline gap-2 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
            >
              <span className="font-display text-lg tracking-tight text-text-hi">
                Northline
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-text-low sm:inline">
                Smart Systems
              </span>
            </a>

            <div className="flex items-center gap-7">
              <nav
                aria-label="Page sections"
                className="hidden items-center gap-7 text-sm font-medium text-text-mid lg:flex"
              >
                {links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="rounded transition-colors hover:text-text-hi focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>

              <Button
                variant="primary"
                className="h-9 px-4 text-xs"
                href="#contact"
                data-book="consultation"
              >
                Book a consultation
                <ArrowRight size={14} strokeWidth={2} aria-hidden />
              </Button>
            </div>
          </Container>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
