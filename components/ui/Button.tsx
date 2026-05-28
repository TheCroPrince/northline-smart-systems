import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary";

interface ButtonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  /**
   * If provided, the button renders as a navigation element:
   *  - `next/link` for relative paths and same-origin hrefs
   *  - native `<a target="_blank">` for absolute external URLs
   *
   * If omitted, the button renders as a native `<button>`.
   */
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
  "data-cta"?: string;
}

const baseStyles =
  "inline-flex select-none items-center justify-center gap-2 rounded-full px-6 h-11 text-sm font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Hover language per DESIGN_MOTION §14:
 *  - primary: background brightens ~6%, no translate.
 *  - secondary: border opacity rises from 30% to 60%, fill stays transparent.
 *
 * Focus ring is provided globally by `:focus-visible` styles in globals.css.
 */
const variantStyles: Record<Variant, string> = {
  primary: "bg-accent text-text-hi hover:bg-[#478AF7]",
  secondary:
    "border border-border/30 bg-transparent text-text-hi hover:border-border/60",
};

export function Button({
  variant = "primary",
  className,
  children,
  href,
  onClick,
  type = "button",
  disabled,
  ...aria
}: ButtonProps) {
  const classes = cn(baseStyles, variantStyles[variant], className);

  if (href !== undefined) {
    const isExternal = /^(https?:)?\/\//.test(href);
    if (isExternal) {
      return (
        <a
          href={href}
          className={classes}
          rel="noopener noreferrer"
          target="_blank"
          {...aria}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...aria}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
      {...aria}
    >
      {children}
    </button>
  );
}
