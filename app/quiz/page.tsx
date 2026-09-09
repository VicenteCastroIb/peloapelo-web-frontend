import type { Metadata } from "next";
import QuizFlow from "@/components/quiz/QuizFlow";

// Ruta PÚBLICA (fuera del grupo (app), que exige sesión) -- misma lógica que
// app/auth/page.tsx: es la puerta de entrada para gente nueva. Los 3 CTA
// "Haz el Quiz" del sitio (Header, Hero, paso 1 de "Cómo funciona") apuntan
// acá.
export const metadata: Metadata = {
  title: "Haz el quiz — Pelo a Pelo",
  description:
    "Una autoevaluación de orientación, en unos 2 minutos, para reconocer qué tipo de alopecia podría explicar tu caída de cabello. No reemplaza a un dermatólogo.",
};

export default function QuizPage() {
  return <QuizFlow />;
}
