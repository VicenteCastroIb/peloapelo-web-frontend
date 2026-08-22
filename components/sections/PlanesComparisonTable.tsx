"use client";

import { useRef, useState } from "react";
import { Check, X } from "lucide-react";
import type { ComparisonRow } from "@/lib/data/plans";

function Cell({ value }: { value: string | boolean }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check size={16} className="mx-auto text-accent" />
    ) : (
      <X size={16} className="mx-auto text-navy/25" />
    );
  }
  return <span className="text-p-small">{value}</span>;
}

// Client component aparte (auditoria mobile, ago 2026): necesita onScroll
// para el affordance de abajo, asi que no puede vivir directo en
// app/planes/page.tsx (server component -- ese archivo hace fetch server-side
// de los planes con precio en vivo, ver PlanesPage).
export default function PlanesComparisonTable({ rows }: { rows: ComparisonRow[] }) {
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative mt-10">
      {/* Affordance de scroll: el overflow-x-auto de abajo SI permite ver las
          4 columnas deslizando, pero a 390px de ancho solo entran 2 de
          entrada (Caracteristica + Gratuito) -- sin ningun indicio visual, la
          tabla se leia como si solo tuviera un plan. El hint de texto (solo
          mobile, desaparece apenas se hace scroll) mas el degrade a la
          derecha avisan que hay mas para ver deslizando. */}
      <p
        className={`mb-2 text-center text-p-caption text-navy/60 transition-opacity sm:hidden ${
          scrolled ? "opacity-0" : "opacity-100"
        }`}
      >
        Desliza para ver los 3 planes →
      </p>
      <div
        ref={scrollRef}
        onScroll={() => setScrolled((scrollRef.current?.scrollLeft ?? 0) > 8)}
        className="overflow-x-auto rounded-card-lg border border-navy/10 bg-white"
      >
        <table className="w-full min-w-[560px] text-left text-p-small">
          <thead>
            <tr className="border-b border-navy/10">
              <th className="p-4 font-semibold">Característica</th>
              <th className="p-4 text-center font-semibold">Gratuito</th>
              <th className="p-4 text-center font-semibold text-accent">Plan 3 Meses</th>
              <th className="p-4 text-center font-semibold">Mensual</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature} className="border-b border-navy/5">
                <td className="p-4">{row.feature}</td>
                <td className="p-4 text-center">
                  <Cell value={row.gratuito} />
                </td>
                <td className="p-4 text-center">
                  <Cell value={row.trimestral} />
                </td>
                <td className="p-4 text-center">
                  <Cell value={row.mensual} />
                </td>
              </tr>
            ))}
            <tr className="border-b border-navy/5 font-semibold">
              <td className="p-4">Precio</td>
              <td className="p-4 text-center">Gratis · 3 días</td>
              <td className="p-4 text-center">$92.000 CLP</td>
              <td className="p-4 text-center">$35.990 CLP / mes</td>
            </tr>
            <tr>
              <td className="p-4">Costo por día</td>
              <td className="p-4 text-center text-navy/40">—</td>
              <td className="p-4 text-center">$1.022</td>
              <td className="p-4 text-center">$1.199</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        aria-hidden
        className={`pointer-events-none absolute bottom-0 right-0 top-8 w-10 rounded-r-card-lg bg-gradient-to-l from-white to-transparent transition-opacity sm:hidden ${
          scrolled ? "opacity-0" : "opacity-100"
        }`}
      />
    </div>
  );
}
