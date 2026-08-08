"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import { Plan } from "@/lib/data/plans";
import { useAuth, ApiError } from "@/lib/auth/AuthContext";
import { subscribeToPlan } from "@/lib/api/subscriptions";

// Degrade suave de marca por plan (rediseno, ver docs de handoff):
// reemplaza el contraste solido blanco/navy que tenia esta tarjeta antes.
// Cada plan tiene su propio tinte, siempre sutil (base blanca), para no
// competir con el contenido ni con el fondo fotografico de la seccion.
const PLAN_GRADIENTS: Record<Plan["id"], string> = {
  gratuito: "linear-gradient(160deg,#ffffff,rgba(137,207,235,0.14))",
  trimestral: "linear-gradient(160deg,#ffffff,rgba(143,124,182,0.16))",
  mensual: "linear-gradient(160deg,#ffffff,rgba(239,67,67,0.08))",
};

// Sombra tenida en navy en vez del gris por defecto de Tailwind (ago 2026,
// "las cards deben notarse mas"): shadow-lg/xl planos se perdian contra el
// fondo pastel de la seccion -- una sombra mas grande, mas oscura y con un
// tinte de marca en vez de gris puro lee con mas peso y contraste. La
// destacada suma un halo violeta ademas del negro, para que se note que es
// "la que flota mas alto" incluso antes de leer el badge.
const CARD_SHADOW = "0 24px 48px -14px rgba(43,61,79,0.35), 0 6px 16px -6px rgba(43,61,79,0.18)";
const CARD_SHADOW_HIGHLIGHTED =
  "0 28px 60px -14px rgba(96,73,141,0.4), 0 8px 20px -6px rgba(43,61,79,0.22)";

export default function PlanCard({ plan }: { plan: Plan }) {
  const router = useRouter();
  const { status, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    // No se exige `token` aca: tras recargar la pagina no queda token en
    // memoria (ver AuthContext.tsx), pero la cookie httpOnly sigue
    // autenticando la request igual. `status` es la unica fuente de verdad.
    if (status !== "authenticated") {
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
      // Sombra propia (ago 2026, "que las cards esten por encima del
      // background", luego "las cards deben notarse mas"): antes la card no
      // tenia shadow, dependia solo del fondo detras para separarse -- ahora
      // se despega con una sombra tenida en navy (CARD_SHADOW, ver arriba),
      // mas fuerte que el shadow-lg/xl generico de Tailwind con el que se
      // probo primero.
      className={`relative flex flex-col gap-5 rounded-card-lg border p-8 text-navy ${
        plan.highlighted ? "border-2 border-accent" : "border-navy/15"
      }`}
      style={{
        background: PLAN_GRADIENTS[plan.id],
        boxShadow: plan.highlighted ? CARD_SHADOW_HIGHLIGHTED : CARD_SHADOW,
      }}
    >
      {plan.highlighted && (
        <span className="absolute -top-3.5 left-7 rounded-pill bg-accent px-3.5 py-1.5 text-p-caption font-bold tracking-wide text-white">
          ★ Más popular
        </span>
      )}

      <div>
        <h3 className="text-h3-md text-navy">{plan.name}</h3>
        <p className="mt-1 text-p-small text-navy/60">{plan.description}</p>
      </div>

      <div>
        <p className="flex items-baseline gap-2">
          <span className="text-h2-md font-semibold text-navy">{plan.price}</span>
          {plan.currency && <span className="text-p-small text-navy/50">{plan.currency}</span>}
        </p>
        <p className="text-p-small text-navy/50">
          {plan.period}
          {plan.costPerDay ? ` · ${plan.costPerDay}` : ""}
        </p>
      </div>

      <ul className="flex-1 space-y-3 text-p-small text-navy/75">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2">
            <Check size={16} className="mt-0.5 shrink-0 text-accent" />
            {feature}
          </li>
        ))}
      </ul>

      {error && <p className="text-p-caption text-coral">{error}</p>}

      <Button
        onClick={handleClick}
        disabled={loading}
        variant={plan.highlighted ? "gradient" : "outline"}
        className={`w-full ${plan.highlighted ? "" : "border-navy/20"}`}
      >
        {loading ? "Un momento…" : plan.cta}
      </Button>
    </div>
  );
}
