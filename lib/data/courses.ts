export interface Course {
  id: string;
  level: "Básico" | "Intermedio";
  title: string;
  description: string;
  durationMinutes: number;
  lessons: number;
}

// Copiado del sitio real (ver docs/scan-22-07-2026/02-dashboard-interno.md).
// Las tarjetas no llevan a un detalle de lección todavia: el sitio real
// tampoco lo tiene construido, asi que se replica ese mismo estado.
export const courses: Course[] = [
  {
    id: "ansiedad-y-pelo",
    level: "Básico",
    title: "Ansiedad y Pelo",
    description: "Entiende la conexión entre tu mente y tu cabello",
    durationMinutes: 45,
    lessons: 5,
  },
  {
    id: "cuerpo-y-pelo",
    level: "Básico",
    title: "Cuerpo y Pelo",
    description: "Tu cuerpo habla, aprende a escucharlo",
    durationMinutes: 50,
    lessons: 5,
  },
  {
    id: "proyecto-crecimiento",
    level: "Intermedio",
    title: "Proyecto Crecimiento",
    description: "¿Qué es y cómo empezar?",
    durationMinutes: 55,
    lessons: 5,
  },
];
