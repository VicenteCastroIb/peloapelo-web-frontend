import { QUIZ_QUESTIONS, findOption } from "./questions";
import type { QuizAnswer } from "./scoring";

// Arma el texto que le refleja a la persona sus propias respuestas en la
// pantalla de resultado ("Te mostramos esto porque nos dijiste que ..."). El
// resultado del quiz nunca se presenta como una caja negra: se explica con
// las mismas cosas que la persona respondió. Puro y testeable.

/** Echoes de las respuestas elegidas, en orden de pregunta. Las opciones
 *  tipo "no sé / no" no tienen echo y se omiten. */
export function answerEchoes(answers: QuizAnswer[]): string[] {
  const byQuestion = new Map(answers.map((a) => [a.questionId, a.optionId]));
  const echoes: string[] = [];
  for (const question of QUIZ_QUESTIONS) {
    const optionId = byQuestion.get(question.id);
    if (!optionId) continue;
    const echo = findOption(question.id, optionId)?.echo;
    if (echo) echoes.push(echo);
  }
  return echoes;
}

/** Une frases en una enumeración natural en español: "a, b y c". */
export function joinWithY(parts: string[]): string {
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  return `${parts.slice(0, -1).join(", ")} y ${parts[parts.length - 1]}`;
}

/**
 * Frase completa "...nos dijiste que X, Y y Z". Se limita a `max` echoes para
 * que no se vuelva un párrafo interminable en quienes respondieron muchas
 * preguntas con señal.
 */
export function whySentence(answers: QuizAnswer[], max = 4): string {
  const echoes = answerEchoes(answers).slice(0, max);
  return joinWithY(echoes);
}
