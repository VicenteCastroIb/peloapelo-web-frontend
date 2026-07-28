export interface FaqItem {
  question: string;
  answer: string;
}

// Tal cual el mockup "Landing Rediseñada" (26 jul 2026): solo 5 preguntas,
// wording exacto. Las 2 que tenia esta pagina antes (movil, cancelacion) se
// guardan en faqItemsArchived mas abajo -- no se borraron, solo no se
// renderizan (a pedido explicito, mismo criterio que las secciones que el
// mockup no incluye).
export const faqItems: FaqItem[] = [
  {
    question: "¿Es privada mi información?",
    answer:
      "Sí. Tu información personal y médica nunca se comparte sin consentimiento. Puedes participar de la comunidad de forma anónima si lo prefieres.",
  },
  {
    question: "¿Cuánto cuesta? ¿Hay prueba gratis?",
    answer:
      "Plan 3 Meses: $92.000 CLP. Plan Mensual: $35.990 CLP. Tienes 3 días de prueba gratis, sin tarjeta de crédito.",
  },
  {
    question: "¿Qué tipos de alopecia cubre?",
    answer:
      "Alopecia areata, androgenética, efluvio telógeno, tricotilomanía, alopecia por estrés y otras formas de caída capilar.",
  },
  {
    question: "¿Hay profesionales disponibles?",
    answer:
      "El contenido está respaldado por psicólogos y bibliografía médica. Puedes agendar sesión con la fundadora, Jessica Lagno, desde la página de sesiones.",
  },
  {
    question: "¿Cuándo veo resultados?",
    answer:
      "La educación y la contención emocional se sienten desde las primeras semanas. Los cambios en la caída capilar toman más tiempo — por eso el Plan 3 Meses es el más recomendado.",
  },
  {
    question: "¿Funciona en el móvil?",
    answer: "Sí, la plataforma está 100% optimizada para iOS y Android. Accede desde cualquier lugar.",
  },
];

// No renderizadas actualmente (ver arriba). Conservadas por si se decide
// reincorporarlas.
export const faqItemsArchived: FaqItem[] = [
  {
    question: "¿Puedo cancelar cuando quiera?",
    answer:
      "Sí. El plan mensual se cancela en cualquier momento. Además, ofrecemos garantía de 14 días en el Plan 3 Meses.",
  },
];
