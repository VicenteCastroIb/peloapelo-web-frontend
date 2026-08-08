import Image from "next/image";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

// "size" por defecto 116px; Calma y Consistencia se agrandaron un poco a
// pedido (26 jul 2026) -- sus archivos fuente (539x488 y 821x804) tienen
// resolucion de sobra para 136px sin perder nitidez. Compañía se deja igual
// (su archivo es 925x943, pero no se pidio agrandarla).
const AFIRMACIONES = [
  {
    image: "/images/icons/afirmacion-calma-icono.jpg",
    title: "Calma",
    description: "Un espacio donde puedes bajar la guardia, sin explicaciones de más.",
    size: 136,
  },
  {
    image: "/images/icons/afirmacion-compania-icono.jpg",
    title: "Compañía",
    description: "Nunca vuelves a atravesar esto en soledad silenciosa.",
    size: 116,
  },
  {
    image: "/images/icons/afirmacion-consistencia-icono.jpg",
    title: "Consistencia",
    description: "Pequeños pasos sostenidos en el tiempo, ayudamos a generar un cambio real.",
    size: 136,
  },
];

// Un acento de color propio por card (ago 2026, "agregale adornos a las
// cards"): tinte de fondo muy sutil + un resplandor difuminado en la
// esquina + dos motas de color cerca del icono, que continuan el motivo de
// puntitos/confeti que ya tienen las 3 ilustraciones en acuarela -- en vez
// de decoracion generica, extiende el arte de cada icono hacia la card.
const CARD_ACCENTS = [
  {
    tint: "rgba(143,124,182,0.10)",
    blob: "var(--color-gradient-from)",
    dotA: "var(--color-gradient-from)",
    dotB: "var(--color-accent)",
  },
  {
    tint: "rgba(96,73,141,0.08)",
    blob: "var(--color-accent)",
    dotA: "var(--color-accent)",
    dotB: "var(--color-gradient-to)",
  },
  {
    tint: "rgba(137,207,235,0.14)",
    blob: "var(--color-gradient-to)",
    dotA: "var(--color-gradient-to)",
    dotB: "var(--color-gradient-from)",
  },
];

/**
 * "Cómo te sostenemos" — seccion nueva del rediseno, sin equivalente previo
 * en el codebase (ver docs de handoff).
 *
 * Rediseno (ago 2026, feedback de diseno "senior"): era la unica seccion
 * del sitio sin el lenguaje de card ya establecido en el resto (WhatIsAlopecia,
 * Estadisticas, planes) -- los 3 pilares flotaban sueltos sobre un fondo con
 * mucho linework propio, sin hover ni entrada escalonada. Se suma:
 * 1. Card propia por pilar (tinte de marca + blur, sombra, hover con lift)
 *    para que se despeguen del fondo y se sientan del mismo sistema visual
 *    que el resto del sitio.
 * 2. Numeracion sutil (01/02/03) + hilo punteado detras de la fila: refuerza
 *    que son una secuencia/progresion (Calma -> Compañia -> Consistencia) y
 *    no tres datos sueltos -- ademas dialoga con el camino punteado que ya
 *    tiene el icono de "Consistencia".
 * 3. Entrada escalonada (mismo patron que Estadisticas) en vez de aparecer
 *    todo de un solo golpe.
 * 4. La cita de cierre pasa de un tinte translucido (se perdia contra el
 *    linework del fondo) a su propia card con sombra y una comilla
 *    decorativa grande, para que cierre la seccion con el peso que merece.
 * 5. Adornos por card (CARD_ACCENTS): resplandor de esquina + motas de
 *    color que continuan el motivo de puntitos de cada ilustracion.
 *
 * Segunda pasada (ago 2026, "que el fondo no se note tanto"): el fondo
 * pastel con linework, que antes se dejaba sin overlay a proposito (27 jul
 * 2026), ahora competia demasiado con las cards nuevas -- se le suma un
 * tinte cream encima para bajarle protagonismo sin perderlo del todo.
 */
export default function ComoTeSostenemos() {
  return (
    <section className="relative overflow-hidden px-6 py-16 lg:px-12 lg:py-20">
      <div className="absolute inset-0 -z-20">
        <Image
          src="/images/backgrounds/fondo-quienes-somos.jpg"
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          className="object-cover object-[center_bottom]"
        />
      </div>
      <div aria-hidden className="absolute inset-0 -z-10 bg-cream/70" />

      <FadeInOnScroll className="mx-auto max-w-5xl">
        <div className="text-center">
          <div className="flex justify-center">
            <SectionBadge label="Cómo te sostenemos" />
          </div>
          <h2 className="mx-auto max-w-xl text-h2-lg text-navy">
            Calma, <span className="italic text-accent">compañía</span> y consistencia.
          </h2>
        </div>

        <div className="relative mt-14">
          {/* Hilo punteado detras de la fila: solo se asoma en los espacios
              entre cards (las cards, opacas, lo tapan en el resto), como si
              el camino continuara de pilar a pilar. Decorativo, oculto en
              mobile donde las cards se apilan verticalmente. */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-28 hidden border-t-2 border-dashed border-accent/25 sm:block"
          />

          <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
            {AFIRMACIONES.map(({ image, title, description, size }, index) => {
              const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
              return (
                <FadeInOnScroll key={title} delayMs={150 * index} className="h-full">
                  <div
                    className="group relative flex h-full flex-col items-center overflow-hidden rounded-card-lg border border-navy/8 px-6 pb-8 pt-9 text-center shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    style={{ background: `linear-gradient(160deg,#ffffff,${accent.tint})` }}
                  >
                    {/* Resplandor de esquina + motas de color: adornos que
                        continuan el motivo de puntitos de la ilustracion
                        hacia la card, uno por pilar (ver CARD_ACCENTS). */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-25 blur-2xl transition-opacity duration-300 group-hover:opacity-40"
                      style={{ background: accent.blob }}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-7 top-16 h-2 w-2 rounded-full opacity-60"
                      style={{ background: accent.dotA }}
                    />
                    <span
                      aria-hidden
                      className="pointer-events-none absolute bottom-9 right-8 h-1.5 w-1.5 rounded-full opacity-50"
                      style={{ background: accent.dotB }}
                    />

                    <span className="absolute right-5 top-5 text-p-caption font-bold tracking-wide text-accent/40">
                      0{index + 1}
                    </span>

                    {/* Iconos reemplazados (26 jul 2026) por versiones ya
                        recortadas a mano -- el zoom por CSS que compensaba
                        el margen blanco de los archivos anteriores ya no
                        hace falta y sobre-recortaria el dibujo, asi que se
                        saca. */}
                    <div
                      className="relative mx-auto mb-4 overflow-hidden rounded-card-md border-2 border-[var(--color-gradient-from)] bg-cream transition-transform duration-300 group-hover:scale-105"
                      style={{ height: size, width: size }}
                    >
                      <Image
                        src={image}
                        alt=""
                        aria-hidden
                        fill
                        sizes={`${size}px`}
                        className="object-cover"
                      />
                    </div>
                    <h3 className="relative text-h3-md text-navy">{title}</h3>
                    <p className="relative mx-auto mt-2 max-w-[280px] text-p-body text-navy/85">
                      {description}
                    </p>
                  </div>
                </FadeInOnScroll>
              );
            })}
          </div>
        </div>

        <FadeInOnScroll delayMs={450} className="mx-auto mt-14 max-w-2xl">
          <div className="relative overflow-hidden rounded-card-lg bg-white/90 px-8 py-10 text-center shadow-md backdrop-blur-sm sm:px-12">
            <span
              aria-hidden
              className="pointer-events-none absolute -left-2 -top-12 select-none text-[160px] font-black leading-none text-accent/10"
            >
              &ldquo;
            </span>
            <p className="relative text-p-lead text-navy">
              La soledad y la ansiedad suelen vivir en el pasado que ya no está o en el
              futuro que aún no llega.{" "}
              <span className="italic text-accent">
                Sanar empieza cuando volvemos, con calma, al presente.
              </span>
            </p>
          </div>
        </FadeInOnScroll>
      </FadeInOnScroll>
    </section>
  );
}
