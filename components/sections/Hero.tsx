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
      className="relative isolate -mt-[72px] flex min-h-screen flex-col overflow-hidden pt-[72px]"
    >
      {/* La foto trae de fabrica el difuminado inferior hacia el cream, pero
          en pantallas anchas y bajas el object-cover recorta esa franja
          antes de que llegue a verse. Se agrega un fundido explicito por
          CSS al fondo de la foto para garantizar la transicion sin depender
          del recorte. La banda es deliberadamente chica (solo el borde
          inferior) y un degrade lineal simple (sin via intermedio), para
          que la foto se vea completa y solo el ultimo tramo se funda hacia
          la siguiente seccion. */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          src="/images/hero/hero-nuevo.jpg"
          alt="Una terapeuta apoya con calidez a una mujer con pañuelo en la cabeza por pérdida de pelo."
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[center_10%]"
        />
        {/* Antes era una banda de degrade bastante alta (h-12/16/20); a
            pedido se deja solo una linea delgada, no un fundido largo. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[3px] bg-cream"
        />
      </div>

      {/* Arco decorativo suave con la paleta de la pagina, detras del texto
          pero encima de la foto — hace de "halo" cerca del bloque de texto,
          igual que el arco del ejemplo de referencia. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 top-1/2 -z-10 h-[520px] w-[520px] -translate-y-1/2 rounded-full bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] opacity-[0.12] blur-3xl"
      />

      {/* El alto ya lo da min-h-screen en la section (el hero ahora ocupa
          toda la pantalla, a pedido); este div solo centra el contenido
          verticalmente dentro de ese espacio con flex-1 + justify-center. */}
      <div className="relative mx-auto flex w-full max-w-[88rem] flex-1 flex-col justify-center px-6 pb-16 sm:items-start sm:justify-center lg:px-12">
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
            vida. Cuerpo, emoción y hábitos — a tu ritmo, sin promesas vacías.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="/auth" variant="gradient" className="px-7 py-3.5 text-base">
              Haz el quiz gratuito →
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
      </div>
    </section>
  );
}
