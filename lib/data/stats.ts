export interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: "chart" | "globe" | "chat" | "world" | "clock";
}

// Valores reales confirmados en el DOM de peloapelo.cl (docs/scan-22-07-2026)
export const stats: Stat[] = [
  { value: 40, suffix: "%", label: "pierde cabello antes de los 50", icon: "chart" },
  { value: 88, suffix: "%", label: "reporta impacto en salud mental", icon: "globe" },
  { value: 60, suffix: "%", label: "menos angustia con apoyo adecuado", icon: "chat" },
  { value: 147, suffix: "M+", label: "personas con alopecia en el mundo", icon: "world" },
  { value: 70, suffix: "%", label: "tarda +1 año en buscar ayuda", icon: "clock" },
];
