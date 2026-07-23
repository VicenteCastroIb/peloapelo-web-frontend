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
      "Acceso por 3 días",
      "Quiz inicial personalizado",
      "Seguimiento de progreso",
      "Ebook gratuito",
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
      "Todo del plan mensual",
      "Programa estructurado de 3 meses",
      "Contenido progresivo semanal",
      "Cursos especializados en ansiedad",
      "Agenda con terapeuta profesional",
      "Garantía 14 días",
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
      "Contenido nuevo cada semana",
      "Seguimiento de progreso",
      "Comunidad de apoyo",
    ],
    cta: "Elegir Mensual",
  },
];

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
