import type { LucideIcon } from "lucide-react";

// Tarjeta chica de una sola metrica (icono + valor + label), usada donde
// haga falta mostrar un numero de progreso personal sin la densidad de una
// tarjeta de dato completa (ver text-data-lg/md en globals.css para esa
// otra escala). Extraida de /progress (ago 2026) para reusarla tal cual en
// el dashboard -- misma racha/fotos/meses, dos lugares distintos.
export default function MetricaChica({
  icon: Icon,
  valor,
  label,
}: {
  icon: LucideIcon;
  valor: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-card-md border border-navy/10 bg-white px-[18px] py-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-icon bg-accent/10 text-accent">
        <Icon size={20} strokeWidth={1.9} />
      </span>
      <div className="min-w-0">
        <p className="text-2xl font-black tabular-nums text-navy">{valor}</p>
        <p className="mt-0.5 text-p-small text-navy/60">{label}</p>
      </div>
    </div>
  );
}
