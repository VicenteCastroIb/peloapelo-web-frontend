import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

// Estado sin contenido o seccion recien confirmada (ver docs/design del
// rediseno /progress). tone="accent" es para confirmaciones positivas
// ("Listo por hoy") -- sin sombra, fondo lila suave; el resto usa la misma
// tarjeta blanca que cualquier card del panel.
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = "muted",
  className = "",
}: {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  action?: ReactNode;
  tone?: "muted" | "accent";
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-card-lg px-8 py-10 text-center ${
        tone === "accent" ? "bg-accent/5" : "bg-white shadow-sm"
      } ${className}`}
    >
      {Icon && (
        <span className="flex h-14 w-14 items-center justify-center rounded-pill bg-accent/10 text-accent">
          <Icon size={24} strokeWidth={1.8} />
        </span>
      )}
      {title && (
        <p className={`text-h3-sm ${tone === "accent" ? "text-accent" : "text-navy"}`}>{title}</p>
      )}
      {description && (
        <p className="max-w-[420px] text-p-small leading-relaxed text-navy/70 text-pretty">{description}</p>
      )}
      {action && <div className="mt-1.5">{action}</div>}
    </div>
  );
}
