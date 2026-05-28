"use client";

import { motion, useReducedMotion } from "framer-motion";

interface WordRevealProps {
  /** Text to reveal. Splits on whitespace; each word animates independently. */
  children: string;
  /** Base delay in ms before the first word starts. */
  delay?: number;
  /** Stagger between words in ms. */
  stagger?: number;
  /** Visual style applied to each word span. */
  className?: string;
}

/**
 * Word-by-word headline reveal. Each word fades in with a small Y offset and
 * a brief blur-to-crisp resolve — like ink absorbing into paper.
 *
 * Reduced-motion: renders the text plainly with no animation.
 */
export function WordReveal({
  children,
  delay = 0,
  stagger = 70,
  className,
}: WordRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const words = children.split(" ");

  if (prefersReducedMotion) {
    return <span className={className}>{children}</span>;
  }

  return (
    <span className={className} aria-label={children}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block whitespace-pre"
          initial={{ opacity: 0, y: "0.45em", filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.85,
            delay: (delay + i * stagger) / 1000,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </span>
  );
}
