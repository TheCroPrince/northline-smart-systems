"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState, type CSSProperties } from "react";

interface TextHoverEffectProps {
  text: string;
  /** Stroke draw-in duration (seconds). */
  duration?: number;
  /** Render the line in italic (matches the brand display rhythm). */
  italic?: boolean;
  /** Extra classes on the wrapping svg. Caller controls width. */
  className?: string;
}

/**
 * Clipped-gradient text effect (Aceternity "text hover" family).
 *
 * The headline is real SVG <text>:
 *  - a base fill in ink (always readable),
 *  - an animated outline stroke that draws in on mount,
 *  - a vivid teal→gold gradient fill revealed through a radial mask that
 *    follows the cursor.
 *
 * This is a true clipped/animated text treatment, not a word/blur reveal.
 * The viewBox width is derived from the text length so multiple lines can be
 * laid out at a consistent glyph size by the caller (see Hero).
 *
 * Reduced motion: renders static ink text with a faint static gradient wash,
 * no stroke animation, no cursor tracking.
 */
export function TextHoverEffect({
  text,
  duration = 1.2,
  italic = false,
  className,
}: TextHoverEffectProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [mask, setMask] = useState({ cx: "50%", cy: "50%" });

  // Approximate advance width per character for Instrument Serif at the
  // working font size, so the viewBox hugs the text. Tunable.
  const FONT_SIZE = 100;
  const vbWidth = Math.max(text.length * 52, 120);
  const vbHeight = 120;
  const baselineY = 92;

  useEffect(() => {
    // Default reveal sits slightly above center so it reads on first paint.
    if (!hovered) setMask({ cx: "50%", cy: "44%" });
  }, [hovered]);

  function handleMove(e: React.MouseEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * 100;
    const cy = ((e.clientY - rect.top) / rect.height) * 100;
    setMask({ cx: `${cx}%`, cy: `${cy}%` });
  }

  const textStyle: CSSProperties = {
    fontFamily: "var(--font-instrument-serif), serif",
    fontSize: FONT_SIZE,
    fontStyle: italic ? "italic" : "normal",
  };

  const textProps = {
    x: 0,
    y: baselineY,
    textAnchor: "start" as const,
    style: textStyle,
  };

  if (prefersReducedMotion) {
    return (
      <svg
        viewBox={`0 0 ${vbWidth} ${vbHeight}`}
        preserveAspectRatio="xMinYMid meet"
        className={className}
        style={{ overflow: "visible", width: "100%" }}
        aria-hidden
      >
        <text {...textProps} fill="var(--text-hi)">
          {text}
        </text>
      </svg>
    );
  }

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${vbWidth} ${vbHeight}`}
      preserveAspectRatio="xMinYMid meet"
      className={className}
      style={{ overflow: "visible", width: "100%" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMove}
      aria-hidden
    >
      <defs>
        <linearGradient id="northline-text-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--accent)" />
          <stop offset="45%" stopColor="var(--accent-bright)" />
          <stop offset="100%" stopColor="var(--gold)" />
        </linearGradient>

        <motion.radialGradient
          id="northline-reveal"
          gradientUnits="userSpaceOnUse"
          r={vbWidth * 0.22}
          animate={{ cx: mask.cx, cy: mask.cy }}
          transition={{ duration: hovered ? 0.18 : 0.6, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>

        <mask id="northline-text-mask">
          <rect
            x="0"
            y="0"
            width={vbWidth}
            height={vbHeight}
            fill="url(#northline-reveal)"
          />
        </mask>
      </defs>

      {/* Base ink fill — always readable */}
      <text {...textProps} fill="var(--text-hi)" opacity={0.92}>
        {text}
      </text>

      {/* Animated outline stroke, draws in on mount */}
      <motion.text
        {...textProps}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={0.7}
        strokeOpacity={0.35}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration, ease: [0.16, 1, 0.3, 1] }}
      >
        {text}
      </motion.text>

      {/* Vivid gradient fill revealed through the cursor mask */}
      <text
        {...textProps}
        fill="url(#northline-text-grad)"
        mask="url(#northline-text-mask)"
      >
        {text}
      </text>
    </svg>
  );
}
