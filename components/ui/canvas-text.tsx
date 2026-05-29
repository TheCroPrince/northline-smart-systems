"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

interface CanvasTextProps {
  text: string;
  /**
   * Font classes for the (invisible) sizing element. The canvas reads the
   * resolved font from it, so responsive `clamp()` sizing works. Use the
   * display font here.
   */
  className?: string;
  /** Line colors cycled across the diagonal sweep. */
  colors?: string[];
  /** Gap between lines, in CSS px (scaled by dpr). */
  lineGap?: number;
  /** Seconds for one full color sweep. */
  animationDuration?: number;
  /** Horizontal alignment of the rendered text within its box. */
  align?: "left" | "center";
}

const DEFAULT_COLORS = [
  "#5fd6bb",
  "#34b39a",
  "#2a9a84",
  "#9fe2d2",
  "#34b39a",
  "#d6a861",
  "#5fd6bb",
  "#2a9a84",
];

/**
 * Canvas Text (Aceternity-style). The text is rendered on an HTML canvas as a
 * mask: animated diagonal color lines are drawn across the box, then clipped to
 * the glyph shapes via `destination-in` compositing. The result is letters
 * filled with continuously moving colored lines — a true canvas-clipped text
 * effect, not a CSS gradient or reveal.
 *
 * An invisible sizing element (same font classes) establishes a responsive box
 * and supplies the resolved font to the canvas. Reduced motion renders static
 * cream text instead.
 */
export function CanvasText({
  text,
  className,
  colors = DEFAULT_COLORS,
  lineGap = 5,
  animationDuration = 16,
  align = "center",
}: CanvasTextProps) {
  const sizerRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const sizer = sizerRef.current;
    const canvas = canvasRef.current;
    if (!sizer || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let font = "";
    let raf = 0;
    const start = performance.now();

    const sync = () => {
      const rect = sizer.getBoundingClientRect();
      if (rect.width < 1) return;
      canvas.width = Math.ceil(rect.width * dpr);
      canvas.height = Math.ceil(rect.height * dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      const cs = getComputedStyle(sizer);
      const sizePx = parseFloat(cs.fontSize) * dpr;
      font = `${cs.fontStyle} ${cs.fontWeight} ${sizePx}px ${cs.fontFamily}`;
    };

    const draw = (now: number) => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const gap = Math.max(2, lineGap * dpr) * 3;
      const cycle = (((now - start) / (animationDuration * 1000)) % 1 + 1) % 1;
      const scroll = cycle * gap * colors.length;
      ctx.lineWidth = Math.max(1.2, lineGap * dpr * 0.7);
      ctx.lineCap = "round";

      // 45° diagonal lines sweeping left→right
      for (let i = -h; i < w + h; i += gap) {
        const idx = Math.floor((i + scroll) / gap);
        const color = colors[((idx % colors.length) + colors.length) % colors.length];
        const x = i + (scroll % gap);
        ctx.strokeStyle = color;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x - h, h);
        ctx.stroke();
      }

      // clip the lines to the glyph shapes
      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = "#000";
      ctx.font = font;
      ctx.textBaseline = "alphabetic";
      const metrics = ctx.measureText(text);
      const ascent = metrics.actualBoundingBoxAscent || parseFloat(font) * 0.8;
      const descent = metrics.actualBoundingBoxDescent || parseFloat(font) * 0.2;
      const textW = metrics.width;
      const x = align === "center" ? (w - textW) / 2 : 0;
      const y = (h + ascent - descent) / 2;
      ctx.fillText(text, x, y);
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(draw);
    };

    sync();
    raf = requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => sync());
    ro.observe(sizer);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [text, colors, lineGap, animationDuration, align, prefersReducedMotion]);

  return (
    <span className={cn("relative inline-block", align === "center" && "text-center")}>
      {/* Sizing element carries the real text for accessibility. It is visible
          (cream) under reduced motion, and visually hidden (but still in the
          a11y tree) while the canvas paints the animated fill. */}
      <span
        ref={sizerRef}
        className={cn(
          "block whitespace-nowrap",
          className,
          prefersReducedMotion ? "text-text-hi" : "opacity-0",
        )}
      >
        {text}
      </span>
      {!prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          aria-hidden
          className="pointer-events-none absolute left-0 top-0"
        />
      )}
    </span>
  );
}
