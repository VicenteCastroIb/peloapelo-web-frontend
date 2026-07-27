import Image from "next/image";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

/**
 * "Como te acompañamos" — tal cual el mockup: bloque de prosa angosto, no el
 * grid de 3 columnas que tenia esta seccion antes (ver
 * lib/data/propuesta.ts, que queda sin usar por si se decide recuperar ese
 * tratamiento).
 */
export default function Propuesta() {
  return (
    <section className="relative overflow-hidden px-6 py-24 lg:px-12 lg:py-36">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/backgrounds/estadisticas-fondo-patron.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div aria-hidden className="absolute inset-0 bg-cream/32" />
      </div>

      <FadeInOnScroll className="mx-auto max-w-3xl">
        <div className="mb-5 flex items-center gap-3 text-h4-label text-navy/50">
          <span className="h-px w-8 bg-navy/20" />
          Cómo te acompañamos
        </div>
        <h2 className="max-w-lg text-h2-lg text-navy">
          Así te <span className="italic text-accent">acompañamos</span>.
        </h2>
        <p className="mt-6 text-p-lead text-navy/80">
          Detrás de la plataforma hay <strong className="text-navy">personas reales
            acompañándote</strong>, en todo momento. Un{" "}
          <strong className="text-navy">seguimiento de tu progreso</strong> que respeta
          tu ritmo, <strong className="text-navy">cursos especializados</strong> hechos
          con psicólogos expertos, y una{" "}
          <strong className="text-navy">guía clara de tratamientos</strong> para que
          entiendas tus opciones.
        </p>
        <p className="mt-4 text-p-lead text-navy/80">
          Con el tiempo, la plataforma aprende de ti, te llegan{" "}
          <span className="italic text-accent">recomendaciones y recordatorios pensados para tu caso</span>{" "},
          estamos para acompañarte en cada paso.
        </p>
      </FadeInOnScroll>
    </section>
  );
}
