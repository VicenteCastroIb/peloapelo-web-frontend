export interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: "chart" | "brain" | "chat" | "world" | "heart";
  source: string;
  sourceUrl: string;
}

// Cifras actualizadas e investigadas (jul-2026), cada una respaldada por un
// paper real e indexado. Enfocadas en mujeres (publico principal de la
// fundacion): prevalencia, riesgo de por vida, autoestima, evitacion social
// y riesgo de trastorno de adaptacion. Reemplazan los valores de marketing
// del sitio original (docs/scan-22-07-2026), que no tenian fuente
// verificable.
export const stats: Stat[] = [
  {
    value: 25,
    suffix: "%",
    label: "de las mujeres presenta algún grado de alopecia androgenética a los 50 años",
    icon: "chart",
    source: "Int. J. Women's Dermatol., 2018",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/30627618/",
  },
  {
    value: 32,
    suffix: "%",
    label: "de las mujeres desarrollará alopecia areata en algún momento de su vida, casi el doble que los hombres",
    icon: "world",
    source: "Biology of Sex Differences, 2025",
    sourceUrl: "https://link.springer.com/article/10.1186/s13293-025-00749-w",
  },
  {
    value: 75,
    suffix: "%",
    label: "de las mujeres con alopecia androgenética ve afectada negativamente su autoestima",
    icon: "heart",
    source: "Soc. Sci. Med., 1994",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/8146707/",
  },
  {
    value: 65,
    suffix: "%",
    label: "de las mujeres con alopecia areata evita situaciones sociales a causa de su condición",
    icon: "chat",
    source: "JMIR Dermatology, 2022",
    sourceUrl: "https://derma.jmir.org/2022/4/e39167",
  },
  {
    value: 62,
    suffix: "%",
    label: "de las mujeres con alopecia areata está en alto riesgo de un trastorno de adaptación",
    icon: "brain",
    source: "JMIR Dermatology, 2022",
    sourceUrl: "https://derma.jmir.org/2022/4/e39167",
  },
];
