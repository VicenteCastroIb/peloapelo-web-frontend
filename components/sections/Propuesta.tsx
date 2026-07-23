import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import { propuestaItems } from "@/lib/data/propuesta";

export default function Propuesta() {
  return (
    <section id="propuesta" className="px-6 py-24 lg:px-12 lg:py-36">
      <FadeInOnScroll className="mx-auto max-w-5xl">
        <SectionBadge label="La propuesta · III" />
        <h2 className="max-w-xl text-4xl font-normal leading-tight sm:text-5xl">
          Todo lo que necesitas, <span className="italic text-accent">en un solo lugar</span>.
        </h2>
        <p className="mt-4 text-navy/70">
          Herramientas diseñadas con empatía y respaldadas por ciencia.
        </p>

        <div className="mt-14 grid divide-y divide-navy/10 border-t border-navy/10 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {propuestaItems.map((item) => (
            <div key={item.number} className="p-8">
              <p className="text-2xl font-light text-navy/25">{item.number}</p>
              <h3 className="mt-2 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-navy/70">{item.description}</p>
            </div>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
}
