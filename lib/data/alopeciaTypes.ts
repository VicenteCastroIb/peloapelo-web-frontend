// Fuente unica de verdad de los 4 tipos de alopecia que cubre la fundacion.
// Antes este contenido vivia hardcodeado solo dentro de
// components/sections/WhatIsAlopecia.tsx; ahora esa seccion, el resultado del
// quiz (/quiz) y el badge de /profile leen todos de aca para no duplicar
// texto ni que se desincronicen.

export type AlopeciaTypeCode =
  | "AREATA"
  | "ANDROGENETICA"
  | "EFLUVIO_TELOGENO"
  | "TRICOTILOMANIA";

export const ALL_ALOPECIA_CODES: AlopeciaTypeCode[] = [
  "AREATA",
  "ANDROGENETICA",
  "EFLUVIO_TELOGENO",
  "TRICOTILOMANIA",
];

export interface AlopeciaSource {
  /** Cita corta, estilo referencia bibliografica. */
  label: string;
  url: string;
}

export interface AlopeciaType {
  code: AlopeciaTypeCode;
  /** Nombre para mostrar -- tambien el que se usa como badge en /profile. */
  name: string;
  /** Etiqueta corta de una palabra o frase (autoinmune, reversible, etc.). */
  tag: string;
  /** Descripcion de 1 parrafo, reusada tal cual en WhatIsAlopecia y en el
   *  resultado del quiz. */
  description: string;
  /** Foto editorial por tipo (public/images/alopecia-types/). */
  image: string;
  /** Mismo patron que STEP_GRADIENTS/PLAN_GRADIENTS: base blanca + tinte de
   *  marca muy sutil, uno distinto por tipo. */
  tintGradient: string;
  /** Una fuente medica citable para la pantalla de resultado del quiz.
   *  Verificada contra StatPearls/NCBI y Medscape. */
  source: AlopeciaSource;
}

export const ALOPECIA_TYPES: AlopeciaType[] = [
  {
    code: "AREATA",
    tag: "Autoinmune",
    name: "Alopecia areata",
    description:
      "El sistema inmune ataca por error los folículos capilares, provocando parches de pérdida repentina. Puede afectar el cuero cabelludo, cejas, pestañas o todo el cuerpo (areata universal). No es contagiosa ni está causada por algo que hayas hecho.",
    image: "/images/alopecia-types/areata.jpg",
    tintGradient: "linear-gradient(160deg,#ffffff,rgba(239,67,67,0.06))",
    source: {
      label: "StatPearls — Alopecia Areata. NCBI Bookshelf.",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK537000/",
    },
  },
  {
    code: "ANDROGENETICA",
    tag: "La más común",
    name: "Alopecia androgenética",
    description:
      "La más común. Determinada genéticamente y ligada a hormonas, se presenta como un adelgazamiento progresivo y gradual del cabello, con un patrón distinto entre hombres y mujeres.",
    image: "/images/alopecia-types/androgenetica.jpg",
    tintGradient: "linear-gradient(160deg,#ffffff,rgba(143,124,182,0.12))",
    source: {
      label: "StatPearls — Androgenetic Alopecia. NCBI Bookshelf.",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK430924/",
    },
  },
  {
    code: "EFLUVIO_TELOGENO",
    tag: "Reversible",
    name: "Efluvio telógeno",
    description:
      "Una caída generalizada y temporal, gatillada por estrés físico o emocional intenso, cambios hormonales, o eventos como un parto o una enfermedad. Suele revertir con el tiempo y el cuidado adecuado.",
    image: "/images/alopecia-types/efluvio-telogeno.jpg",
    tintGradient: "linear-gradient(160deg,#ffffff,rgba(137,207,235,0.16))",
    source: {
      label: "StatPearls — Telogen Effluvium. NCBI Bookshelf.",
      url: "https://www.ncbi.nlm.nih.gov/books/NBK430848/",
    },
  },
  {
    code: "TRICOTILOMANIA",
    tag: "Relacionada a la ansiedad",
    name: "Tricotilomanía",
    description:
      "Un trastorno relacionado a la ansiedad que lleva a arrancarse el propio cabello, muchas veces sin plena conciencia del acto. Requiere abordaje psicológico junto con el físico.",
    image: "/images/alopecia-types/tricotilomania.jpg",
    tintGradient: "linear-gradient(160deg,#ffffff,rgba(96,73,141,0.10))",
    source: {
      label: "Medscape — Trichotillomania (Hair-Pulling Disorder).",
      url: "https://emedicine.medscape.com/article/1071854-overview",
    },
  },
];

const BY_CODE: Record<AlopeciaTypeCode, AlopeciaType> = ALOPECIA_TYPES.reduce(
  (acc, type) => {
    acc[type.code] = type;
    return acc;
  },
  {} as Record<AlopeciaTypeCode, AlopeciaType>,
);

export function alopeciaTypeByCode(code: AlopeciaTypeCode): AlopeciaType {
  return BY_CODE[code];
}
