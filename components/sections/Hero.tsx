import Image from "next/image";
import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

// Fila de confianza tal cual el mockup: puntos simples, no iconos en
// circulo (ver docs de handoff / Hero.tsx del mockup).
const CONFIANZA = ["Acompañamiento humano", "Respaldado en evidencia", "A tu ritmo"];

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate -mt-[72px] flex min-h-screen flex-col overflow-hidden bg-cream pt-[72px]"
    >
      {/* Prueba (27 jul 2026, "intenta"): se saca el fondo ilustrado a
          pantalla completa y se reemplaza por un layout de 2 columnas --
          texto a la izquierda, ilustracion vertical (Posible-hero.jpg) a la
          derecha, sin croppear (object-contain: la ilustracion ya trae su
          propio halo circular pintado, cortarla con object-cover le habria
          quitado composicion). Oculta en mobile/tablet chico (lg:flex) para
          no aplastar el texto -- ahi el hero queda solo con el bloque de
          texto, como antes de este intento. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/2 -z-10 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] opacity-[0.12] blur-3xl"
      />

      <div className="relative mx-auto flex w-full max-w-[88rem] flex-1 flex-col items-center gap-10 px-6 pb-16 lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:px-12">
        <FadeInOnScroll className="w-full sm:max-w-xl lg:max-w-2xl">
          <div className="mb-6 flex items-center gap-3 text-h4-label text-navy/50">
            <span className="h-px w-8 bg-navy/20" />
            Fundación Pelo a Pelo Chile
          </div>

          <h1 className="text-4xl font-normal leading-tight text-navy sm:text-5xl lg:text-6xl">
            Te acompañamos en la{" "}
            <span className="italic text-accent">pérdida de pelo</span>, con empatía,
            cuidado y evidencia.
          </h1>

          {/* text-p-lead trae font-weight:300 propio (ver globals.css); se
              fuerza con !font-medium (500) porque, al empatar especificidad
              con una utilidad normal, la clase custom ganaria el cascade. */}
          <p className="mt-6 text-p-lead !font-medium text-navy/75 sm:text-xl">
            Acompañamiento integral creado por quien ha vivido la alopecia toda su
            vida. Cuerpo, emoción y hábitos a tu ritmo.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="/auth" variant="gradient" className="px-7 py-3.5 text-base">
              Haz el quiz gratuito
            </Button>
            <Button href="/therapist" variant="outline" className="px-7 py-3.5 text-base">
              Agendar una hora
            </Button>
          </div>

          {/* Fila de confianza tal cual el mockup: puntos simples en vez de
              iconos en circulo. */}
          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3">
            {CONFIANZA.map((label) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-p-small font-medium text-navy/70">{label}</span>
              </div>
            ))}
          </div>
        </FadeInOnScroll>

        <div className="relative hidden w-full max-w-md shrink-0 lg:block">
          {/* mask-image degrada los bordes del archivo a transparente para
              que el rectangulo de la imagen no se note contra el fondo
              cream de la seccion -- mismo truco que el retrato de
              Fundadora.tsx. */}
          <div
            className="relative aspect-[3/4] w-full"
            style={{
              maskImage: "radial-gradient(ellipse at center, black 62%, transparent 92%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 62%, transparent 92%)",
            }}
          >
            <Image
              src="/images/hero/Posible-hero.jpg"
              alt=""
              fill
              priority
              quality={90}
              sizes="(min-width: 1024px) 28rem, 0px"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
