import Hero from "@/components/sections/Hero";
import IdentityAndSelfEsteem from "@/components/sections/IdentityAndSelfEsteem";
import WhatIsAlopecia from "@/components/sections/WhatIsAlopecia";
import Estadisticas from "@/components/sections/Estadisticas";
import ComoTeSostenemos from "@/components/sections/ComoTeSostenemos";
import ComoFunciona from "@/components/sections/ComoFunciona";
import TestimonialsCarousel from "@/components/sections/TestimonialsCarousel";
import RelatedArticles from "@/components/sections/RelatedArticles";
import Fundadora from "@/components/sections/Fundadora";
import Planes from "@/components/sections/Planes";
import Faq from "@/components/sections/Faq";

// Arquitectura hibrida Multipage + Landing larga (ver tarea de
// reestructuracion, ago 2026): Header y Footer ya son globales (ver
// app/layout.tsx), este archivo solo define el orden EXACTO del home.
//
//   Hero                  -> HeroSection
//   IdentityAndSelfEsteem  -> nueva: que significa perder el pelo
//   WhatIsAlopecia          -> nueva: definicion + tipos, acordeon
//   Estadisticas            -> ImpactData ("La realidad que nadie cuenta")
//   ComoTeSostenemos        -> OurPhilosophy (Calma / Compañia / Consistencia)
//   ComoFunciona             -> HowItWorks (4 pasos)
//   Fundadora                -> "Conoce a tu terapeuta" + CTA de agendar
//   TestimonialsCarousel    -> prueba social, justo despues de Jessica a
//                              proposito (ago 2026, reorden funnel): que se
//                              lean como "esto es lo que logro con ellas"
//   Planes                   -> PricingPlans, el "plan B" si agendar 1 a 1
//                              con Jessica no es una opcion ahora mismo
//   RelatedArticles          -> grid hacia /blog, mock data
//   Faq                      -> incluye el bloque "comunidad" al final
//
// Reorden (ago 2026, "funnel" pedido por la fundacion): antes Fundadora iba
// casi al final (justo antes de Planes); ahora va inmediatamente despues de
// "Como funciona", con Testimonios y Planes seguidos, para que la logica de
// conversion sea: entiendes el metodo -> conoces a quien lo creo -> ves
// prueba social de lo que logro -> eliges como seguir (sesion 1 a 1 con
// Jessica via el CTA de esa seccion, o un plan de la plataforma como
// alternativa). Hero, Identidad, Tipos de alopecia, Estadisticas y Como te
// sostenemos se quedan intactos al inicio -- no forman parte de este
// reorden.
//
// QuienesSomos, Propuesta y EbookGratuito salen del home en este reorden
// (no estan en la estructura exacta pedida) pero NO se borran, ver
// components/sections/: QuienesSomos + QueEsPeloAPelo ahora arman /fundacion
// (ver app/fundacion/page.tsx). Propuesta y EbookGratuito quedan sin uso
// por ahora, disponibles si se decide reincorporarlas.
export default function Home() {
  return (
    <>
      <Hero />
      <IdentityAndSelfEsteem />
      <WhatIsAlopecia />
      <Estadisticas />
      <ComoTeSostenemos />
      <ComoFunciona />
      <Fundadora />
      <TestimonialsCarousel />
      <Planes />
      <RelatedArticles />
      <Faq />
    </>
  );
}
