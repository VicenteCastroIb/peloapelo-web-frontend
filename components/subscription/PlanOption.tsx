"use client";

import { Check } from "lucide-react";

interface PlanOptionProps {
  name: string;
  price: string;
  currency?: string;
  period: string;
  costPerDay?: string;
  features?: string[];
  note?: string;
  recommended?: boolean;
  selected?: boolean;
  current?: boolean;
  onSelect?: () => void;
  className?: string;
}

// Eleccion de plan DENTRO del panel -- no confundir con components/sections/
// PlanCard.tsx (tarjeta de precios del sitio publico): aca la persona ya
// esta adentro y compara dos opciones concretas, asi que es densa y
// seleccionable (ver docs/design del rediseno /subscription). Borde SIEMPRE
// 2px para que seleccionar no mueva el layout.
export default function PlanOption({
  name,
  price,
  currency = "CLP",
  period,
  costPerDay,
  features = [],
  note,
  recommended = false,
  selected = false,
  current = false,
  onSelect,
  className = "",
}: PlanOptionProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={current}
      onClick={onSelect}
      className={`relative flex w-full flex-col gap-4 rounded-card-lg border-2 px-6 pt-6 pb-[22px] text-left ${
        current
          ? "border-navy/15 bg-navy/[0.03]"
          : selected
          ? "border-accent bg-accent/5 shadow-md"
          : "border-navy/10 bg-white shadow-sm hover:border-accent/25"
      } ${current ? "cursor-default" : "cursor-pointer"} ${className}`}
    >
      {recommended && (
        <span className="absolute -top-[11px] left-[22px] rounded-pill bg-accent px-3 py-[3px] text-p-caption font-bold text-white">
          Recomendado
        </span>
      )}
      {current && (
        <span className="absolute -top-[11px] right-[22px] rounded-pill bg-navy px-3 py-[3px] text-p-caption font-bold text-white">
          Tu plan
        </span>
      )}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-h3-md text-navy">{name}</p>
          <p className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-data-md text-navy">{price}</span>
            <span className="text-p-caption text-navy/50">{currency}</span>
          </p>
          <p className="mt-1 text-p-small text-navy/50">
            {period}
            {costPerDay ? ` · ${costPerDay}` : ""}
          </p>
        </div>
        <span
          aria-hidden
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-pill ${
            selected || current ? "bg-accent text-white" : "border-2 border-navy/20"
          }`}
        >
          {(selected || current) && <Check size={14} strokeWidth={3} />}
        </span>
      </div>

      {features.length > 0 && (
        <ul className="grid gap-2 text-p-small text-navy/75">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check size={15} className="mt-0.5 shrink-0 text-accent" />
              {f}
            </li>
          ))}
        </ul>
      )}

      {note && <p className="text-p-caption text-navy/50">{note}</p>}
    </button>
  );
}
