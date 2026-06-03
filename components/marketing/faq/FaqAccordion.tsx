"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/cn";
import { duration, ease } from "@/lib/motion";

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * FAQ accordion. One item open at a time (COPY_VOICE §11). The answer panel
 * animates open with a height/opacity transition; reduced motion shows/hides it
 * instantly. The "+" marker rotates into an "×" when open. Questions are h3s so
 * the section keeps a clean h2 → h3 hierarchy.
 */
export function FaqAccordion({ items }: { items: readonly FaqItem[] }) {
  const prefersReducedMotion = useReducedMotion();
  // First item open by default so the section has presence and shows there's
  // real content; -1 means all closed.
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <ul className="border-t border-border-soft">
      {items.map((item, i) => {
        const isOpen = i === openIndex;
        const panelId = `faq-panel-${i}`;
        const btnId = `faq-button-${i}`;

        const answer = (
          <p className="max-w-2xl pb-6 pr-8 text-sm leading-relaxed text-text-mid sm:text-base">
            {item.a}
          </p>
        );

        return (
          <li key={item.q} className="border-b border-border-soft">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? -1 : i)}
                className="flex w-full items-center justify-between gap-4 py-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
              >
                <span className="font-display text-lg text-text-hi sm:text-xl">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full border text-text-mid transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none",
                    isOpen
                      ? "rotate-45 border-accent/40 bg-accent/10 text-accent-bright"
                      : "border-border-soft",
                  )}
                >
                  <Plus size={15} strokeWidth={2} />
                </span>
              </button>
            </h3>

            {prefersReducedMotion ? (
              isOpen ? (
                <div id={panelId} role="region" aria-labelledby={btnId}>
                  {answer}
                </div>
              ) : null
            ) : (
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    id={panelId}
                    role="region"
                    aria-labelledby={btnId}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: duration.normal / 1000, ease: ease.out }}
                    className="overflow-hidden"
                  >
                    {answer}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </li>
        );
      })}
    </ul>
  );
}
