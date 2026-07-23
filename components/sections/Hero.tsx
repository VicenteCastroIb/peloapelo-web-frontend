import Button from "@/components/ui/Button";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden px-6 py-24 lg:px-12 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-0 h-[480px] w-[480px] rounded-full bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] opacity-10 blur-3xl"
      />

      <FadeInOnScroll className="relative mx-auto max-w-4xl">
        <div className="mb-6 flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-navy/50">
          <span className="h-px w-8 bg-navy/20" />
          Fundación Pelo a Pelo · Chile
        </div>

        <h1 className="text-5xl font-normal leading-tight sm:text-6xl lg:text-[112px] lg:leading-[1.02]">
          Te guiamos en la pérdida de pelo,{" "}
          <span className="italic text-accent">sin prisa</span>,{" "}
          <span className="italic text-accent">sin juicios</span>.
        </h1>

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-navy/70">
            Acompañamiento integral creado por quien ha vivido la alopecia toda su
            vida. Cuerpo, emoción y hábitos — a tu ritmo.
          </p>

          <div className="flex items-center gap-6">
            <Button href="/auth" variant="solid">
              Comienza gratis →
            </Button>
            <Button href="/pricing" variant="ghost">
              Ver planes
            </Button>
          </div>
        </div>
      </FadeInOnScroll>
    </section>
  );
}
