import Link from "next/link";
import { ReactNode } from "react";

type Variant = "solid" | "gradient" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base = "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-opacity hover:opacity-90";

const variants: Record<Variant, string> = {
  solid: "bg-navy text-cream",
  gradient:
    "text-white bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]",
  outline: "border-2 border-navy/20 text-navy bg-transparent",
  ghost: "text-navy",
};

// sm es para acciones secundarias dentro de una tarjeta (ej. "Elegir foto",
// "Comparar dos fechas" -- ver docs/design del rediseno /progress); md es
// el boton por defecto de siempre, con el objetivo tactil minimo de 44px.
const sizes: Record<Size, string> = {
  sm: "min-h-9 px-4 py-2 text-xs",
  md: "min-h-11 px-6 py-3 text-sm",
  lg: "min-h-11 px-7 py-3.5 text-base",
};

export default function Button({
  href,
  variant = "solid",
  size = "md",
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
  size?: Size;
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
  download?: boolean | string;
  target?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${disabled ? "pointer-events-none opacity-50" : ""} ${className}`;

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
