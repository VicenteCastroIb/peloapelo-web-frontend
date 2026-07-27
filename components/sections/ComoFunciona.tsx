import Image from "next/image";
import Link from "next/link";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import { comoFuncionaSteps } from "@/lib/data/comoFunciona";

export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="bg-white/40 px-6 py-24 lg:px-12 lg:py-36">
      <FadeInOnScroll className="mx-auto max-w-6xl">
        <SectionBadge label="Cómo funciona" />

        <h2 className="max-w-xl text-h2-lg text-navy">
          Cuatro pasos, <span className="italic text-accent">a tu ritmo</span>.
        </h2>
        <p className="mt-4 max-w-md text-p-body text-navy/70">
          Un camino diseñado por quien lo ha caminado. Empieza gratis, avanza cuando
          te sientas listo.
        </p>

        <div className="mt-14 grid divide-y divide-navy/10 border-t border-navy/10 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {comoFuncionaSteps.map((step) => (
            <div key={step.number} className="flex flex-col gap-3 p-8">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-icon border-2 border-[var(--color-gradient-from)] bg-cream">
                  <Image src={step.icon} alt="" aria-hidden fill sizes="64px" className="object-cover" />
                </div>
                <div>
                  <p className="text-h3-lg font-light text-navy/25">{step.number}</p>
                  <h3 className="mt-0.5 text-h3-md text-navy">{step.title}</h3>
                </div>
              </div>
              <p className="text-p-body text-navy/70">{step.description}</p>
              <Link
                href={step.actionHref}
                className="mt-auto pt-2 text-a-inline font-bold text-coral hover:underline"
              >
                {step.actionLabel}
              </Link>
            </div>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
}
