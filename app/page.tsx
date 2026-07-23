import Hero from "@/components/sections/Hero";
import QuoteDestacada from "@/components/sections/QuoteDestacada";
import Manifiesto from "@/components/sections/Manifiesto";
import ComoFunciona from "@/components/sections/ComoFunciona";
import Estadisticas from "@/components/sections/Estadisticas";
import QuePelo from "@/components/sections/QuePelo";
import Fundadora from "@/components/sections/Fundadora";
import EbookGratuito from "@/components/sections/EbookGratuito";
import PainPoints from "@/components/sections/PainPoints";
import Beneficios from "@/components/sections/Beneficios";
import Propuesta from "@/components/sections/Propuesta";
import Planes from "@/components/sections/Planes";
import Testimonios from "@/components/sections/Testimonios";
import Faq from "@/components/sections/Faq";

// Orden 1:1 con el sitio original (17 secciones incluyendo Header/Footer).
// El "Cierre CTA" vive dentro de Footer.tsx porque en el diseño real es un
// bloque visualmente continuo con el footer (mismo fondo oscuro, sin corte).
// No reordenar sin aprobación — ver docs/scan-22-07-2026.
export default function Home() {
  return (
    <>
      <Hero />
      <QuoteDestacada />
      <Manifiesto />
      <ComoFunciona />
      <Estadisticas />
      <QuePelo />
      <Fundadora />
      <EbookGratuito />
      <PainPoints />
      <Beneficios />
      <Propuesta />
      <Planes />
      <Testimonios />
      <Faq />
    </>
  );
}
