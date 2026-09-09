"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, HelpCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/shared/ProgressBar";
import Collapse from "@/components/shared/Collapse";
import type { QuizQuestion } from "@/lib/quiz/questions";

interface QuizQuestionCardProps {
  question: QuizQuestion;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionId: string | null;
  onSelect: (optionId: string) => void;
  onNext: () => void;
  onBack: () => void;
}

// Una pregunta a la vez. El patrón de accesibilidad de las opciones está
// copiado tal cual de components/progress/MoodPicker.tsx: contenedor
// role="radiogroup", cada opción un <button role="radio"> con aria-checked;
// acá son opciones de texto en vez de la escala de ánimo.
export default function QuizQuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionId,
  onSelect,
  onNext,
  onBack,
}: QuizQuestionCardProps) {
  const [showHelp, setShowHelp] = useState(false);
  const isLast = questionNumber === totalQuestions;
  const percent = Math.round((questionNumber / totalQuestions) * 100);

  return (
    <div className="rounded-card-lg bg-white p-8 shadow-sm sm:p-10">
      <div className="flex items-center justify-between gap-4">
        <p className="text-p-caption font-semibold uppercase tracking-wide text-navy/45">
          Pregunta {questionNumber} de {totalQuestions}
        </p>
        <p className="text-p-caption font-semibold text-accent">{percent}%</p>
      </div>
      <div className="mt-2.5">
        <ProgressBar percent={percent} />
      </div>

      <div key={question.id} className="animate-reveal-in">
        <h1 className="mt-7 text-h3-lg text-navy">{question.prompt}</h1>

        <div
          role="radiogroup"
          aria-label={question.prompt}
          className="mt-6 flex flex-col gap-3"
        >
          {question.options.map((option) => {
            const checked = selectedOptionId === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={checked}
                aria-label={option.label}
                onClick={() => onSelect(option.id)}
                className={`flex w-full items-start gap-3 rounded-card-md border px-5 py-4 text-left text-p-body transition-colors ${
                  checked
                    ? "border-accent bg-accent/5 text-navy"
                    : "border-navy/12 bg-white text-navy/80 hover:border-accent/40 hover:bg-navy/[0.02]"
                }`}
              >
                <span
                  aria-hidden
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-pill border transition-colors ${
                    checked ? "border-accent bg-accent text-white" : "border-navy/25 bg-white text-transparent"
                  }`}
                >
                  <Check size={13} strokeWidth={3} />
                </span>
                <span>{option.label}</span>
              </button>
            );
          })}
        </div>

        {question.helpNote && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowHelp((v) => !v)}
              aria-expanded={showHelp}
              className="inline-flex items-center gap-1.5 border-none bg-transparent p-0 text-a-inline font-semibold text-accent"
            >
              <HelpCircle size={15} />
              ¿Por qué te preguntamos esto?
            </button>
            <Collapse open={showHelp}>
              <p className="pt-2 text-p-small leading-relaxed text-navy/60">
                {question.helpNote}
              </p>
            </Collapse>
          </div>
        )}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 border-none bg-transparent p-0 text-a-inline font-semibold text-navy/60 hover:text-navy"
        >
          <ArrowLeft size={15} />
          Atrás
        </button>
        <Button
          variant="gradient"
          onClick={onNext}
          disabled={!selectedOptionId}
        >
          {isLast ? "Ver mi resultado" : "Siguiente"}
          <ArrowRight size={15} />
        </Button>
      </div>
    </div>
  );
}
