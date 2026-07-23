import { Heart, ShieldCheck, Sparkles } from "lucide-react";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";

const PILARES = [
  {
    icon: Heart,
    title: "Emocional",
    description: "Acompañamiento empático para procesar tus emociones.",
  },
  {
    icon: ShieldCheck,
    title: "Físico",
    description: "Guía basada en evidencia sobre tratamientos y cuidado.",
  },
  {
    icon: Sparkles,
    title: "Mental",
    description: "Herramientas para fortalecer tu bienestar psicológico.",
  },
];

export default function QuePelo() {
  return (
    <section className="px-6 py-24 text-center lg:px-12 lg:py-28">
      <FadeInOnScroll className="mx-auto max-w-3xl">
        <h2 className="text-h2-md text-navy">
          ¿Qué es <span className="italic text-accent">Pelo a Pelo</span>?
        </h2>

        <span className="mt-4 inline-flex items-center gap-2 rounded-pill bg-accent/10 px-4 py-1.5 text-a-inline font-medium text-accent">
          🤝 Fundación sin fines de lucro
        </span>

        <p className="mx-auto mt-6 max-w-xl text-p-body text-navy/70">
          Pelo a Pelo es una <strong className="text-navy">fundación</strong> cuyo fin
          es aportar a la comunidad de personas que atraviesan la pérdida de cabello.
          Desde una mirada integral — mental, física y emocional — ofrecemos una guía
          clara, respetuosa y sin prisa.
        </p>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {PILARES.map(({ icon: Icon, title, description }) => (
            <div key={title}>
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-icon bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] text-white">
                <Icon size={22} />
              </span>
              <h3 className="text-h3-md text-navy">{title}</h3>
              <p className="mt-1 text-p-small text-navy/70">{description}</p>
            </div>
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
}
