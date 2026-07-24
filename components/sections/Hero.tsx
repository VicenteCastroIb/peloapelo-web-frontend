import Image from "next/image";
import { HeartHandshake, BookOpenCheck, Feather, Globe2 } from "lucide-react";
import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import { stats } from "@/lib/data/stats";

const CONFIANZA = [
  { icon: HeartHandshake, label: "Acompañamiento profesional" },
  { icon: BookOpenCheck, label: "Basado en evidencia" },
  { icon: Feather, label: "A tu ritmo" },
];

// Dato real ya investigado y citado en Estadisticas.tsx — se reutiliza
// aca en vez de inventar una cifra o rating falso para la tarjeta flotante.
const worldStat = stats.find((stat) => stat.icon === "world")!;

export default function Hero() {
  return (
    <section id="inicio" className="relative isolate -mt-[104px] overflow-hidden pt-[104px]">
      {/* La foto trae de fabrica el difuminado inferior hacia el cream, pero
          en pantallas anchas y bajas el object-cover recorta esa franja
          antes de que llegue a verse. Se agrega un fundido explicito por
          CSS al fondo de la foto (crece en pantallas grandes) para
          garantizar la transicion sin depender del recorte. La banda es
          angosta y el color solido (cream) se alcanza al 60% de su alto
          (via-60%) para que el corte hacia la siguiente seccion sea rapido
          en vez de un desvanecido largo. */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          src="/images/hero-photo.jpg"
          alt="Una terapeuta apoya con calidez a una mujer con pañuelo en la cabeza por pérdida de pelo."
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[center_30%]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent from-0% via-cream via-60% to-cream to-100% sm:h-32 lg:h-40"
        />
      </div>

      {/* Arco decorativo suave con la paleta de la pagina, detras del texto
          pero encima de la foto — hace de "halo" cerca del bloque de texto,
          igual que el arco del ejemplo de referencia. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/2 -z-10 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] opacity-[0.12] blur-3xl"
      />

      <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-start px-6 pb-16 pt-6 sm:min-h-[640px] sm:items-start sm:justify-start sm:pb-24 sm:pt-8 lg:px-12 lg:pt-10">
        <FadeInOnScroll className="w-full sm:max-w-lg lg:max-w-xl">
          <div className="mb-6 flex items-center gap-3 text-h4-label text-navy/50">
            <span className="h-px w-8 bg-navy/20" />
            Fundación Pelo a Pelo Chile
          </div>

          <h1 className="text-3xl font-normal leading-tight text-navy sm:text-4xl lg:text-5xl">
            Te acompañamos en la pérdida de pelo desde la{" "}
            <span className="italic text-accent">empatía</span>, la{" "}
            <span className="italic text-accent">experiencia personal</span> y la{" "}
            <span className="italic text-accent">evidencia</span>.
          </h1>

          <p className="mt-6 text-h3-sm font-normal text-navy/70">
            Acompañamiento integral creado por quien ha vivido la alopecia toda su
            vida. Cuerpo, emoción y hábitos — a tu ritmo.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="/auth" variant="outline">
              Comienza gratis →
            </Button>
            <Button href="/pricing" variant="ghost">
              Ver planes →
            </Button>
          </div>

          {/* Fila de confianza, equivalente a los 3 iconos del ejemplo
              (Clean Ingredients / Clinically Tested / For All Skin Types)
              pero con lo que realmente ofrece la fundacion. */}
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3">
            {CONFIANZA.map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-navy/20 text-navy/70">
                  <Icon size={14} />
                </span>
                <span className="text-p-caption text-navy/70">{label}</span>
              </div>
            ))}
          </div>
        </FadeInOnScroll>
      </div>

      {/* Tarjeta flotante con un dato real (ya citado en Estadisticas), no
          una resenia o rating inventado como en el ejemplo de referencia. */}
      <div className="pointer-events-auto absolute bottom-8 right-6 hidden max-w-[230px] rounded-card-md bg-cream p-4 shadow-lg sm:block lg:right-12">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-navy/20 text-navy/70">
            <Globe2 size={16} />
          </span>
          <p className="text-h3-sm text-navy">
            <AnimatedCounter value={worldStat.value} suffix={worldStat.suffix} />
          </p>
        </div>
        <p className="mt-2 text-p-caption text-navy/60">{worldStat.label}</p>
        <a
          href={worldStat.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-p-caption text-accent hover:underline"
        >
          Fuente: {worldStat.source} →
        </a>
      </div>
    </section>
  );
}
