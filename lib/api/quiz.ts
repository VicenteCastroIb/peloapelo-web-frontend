import { apiFetch } from "./client";
import type { AlopeciaTypeCode } from "@/lib/data/alopeciaTypes";
import type { QuizAnswer, QuizScores } from "@/lib/quiz/scoring";

// Cliente del módulo /api/quiz del backend. Mismo patrón que lib/api/progress.ts.

export interface SubmitQuizPayload {
  /** `null` cuando el resultado no fue concluyente. */
  primaryType: AlopeciaTypeCode | null;
  scores: QuizScores;
  answers: QuizAnswer[];
}

/**
 * Lo que devuelve el backend al leer/guardar el resultado. Nunca incluye el
 * detalle de `answers` -- es dato de salud sensible y no se expone de vuelta
 * (ver política de privacidad en lib/data/legal.ts y QuizService en el
 * backend).
 */
export interface QuizResultResponse {
  primaryType: AlopeciaTypeCode | null;
  inconclusive: boolean;
  scores: QuizScores;
  updatedAt: string;
}

/** Upsert por usuario: si repite el quiz, se actualiza el mismo registro. */
export function submitQuizResult(
  token: string | null | undefined,
  payload: SubmitQuizPayload,
) {
  return apiFetch<QuizResultResponse>("/api/quiz/result", {
    method: "POST",
    body: payload,
    token,
  });
}

/** `undefined` cuando la persona nunca hizo el quiz (el backend responde 204). */
export function getMyQuizResult(token?: string | null) {
  return apiFetch<QuizResultResponse | undefined>("/api/quiz/result", { token });
}
