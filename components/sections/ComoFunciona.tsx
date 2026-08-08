import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import { comoFuncionaSteps } from "@/lib/data/comoFunciona";

// Un tinte de marca distinto por tarjeta (mismo patron que PLAN_GRADIENTS en
// PlanCard.tsx: base blanca + gradiente de marca muy sutil) para que las
// cuatro tarjetas se lean como pasos de un mismo camino, no como filas
// identicas de una tabla.
const STEP_GRADIENTS = [
  "linear-gradient(160deg,#ffffff,rgba(143,124,182,0.12))",
  "linear-gradient(160deg,#ffffff,rgba(137,207,235,0.16))",
  "linear-gradient(160deg,#ffffff,rgba(239,67,67,0.07))",
  "linear-gradient(160deg,#ffffff,rgba(96,73,141,0.11))",
];

/**
 * Rediseno (ago 2026, feedback de diseno "senior" -- imagenes y formas):
 * 1. Icono agrandado de un badge circular de 64px a un marco cuadrado de
 *    96px con borde en gradient-from, mismo lenguaje que los iconos de
 *    "Cómo te sostenemos" -- a 64px el icono (fuente real 1024x1024, sobra
 *    resolucion) se perdia como un favicon en vez de leerse como ilustracion.
 * 2. Hilo punteado en zigzag detras de la grilla (SVG, viewBox 0-100 no
 *    uniforme a proposito para que se estire con el contenedor): conecta
 *    01 -> 02 -> 03 -> 04 en su orden de lectura, igual que el hilo de
 *    "Cómo te sostenemos" -- refuerza que son pasos secuenciales y no una
 *    grilla de features sueltas. Solo se asoma en los gaps entre cards.
 * 3. Icono del Paso 3 pendiente de reemplazo (ver nota en comoFunciona.ts):
 *    la forma actual se lee muy anatomica (pulmones) para un sitio de salud;
 *    se pidio un concepto de respiracion menos literal.
 */
export default function ComoFunciona() {
  return (
    <section id="como-funciona" className="scroll-mt-24 bg-white/40 px-6 py-24 lg:px-12 lg:py-36">
      <FadeInOnScroll className="mx-auto max-w-6xl">
        <SectionBadge label="Cómo funciona" />

        <h2 className="max-w-xl text-h2-lg text-navy">
          Cuatro pasos, <span className="italic text-accent">a tu ritmo</span>.
        </h2>
        <p className="mt-4 max-w-md text-p-body text-navy/70">
          Un camino diseñado por quien lo ha caminado. Empieza gratis, avanza cuando
          te sientas listo.
        </p>

        {/* Tarjetas propias en vez de la grilla dividida por lineas: cada
            paso tiene su tinte, su numero grande de fondo y un icono en
            marco cuadrado, con una micro-interaccion en el CTA al pasar
            el cursor -- pensado para sentirse acompañado, no tabulado. */}
        <div className="relative mt-14">
          <svg
            aria-hidden
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 hidden sm:block"
          >
            {/* Solo tramos horizontales/verticales a proposito: el viewBox
                se estira sin mantener proporcion (preserveAspectRatio none)
                para acompañar el ancho real del contenedor, y una diagonal
                bajo ese estiramiento se ve como un bloque deforme en vez de
                una linea fina -- los tramos rectos no tienen ese problema.
                Esquinas redondeadas a mano con curvas Q en vez de vertices
                en angulo recto (mas calido, menos "diagrama tecnico"). */}
            <path
              d="M 25 18 L 71 18 Q 75 18 75 22 L 75 39 Q 75 43 71 43 L 29 43 Q 25 43 25 47 L 25 64 Q 25 68 29 68 L 75 68"
              fill="none"
              stroke="var(--color-accent)"
              strokeOpacity="0.22"
              strokeWidth="0.35"
              strokeDasharray="2 2.5"
              strokeLinecap="round"
            />
          </svg>

          <div className="grid gap-6 sm:grid-cols-2">
            {comoFuncionaSteps.map((step, index) => (
              <FadeInOnScroll key={step.number} delayMs={index * 90}>
                <div
                  className="group relative flex h-full flex-col gap-4 overflow-hidden rounded-card-lg border border-navy/12 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-transparent hover:shadow-xl"
                  style={{ background: STEP_GRADIENTS[index % STEP_GRADIENTS.length] }}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute -right-2 -top-8 select-none text-[110px] font-black leading-none text-navy/[0.06]"
                  >
                    {step.number}
                  </span>

                  <div className="relative flex items-center gap-5">
                    <div
                      className="relative h-24 w-24 shrink-0 overflow-hidden rounded-card-md border-2 border-[var(--color-gradient-from)] bg-cream transition-transform duration-300 group-hover:scale-105"
                    >
                      <Image src={step.icon} alt="" aria-hidden fill sizes="96px" className="object-cover" />
                    </div>
                    <div>
                      <p className="text-h4-label text-accent">Paso {step.number}</p>
                      <h3 className="mt-0.5 text-h3-md text-navy">{step.title}</h3>
                    </div>
                  </div>

                  <p className="relative text-p-body text-navy/70">{step.description}</p>

                  <Link
                    href={step.actionHref}
                    className="relative mt-auto flex w-fit items-center gap-1.5 pt-2 text-a-inline font-bold text-coral"
                  >
                    {step.actionLabel.replace(/\s*→\s*$/, "")}
                    <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </FadeInOnScroll>
            ))}
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
