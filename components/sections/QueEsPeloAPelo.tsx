import Image from "next/image";
import { BarChart3, Brain, MessageCircle, Globe2, Heart } from "lucide-react";
import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import { stats } from "@/lib/data/stats";

const STAT_ICONS = {
  chart: BarChart3,
  brain: Brain,
  chat: MessageCircle,
  world: Globe2,
  heart: Heart,
};

// Fondos de las tarjetas de datos: ciclan por la paleta de marca (ver
// globals.css) en su version suave, para diferenciarlas entre si sin
// salirse de los colores propios del sitio.
const STAT_BACKGROUNDS = [
  "bg-accent/10",
  "bg-coral-soft",
  "bg-[rgba(137,207,235,0.16)]",
  "bg-navy/8",
  "bg-[linear-gradient(135deg,rgba(143,124,182,0.14),rgba(137,207,235,0.14))]",
];

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
      {/* Fundido superior que retoma el mismo cream con el que ahora termina
          el degrade del Hero (ver Hero.tsx), para que el corte entre
          secciones sea fluido. Al ser el mismo color en ambos extremos no
          hace falta transicion visible: el fondo de la pagina (--color-cream
          en globals.css) ya continua sin corte por si solo. */}

      <FadeInOnScroll className="mx-auto max-w-6xl">
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

        {/* "Por que existimos": mismo patron que el bloque de arriba
            (foto + texto a dos columnas), pero espejado: texto a la
            izquierda, foto a la derecha. items-start (en vez de
            items-center) para que el texto arranque a la misma altura que
            la foto; el espacio libre que deja el texto, mas corto que la
            foto, se rellena con las estadisticas (antes una seccion aparte
            mas abajo, ver page.tsx). */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 sm:items-start">
          <div>
            <h3 className="text-h2-md text-navy">
              Por qué <span className="italic text-accent">existimos</span>
            </h3>

            <p className="mt-6 text-p-body text-navy/80">
              Ante un síntoma tan difícil, las alarmas se encienden y buscamos
              soluciones desesperadas, sin estrategia ni estructura.
            </p>
            <p className="mt-4 text-p-body text-navy/80">
              Entre los <strong className="text-navy">fantasmas del pasado</strong>{" "}
              y las fantasías del futuro, es casi imposible avanzar. Por eso te
              invitamos a construir juntos un espacio seguro de exploración y
              foco, con pasos concretos, a tu ritmo.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-3">
              {stats.map((stat, index) => {
                const Icon = STAT_ICONS[stat.icon];
                const isLast = index === stats.length - 1;
                return (
                  <div
                    key={stat.label}
                    className={`flex flex-col gap-2 rounded-card-md p-4 ${STAT_BACKGROUNDS[index % STAT_BACKGROUNDS.length]} ${
                      isLast && stats.length % 2 === 1 ? "col-span-2" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-data-md text-navy">
                        <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                      </p>
                      <Icon size={18} className="shrink-0 text-navy/40" />
                    </div>
                    <p className="text-p-caption leading-snug text-navy/70">{stat.label}</p>
                    <a
                      href={stat.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-p-caption text-accent hover:underline"
                    >
                      Fuente: {stat.source} →
                    </a>
                  </div>
                );
              })}
            </div>
          </div>

          <figure>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card-lg bg-navy/10">
              <Image
                src="/images/pq-existimos.jpg"
                alt="Una persona escribe con calma en un cuaderno, junto a una taza de té, en un momento de estructura y pausa."
                fill
                sizes="(min-width: 640px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </figure>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
