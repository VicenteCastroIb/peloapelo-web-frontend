import type { Metadata } from "next";
import SectionBadge from "@/components/shared/SectionBadge";
import PlanCard from "@/components/sections/PlanCard";
import PlanesComparisonTable from "@/components/sections/PlanesComparisonTable";
import Faq from "@/components/sections/Faq";
import { plans as staticPlans, withLivePricing, comparisonTable } from "@/lib/data/plans";
import { fetchBackendPlans } from "@/lib/api/plans";

export const metadata: Metadata = {
  title: "Planes y precios · Pelo a Pelo",
  description:
    "Cada suscripción sostiene nuestra comunidad y permite que otra persona reciba apoyo. Sin tarjeta para empezar.",
};

// Reubicada desde /pricing a /planes (ver tarea de reestructuracion, ago
// 2026) -- mismo contenido, sin tocar copy. /pricing queda como redirect
// permanente (ver next.config.ts) para no romper links existentes.
export default async function PlanesPage() {
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
        <p className="text-h4-label text-navy/75">
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

          <PlanesComparisonTable rows={comparisonTable} />

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
