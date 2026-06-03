import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

interface ButtonProps {
  variant?: Variant;
  className?: string;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  "aria-label"?: string;
  "data-cta"?: string;
  /** Opens the consultation modal via document-level delegation. */
  "data-book"?: string;
}

const baseStyles =
  "inline-flex h-12 select-none items-center justify-center gap-2 rounded-full px-7 text-sm font-medium tracking-tight transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-not-allowed disabled:opacity-60";

/**
 * Dark-theme variants:
 *  - primary: cream fill / ink text, brightens to teal on hover (pops on dark).
 *  - secondary: warm bordered surface that lifts to an accent edge.
 *  - ghost: text-only, accent on hover.
 */
const variantStyles: Record<Variant, string> = {
  primary: cn(
    "bg-text-hi text-ink-0",
    "shadow-[0_10px_30px_rgba(0,0,0,0.4)]",
    "hover:bg-accent-bright hover:text-ink-0",
    "hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
  ),
  secondary: cn(
    "border border-border bg-surface/60 text-text-hi backdrop-blur-sm",
    "hover:border-accent/50 hover:bg-surface",
    "hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
  ),
  ghost: "text-text-hi hover:text-accent-bright",
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
        <a href={href} className={classes} rel="noopener noreferrer" target="_blank" {...aria}>
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
    <button type={type} onClick={onClick} disabled={disabled} className={classes} {...aria}>
      {children}
    </button>
  );
}
