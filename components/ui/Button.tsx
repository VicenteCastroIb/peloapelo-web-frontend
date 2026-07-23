import Link from "next/link";
import { ReactNode } from "react";

type Variant = "solid" | "gradient" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90";

const variants: Record<Variant, string> = {
  solid: "bg-navy text-cream",
  gradient:
    "text-white bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]",
  outline: "border border-navy/20 text-navy bg-transparent",
  ghost: "text-navy",
};

export default function Button({
  href,
  variant = "solid",
  children,
  className = "",
  type,
}: {
  href?: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
}) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} className={classes}>
      {children}
    </button>
  );
}
