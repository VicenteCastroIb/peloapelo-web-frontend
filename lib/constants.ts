// Constantes compartidas entre secciones (ago 2026): antes CALENDLY_URL vivia
// como const local dentro de Fundadora.tsx y se iba a duplicar al agregar un
// segundo CTA en QueEsPeloAPelo.tsx -- se centraliza aca para que el link
// real (cuando la fundacion cree su cuenta de Calendly) se actualice en un
// solo lugar.
//
// TODO (ago 2026): reemplazar por el link real de Calendly cuando la
// fundacion cree su cuenta y su tipo de evento ("Sesion de orientacion" o
// similar). Mientras tanto apunta a Calendly con un placeholder obvio para
// que no se confunda con un link real.
export const CALENDLY_URL = "https://calendly.com/pelo-a-pelo/sesion-con-jessica";
