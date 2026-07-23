import { BarChart3, Brain, MessageCircle, Globe2, Clock3 } from "lucide-react";
import AnimatedCounter from "@/components/shared/AnimatedCounter";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import { stats } from "@/lib/data/stats";

const ICONS = {
  chart: BarChart3,
  globe: Brain,
  chat: MessageCircle,
  world: Globe2,
  clock: Clock3,
};

export default function Estadisticas() {
  return (
    <section className="px-6 py-24 lg:px-12 lg:py-28">
      <FadeInOnScroll className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-semibold sm:text-4xl">
          La realidad que <span className="italic text-accent">nadie cuenta</span>
        </h2>
        <p className="mt-3 text-navy/70">
          Cifras reales sobre la pérdida de cabello y la importancia del apoyo.
        </p>

        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {stats.map((stat) => {
            const Icon = ICONS[stat.icon];
            return (
              <div
                key={stat.label}
                className="flex w-64 items-center gap-4 rounded-card-md bg-white p-5 text-left"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-icon bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] text-white">
                  <Icon size={20} />
                </span>
                <div>
                  <p className="text-2xl font-semibold">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-sm text-navy/60">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </FadeInOnScroll>
    </section>
  );
}
