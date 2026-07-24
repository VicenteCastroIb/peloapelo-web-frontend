import Image from "next/image";
import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

export default function Hero() {
  return (
    <section id="inicio" className="relative isolate -mt-[104px] overflow-hidden pt-[104px]">
      {/* La foto ocupa solo el ~80% derecho de la sección; el resto queda en
          crema puro, dando espacio garantizado para el texto sin depender
          solo del degradado. */}
      <div className="absolute inset-y-0 left-[18%] right-0 -z-20 overflow-hidden sm:left-[22%]">
        <Image
          src="/images/hero-photo.jpg"
          alt="Una terapeuta apoya con calidez a una mujer con pañuelo en la cabeza por pérdida de pelo."
          fill
          priority
          sizes="80vw"
          className="object-cover"
        />
      </div>

      {/* Scrim: suaviza el borde entre la foto y el crema, y refuerza la
          legibilidad del texto (abajo en mobile, a la izquierda en desktop). */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-cream via-cream/75 to-cream/10 sm:bg-gradient-to-r sm:from-cream sm:via-cream/40 sm:to-transparent"
      />

      <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-end px-6 py-16 sm:min-h-[640px] sm:items-start sm:justify-center sm:py-24 lg:px-12 lg:py-32">
        <FadeInOnScroll className="w-full sm:max-w-lg lg:max-w-xl">
          <div className="mb-6 flex items-center gap-3 text-h4-label text-navy/50">
            <span className="h-px w-8 bg-navy/20" />
            Fundación Pelo a Pelo · Chile
          </div>

          <h1 className="text-5xl font-normal leading-tight text-navy sm:text-6xl lg:text-7xl">
            Te guiamos en la pérdida de pelo,{" "}
            <span className="italic text-accent">sin prisa</span>,{" "}
            <span className="italic text-accent">sin juicios</span>.
          </h1>

          <p className="mt-6 text-h3-sm font-normal text-navy/70">
            Acompañamiento integral creado por quien ha vivido la alopecia toda su
            vida. Cuerpo, emoción y hábitos — a tu ritmo.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="/auth" variant="solid">
              Comienza gratis →
            </Button>
            <Button href="/pricing" variant="ghost">
              Ver planes
            </Button>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
