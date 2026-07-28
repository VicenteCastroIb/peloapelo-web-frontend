import Image from "next/image";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import PlanCard from "@/components/sections/PlanCard";
import { plans as staticPlans, withLivePricing } from "@/lib/data/plans";
import { fetchBackendPlans } from "@/lib/api/plans";

export default async function Planes() {
  // Server Component: intenta traer precio/nombre reales del backend: si
  // falla (backend caido, red, etc.) la landing sigue mostrando el valor
  // estatico en vez de romperse -- nunca dejar el fallback sin manejar.
  let plans = staticPlans;
  try {
    plans = withLivePricing(await fetchBackendPlans());
  } catch {
    // usa staticPlans tal cual, ya asignado arriba
  }

  return (
    <section id="planes" className="relative scroll-mt-24 overflow-hidden px-6 py-24 lg:px-12 lg:py-28">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/fondo-planes.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover"
        />
        {/* Bajado de /32 a /12 (27 jul 2026, a peticion explicita): opacaba
            demasiado los colores originales del fondo. */}
        <div aria-hidden className="absolute inset-0 bg-cream/12" />
      </div>

      <FadeInOnScroll className="mx-auto max-w-6xl">
        <SectionBadge label="Planes" />
        <h2 className="text-h2-lg text-navy">
          Elige <span className="italic text-accent">tu camino</span>.
        </h2>
        <p className="mt-4 max-w-lg text-p-body text-navy/70">
          Somos una fundación sin fines de lucro, y con tu suscripción ayudas a que otra persona pueda recibir apoyo sin costo.
        </p>

        {/* Tarjetas separadas con gap (antes: un unico panel dividido por
            bordes internos) para que cada degrade de marca (ver
            PlanCard.tsx) se lea como tarjeta propia, con espacio para el
            badge flotante "Mas popular" de la tarjeta destacada. */}
        <div className="mt-12 grid items-stretch gap-7 sm:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
}
