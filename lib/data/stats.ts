export interface Stat {
  value: number;
  suffix: string;
  label: string;
  icon: "chart" | "brain" | "chat" | "world" | "heart";
  source: string;
  sourceUrl: string;
}

// Cifras actualizadas e investigadas (jul-2026), cada una respaldada por un
// paper real e indexado. Reemplazan los valores de marketing del sitio
// original (docs/scan-22-07-2026), que no tenian fuente verificable.
export const stats: Stat[] = [
  {
    value: 58,
    suffix: "%",
    label: "de los hombres de 30 a 50 años tiene algún grado de alopecia androgenética",
    icon: "chart",
    source: "Int. J. Trichology, 2009",
    sourceUrl: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2938575/",
  },
  {
    value: 47,
    suffix: "%",
    label: "de quienes viven pérdida de cabello cumple criterios de un trastorno de ansiedad",
    icon: "brain",
    source: "Medicine (Baltimore), 2025",
    sourceUrl:
      "https://journals.lww.com/md-journal/fulltext/2025/02070/the_impact,_prevalence,_and_association_of.63.aspx",
  },
  {
    value: 65,
    suffix: "%",
    label: "evita situaciones sociales a causa de su alopecia",
    icon: "chat",
    source: "JMIR Dermatology, 2022",
    sourceUrl: "https://derma.jmir.org/2022/4/e39167",
  },
  {
    value: 170,
    suffix: "M+",
    label: "personas viven con alopecia areata en el mundo",
    icon: "world",
    source: "J. Invest. Dermatol., 2014",
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/24202232/",
  },
  {
    value: 62,
    suffix: "%",
    label: "está en alto riesgo de un trastorno de adaptación tras el diagnóstico",
    icon: "heart",
    source: "JMIR Dermatology, 2022",
    sourceUrl: "https://derma.jmir.org/2022/4/e39167",
  },
];
