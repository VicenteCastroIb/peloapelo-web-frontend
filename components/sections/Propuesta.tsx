import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import { propuestaItems } from "@/lib/data/propuesta";

export default function Propuesta() {
  return (
    <section id="propuesta" className="px-6 py-24 lg:px-12 lg:py-36">
      <FadeInOnScroll className="mx-auto max-w-6xl">
        <SectionBadge label="La propuesta · IV" />
        <h2 className="max-w-xl text-h2-lg text-navy">
          Así te <span className="italic text-accent">acompañamos</span>.
        </h2>
        <p className="mt-4 text-p-body text-navy/70">
          Herramientas pensadas con empatía y respaldadas por evidencia, para que
          elijas lo que necesitas, a tu ritmo.
        </p>

        <div className="mt-14 grid divide-y divide-navy/10 border-t border-navy/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {propuestaItems.map((item) => (
            <div key={item.number} className="p-8">
              <p className="text-h3-lg font-light text-navy/25">{item.number}</p>
              <h3 className="mt-2 text-h3-sm text-navy">{item.title}</h3>
              <p className="mt-2 text-p-small text-navy/70">{item.description}</p>
            </div>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
}
