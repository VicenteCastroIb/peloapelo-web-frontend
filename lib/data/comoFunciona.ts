export interface Step {
  number: string;
  title: string;
  description: string;
}

export const comoFuncionaSteps: Step[] = [
  {
    number: "01",
    title: "Entiende tu situación",
    description:
      "Un quiz breve para reconocer tu tipo de pérdida, el impacto emocional y lo que más necesitas. Recibes una recomendación al instante.",
  },
  {
    number: "02",
    title: "Aprende la ciencia",
    description:
      "Contenido sobre alopecia, neurociencia del estrés y psicología del bienestar. Sin promesas vacías, con fuentes verificables.",
  },
  {
    number: "03",
    title: "Sostén el impacto emocional",
    description:
      "Herramientas concretas: mindfulness, respiración, autocompasión. Hábitos para bajar cortisol y reconciliarte con tu cuerpo.",
  },
  {
    number: "04",
    title: "Conecta con quienes entienden",
    description:
      "Una comunidad cuidada de personas que viven lo mismo. Tu suscripción sostiene el espacio para que otros también lleguen.",
  },
];
