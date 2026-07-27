import Image from "next/image";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import Button from "@/components/ui/Button";

export default function Fundadora() {
  return (
    <section id="fundadora" className="relative overflow-hidden px-6 py-24 lg:px-12 lg:py-28">
      <FadeInOnScroll className="mx-auto max-w-6xl">
        <SectionBadge label="Quién está detrás" />
        <h2 className="text-3xl font-bold leading-[1.08] text-navy sm:text-5xl">
          Conoce a <span className="italic text-accent">Jessica Lagno</span>.
        </h2>

        <div className="mt-12 grid gap-10 sm:grid-cols-2 sm:items-start sm:gap-20 lg:gap-24">
          <figure className="relative">
            {/* Halo decorativo agregado por el rediseno (ver docs de
                handoff): reemplaza el adorno-flores.png anterior, que
                quedaba compitiendo visualmente con este halo pensado
                especificamente para enmarcar este retrato. Un poco mas
                grande que la foto y centrado detras de ella (z-index
                menor), con un overlay cream translucido para que no le
                quite protagonismo al retrato real. */}
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -z-10 h-[108%] w-[112%] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-card-lg"
            >
              <Image
                src="/images/founder/fondo-creadora.jpg"
                alt=""
                fill
                sizes="(min-width: 640px) 45vw, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-cream/20" />
            </div>

            {/* Achicada un poco (mx-auto + max-w) para que el halo de fondo
                respire mas alrededor; mask-image degrada los bordes de la
                foto misma a transparente (no solo el marco) para que ese
                halo se note tambien a traves del borde, no solo afuera.
                aspect-[5/6] (antes 3/4): achica la foto y su halo de fondo
                verticalmente -- el halo esta dimensionado en % relativo a
                este bloque, asi que baja de tamano en conjunto con la foto. */}
            <div
              className="relative mx-auto aspect-[5/6] w-[88%] overflow-hidden rounded-card-lg bg-navy/10"
              style={{
                maskImage: "radial-gradient(ellipse at center, black 72%, transparent 100%)",
                WebkitMaskImage:
                  "radial-gradient(ellipse at center, black 72%, transparent 100%)",
              }}
            >
              <Image
                src="/images/founder/jessica-lagno.png"
                alt="Jessica Lagno, fundadora de Pelo a Pelo"
                fill
                sizes="(min-width: 640px) 35vw, 80vw"
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="mt-4 flex justify-between text-p-small font-semibold uppercase tracking-wide text-navy/80">
              <span>Jessica · 11 años</span>
              <span className="italic normal-case text-accent">Alopecia areata universal</span>
            </figcaption>
          </figure>

          <div>
            <p className="text-h4-label text-navy/50">
              Psicóloga · Coach ontológica · Fundadora
            </p>

            <p className="mt-6 text-p-lead text-navy/80 sm:text-xl">
              <span className="float-left mr-2 text-h2-md font-semibold leading-none text-accent">
                H
              </span>
              e vivido con alopecia areata toda mi vida. La primera vez fue de los 5 a
              los 12 años — dos veces llegó a ser universal, sin un solo pelo en mi
              cuerpo. Luego volvió en mis 30.
            </p>

            <p className="mt-4 text-p-lead text-navy/80 sm:text-xl">
              Sé lo que es mirarte al espejo y no reconocerte. Y también sé que se
              puede salir adelante — no porque el pelo vuelva, sino porque{" "}
              <strong className="text-navy">tú vuelves a ti</strong>.
            </p>

            <p className="mt-4 text-p-lead text-navy/80 sm:text-xl">
              Creé Pelo a Pelo trayendo lo que más sé: mi vida personal y mi formación
              profesional. Nadie debería atravesar esto sin herramientas.
            </p>

            <p className="mt-6 border-t border-navy/10 pt-6 text-p-lead italic text-accent sm:text-xl">
              Todo lo que enseño, lo he vivido primero.
            </p>

            <Button href="/therapist" variant="gradient" className="mt-6">
              Agenda una conversación conmigo →
            </Button>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
