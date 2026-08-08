import Image from "next/image";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import Button from "@/components/ui/Button";
import { CALENDLY_URL } from "@/lib/constants";

// CALENDLY_URL centralizado en lib/constants.ts (ago 2026): se reutiliza
// tambien en el CTA de cierre de QueEsPeloAPelo.tsx (/fundacion), ver ese
// archivo para el porque. Se opto por Calendly (agendamiento externo, sin
// login) en vez de exponer publicamente el formulario mock de /therapist
// (que vive detras de login, pensado para el dashboard interno, no para
// visitantes del home).

// Ahora funciona como "FounderSummary" dentro del home (ver tarea de
// reestructuracion, ago 2026): mismo texto original de Jessica intacto, sin
// resumir, solo se agrega el link a /fundacion (pagina nueva de
// transparencia institucional) al cierre.
//
// Rediseno (ago 2026, reorden "funnel"): la seccion se mueve justo despues
// de "Como funciona" (antes iba casi al final) y el CTA de agendar pasa de
// ser un boton mas entre dos a ser el elemento mas grande y llamativo de
// toda la seccion -- tarjeta propia con tinte de marca, icono y texto de
// apoyo, para que sea imposible no verlo. El link a /fundacion se mantiene
// pero baja de jerarquia (texto plano, ya no comparte fila con el boton).
export default function Fundadora() {
  return (
    <section id="fundadora" className="relative scroll-mt-24 overflow-hidden px-6 py-24 lg:px-12 lg:py-28">
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
                menor). Sin overlay (27 jul 2026, a peticion explicita: deja
                el color original del halo); el mask-image de la foto de
                arriba ya se encarga de que no compita con el retrato real. */}
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
            </div>

            {/* Achicada un poco (mx-auto + max-w) para que el halo de fondo
                respire mas alrededor; mask-image degrada los bordes de la
                foto misma a transparente (no solo el marco) para que ese
                halo se note tambien a traves del borde, no solo afuera.
                aspect-[5/6] (antes 3/4): achica la foto y su halo de fondo
                verticalmente -- el halo esta dimensionado en % relativo a
                este bloque, asi que baja de tamano en conjunto con la foto.
                w-[94%] (antes 88%, ago 2026 "simetria con la card de
                agendar"): agranda un poco la foto para que su borde
                inferior llegue mas cerca del borde inferior de la tarjeta
                de agendar de la columna de al lado. */}
            <div
              className="relative mx-auto aspect-[5/6] w-[94%] overflow-hidden rounded-card-lg bg-navy/10"
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
            {/* Espaciado ajustado (ago 2026, "simetria con la foto"): antes
                cada parrafo llevaba mt-6/mt-4 y la tarjeta de agenda mt-8,
                lo que dejaba esta columna bastante mas alta que la foto de
                al lado -- se ajusta el ritmo vertical mas apretado en todo
                el bloque para que el borde inferior de la tarjeta de agenda
                quede a la altura del borde inferior de la foto. */}
            <p className="text-h4-label text-navy/50">
              Psicóloga · Coach ontológica · Fundadora
            </p>

            <p className="mt-4 text-p-lead text-navy/80 sm:text-xl">
              <span className="float-left mr-2 text-h2-md font-semibold leading-none text-accent">
                H
              </span>
              e vivido con alopecia areata toda mi vida. La primera vez fue de los 5 a
              los 12 años — dos veces llegó a ser universal, sin un solo pelo en mi
              cuerpo. Luego volvió en mis 30.
            </p>

            <p className="mt-3 text-p-lead text-navy/80 sm:text-xl">
              Sé lo que es mirarte al espejo y no reconocerte. Sé lo que es sentir vergüenza, esconder tu cabeza, no querer que nadie te pregunte. Y también sé que se
              puede salir adelante — no porque el pelo vuelva, sino porque{" "}
              <strong className="text-navy">tú vuelves a ti</strong>.
            </p>

            <p className="mt-3 text-p-lead text-navy/80 sm:text-xl">
              Creé Pelo a Pelo trayendo lo que más sé: mi vida personal y mi formación profesional. Esta fundación nace de la convicción de que nadie debería atravesar la pérdida de pelo en silencio ni sin herramientas.
            </p>

            <p className="mt-4 border-t border-navy/10 pt-4 text-p-lead italic text-accent sm:text-xl">
              Todo lo que enseño, lo he vivido primero.
            </p>

            {/* Tarjeta de agenda: el elemento mas grande/llamativo de la
                seccion a proposito (ver nota arriba). target=_blank porque
                Calendly abre como flujo externo, no una pagina del sitio. */}
            <div className="mt-4 rounded-card-lg border border-accent/20 bg-[linear-gradient(160deg,#ffffff,rgba(96,73,141,0.08))] p-4 sm:p-5">
              <p className="flex items-center gap-2 text-h4-label text-accent">
                <CalendarCheck size={16} /> Agenda tu hora
              </p>
              <p className="mt-1.5 text-p-body text-navy/75">
                Una primera conversación conmigo, a tu ritmo. Elige el día y la hora
                que te acomoden.
              </p>
              <Button
                href={CALENDLY_URL}
                target="_blank"
                variant="gradient"
                className="mt-3 w-full py-3.5 text-base sm:w-auto sm:px-10"
              >
                Agendar sesión con Jessica →
              </Button>
            </div>

            <Link
              href="/fundacion"
              className="mt-2.5 inline-block text-a-inline font-bold text-accent hover:underline"
            >
              Conoce nuestra historia →
            </Link>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
