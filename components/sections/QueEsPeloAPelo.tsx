import Image from "next/image";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

const PILARES = [
  {
    image: "/images/pilar-emocional.jpg",
    title: "Emocional",
    description: "Acompañamiento empático para procesar tus emociones.",
  },
  {
    image: "/images/pilar-fisico.jpg",
    title: "Físico",
    description: "Guía basada en evidencia sobre tratamientos y cuidado.",
  },
  {
    image: "/images/pilar-mental.jpg",
    title: "Mental",
    description: "Herramientas para fortalecer tu bienestar psicológico.",
  },
];

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

            <div className="mt-8 rounded-card-md bg-[linear-gradient(135deg,rgba(143,124,182,0.12),rgba(137,207,235,0.12))] p-6 shadow-sm">
              <p className="text-p-lead text-navy/80">
                <span className="italic text-accent">&quot;El cambio más profundo</span>{" "}
                empieza cuando dejas de buscar afuera lo que solo puedes sanar{" "}
                <span className="italic text-accent">por dentro.&quot;</span>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid gap-10 text-center sm:grid-cols-3">
          {PILARES.map(({ image, title, description }) => (
            <div key={title}>
              <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full bg-cream">
                <Image
                  src={image}
                  alt={`Ilustración en acuarela que representa el acompañamiento ${title.toLowerCase()}`}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </div>
              <h3 className="text-h3-md text-navy">{title}</h3>
              <p className="mt-1 text-p-small text-navy/70">{description}</p>
            </div>
          ))}
        </div>

        {/* Caja "por qué existimos": version resumida del texto largo que la
            fundadora pidio como recuadro chico (ver docs/Pelo a pelo.docx).
            Manchas acuareladas con los colores reales de la pagina + una
            interaccion sutil al pasar el mouse (se eleva y las manchas
            se intensifican), en vez de un simple bloque de texto estatico. */}
        <div className="group relative mx-auto mt-16 max-w-3xl overflow-hidden rounded-card-lg bg-white p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-12">
          <span
            aria-hidden
            className="pointer-events-none absolute -left-12 -top-16 h-48 w-48 rounded-full bg-accent/15 blur-3xl transition-all duration-500 group-hover:scale-110 group-hover:bg-accent/25"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute -bottom-16 -right-10 h-56 w-56 rounded-full bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] opacity-20 blur-3xl transition-all duration-500 group-hover:scale-110 group-hover:opacity-35"
          />

          <div className="relative">
            <p className="text-h4-label text-navy/50">Por qué existimos</p>
            <p className="mt-4 text-p-lead text-navy/80">
              Ante un síntoma tan difícil, las alarmas se encienden y buscamos
              soluciones desesperadas, sin estrategia. Entre los{" "}
              <strong className="text-navy">fantasmas del pasado</strong> y las
              fantasías del futuro, te invitamos a construir juntos un espacio
              seguro.
            </p>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
