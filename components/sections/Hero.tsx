import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

export default function Hero() {
  return (
    <section id="inicio" className="relative isolate -mt-[104px] overflow-hidden pt-[104px]">
      <video
        className="absolute inset-0 -z-20 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        poster="/images/hero-poster.jpg"
      >
        <source src="/videos/hero-animado.mp4" type="video/mp4" />
      </video>

      {/* Scrim: transparente sobre las personas, se funde a crema donde va el texto
          (abajo en mobile, a la izquierda en desktop) para que siempre sea legible. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-cream via-cream/75 to-cream/10 sm:bg-gradient-to-l sm:from-cream/10 sm:via-cream/55 sm:to-cream"
      />

      <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-end px-6 py-16 sm:min-h-[640px] sm:items-start sm:justify-center sm:py-24 lg:px-12 lg:py-32">
        <FadeInOnScroll className="w-full sm:max-w-md lg:max-w-lg">
          <div className="mb-6 flex items-center gap-3 text-h4-label text-navy/50">
            <span className="h-px w-8 bg-navy/20" />
            Fundación Pelo a Pelo · Chile
          </div>

          <h1 className="text-4xl font-normal leading-tight text-navy sm:text-5xl lg:text-6xl">
            Te guiamos en la pérdida de pelo,{" "}
            <span className="italic text-accent">sin prisa</span>,{" "}
            <span className="italic text-accent">sin juicios</span>.
          </h1>

          <p className="mt-6 text-p-lead text-navy/70">
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
