export interface Testimonial {
  quote: string;
  name: string;
  caption: string;
}

// NOTA: patron narrativo muy simetrico entre los 4 (cada uno valida un pilar de
// marketing distinto) - confirmar con la fundacion si son reales antes de mantener
// el sello "verificado/a" en produccion. Ver docs/scan-22-07-2026, seccion 13.
export const testimonials: Testimonial[] = [
  {
    quote: "Finalmente algo que entiende que esto afecta mi salud mental, no solo mi aspecto físico.",
    name: "María",
    caption: "USUARIA VERIFICADA · ALOPECIA AREATA",
  },
  {
    quote: "El acompañamiento me ayudó a entender por qué el estrés empeoraba mi caída de cabello. Cambió mi perspectiva.",
    name: "Carlos",
    caption: "USUARIO VERIFICADO · ANDROGENÉTICA",
  },
  {
    quote: "No me siento solo en esto. La comunidad es real, genuina, sin drama. Exactamente lo que necesitaba.",
    name: "Alex",
    caption: "USUARIO VERIFICADO · TRICOTILOMANÍA",
  },
  {
    quote: "La neurociencia detrás del estrés y el cabello finalmente tiene sentido. Me siento empoderada.",
    name: "Sofía",
    caption: "USUARIA VERIFICADA · EFLUVIO TELÓGENO",
  },
];
