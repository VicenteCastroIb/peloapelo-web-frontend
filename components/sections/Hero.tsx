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
      {/* Fondo ilustrado (acuarela) en vez de foto: el arbol queda dibujado
          del lado izquierdo del archivo original, pero el texto del Hero
          tambien vive a la izquierda, asi que se aplica en modo espejo
          (-scale-x-100) para que el arbol quede del lado derecho y el
          fondo detras del texto quede despejado. object-[left_bottom] fija
          el recorte de object-cover sobre la zona donde esta el arbol y
          las colinas (que es el lado izquierdo del archivo, antes de
          espejarlo), para no perderlo en pantallas angostas/altas. El
          fondo de la ilustracion ya es cream, asi que funde naturalmente
          con el resto de la pagina sin necesitar un degrade adicional. */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        <Image
          src="/images/hero/hero-ilustrado.jpg"
          alt=""
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover object-[left_bottom] -scale-x-100"
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
