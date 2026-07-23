"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { Plan } from "@/lib/data/plans";
import { useAuth, ApiError } from "@/lib/auth/AuthContext";
import { subscribeToPlan } from "@/lib/api/subscriptions";

export default function PlanCard({ plan }: { plan: Plan }) {
  const router = useRouter();
  const { status, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (status !== "authenticated" || !token) {
      router.push("/auth");
      return;
    }

    setError(null);
    setLoading(true);
    try {
      await subscribeToPlan(token, plan.id);
      router.push("/subscription");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "No pudimos conectar con el servidor.");
      setLoading(false);
    }
  }

  return (
    <div
      className={`flex flex-col p-8 ${
        plan.highlighted ? "bg-navy text-cream" : "bg-white text-navy"
      }`}
    >
      <p
        className={`text-h4-label ${
          plan.highlighted ? "text-[var(--color-gradient-to)]" : "text-accent"
        }`}
      >
        {plan.highlighted ? "★ Más popular" : " "}
      </p>
      <h3 className="mt-2 text-h3-md">{plan.name}</h3>
      <p className={`mt-1 text-p-small ${plan.highlighted ? "text-cream/70" : "text-navy/60"}`}>
        {plan.description}
      </p>

      <p className="mt-6 flex items-baseline gap-2">
        <span className="text-h2-md font-semibold">{plan.price}</span>
        {plan.currency && <span className="text-p-small opacity-70">{plan.currency}</span>}
      </p>
      <p className={`text-p-small ${plan.highlighted ? "text-cream/60" : "text-navy/50"}`}>
        {plan.period}
        {plan.costPerDay ? ` · ${plan.costPerDay}` : ""}
      </p>

      <ul
        className={`mt-6 flex-1 space-y-3 border-t pt-6 text-p-small ${
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

      {error && <p className="mt-3 text-p-caption text-coral">{error}</p>}

      <Button
        onClick={handleClick}
        disabled={loading}
        variant={plan.highlighted ? "gradient" : "outline"}
        className={`mt-8 w-full ${plan.highlighted ? "" : "border-navy/20"}`}
      >
        {loading ? "Un momento…" : plan.cta}
      </Button>
    </div>
  );
}
