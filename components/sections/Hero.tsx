import Image from "next/image";
import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

export default function Hero() {
  return (
    <section id="inicio" className="relative isolate -mt-[104px] overflow-hidden pt-[104px]">
      {/* La foto ya trae de fabrica el difuminado inferior hacia el cream
          y el espacio con plantas decorativas del lado izquierdo para el
          texto, asi que no se aplica ninguna mascara/gradiente por CSS. */}
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
      </div>

      <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-end px-6 py-16 sm:min-h-[640px] sm:items-start sm:justify-center sm:py-24 lg:px-12 lg:py-32">
        <FadeInOnScroll className="w-full sm:max-w-lg lg:max-w-xl">
          <div className="mb-6 flex items-center gap-3 text-h4-label text-navy/50">
            <span className="h-px w-8 bg-navy/20" />
            Fundación Pelo a Pelo Chile
          </div>

          <h1 className="text-5xl font-normal leading-tight text-navy sm:text-6xl lg:text-7xl">
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
