import Link from "next/link";
import { ReactNode } from "react";

type Variant = "solid" | "gradient" | "outline" | "ghost" | "inverted";
type Size = "sm" | "md" | "lg";

const base = "inline-flex items-center justify-center gap-2 rounded-pill font-semibold transition-opacity hover:opacity-90";

const variants: Record<Variant, string> = {
  solid: "bg-navy text-cream",
  gradient:
    "text-white bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]",
  outline: "border-2 border-navy/20 text-navy bg-transparent",
  ghost: "text-navy",
  // CTA blanco solido para usar SOBRE el degradado de marca (ej. banner
  // "Mensaje del dia" de /dashboard) -- variant propio en vez de className
  // override sobre "solid" porque bg-white/text-accent chocaban en
  // especificidad con bg-navy/text-cream (mismas utilidades, mismo peso:
  // Tailwind resuelve el empate por orden en la hoja de estilos, no por
  // cual clase viene despues en el string), y el override perdia -- texto
  // casi invisible (crema sobre blanco).
  inverted: "bg-white text-accent",
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
  rel,
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
  /** Solo hace falta pasarlo para links externos con target="_blank" (ej.
   * "noopener noreferrer") -- los internos no lo necesitan. */
  rel?: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${disabled ? "pointer-events-none opacity-50" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} download={download} target={target} rel={rel}>
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
