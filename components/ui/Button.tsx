import Link from "next/link";
import { ReactNode } from "react";

type Variant = "solid" | "gradient" | "outline" | "ghost";

const base =
  "inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3 text-sm font-semibold transition-opacity hover:opacity-90";

const variants: Record<Variant, string> = {
  solid: "bg-navy text-cream",
  gradient:
    "text-white bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]",
  outline: "border-2 border-navy/20 text-navy bg-transparent",
  ghost: "text-navy",
};

export default function Button({
  href,
  variant = "solid",
  children,
  className = "",
  type,
  download,
  target,
  onClick,
  disabled,
}: {
  href?: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  download?: boolean | string;
  target?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const classes = `${base} ${variants[variant]} ${disabled ? "pointer-events-none opacity-50" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} download={download} target={target}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} className={classes} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
