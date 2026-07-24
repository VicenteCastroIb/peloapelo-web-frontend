import Image from "next/image";
import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

export default function Hero() {
  return (
    <section id="inicio" className="relative isolate -mt-[104px] overflow-hidden pt-[104px]">
      {/* La foto cubre toda la sección, pero se desvanece hacia crema en su
          borde izquierdo (mask-image, sin corte recto) dejando espacio para
          el texto. En mobile se desvanece hacia abajo en vez de a un lado. */}
      <div className="absolute inset-0 -z-20 overflow-hidden [mask-image:linear-gradient(to_top,transparent,black_45%)] sm:[mask-image:linear-gradient(to_right,transparent,black_45%)]">
        <Image
          src="/images/hero-photo.jpg"
          alt="Una terapeuta apoya con calidez a una mujer con pañuelo en la cabeza por pérdida de pelo."
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Scrim adicional: refuerza el crema alrededor del texto por si el
          fondo de la foto queda claro en algún punto. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-cream via-cream/40 to-transparent sm:bg-gradient-to-r sm:from-cream sm:via-cream/25 sm:to-transparent"
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
