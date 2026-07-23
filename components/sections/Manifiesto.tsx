import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

export default function Manifiesto() {
  return (
    <section className="px-6 py-24 lg:px-12 lg:py-36">
      <FadeInOnScroll className="mx-auto max-w-3xl text-center">
        <SectionBadge label="Manifiesto · I" />

        <h2 className="mx-auto text-h2-lg text-navy">
          Nada te hará cambiar más que <span className="italic text-accent">tú mism@</span>.
        </h2>

        <div className="mx-auto mt-8 max-w-xl space-y-4 text-p-body text-navy/70">
          <p>No pongas afuera lo que debes trabajar por dentro.</p>
          <p>
            La invitación es darte <strong className="text-navy">foco y estructura</strong> a
            tu sanación. Cuando estás pasando por un síntoma, normalmente el foco se
            pierde y comenzamos a buscar soluciones sin una estrategia detrás.
          </p>
          <p>
            Navegamos en el <strong className="text-navy">miedo</strong>, y desde ahí es
            difícil llegar a una solución.
          </p>
        </div>

        {/*
          TODO: reemplazar por el diagrama ilustrado real
          (/assets/timeline-presente-CoJC-3XL.png en el sitio original,
          ver docs/scan-22-07-2026). Placeholder funcional mientras tanto.
        */}
        <div className="mx-auto mt-12 max-w-2xl rounded-card-lg bg-white p-10">
          <p className="mb-8 text-p-lead italic">Línea predecible de tu realidad conocida</p>
          <div className="flex items-center justify-between text-h3-sm">
            <div className="text-left">
              <p>AYER</p>
              <p className="font-normal italic text-navy/50">Pasado</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-cream">
              Ahora
            </div>
            <div className="text-right">
              <p>MAÑANA</p>
              <p className="font-normal italic text-navy/50">Futuro</p>
            </div>
          </div>
        </div>

        <p className="mt-8 text-p-body italic text-navy/50">
          El verdadero cambio ocurre en el momento presente.
        </p>
      </FadeInOnScroll>
    </section>
  );
}
