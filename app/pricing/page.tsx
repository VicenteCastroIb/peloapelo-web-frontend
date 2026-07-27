import type { Metadata } from "next";
import { Check, X } from "lucide-react";
import SectionBadge from "@/components/shared/SectionBadge";
import PlanCard from "@/components/sections/PlanCard";
import Faq from "@/components/sections/Faq";
import { plans as staticPlans, withLivePricing, comparisonTable } from "@/lib/data/plans";
import { fetchBackendPlans } from "@/lib/api/plans";

export const metadata: Metadata = {
  title: "Planes y precios · Pelo a Pelo",
  description:
    "Cada suscripción sostiene nuestra comunidad y permite que otra persona reciba apoyo. Sin tarjeta para empezar.",
};

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

export default async function PricingPage() {
  // Ver Planes.tsx: mismo patron de fallback seguro si el backend no responde.
  let plans = staticPlans;
  try {
    plans = withLivePricing(await fetchBackendPlans());
  } catch {
    // usa staticPlans tal cual, ya asignado arriba
  }

  return (
    <>
      <section className="px-6 py-20 text-center lg:px-12">
        <p className="text-h4-label text-navy/50">
          Planes y precios
        </p>
        <h1 className="mx-auto mt-4 max-w-2xl text-h2-lg text-navy">
          Invierte en tu <span className="italic text-accent">bienestar</span>.
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-p-body text-navy/70">
          Cada suscripción sostiene nuestra comunidad y permite que otra persona
          reciba apoyo. Sin tarjeta para empezar.
        </p>
      </section>

      <section className="px-6 pb-16 lg:px-12">
        <div className="mx-auto max-w-6xl">
          <SectionBadge label="Planes · IV" />
          <h2 className="text-h2-lg text-navy">
            Elige <span className="italic text-accent">tu camino</span>.
          </h2>
          <p className="mt-4 max-w-lg text-p-body text-navy/70">
            Somos una fundación sin fines de lucro. Cada plan que eliges permite que
            otra persona reciba apoyo sin costo.
          </p>

          {/* Grid con gap (no un panel compartido con border): PlanCard ya
              trae su propio borde/radio/degrade (ver PlanCard.tsx tras el
              rediseno), y la tarjeta destacada necesita espacio para su
              badge flotante "Mas popular", que un contenedor con
              overflow-hidden recortaria. */}
          <div className="mt-12 grid items-stretch gap-7 sm:grid-cols-3">
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-24 lg:px-12">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-h2-md text-navy">
            Tabla <span className="italic text-accent">comparativa</span>
          </h2>

          <div className="mt-10 overflow-hidden rounded-card-lg border border-navy/10 bg-white">
            <table className="w-full text-left text-p-small">
              <thead>
                <tr className="border-b border-navy/10">
                  <th className="p-4 font-semibold">Característica</th>
                  <th className="p-4 text-center font-semibold">Gratuito</th>
                  <th className="p-4 text-center font-semibold text-accent">
                    Plan 3 Meses
                  </th>
                  <th className="p-4 text-center font-semibold">Mensual</th>
                </tr>
              </thead>
              <tbody>
                {comparisonTable.map((row) => (
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

          <p className="mt-6 text-center text-p-small text-navy/60">
            Todos los pagos se procesan de forma segura con Mercado Pago. Puedes
            cancelar en cualquier momento. Garantía: si no es lo que esperabas dentro
            de los primeros 14 días, te devolvemos tu dinero.
          </p>
        </div>
      </section>

      <Faq />
    </>
  );
}
