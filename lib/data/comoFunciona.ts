export interface Step {
  number: string;
  title: string;
  description: string;
  icon: string;
  actionHref: string;
  actionLabel: string;
}

// Copy tal cual el mockup "Landing Rediseñada" (26 jul 2026).
export const comoFuncionaSteps: Step[] = [
  {
    number: "01",
    title: "Entiende tu situación",
    description:
      "Un quiz breve para reconocer tu tipo de pérdida y lo que más necesitas hoy. Recibes una recomendación al instante.",
    icon: "/images/icons/como-funciona-paso1-quiz-icono.jpg",
    actionHref: "/#quiz",
    actionLabel: "Pincha aquí →",
  },
  {
    number: "02",
    title: "Aprende de la ciencia",
    description:
      "Contenido sobre alopecia, estrés y bienestar psicológico. Sin promesas vacías, con fuentes verificables.",
    icon: "/images/icons/como-funciona-paso2-ciencia-icono.jpg",
    actionHref: "/#articulos",
    actionLabel: "Pincha aquí →",
  },
  {
    number: "03",
    title: "Sostén el impacto emocional",
    description:
      "Herramientas concretas para bajar la ansiedad y reconciliarte con tu cuerpo, paso a paso.",
    icon: "/images/icons/como-funciona-paso3-emocional-icono.jpg",
    actionHref: "/#planes",
    actionLabel: "Pincha aquí →",
  },
  {
    number: "04",
    title: "Conecta con quienes entienden",
    description:
      "Una comunidad cuidada de personas que viven lo mismo. Tu suscripción sostiene el espacio para que otros también lleguen.",
    icon: "/images/icons/como-funciona-paso4-comunidad-icono.jpg",
    actionHref: "/#comunidad",
    actionLabel: "Pincha aquí →",
  },
];
