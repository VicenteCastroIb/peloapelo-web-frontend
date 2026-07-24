import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import { comoFuncionaSteps } from "@/lib/data/comoFunciona";

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-white/40 px-6 py-24 lg:px-12 lg:py-36">
      <FadeInOnScroll className="mx-auto max-w-6xl">
        <SectionBadge label="Cómo funciona · III" />

        <h2 className="max-w-xl text-h2-lg text-navy">
          Cuatro pasos, <span className="italic text-accent">a tu ritmo</span>.
        </h2>
        <p className="mt-4 max-w-md text-p-body text-navy/70">
          Un camino diseñado por quien lo ha caminado. Empieza gratis, avanza cuando
          te sientas listo.
        </p>

        <div className="mt-14 grid divide-y divide-navy/10 border-t border-navy/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {comoFuncionaSteps.map((step) => (
            <div key={step.number} className="p-8">
              <p className="text-h3-lg font-light text-navy/25">{step.number}</p>
              <h3 className="mt-2 text-h3-md text-navy">{step.title}</h3>
              <p className="mt-2 text-p-body text-navy/70">{step.description}</p>
            </div>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
}
