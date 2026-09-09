import { ALL_ALOPECIA_CODES, type AlopeciaTypeCode } from "@/lib/data/alopeciaTypes";
import { findOption } from "./questions";

// Calculo del resultado del quiz a partir de las respuestas. Funcion PURA y
// testeable: no toca React, no lee estado global, no hace fetch -- se le
// pasan las respuestas y devuelve un resultado, de forma determinista. La UI
// (components/quiz/) y cualquier test la consumen igual.

export interface QuizAnswer {
  questionId: number;
  optionId: string;
}

export type QuizScores = Record<AlopeciaTypeCode, number>;

export type QuizResultStatus = "CONCLUSIVE" | "INCONCLUSIVE";

export interface QuizResult {
  status: QuizResultStatus;
  /** El tipo mas probable. `null` cuando el resultado no es concluyente
   *  (empate arriba, o puntaje total demasiado bajo) -- en ese caso NO se
   *  fuerza una categoria. */
  primaryType: AlopeciaTypeCode | null;
  scores: QuizScores;
  /** Los 1-2 tipos mas cercanos, de mayor a menor puntaje. Con un resultado
   *  concluyente es exactamente [primaryType]; con uno no concluyente son
   *  los candidatos que quedaron arriba (para poder decir "lo más cercano
   *  fue..." sin comprometerse). Vacio si nadie sumo puntos. */
  topTypes: AlopeciaTypeCode[];
  totalPoints: number;
}

// Umbral de "respondio 'no sé' a casi todo": con 2 puntos o menos repartidos
// en total, no hay senal suficiente para orientar y el resultado se marca
// como no concluyente.
const LOW_CONFIDENCE_TOTAL = 2;

function emptyScores(): QuizScores {
  return { AREATA: 0, ANDROGENETICA: 0, EFLUVIO_TELOGENO: 0, TRICOTILOMANIA: 0 };
}

export function calcularResultadoQuiz(respuestas: QuizAnswer[]): QuizResult {
  const scores = emptyScores();

  for (const answer of respuestas) {
    const option = findOption(answer.questionId, answer.optionId);
    if (!option) continue;
    for (const code of ALL_ALOPECIA_CODES) {
      scores[code] += option.scores[code] ?? 0;
    }
  }

  const totalPoints = ALL_ALOPECIA_CODES.reduce((sum, code) => sum + scores[code], 0);

  // Orden estable: Array.prototype.sort es estable y ALL_ALOPECIA_CODES se
  // copia antes de ordenar, asi que a igualdad de puntaje se conserva el
  // orden de declaracion -- el resultado es determinista, sin desempates al
  // azar.
  const ranked = [...ALL_ALOPECIA_CODES].sort((a, b) => scores[b] - scores[a]);
  const topScore = scores[ranked[0]];
  const runnerUpScore = scores[ranked[1]];
  const tiedAtTop = topScore > 0 && topScore === runnerUpScore;

  if (topScore === 0 || tiedAtTop || totalPoints <= LOW_CONFIDENCE_TOTAL) {
    const topTypes = ranked.filter((code) => scores[code] > 0).slice(0, 2);
    return { status: "INCONCLUSIVE", primaryType: null, scores, topTypes, totalPoints };
  }

  return {
    status: "CONCLUSIVE",
    primaryType: ranked[0],
    scores,
    topTypes: [ranked[0]],
    totalPoints,
  };
}

/**
 * Casos de ejemplo para revisar / testear el scoring sin montar UI. Un test
 * runner (jest/vitest) no está configurado en este repo todavía; mientras
 * tanto sirven como documentación ejecutable de la intención.
 *
 * @example
 * // Areata clásica: inicio súbito + parches + uñas + autoinmune
 * calcularResultadoQuiz([
 *   { questionId: 1, optionId: "q1_sudden" },     // AREATA +2
 *   { questionId: 2, optionId: "q2_patches" },    // AREATA +3
 *   { questionId: 5, optionId: "q5_yes" },        // AREATA +2
 *   { questionId: 7, optionId: "q7_yes" },        // AREATA +2
 * ]); // -> { status: "CONCLUSIVE", primaryType: "AREATA", ... }
 *
 * @example
 * // Sin señal: "no sé" en todo -> no se fuerza categoría
 * calcularResultadoQuiz([
 *   { questionId: 1, optionId: "q1_unsure" },
 *   { questionId: 4, optionId: "q4_no" },
 * ]); // -> { status: "INCONCLUSIVE", primaryType: null, topTypes: [] }
 */
