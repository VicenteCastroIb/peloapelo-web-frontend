export interface Step {
  number: string;
  title: string;
  description: string;
  icon: string;
  actionHref: string;
  actionLabel: string;
}

// Copy tal cual el mockup "Landing Rediseñada" (26 jul 2026).
// actionHref de los pasos 1 y 2 corregidos (27 jul 2026, auditoria de
// links): apuntaban a anclas #quiz y #articulos que no existen en ninguna
// seccion del home. Paso 1 -> /auth (ahi vive el quiz real, mismo destino
// que el CTA "Haz el quiz gratuito" del Hero).
// Paso 2 actualizado de nuevo (ver tarea de reestructuracion, ago 2026):
// apuntaba a #ebook, seccion que salio del home en el reorden -- el ebook
// gratuito ahora vive en /blog (ver app/blog/page.tsx), que tambien es el
// destino natural de "aprende de la ciencia".
export const comoFuncionaSteps: Step[] = [
  {
    number: "01",
    title: "Entiende tu situación",
    description:
      "Un quiz breve para reconocer tu tipo de pérdida, el impacto emocional y lo que más necesitas. Recibes una recomendación al instante.",
    icon: "/images/icons/como-funciona-paso1-quiz-icono.jpg",
    actionHref: "/auth",
    actionLabel: "Pincha aquí →",
  },
  {
    number: "02",
    title: "Aprende de la ciencia",
    description:
      "Contenido sobre alopecia, neurociencia del estrés y psicología del bienestar. Sin promesas vacías, con fuentes verificables.",
    icon: "/images/icons/como-funciona-paso2-ciencia-icono.jpg",
    actionHref: "/blog",
    actionLabel: "Pincha aquí →",
  },
  {
    number: "03",
    title: "Sostén el impacto emocional",
    description:
      "Herramientas concretas: mindfulness, respiración, autocompasión. Hábitos para bajar cortisol y reconciliarte con tu cuerpo.",
    // Pendiente de reemplazo (ago 2026, feedback de diseno): el icono actual
    // se lee como pulmones/anatomia, muy clinico para un sitio de salud.
    // Prompt de reemplazo sugerido -- ver conversacion de esta tarea.
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
