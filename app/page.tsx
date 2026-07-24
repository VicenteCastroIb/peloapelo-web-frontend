import Hero from "@/components/sections/Hero";
import QueEsPeloAPelo from "@/components/sections/QueEsPeloAPelo";
import Manifiesto from "@/components/sections/Manifiesto";
import Fundadora from "@/components/sections/Fundadora";
import Estadisticas from "@/components/sections/Estadisticas";
import ComoFunciona from "@/components/sections/ComoFunciona";
import PainPoints from "@/components/sections/PainPoints";
import Beneficios from "@/components/sections/Beneficios";
import Propuesta from "@/components/sections/Propuesta";
import Planes from "@/components/sections/Planes";
import EbookGratuito from "@/components/sections/EbookGratuito";
import Testimonios from "@/components/sections/Testimonios";
import Faq from "@/components/sections/Faq";

// Orden agrupado segun la guia de la fundadora (docs/Pelo a pelo.docx):
// no es 1:1 con el scan original — se reestructuro a pedido explicito.
//
//   Quienes somos:     Hero, QueEsPeloAPelo, Manifiesto, Fundadora
//   Como funciona:     Estadisticas, ComoFunciona, PainPoints, Beneficios,
//                       Propuesta, Planes (gratis primero, tto despues)
//   Articulos/Informate: EbookGratuito
//   Testimonios:       Testimonios
//   Preguntas frecuentes: Faq
//
// QueEsPeloAPelo agregada despues del Hero por pedido explicito (no forma
// parte del scan original). La frase de QuoteDestacada se movio dentro de
// "Que es Pelo a Pelo" (vineta bajo el texto) para no repetirla. QuePelo se
// elimino: duplicaba casi 1:1 su contenido; su grid de 3 pilares
// (Emocional/Fisico/Mental) se fusiono dentro de QueEsPeloAPelo.
//
// El "Cierre CTA" vive dentro de Footer.tsx porque en el diseño real es un
// bloque visualmente continuo con el footer (mismo fondo oscuro, sin corte).
// No reordenar sin aprobación.
export default function Home() {
  return (
    <>
      <Hero />
      <QueEsPeloAPelo />
      <Manifiesto />
      <Fundadora />
      <Estadisticas />
      <ComoFunciona />
      <PainPoints />
      <Beneficios />
      <Propuesta />
      <Planes />
      <EbookGratuito />
      <Testimonios />
      <Faq />
    </>
  );
}
