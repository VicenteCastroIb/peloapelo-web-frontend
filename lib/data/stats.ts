export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

// Cifras tal cual el mockup "Landing Rediseñada" (Claude Design, ver docs de
// handoff) -- a pedido explicito (26 jul 2026) de implementar el mockup
// literal en vez del set de cifras con fuente academica que se uso antes
// (ver git history de este archivo si se quiere recuperar esa version).
export const stats: Stat[] = [
  { value: 40, suffix: "%", label: "pierde cabello antes de los 50 años" },
  { value: 88, suffix: "%", label: "reporta impacto en su salud mental" },
  { value: 60, suffix: "%", label: "menos angustia con el apoyo adecuado" },
  { value: 147, suffix: "M+", label: "personas conviven con alopecia en el mundo" },
  { value: 70, suffix: "%", label: "tarda más de un año en buscar ayuda" },
];
