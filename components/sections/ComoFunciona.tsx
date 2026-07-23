import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import { comoFuncionaSteps } from "@/lib/data/comoFunciona";

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-white/40 px-6 py-24 lg:px-12 lg:py-36">
      <FadeInOnScroll className="mx-auto max-w-5xl">
        <SectionBadge label="Cómo funciona · II" />

        <h2 className="max-w-xl text-4xl font-normal leading-tight sm:text-5xl">
          Cuatro pasos, <span className="italic text-accent">a tu ritmo</span>.
        </h2>
        <p className="mt-4 max-w-md text-navy/70">
          Un camino diseñado por quien lo ha caminado. Empieza gratis, avanza cuando
          te sientas listo.
        </p>

        <div className="mt-14 grid divide-y divide-navy/10 border-t border-navy/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {comoFuncionaSteps.map((step) => (
            <div key={step.number} className="p-8">
              <p className="text-3xl font-light text-navy/25">{step.number}</p>
              <h3 className="mt-2 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-navy/70">{step.description}</p>
            </div>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
}
