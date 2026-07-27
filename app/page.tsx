import Hero from "@/components/sections/Hero";
import QuienesSomos from "@/components/sections/QuienesSomos";
import ComoTeSostenemos from "@/components/sections/ComoTeSostenemos";
import Estadisticas from "@/components/sections/Estadisticas";
import Propuesta from "@/components/sections/Propuesta";
import ComoFunciona from "@/components/sections/ComoFunciona";
import Planes from "@/components/sections/Planes";
import Fundadora from "@/components/sections/Fundadora";
import EbookGratuito from "@/components/sections/EbookGratuito";
import Faq from "@/components/sections/Faq";

// Implementacion 1:1 del mockup "Pelo a Pelo - Landing Rediseñada" (Claude
// Design, ver docs de handoff). A pedido explicito (26 jul 2026): el home
// ya NO mezcla el mockup con el sitio anterior -- solo se renderizan las
// secciones que el mockup define, en el mismo orden.
//
// Las secciones del sitio anterior que el mockup no incluye (Manifiesto,
// PainPoints, Beneficios, Testimonios, QueEsPeloAPelo) se sacaron de este
// archivo pero sus componentes NO se borraron (siguen en
// components/sections/, ver ese folder) por si se decide reincorporarlas
// mas adelante.
//
//   Hero
//   QuienesSomos       -> bloque solo-texto
//   ComoTeSostenemos   -> Calma / Compañia / Consistencia
//   Estadisticas       -> "La realidad que nadie cuenta"
//   Propuesta          -> "Como te acompañamos" (prosa, ver Propuesta.tsx)
//   ComoFunciona       -> 4 pasos con icono + link de accion
//   Planes
//   Fundadora
//   EbookGratuito
//   Faq                -> incluye el bloque "comunidad" al final
//
// El "Cierre CTA" vive dentro de Footer.tsx (bloque visualmente continuo
// con el footer). No reordenar sin aprobacion.
export default function Home() {
  return (
    <>
      <Hero />
      <QuienesSomos />
      <ComoTeSostenemos />
      <Estadisticas />
      <Propuesta />
      <ComoFunciona />
      <Planes />
      <Fundadora />
      <EbookGratuito />
      <Faq />
    </>
  );
}
