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
}

const baseStyles =
  "inline-flex h-12 select-none items-center justify-center gap-2 rounded-full px-7 text-sm font-medium tracking-tight transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] disabled:cursor-not-allowed disabled:opacity-60";

const variantStyles: Record<Variant, string> = {
  primary: cn(
    "bg-ink-0 text-text-on-ink",
    "shadow-[0_8px_24px_rgba(20,24,26,0.18),0_1px_2px_rgba(20,24,26,0.12)]",
    "hover:bg-accent hover:shadow-[0_12px_32px_color-mix(in_srgb,var(--accent)_28%,transparent),0_1px_2px_rgba(20,24,26,0.12)]",
    "hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
  ),
  secondary: cn(
    "bg-surface text-text-hi border border-border",
    "hover:border-accent/50 hover:shadow-[var(--shadow-card)]",
    "hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
  ),
  ghost: cn(
    "text-text-hi",
    "hover:text-accent",
  ),
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
