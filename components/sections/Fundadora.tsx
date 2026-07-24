import Image from "next/image";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

export default function Fundadora() {
  return (
    <section className="px-6 py-24 lg:px-12 lg:py-28">
      <FadeInOnScroll className="mx-auto max-w-6xl">
        <SectionBadge label="Quien está detrás · II" />
        <h2 className="text-h2-lg text-navy">
          Conoce a <span className="italic text-accent">Jessica Lagno</span>.
        </h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:items-start">
          <figure>
            <div className="relative aspect-[3/4] w-full overflow-hidden rounded-card-lg bg-navy/10">
              <Image
                src="/images/jessica-lagno.png"
                alt="Jessica Lagno, fundadora de Pelo a Pelo"
                fill
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="mt-3 flex justify-between text-p-caption uppercase tracking-wide text-navy/50">
              <span>Jessica · 11 años</span>
              <span className="italic normal-case">Alopecia areata universal</span>
            </figcaption>
          </figure>

          <div>
            <p className="text-h4-label text-navy/50">
              Psicóloga · Coach ontológica · Fundadora
            </p>

            <p className="mt-6 text-p-body text-navy/80">
              <span className="float-left mr-2 text-h2-md font-semibold leading-none text-accent">
                H
              </span>
              e vivido con alopecia areata toda mi vida. La primera vez fue de los 5 a
              los 12 años — dos veces llegó a ser universal, sin un solo pelo en mi
              cuerpo. Luego volvió en mis 30.
            </p>

            <p className="mt-4 text-p-body text-navy/80">
              Sé lo que es mirarte al espejo y no reconocerte. Sé lo que es sentir
              vergüenza, esconder tu cabeza, no querer que nadie te pregunte. Y también
              sé que se puede salir adelante — no porque el pelo vuelva, sino porque{" "}
              <strong className="text-navy">tú vuelves a ti</strong>.
            </p>

            <p className="mt-4 text-p-body text-navy/80">
              Creé Pelo a Pelo trayendo lo que más sé: mi vida personal y mi formación
              profesional. Esta fundación nace de la convicción de que nadie debería
              atravesar la pérdida de pelo en silencio ni sin herramientas.
            </p>

            <p className="mt-6 border-t border-navy/10 pt-6 text-p-body italic text-accent">
              ✨ Todo lo que enseño, lo he vivido primero.
            </p>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
