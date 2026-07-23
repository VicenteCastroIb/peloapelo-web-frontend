import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { Plan } from "@/lib/data/plans";

export default function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={`flex flex-col p-8 ${
        plan.highlighted ? "bg-navy text-cream" : "bg-white text-navy"
      }`}
    >
      <p
        className={`text-xs font-semibold uppercase tracking-widest ${
          plan.highlighted ? "text-[var(--color-gradient-to)]" : "text-accent"
        }`}
      >
        {plan.highlighted ? "★ Más popular" : " "}
      </p>
      <h3 className="mt-2 text-xl font-semibold">{plan.name}</h3>
      <p className={`mt-1 text-sm ${plan.highlighted ? "text-cream/70" : "text-navy/60"}`}>
        {plan.description}
      </p>

      <p className="mt-6 flex items-baseline gap-2">
        <span className="text-4xl font-semibold">{plan.price}</span>
        {plan.currency && <span className="text-sm opacity-70">{plan.currency}</span>}
      </p>
      <p className={`text-sm ${plan.highlighted ? "text-cream/60" : "text-navy/50"}`}>
        {plan.period}
        {plan.costPerDay ? ` · ${plan.costPerDay}` : ""}
      </p>

      <ul
        className={`mt-6 flex-1 space-y-3 border-t pt-6 text-sm ${
          plan.highlighted ? "border-cream/15" : "border-navy/10"
        }`}
      >
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check size={16} className="mt-0.5 shrink-0 text-accent" />
            {feature}
          </li>
        ))}
      </ul>

      <Button
        href="/auth"
        variant={plan.highlighted ? "gradient" : "outline"}
        className={`mt-8 w-full ${plan.highlighted ? "" : "border-navy/20"}`}
      >
        {plan.cta}
      </Button>
    </div>
  );
}
