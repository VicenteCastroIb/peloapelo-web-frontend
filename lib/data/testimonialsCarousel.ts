export interface HomeTestimonial {
  name: string;
  alopeciaType: string;
  quote: string;
  rating: number; // 1-5
}

// Mock data para <TestimonialsCarousel /> (ver tarea de reestructuracion,
// ago 2026). Distinto de lib/data/testimonials.ts (testimonios mixtos, sin
// uso actual): estas son ficticias a proposito -- todas mujeres, con
// distintos tipos de alopecia, foco en el acompañamiento emocional de la
// fundacion, no en resultados capilares. Reemplazar por historias reales
// (con consentimiento) cuando la fundacion las tenga disponibles.
//
// Rediseno (ago 2026, "carrusel en movimiento continuo"): de 3 testimonios
// a 12, pensado para una cinta en loop (no una tarjeta que se navega a
// mano). Variacion deliberada en:
// - Formato del nombre (solo nombre / nombre y apellido / nombre e inicial
//   de apellido), como se ve en reseñas reales -- no todas firman igual.
// - Rating de 1 a 5 (ver <RatingStars /> en el componente): todos en 5 (ago
//   2026, a pedido -- antes 3 testimonios tenian 4 estrellas). El componente
//   de estrellas sigue soportando el rango completo de 1 a 5.
//
// Textos (ago 2026): parafraseados a mano por el cliente sobre la primera
// version -- se dejan tal cual los entrego, incluidas las tildes sueltas
// que se le escaparon (ej. Fernanda Rojas) y el largo dispar entre
// testimonios (Constanza P. es mucho mas corto que el resto): eso es
// justamente lo que los hace sonar a reseñas reales y no a copy parejo.
export const homeTestimonials: HomeTestimonial[] = [
  {
    name: "Vale",
    alopeciaType: "Alopecia areata universal",
    rating: 5,
    quote:
      "Antes de unirme a Pelo a Pelo, siempre tenía que explicar mi situación cada vez que salía. Ahora encontre un espacio donde no tengo que explicar nada, solo tengo que acompañarme un día a la vez. He recuperado algo que creía que había perdido, mi paz.",
  },
  {
    name: "Cami Reyes",
    alopeciaType: "Alopecia androgenética",
    rating: 5,
    quote:
      "Me costaba admitir que algo tan común como la ansiedad me afectara tanto. Este programa me ayudó a entender que mi ansiedad es válida y a construir hábitos para manejarla, en lugar de esconderla.",
  },
  {
    name: "Antonia",
    alopeciaType: "Efluvio telógeno postparto",
    rating: 5,
    quote:
      "Llegué al grupo muy agotada, con culpa y sin saber si lo que sentía era normal. El acompañamiento psicológico me devolvió la calma antes que cualquier tratamiento, y eso ha cambiado todo para mí.",
  },
  {
    name: "Javiera M.",
    alopeciaType: "Alopecia areata",
    rating: 5,
    quote:
      "Fue algo muy dificil de sobrellevar, pero por primera vez sentí que alguien entendía lo que estaba viviendo. Eso ya es mucho para mí.",
  },
  {
    name: "Francisca Herrera",
    alopeciaType: "Alopecia androgenética",
    rating: 5,
    quote:
      "Llevaba años escondiendo mi pelo bajo gorros y peinados imposibles. Ahora aprendi que no tengo que esconderme para que me tomen en serio. Hoy puedo salir como soy, sin necesidad de pedir permiso.",
  },
  {
    name: "Daniela",
    alopeciaType: "Tricotilomanía",
    rating: 5,
    quote:
      "Nunca había hablado de mi ansiedad con nadie, ni siquiera con mi familia. En el grupo encontré personas que entendían la ansiedad detrás de mis acciones, no solo el resultado. Por primera vez no me sentí juzgada.",
  },
  {
    name: "Constanza P.",
    alopeciaType: "Alopecia areata",
    rating: 5,
    quote: "Muy buenos profesionales, me llevo una gran experiencia.",
  },
  {
    name: "Fernanda Rojas",
    alopeciaType: "Efluvio telógeno",
    rating: 5,
    quote:
      "Perdi mi pelo despues del parto, no lograba entender bien que habia pasado, con ayuda de Jessica se que es una reacción normal del cuerpo, lo tratamos juntas y llevo mis dias de mama mas tranquila.",
  },
  {
    name: "Paulina",
    alopeciaType: "Alopecia androgenética",
    rating: 5,
    quote:
      "Mi autoestima venía en caída hace años. El acompañamiento me ayudó a separar quién soy de cuánto pelo tengo. Suena simple, pero para mí ha sido un cambio de vida.",
  },
  {
    name: "Macarena T.",
    alopeciaType: "Alopecia areata universal",
    rating: 5,
    quote:
      "Los primeros meses fueron muy duros, pero tener un espacio donde nadie me miraba raro me dio fuerzas que no sabía que tenía.",
  },
  {
    name: "Josefina Contreras",
    alopeciaType: "Tricotilomanía",
    rating: 5,
    quote:
      "No busco una cura milagrosa, solo quiero no sentirme sola en esto. Y eso es lo que he encontrado aquí. El resto lo vamos construyendo de a poco.",
  },
  {
    name: "Trinidad",
    alopeciaType: "Efluvio telógeno",
    rating: 5,
    quote:
      "Antes le tenía miedo al espejo. Ahora, gracias al grupo, he aprendido a mirarme de manera diferente. No soy perfecta, pero estoy en paz.",
  },
];
