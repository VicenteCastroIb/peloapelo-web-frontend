import { ALL_ALOPECIA_CODES, type AlopeciaTypeCode } from "@/lib/data/alopeciaTypes";
import type { QuizAnswer, QuizResultStatus, QuizScores } from "./scoring";

// Guarda temporalmente el resultado del quiz de alguien SIN sesión, entre que
// termina el quiz y crea (o inicia) su cuenta. Se usa sessionStorage a
// propósito, no localStorage: son datos de salud sensibles (tipo de
// alopecia, respuestas) y sessionStorage se borra solo al cerrar la pestaña
// -- nada de datos de salud persistidos sin expiración. Al guardarse en el
// backend tras el registro, se limpia de inmediato (ver clearPendingQuiz).

const KEY = "pap_quiz_pendiente_v1";

export interface PendingQuiz {
  answers: QuizAnswer[];
  primaryType: AlopeciaTypeCode | null;
  scores: QuizScores;
  status: QuizResultStatus;
  savedAt: string;
}

function isValid(value: unknown): value is PendingQuiz {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.answers)) return false;
  if (typeof v.scores !== "object" || v.scores === null) return false;
  if (v.status !== "CONCLUSIVE" && v.status !== "INCONCLUSIVE") return false;
  if (
    v.primaryType !== null &&
    !ALL_ALOPECIA_CODES.includes(v.primaryType as AlopeciaTypeCode)
  ) {
    return false;
  }
  return true;
}

export function savePendingQuiz(data: PendingQuiz): void {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Modo incógnito, storage lleno o deshabilitado: la persona simplemente
    // tendrá que volver a hacer el quiz. No es un error que valga la pena
    // mostrar.
  }
}

export function readPendingQuiz(): PendingQuiz | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function clearPendingQuiz(): void {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Nada que hacer si el storage no está disponible.
  }
}
