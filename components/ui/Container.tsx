import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/cn";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /**
   * Element to render. Defaults to `div`. Use `section`, `header`, or `footer`
   * when the container is the semantic root of a region.
   */
  as?: ElementType;
}

/**
 * Shared max-width and horizontal padding wrapper used by every section.
 *
 * - Max width: 80rem (1280px). Wide enough for ultrawide composition without
 *   getting too sparse on desktop.
 * - Horizontal padding scales from 24px (mobile) to 48px (desktop).
 * - No vertical spacing imposed. Sections own their own `py-*`.
 */
export function Container({
  children,
  className,
  as: Component = "div",
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-7xl px-6 sm:px-8 lg:px-12",
        className,
      )}
    >
      {children}
    </Component>
  );
}
