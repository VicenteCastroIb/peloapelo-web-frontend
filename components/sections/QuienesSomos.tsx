import Link from "next/link";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

/**
 * Bloque solo-texto, separado de QueEsPeloAPelo.tsx a pedido del rediseño
 * (ver docs de handoff): antes vivia mezclado con la foto/pilares de esa
 * seccion, ahora es su propia introduccion angosta y centrada, justo
 * despues del Hero.
 */
export default function QuienesSomos() {
  return (
    <section id="quienes-somos" className="px-6 py-16 lg:px-12 lg:py-20">
      <FadeInOnScroll className="mx-auto max-w-3xl text-center">
        <div className="flex justify-center">
          <SectionBadge label="Quiénes somos" />
        </div>

        <h2 className="text-h2-lg text-navy">
          Una fundación nacida de <span className="italic text-accent">una historia real</span>.
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-p-lead text-navy/80">
          Pelo a Pelo es una fundación chilena sin fines de lucro. Existe para que
          nadie atraviese la pérdida de cabello en silencio: acompañamos desde lo
          emocional, lo físico y lo mental, con una mirada honesta y sostenida en el
          tiempo, nunca en soluciones rápidas.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-p-lead text-navy/80">
          Nace de Jessica Lagno, psicóloga que vive con alopecia areata universal
          hace once años. Todo lo que ofrecemos parte de algo que ella misma
          necesitó primero.
        </p>

        <Link
          href="#fundadora"
          className="mt-5 inline-block text-a-inline font-bold text-accent hover:underline"
        >
          Conoce su historia →
        </Link>
      </FadeInOnScroll>
    </section>
  );
}
