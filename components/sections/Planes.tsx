import SectionBadge from "@/components/shared/SectionBadge";
import FadeInOnScroll from "@/components/shared/FadeInOnScroll";
import PlanCard from "@/components/sections/PlanCard";
import { plans } from "@/lib/data/plans";

export default function Planes() {
  return (
    <section className="px-6 py-24 lg:px-12 lg:py-28">
      <FadeInOnScroll className="mx-auto max-w-5xl">
        <SectionBadge label="Planes · IV" />
        <h2 className="text-h2-lg text-navy">
          Elige <span className="italic text-accent">tu camino</span>.
        </h2>
        <p className="mt-4 max-w-lg text-p-body text-navy/70">
          Somos una fundación sin fines de lucro. Cada plan que eliges permite que otra
          persona reciba apoyo sin costo.
        </p>

        <div className="mt-12 grid overflow-hidden rounded-card-lg border border-navy/10 sm:grid-cols-3">
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </FadeInOnScroll>
    </section>
  );
}
