import { formatClp } from "@/lib/format";
import type { BackendPlan } from "@/lib/api/plans";

export interface Plan {
  id: "gratuito" | "trimestral" | "mensual";
  name: string;
  description: string;
  price: string;
  currency?: string;
  period: string;
  costPerDay?: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}

// Fuente única de verdad para Home y /pricing (ver docs/scan-22-07-2026, seccion 1.2 del plan de trabajo)
export const plans: Plan[] = [
  {
    id: "gratuito",
    name: "Gratuito",
    description: "Explora todo sin compromiso",
    price: "Gratis",
    period: "por 3 días",
    features: [
      "Quiz inicial personalizado",
      "Seguimiento de progreso",
      "Sin tarjeta de crédito",
    ],
    cta: "Comienza gratis",
  },
  {
    id: "trimestral",
    name: "Plan 3 Meses",
    description: "El recomendado para ver cambios reales",
    price: "$92.000",
    currency: "CLP",
    period: "por 3 meses",
    costPerDay: "$1.022/día",
    features: [
      "Programa estructurado de 3 meses",
      "Cursos especializados en ansiedad",
      "Sesión con terapeuta profesional",
      "Garantía de 14 días",
    ],
    cta: "Elegir Bienestar",
    highlighted: true,
  },
  {
    id: "mensual",
    name: "Mensual",
    description: "Acceso completo con sesión incluida",
    price: "$35.990",
    currency: "CLP",
    period: "por mes",
    costPerDay: "$1.199/día",
    features: [
      "1 sesión con terapeuta al mes",
      "Acceso a todo el contenido",
      "Comunidad de apoyo",
    ],
    cta: "Elegir Mensual",
  },
];

/**
 * Sobreescribe nombre/precio de `plans` (el copy de marketing: features,
 * descripcion, cta, se queda tal cual) con los valores reales que vienen
 * de la tabla `plans` del backend -- la fundacion puede editar precio ahi
 * sin tocar codigo (ver Plan.java) y esto hace que la landing lo refleje.
 * Si el backend no trae un plan esperado (o no respondio), se conserva el
 * valor estatico para ese plan puntual en vez de ocultarlo: la landing
 * nunca debe romperse porque el backend este caido.
 */
export function withLivePricing(backendPlans: BackendPlan[]): Plan[] {
  const byCode = new Map(backendPlans.map((p) => [p.code, p]));

  return plans.map((plan) => {
    const live = byCode.get(plan.id);
    if (!live) return plan;

    return {
      ...plan,
      name: live.name,
      price: formatClp(live.priceClp),
    };
  });
}

export interface ComparisonRow {
  feature: string;
  gratuito: string | boolean;
  trimestral: string | boolean;
  mensual: string | boolean;
}

export const comparisonTable: ComparisonRow[] = [
  { feature: "Blog y artículos", gratuito: true, trimestral: true, mensual: true },
  { feature: "Quiz inicial", gratuito: true, trimestral: true, mensual: true },
  { feature: "Ebook gratuito", gratuito: true, trimestral: true, mensual: true },
  { feature: "Acceso a 12 módulos educativos", gratuito: false, trimestral: true, mensual: true },
  { feature: "Programa estructurado de 3 meses", gratuito: false, trimestral: true, mensual: false },
  { feature: "Seguimiento personalizado", gratuito: false, trimestral: true, mensual: true },
  { feature: "Comunidad privada", gratuito: "Solo lectura", trimestral: true, mensual: true },
  { feature: "Recursos descargables", gratuito: false, trimestral: true, mensual: true },
  { feature: "Sesión con terapeuta", gratuito: false, trimestral: true, mensual: "1 al mes" },
  { feature: "Garantía 14 días", gratuito: false, trimestral: true, mensual: false },
];
