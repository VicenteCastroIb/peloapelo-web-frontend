import type { ReactNode } from "react";

type Tone = "neutral" | "accent" | "solid" | "gradient" | "danger";

// No hay grises neutros en la paleta de marca (ver docs/design del
// rediseno /progress + /subscription): "neutral" es navy con alfa, no un
// gris generico -- "danger" es la unica tonalidad que usa coral, reservada
// para estados de dolor/cancelacion (ej. pago fallido).
const tones: Record<Tone, string> = {
  neutral: "bg-navy/5 text-navy/60",
  accent: "bg-accent/10 text-accent",
  solid: "bg-accent text-white",
  gradient: "text-white bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))]",
  danger: "bg-coral-soft text-coral",
};

export default function Badge({
  tone = "neutral",
  children,
  className = "",
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-pill px-2.5 py-1 text-p-caption font-semibold ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
