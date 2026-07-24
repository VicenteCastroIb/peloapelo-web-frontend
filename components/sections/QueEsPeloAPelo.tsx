import Image from "next/image";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

export default function QueEsPeloAPelo() {
  return (
    <section className="relative px-6 pb-24 pt-16 lg:px-12 lg:pb-28 lg:pt-20">
      {/* Fundido superior que retoma el tono con el que termina la foto del
          Hero (#fcf8ec, muestreado directo del archivo), para que el corte
          entre secciones pase desapercibido. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-[#fcf8ec] to-cream"
      />

      <FadeInOnScroll className="mx-auto max-w-5xl">
        <SectionBadge label="Qué es Pelo a Pelo" />

        <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
          <figure>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card-lg bg-navy/10">
              <Image
                src="/images/manos-comunidad.jpg"
                alt="Manos de distintas personas de la comunidad Pelo a Pelo unidas en un gesto de apoyo."
                fill
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </figure>

          <div>
            <h2 className="text-h2-lg text-navy">
              ¿Qué es <span className="italic text-accent">Pelo a Pelo</span>?
            </h2>

            <p className="mt-6 text-p-body text-navy/80">
              Fundación sin fines de lucro cuyo fin es aportar a la comunidad de
              personas que atraviesan la pérdida de cabello. Desde la experiencia
              compartida y la evidencia, ofrecemos una mirada integral — mental,
              física y emocional — proponiendo una guía clara, respetuosa y
              adaptable a tu ritmo.
            </p>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
