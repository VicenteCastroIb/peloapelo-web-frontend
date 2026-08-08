import Image from "next/image";
import { CalendarCheck } from "lucide-react";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import Button from "@/components/ui/Button";
import { CALENDLY_URL } from "@/lib/constants";

const PILARES = [
  {
    image: "/images/pillars/pilar-emocional.jpg",
    title: "Emocional",
    description: "Acompañamiento empático para procesar tus emociones.",
  },
  {
    image: "/images/pillars/pilar-fisico.jpg",
    title: "Físico",
    description: "Guía basada en evidencia sobre tratamientos y cuidado.",
  },
  {
    image: "/images/pillars/pilar-mental.jpg",
    title: "Mental",
    description: "Herramientas para fortalecer tu bienestar psicológico.",
  },
];

// Un acento de color propio por pilar (ago 2026, feedback "senior": los
// pilares eran el punto mas plano de toda la pagina -- circulos sueltos sin
// card, hover ni entrada escalonada, en contraste directo con el resto del
// sitio). Mismo patron que CARD_ACCENTS en ComoTeSostenemos.tsx, pero sin
// numeracion ni hilo conector: a diferencia de esos 3 pilares (secuencia
// Calma->Compañia->Consistencia), Emocional/Fisico/Mental son paralelos, no
// una progresion.
const PILAR_ACCENTS = [
  { tint: "rgba(143,124,182,0.10)", blob: "var(--color-gradient-from)" },
  { tint: "rgba(96,73,141,0.08)", blob: "var(--color-accent)" },
  { tint: "rgba(137,207,235,0.14)", blob: "var(--color-gradient-to)" },
];

export default function QueEsPeloAPelo() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-16 lg:px-12 lg:pb-28 lg:pt-20">
      {/* Fundido superior que retoma el mismo cream con el que ahora termina
          el degrade del Hero (ver Hero.tsx), para que el corte entre
          secciones sea fluido. Al ser el mismo color en ambos extremos no
          hace falta transicion visible: el fondo de la pagina (--color-cream
          en globals.css) ya continua sin corte por si solo. */}

      {/* Adorno acuarela (rama), puramente decorativo — detras del
          contenido, sin interceptar clics. */}
      <Image
        aria-hidden
        src="/images/adornos/adorno-rama.png"
        alt=""
        width={769}
        height={896}
        className="pointer-events-none absolute -right-16 -top-10 -z-10 hidden w-[280px] rotate-[8deg] opacity-70 md:block lg:w-[340px]"
      />

      <FadeInOnScroll className="mx-auto max-w-6xl">
        <SectionBadge label="Qué es Pelo a Pelo" />

        {/* Orden invertido en desktop (ago 2026, a pedido): foto a la
            derecha, texto a la izquierda -- solo con sm:order (el orden en
            el DOM/mobile no cambia, sigue foto->texto apilado). */}
        <div className="grid gap-10 sm:grid-cols-2 sm:items-center">
          <figure className="sm:order-2">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card-lg bg-navy/10">
              <Image
                src="/images/community/manos-comunidad.jpg"
                alt="Manos de distintas personas de la comunidad Pelo a Pelo unidas en un gesto de apoyo."
                fill
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </figure>

          <div className="sm:order-1">
            <h2 className="text-h2-lg text-navy">
              ¿Qué es <span className="italic text-accent">Pelo a Pelo</span>?
            </h2>

            <p className="mt-6 text-p-lead text-navy/80">
              Fundación sin fines de lucro cuyo fin es aportar a la comunidad de
              personas que atraviesan la pérdida de cabello. Desde la experiencia
              compartida y la evidencia, ofrecemos una mirada integral — mental,
              física y emocional — proponiendo una guía clara, respetuosa y
              adaptable a tu ritmo.
            </p>

            <div className="mt-8 rounded-card-md bg-[linear-gradient(135deg,rgba(143,124,182,0.12),rgba(137,207,235,0.12))] p-6 shadow-sm">
              <p className="text-p-lead text-navy/80">
                <span className="italic text-accent">&quot;El cambio más profundo</span>{" "}
                empieza cuando dejas de buscar afuera lo que solo puedes sanar{" "}
                <span className="italic text-accent">por dentro.&quot;</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-3 sm:gap-8">
          {PILARES.map(({ image, title, description }, index) => {
            const accent = PILAR_ACCENTS[index % PILAR_ACCENTS.length];
            return (
              <FadeInOnScroll key={title} delayMs={150 * index} className="h-full">
                <div
                  className="group relative flex h-full flex-col items-center overflow-hidden rounded-card-lg border border-navy/8 px-6 pb-8 pt-9 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{ background: `linear-gradient(160deg,#ffffff,${accent.tint})` }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-25 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
                    style={{ background: accent.blob }}
                  />
                  <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full bg-cream transition-transform duration-300 group-hover:scale-105">
                    <Image
                      src={image}
                      alt={`Ilustración en acuarela que representa el acompañamiento ${title.toLowerCase()}`}
                      fill
                      sizes="112px"
                      className="object-cover"
                    />
                  </div>
                  <h3 className="relative text-h3-md text-navy">{title}</h3>
                  <p className="relative mt-1 text-p-small text-navy/70">{description}</p>
                </div>
              </FadeInOnScroll>
            );
          })}
        </div>

        {/* "Por que existimos": mismo patron que el bloque de arriba
            (foto + texto a dos columnas). Las 5 estadisticas que antes
            rellenaban el espacio libre bajo este texto ahora viven en su
            propia seccion independiente, ver components/sections/
            Estadisticas.tsx — se separaron a pedido del rediseno para que
            las cifras tengan foco propio en vez de competir con este texto.
            Orden invertido en desktop (ago 2026, a pedido): foto a la
            izquierda, texto a la derecha -- mismo sm:order que el bloque de
            arriba, mobile sigue apilando texto->foto sin cambios. */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 sm:items-center">
          <div className="sm:order-2">
            <h3 className="text-h2-md text-navy">
              Por qué <span className="italic text-accent">existimos</span>
            </h3>

            <p className="mt-6 text-p-lead text-navy/80">
              Ante un síntoma tan difícil, las alarmas se encienden y buscamos
              soluciones desesperadas, sin estrategia ni estructura.
            </p>
            <p className="mt-4 text-p-lead text-navy/80">
              Entre los <strong className="text-navy">fantasmas del pasado</strong>{" "}
              y las fantasías del futuro, es casi imposible avanzar. Por eso te
              invitamos a construir juntos un espacio seguro de exploración y
              foco, con pasos concretos, a tu ritmo.
            </p>

            {/* Tarjeta de cita (ago 2026, feedback "senior"): este bloque
                pesaba menos que su gemelo "Que es Pelo a Pelo" de arriba, que
                si tiene una tarjeta destacada -- se agrega la misma para que
                ambos bloques espejados queden balanceados. */}
            <div className="mt-8 rounded-card-md bg-[linear-gradient(135deg,rgba(143,124,182,0.12),rgba(137,207,235,0.12))] p-6 shadow-sm">
              <p className="text-p-lead text-navy/80">
                <span className="italic text-accent">&quot;Un paso a la vez</span>{" "}
                es, muchas veces, la única velocidad que necesitas.&quot;
              </p>
            </div>
          </div>

          <figure className="sm:order-1">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card-lg bg-navy/10">
              <Image
                src="/images/community/pq-existimos.jpg"
                alt="Una persona escribe con calma en un cuaderno, junto a una taza de té, en un momento de estructura y pausa."
                fill
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </figure>
        </div>

        {/* CTA de cierre (ago 2026, feedback "senior"): la pagina no tenia
            remate propio, caia directo del ultimo bloque de texto al cierre
            generico compartido con el resto del sitio (Footer). Un lead que
            llega hasta aca ya conoce la historia completa -- apunta directo
            a Calendly (target=_blank, flujo externo) en vez de mandarlo de
            vuelta a /#fundadora: menos friccion para agendar justo despues
            de leer toda la historia. CALENDLY_URL centralizado en
            lib/constants.ts junto al mismo CTA de Fundadora.tsx.

            Segunda pasada de diseno (ago 2026, "mejora el diseño de la
            card final"): la version anterior era una card generica de
            texto+boton, sin nada que la distinguiera como EL cierre de la
            pagina. Se suma: borde acento mas grueso (2px, unica excepcion a
            los border-navy/10 de 1px del resto del sitio -- reservado a
            proposito para el CTA mas importante de /fundacion), dos
            resplandores de esquina (mismo lenguaje que las cards de
            pilares/ComoTeSostenemos), y sobre todo el retrato de Jessica en
            un medallon circular arriba del texto: le pone cara humana a
            "conversarlo directamente con Jessica" en vez de ser solo una
            promesa de texto. */}
        <FadeInOnScroll delayMs={150} className="mt-16">
          <div className="relative mx-auto max-w-2xl overflow-hidden rounded-card-lg border-2 border-accent/25 bg-[linear-gradient(160deg,#ffffff,rgba(96,73,141,0.10))] p-8 text-center shadow-md sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20 blur-3xl"
              style={{ background: "var(--color-gradient-to)" }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full opacity-15 blur-3xl"
              style={{ background: "var(--color-accent)" }}
            />

            <div className="relative mx-auto h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-md">
              <Image
                src="/images/founder/jessica-lagno.png"
                alt="Jessica Lagno, fundadora de Pelo a Pelo"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>

            <p className="relative mt-4 flex items-center justify-center gap-2 text-h4-label text-accent">
              <CalendarCheck size={16} /> Conoce a Jessica
            </p>
            <h3 className="relative mt-2 text-h2-md text-navy">¿Lista para dar el primer paso?</h3>
            <p className="relative mx-auto mt-3 max-w-md text-p-body text-navy/75">
              Esta es la historia detrás de Pelo a Pelo. Si quieres, puedes
              conversarlo directamente con Jessica.
            </p>
            <Button
              href={CALENDLY_URL}
              target="_blank"
              variant="gradient"
              className="relative mt-6 px-10 py-3.5"
            >
              Agendar sesión con Jessica →
            </Button>
          </div>
        </FadeInOnScroll>
      </FadeInOnScroll>
    </section>
  );
}
