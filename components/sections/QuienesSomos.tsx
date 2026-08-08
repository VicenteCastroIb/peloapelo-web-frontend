import Image from "next/image";
import Link from "next/link";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

/**
 * Reubicado del home a /fundacion (ver tarea de reestructuracion, ago 2026):
 * el home ya no incluye este bloque en su estructura exacta, pero el texto
 * no se toco -- solo el link de cierre pasa a ruta absoluta (/#fundadora en
 * vez de #fundadora) porque ahora se renderiza en una pagina distinta de
 * donde vive la seccion de Jessica Lagno.
 *
 * Rediseno (ago 2026, feedback "senior"): era puro texto centrado sobre
 * cream plano -- la apertura mas debil de todo el sitio, justo en la pagina
 * pensada para dar confianza. Se suma una foto de Jessica (misma imagen y
 * tratamiento aspect-[4/5]/rounded-card-lg que ya usan las fotos de
 * QueEsPeloAPelo mas abajo, para que la pagina completa comparta un mismo
 * lenguaje visual desde el primer bloque) a dos columnas con el texto.
 */
export default function QuienesSomos() {
  return (
    <section id="quienes-somos" className="scroll-mt-24 px-6 py-16 lg:px-12 lg:py-20">
      <FadeInOnScroll className="mx-auto max-w-5xl">
        <div className="grid gap-10 sm:grid-cols-[minmax(0,320px)_1fr] sm:items-center">
          <figure>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card-lg bg-navy/10">
              <Image
                src="/images/founder/jessica-lagno.png"
                alt="Jessica Lagno, fundadora de Pelo a Pelo"
                fill
                sizes="(min-width: 640px) 30vw, 80vw"
                className="object-cover"
                priority
              />
            </div>
            <figcaption className="mt-3 text-p-small font-semibold uppercase tracking-wide text-navy/60">
              Jessica Lagno <span className="normal-case text-navy/40">· fundadora</span>
            </figcaption>
          </figure>

          <div>
            <SectionBadge label="Quiénes somos" />

            <h2 className="text-h2-lg text-navy">
              Una fundación nacida de <span className="italic text-accent">una historia real</span>.
            </h2>

            <p className="mt-6 text-p-lead text-navy/80">
              Pelo a Pelo es una fundación chilena sin fines de lucro. Existe para
              que nadie atraviese la pérdida de cabello en silencio. Acompañamos
              desde lo emocional, lo físico y mental, con una mirada honesta y
              sostenida en el tiempo.
            </p>
            <p className="mt-4 text-p-lead text-navy/80">
              Nace de Jessica Lagno, psicóloga que vive con alopecia areata
              universal hace once años. Todo lo que ofrecemos parte de algo que
              ella misma necesitó primero.
            </p>

            <Link
              href="/#fundadora"
              className="mt-5 inline-block text-a-inline font-bold text-accent hover:underline"
            >
              Conoce su historia →
            </Link>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
