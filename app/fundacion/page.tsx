import type { Metadata } from "next";
import QuienesSomos from "@/components/sections/QuienesSomos";
import QueEsPeloAPelo from "@/components/sections/QueEsPeloAPelo";

// Pagina nueva "Quienes Somos / Transparencia" (ver tarea de
// reestructuracion, ago 2026). Reutiliza integramente dos secciones que
// existian en el codebase pero habian quedado sin uso (ver comentarios en
// app/page.tsx de este mismo cambio): QuienesSomos (intro institucional) +
// QueEsPeloAPelo (mision, pilares, por que existimos). Ningun texto nuevo
// aca -- la historia personal de Jessica Lagno completa vive en el home
// (ver Fundadora.tsx), esta pagina no la duplica.
export const metadata: Metadata = {
  title: "Quiénes somos · Pelo a Pelo",
  description:
    "Fundación chilena sin fines de lucro. Conoce nuestra misión, nuestros pilares y por qué existimos.",
};

export default function FundacionPage() {
  return (
    <>
      <QuienesSomos />
      <QueEsPeloAPelo />
    </>
  );
}
