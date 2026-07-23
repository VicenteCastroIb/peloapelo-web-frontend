export interface FaqItem {
  question: string;
  answer: string;
}

export const faqItems: FaqItem[] = [
  {
    question: "¿Es privada mi información?",
    answer:
      "Sí. Tu información personal y médica nunca se comparte sin consentimiento. Puedes participar de la comunidad de forma anónima si lo prefieres.",
  },
  {
    question: "¿Cuánto cuesta? ¿Hay prueba gratis?",
    answer:
      "Plan 3 Meses: $92.000 CLP (recomendado). Plan Mensual: $35.990 CLP (flexible). Tienes 3 días de prueba gratis sin tarjeta de crédito.",
  },
  {
    question: "¿Qué tipos de alopecia cubre?",
    answer:
      "Alopecia Areata, Androgenética, Efluvio Telógeno, Tricotilomanía, Alopecia por estrés y otras formas de caída capilar.",
  },
  {
    question: "¿Hay profesionales médicos disponibles?",
    answer:
      "El contenido está respaldado por psicólogos, neurociencia y bibliografía médica. Puedes agendar sesión con terapeuta. No reemplaza una consulta médica, pero te prepara para ella.",
  },
  {
    question: "¿Funciona en el móvil?",
    answer: "Sí, la plataforma está 100% optimizada para iOS y Android. Accede desde cualquier lugar.",
  },
  {
    question: "¿Cuándo veo resultados?",
    answer:
      "Educación: inmediata. Apoyo emocional: 1-2 semanas. Cambios visibles en la caída capilar: 2-3 meses dependiendo del tipo. Por eso el Plan 3 Meses es el ideal.",
  },
  {
    question: "¿Puedo cancelar cuando quiera?",
    answer:
      "Sí. El plan mensual se cancela en cualquier momento. Además, ofrecemos garantía de 14 días en el Plan 3 Meses.",
  },
];
