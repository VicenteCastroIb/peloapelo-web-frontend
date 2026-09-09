import type { AlopeciaTypeCode } from "@/lib/data/alopeciaTypes";

// Preguntas del quiz inicial de autoevaluacion (/quiz). El puntaje por opcion
// codifica los diferenciadores clinicos verificados contra StatPearls/NCBI,
// DermNet NZ, NAAF y Medscape (ver el prompt de esta tarea y las referencias
// medicas de components/articles/MitosComunesAlopecia.tsx). El calculo del
// resultado a partir de las respuestas vive aparte, en lib/quiz/scoring.ts,
// como funcion pura y testeable.
//
// IMPORTANTE: esto NO es una herramienta de diagnostico. Es orientacion.
// Toda la UI que consume estas preguntas debe mostrar el disclaimer de que
// no reemplaza a un dermatologo.

export type QuizScoreDelta = Partial<Record<AlopeciaTypeCode, number>>;

export interface QuizOption {
  /** Estable -- viaja al backend en `answers` y no debe cambiar aunque se
   *  reordene o reescriba el label. */
  id: string;
  label: string;
  scores: QuizScoreDelta;
  /** Frase en primera persona del plural para reflejarle a la persona sus
   *  propias respuestas en la pantalla de resultado ("...nos dijiste que
   *  {echo}"). Las opciones tipo "no sé" no aportan echo. */
  echo?: string;
}

export interface QuizQuestion {
  id: number;
  prompt: string;
  /** "¿Por qué te preguntamos esto?" -- se muestra plegado, disponible a
   *  demanda, para no recargar cada pantalla. */
  helpNote?: string;
  options: QuizOption[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    prompt: "¿Cómo describirías el inicio de tu caída de cabello?",
    helpNote:
      "El ritmo de aparición es una de las pistas más importantes: lo súbito, lo gradual y lo que aparece después de un evento puntual apuntan a causas distintas.",
    options: [
      {
        id: "q1_sudden",
        label: "Fue de un día para otro, muy rápido",
        scores: { AREATA: 2 },
        echo: "la caída empezó de un día para otro",
      },
      {
        id: "q1_gradual",
        label: "Fue lenta y progresiva, por meses o años",
        scores: { ANDROGENETICA: 3 },
        echo: "la caída ha sido lenta y progresiva",
      },
      {
        id: "q1_trigger",
        label:
          "Empezó entre 1 y 6 meses después de algo puntual (una enfermedad, un parto, una cirugía, un momento de mucho estrés, una dieta estricta)",
        scores: { EFLUVIO_TELOGENO: 3 },
        echo: "empezó unos meses después de un evento puntual",
      },
      {
        id: "q1_unsure",
        label: "No sabría decir, es difícil de precisar",
        scores: {},
      },
    ],
  },
  {
    id: 2,
    prompt: "¿Cómo se ve la zona donde se te cae el pelo?",
    helpNote:
      "La forma de la zona afectada —parches marcados, adelgazamiento parejo o bordes irregulares— ayuda a diferenciar un tipo de otro.",
    options: [
      {
        id: "q2_patches",
        label: "Uno o más parches redondos u ovalados, bien marcados",
        scores: { AREATA: 3 },
        echo: "aparece en parches redondos y bien definidos",
      },
      {
        id: "q2_diffuse",
        label: "Todo el pelo se ve más ralo, de forma pareja",
        scores: { EFLUVIO_TELOGENO: 2 },
        echo: "el pelo se ve más ralo de forma pareja en toda la cabeza",
      },
      {
        id: "q2_pattern",
        label: "Entradas o la coronilla más despejada; la raya se ve más ancha",
        scores: { ANDROGENETICA: 3 },
        echo: "se nota sobre todo en las entradas o la coronilla, con la raya más ancha",
      },
      {
        id: "q2_irregular",
        label: "Zonas irregulares, con pelos de largos muy distintos, como cortados disparejo",
        scores: { TRICOTILOMANIA: 3 },
        echo: "las zonas son irregulares, con pelos de largos muy distintos",
      },
    ],
  },
  {
    id: 3,
    prompt:
      "¿Alguna vez te has sorprendido tirando, jalando o retorciendo tu propio pelo, aunque sea sin darte mucha cuenta?",
    helpNote:
      "Preguntar esto no es un juicio. Tirarse el pelo de forma repetida (tricotilomanía) es una condición frecuente y tratable, y cambia por completo la orientación.",
    options: [
      {
        id: "q3_often",
        label: "Sí, seguido, y me cuesta parar aunque quiera",
        scores: { TRICOTILOMANIA: 4 },
        echo: "te has sorprendido tirándote el pelo y te cuesta parar aunque quieras",
      },
      {
        id: "q3_sometimes",
        label: "A veces, cuando estoy con ansiedad o muy estresada",
        scores: { TRICOTILOMANIA: 2 },
        echo: "a veces te tiras el pelo cuando estás con ansiedad o estrés",
      },
      {
        id: "q3_never",
        label: "No, nunca",
        scores: {},
      },
    ],
  },
  {
    id: 4,
    prompt: "¿Hay antecedentes de calvicie en tu familia directa (papá, mamá, abuelos)?",
    helpNote: "La alopecia androgenética tiene un componente hereditario fuerte.",
    options: [
      {
        id: "q4_yes",
        label: "Sí",
        scores: { ANDROGENETICA: 2 },
        echo: "hay antecedentes de calvicie en tu familia directa",
      },
      {
        id: "q4_no",
        label: "No, o no lo sé",
        scores: {},
      },
    ],
  },
  {
    id: 5,
    prompt:
      "¿Tú o alguien de tu familia tiene alguna enfermedad autoinmune (tiroides, vitíligo, lupus, psoriasis)?",
    helpNote:
      "La alopecia areata se asocia con enfermedades autoinmunes propias o de familiares directos.",
    options: [
      {
        id: "q5_yes",
        label: "Sí",
        scores: { AREATA: 2 },
        echo: "hay enfermedades autoinmunes en tu historia personal o familiar",
      },
      {
        id: "q5_no",
        label: "No, o no lo sé",
        scores: {},
      },
    ],
  },
  {
    id: 6,
    prompt:
      "En los últimos 6 meses, ¿pasaste por alguno de estos? Un parto, una cirugía, una enfermedad con fiebre alta, una dieta muy estricta, un cambio de medicamentos o un período de mucho estrés.",
    helpNote:
      "El efluvio telógeno suele aparecer 1 a 6 meses después de un evento físico o emocional intenso, y es reversible una vez que ese evento pasa.",
    options: [
      {
        id: "q6_yes",
        label: "Sí",
        scores: { EFLUVIO_TELOGENO: 3 },
        echo: "en los últimos meses pasaste por un evento físico o emocional fuerte",
      },
      {
        id: "q6_no",
        label: "No",
        scores: {},
      },
    ],
  },
  {
    id: 7,
    prompt: "¿Notas cambios en tus uñas (hoyitos, líneas o manchas blancas)?",
    helpNote:
      "Los cambios en las uñas acompañan a la alopecia areata en un 10 a 30% de los casos.",
    options: [
      {
        id: "q7_yes",
        label: "Sí",
        scores: { AREATA: 2 },
        echo: "notas cambios en tus uñas",
      },
      {
        id: "q7_no",
        label: "No",
        scores: {},
      },
    ],
  },
  {
    id: 8,
    prompt: "Cuando se te cae el pelo, ¿cómo lo notas más?",
    options: [
      {
        id: "q8_handfuls",
        label: "En mechones grandes al peinarme o lavarme el pelo",
        scores: { EFLUVIO_TELOGENO: 2 },
        echo: "lo notas en mechones grandes al peinarte o lavarte",
      },
      {
        id: "q8_slow",
        label: "Es tan lento que casi no lo noto día a día",
        scores: { ANDROGENETICA: 2 },
        echo: "la pérdida es tan gradual que casi no la notas día a día",
      },
      {
        id: "q8_patches",
        label: "Aparecen parches de un momento a otro",
        scores: { AREATA: 1 },
        echo: "aparecen parches de un momento a otro",
      },
    ],
  },
  {
    id: 9,
    prompt: "¿También se te cae el pelo en cejas, pestañas o el cuerpo?",
    options: [
      {
        id: "q9_yes_pulling",
        label: "Sí, y también me las arranco o juego con ellas",
        scores: { TRICOTILOMANIA: 2 },
        echo: "también te sacas o juegas con el pelo de cejas o pestañas",
      },
      {
        id: "q9_yes_no_pulling",
        label: "Sí, pero no me las arranco",
        scores: { AREATA: 2 },
        echo: "la caída también llega a cejas, pestañas o el cuerpo",
      },
      {
        id: "q9_no",
        label: "No",
        scores: {},
      },
    ],
  },
  {
    id: 10,
    prompt:
      "¿Sientes picazón, ardor u hormigueo en el cuero cabelludo antes o durante la caída?",
    options: [
      {
        id: "q10_yes",
        label: "Sí",
        scores: { AREATA: 1 },
        echo: "sientes picazón, ardor u hormigueo en el cuero cabelludo",
      },
      {
        id: "q10_no",
        label: "No",
        scores: {},
      },
    ],
  },
];

export const QUIZ_LENGTH = QUIZ_QUESTIONS.length;

export function findQuestion(id: number): QuizQuestion | undefined {
  return QUIZ_QUESTIONS.find((q) => q.id === id);
}

export function findOption(questionId: number, optionId: string): QuizOption | undefined {
  return findQuestion(questionId)?.options.find((o) => o.id === optionId);
}
