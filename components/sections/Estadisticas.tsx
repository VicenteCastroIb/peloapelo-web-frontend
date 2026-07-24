import { BarChart3, Brain, MessageCircle, Globe2, Heart } from "lucide-react";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import { stats } from "@/lib/data/stats";

const ICONS = {
  chart: BarChart3,
  brain: Brain,
  chat: MessageCircle,
  world: Globe2,
  heart: Heart,
};

export default function Estadisticas() {
  return (
    <section className="px-6 py-24 lg:px-12 lg:py-28">
      <FadeInOnScroll className="mx-auto max-w-4xl text-center">
        <h2 className="text-h2-md text-navy">
          La realidad que nadie te cuenta:{" "}
          <span className="italic text-accent">NO ESTÁS SOLA</span>
        </h2>
        <p className="mt-3 text-p-body text-navy/70">
          Cifras reales sobre la pérdida de cabello y el impacto del apoyo.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {stats.map((stat) => {
            const Icon = ICONS[stat.icon];
            return (
              <div
                key={stat.label}
                className="flex w-64 flex-col gap-3 rounded-card-md bg-white p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-icon bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] text-white">
                    <Icon size={20} />
                  </span>
                  <div>
                    <p className="text-h3-md text-navy">
                      <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-p-small text-navy/60">{stat.label}</p>
                  </div>
                </div>

                <a
                  href={stat.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-p-caption text-accent hover:underline"
                >
                  Fuente: {stat.source} →
                </a>
              </div>
            );
          })}
        </div>
      </FadeInOnScroll>
    </section>
  );
}
