"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { ApiError } from "@/lib/api/client";
import { QUIZ_QUESTIONS, QUIZ_LENGTH } from "@/lib/quiz/questions";
import {
  calcularResultadoQuiz,
  type QuizAnswer,
  type QuizResult,
} from "@/lib/quiz/scoring";
import { savePendingQuiz, clearPendingQuiz } from "@/lib/quiz/storage";
import { submitQuizResult } from "@/lib/api/quiz";
import QuizIntro from "./QuizIntro";
import QuizQuestionCard from "./QuizQuestionCard";
import QuizResultCard from "./QuizResultCard";

type Phase = "intro" | "questions" | "result";

// Orquestador del quiz de /quiz. Ruta pública: la puerta de entrada para
// gente nueva, no requiere sesión. Las respuestas viven solo en estado de
// React hasta el final; si la persona no tiene sesión, el resultado se
// guarda en sessionStorage (ver lib/quiz/storage.ts) para reenviarlo al
// backend apenas cree su cuenta.
export default function QuizFlow() {
  const { status, token } = useAuth();

  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [result, setResult] = useState<QuizResult | null>(null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const question = QUIZ_QUESTIONS[index];
  const selected = question ? (answers[question.id] ?? null) : null;

  const orderedAnswers = useMemo<QuizAnswer[]>(
    () =>
      QUIZ_QUESTIONS.filter((q) => answers[q.id]).map((q) => ({
        questionId: q.id,
        optionId: answers[q.id],
      })),
    [answers],
  );

  function handleSelect(optionId: string) {
    setAnswers((prev) => ({ ...prev, [question.id]: optionId }));
  }

  function goNext() {
    if (index + 1 < QUIZ_LENGTH) {
      setIndex(index + 1);
      return;
    }
    const finalAnswers: QuizAnswer[] = QUIZ_QUESTIONS.filter((q) => answers[q.id]).map(
      (q) => ({ questionId: q.id, optionId: answers[q.id] }),
    );
    const computed = calcularResultadoQuiz(finalAnswers);
    setResult(computed);
    setPhase("result");
    if (status !== "authenticated") {
      savePendingQuiz({
        answers: finalAnswers,
        primaryType: computed.primaryType,
        scores: computed.scores,
        status: computed.status,
        savedAt: new Date().toISOString(),
      });
    }
  }

  function goBack() {
    if (index === 0) {
      setPhase("intro");
      return;
    }
    setIndex(index - 1);
  }

  function restart() {
    setAnswers({});
    setIndex(0);
    setResult(null);
    setSaved(false);
    setSaveError(null);
    setPhase("intro");
  }

  async function saveResult() {
    if (!result) return;
    setSaving(true);
    setSaveError(null);
    try {
      await submitQuizResult(token, {
        primaryType: result.primaryType,
        scores: result.scores,
        answers: orderedAnswers,
      });
      clearPendingQuiz();
      setSaved(true);
    } catch (err) {
      setSaveError(
        err instanceof ApiError
          ? err.message
          : "No pudimos guardar tu resultado. Intenta de nuevo.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden px-6 py-14 sm:py-20">
      {/* Mismo halo difuso de marca que /auth y /auth/restablecer-password:
          ata visualmente el quiz al resto del embudo de entrada. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-[linear-gradient(135deg,var(--color-gradient-from),var(--color-gradient-to))] opacity-10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-[26rem] w-[26rem] rounded-full bg-[linear-gradient(135deg,var(--color-gradient-to),var(--color-gradient-from))] opacity-[0.08] blur-3xl"
      />

      <div className="relative w-full max-w-2xl">
        {phase === "intro" && <QuizIntro onStart={() => setPhase("questions")} />}

        {phase === "questions" && question && (
          <QuizQuestionCard
            key={question.id}
            question={question}
            questionNumber={index + 1}
            totalQuestions={QUIZ_LENGTH}
            selectedOptionId={selected}
            onSelect={handleSelect}
            onNext={goNext}
            onBack={goBack}
          />
        )}

        {phase === "result" && result && (
          <QuizResultCard
            result={result}
            answers={orderedAnswers}
            isAuthenticated={status === "authenticated"}
            saving={saving}
            saved={saved}
            saveError={saveError}
            onSave={saveResult}
            onRestart={restart}
          />
        )}
      </div>
    </section>
  );
}
