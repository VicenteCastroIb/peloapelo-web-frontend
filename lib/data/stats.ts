export interface Stat {
  value: number;
  suffix: string;
  label: string;
  // "featured": el dato ancla de la seccion, tarjeta grande con el degrade
  // de marca (ver Estadisticas.tsx). "highlight": el dato "esperanzador"
  // entre los demas (que son "el problema"), tarjeta con tinte propio para
  // que se lea como la nota distinta -- ver feedback de diseno, ago 2026.
  variant?: "featured" | "highlight";
}

// Cifras tal cual el mockup "Landing Rediseñada" (Claude Design, ver docs de
// handoff) -- a pedido explicito (26 jul 2026) de implementar el mockup
// literal en vez del set de cifras con fuente academica que se uso antes
// (ver git history de este archivo si se quiere recuperar esa version).
//
// Orden reordenado (ago 2026, rediseno bento): el featured va primero (la
// tarjeta grande ocupa el bloque izquierdo del grid), despues los 3 datos
// "problema" y al final el "highlight" -- asi el highlight cae en la ultima
// celda (abajo a la derecha), como cierre esperanzador de la secuencia.
export const stats: Stat[] = [
  { value: 88, suffix: "%", label: "reporta impacto en su salud mental", variant: "featured" },
  { value: 40, suffix: "%", label: "pierde cabello antes de los 50 años" },
  { value: 147, suffix: "M+", label: "personas conviven con alopecia en el mundo" },
  { value: 70, suffix: "%", label: "tarda más de un año en buscar ayuda" },
  { value: 60, suffix: "%", label: "menos angustia con el apoyo adecuado", variant: "highlight" },
];
