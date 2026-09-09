"use client";

import { BadgeCheck, CheckCircle2, Stethoscope } from "lucide-react";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import { alopeciaTypeByCode } from "@/lib/data/alopeciaTypes";
import type { QuizResult, QuizAnswer } from "@/lib/quiz/scoring";
import { whySentence } from "@/lib/quiz/resultCopy";

interface QuizResultCardProps {
  result: QuizResult;
  answers: QuizAnswer[];
  isAuthenticated: boolean;
  saving: boolean;
  saved: boolean;
  saveError: string | null;
  onSave: () => void;
  onRestart: () => void;
}

// Disclaimer que va SIEMPRE, pegado al CTA. Mismo tono que /therapist y el
// reporte de /progress.
function Disclaimer({ emphatic }: { emphatic: boolean }) {
  return (
    <div className="flex items-start gap-3 rounded-card-md border border-navy/10 bg-navy/5 p-4 text-p-small leading-relaxed text-navy/70">
      <Stethoscope size={18} className="mt-0.5 shrink-0 text-accent" />
      <p>
        {emphatic ? (
          <>
            Con más razón acá: <strong className="font-semibold text-navy/80">agenda una
            evaluación con un dermatólogo</strong>. Este quiz es un complemento, no
            reemplaza la evaluación de un profesional de la salud, y en tu caso
            todavía hay señales cruzadas que solo una consulta en persona puede
            ordenar.
          </>
        ) : (
          <>
            Esto es una orientación, <strong className="font-semibold text-navy/80">no un
            diagnóstico</strong>. Solo un dermatólogo puede confirmar qué tipo de
            alopecia tienes. Es un complemento, no reemplaza la evaluación de un
            profesional de la salud — llévalo a esa consulta como punto de
            partida.
          </>
        )}
      </p>
    </div>
  );
}

function SaveCta({
  isAuthenticated,
  saving,
  saved,
  saveError,
  onSave,
  onRestart,
}: Pick<
  QuizResultCardProps,
  "isAuthenticated" | "saving" | "saved" | "saveError" | "onSave" | "onRestart"
>) {
  if (saved) {
    return (
      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3 rounded-card-md bg-accent/5 p-4 text-p-small text-navy/75">
          <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-accent" />
          <p>
            Listo, guardamos tu resultado. Lo puedes ver en tu perfil y volver a
            hacer el quiz cuando quieras.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/profile" variant="gradient">
            Ir a mi perfil
          </Button>
          <Button variant="ghost" onClick={onRestart}>
            Volver a hacer el quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-3">
        {isAuthenticated ? (
          <Button variant="gradient" onClick={onSave} disabled={saving}>
            {saving ? "Guardando…" : "Guardar resultado"}
          </Button>
        ) : (
          <Button href="/auth?fromQuiz=1" variant="gradient">
            Crea tu cuenta para guardar este resultado
          </Button>
        )}
        <Button variant="ghost" onClick={onRestart}>
          Volver a hacer el quiz
        </Button>
      </div>
      {saveError && <p className="text-p-caption text-coral">{saveError}</p>}
      {!isAuthenticated && (
        <p className="text-p-caption text-navy/50">
          Guardamos tus respuestas solo en este dispositivo hasta que crees tu
          cuenta.
        </p>
      )}
    </div>
  );
}

export default function QuizResultCard({
  result,
  answers,
  isAuthenticated,
  saving,
  saved,
  saveError,
  onSave,
  onRestart,
}: QuizResultCardProps) {
  const why = whySentence(answers);

  if (result.status === "CONCLUSIVE" && result.primaryType) {
    const type = alopeciaTypeByCode(result.primaryType);
    return (
      <div className="animate-fade-in-blur motion-reduce:animate-none flex flex-col gap-6">
        <div
          className="rounded-card-lg border border-navy/12 p-8 shadow-sm sm:p-10"
          style={{ background: type.tintGradient }}
        >
          <p className="text-h4-label text-accent">Tu orientación</p>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="text-h3-lg text-navy">{type.name}</h1>
            <Badge tone="accent">{type.tag}</Badge>
          </div>

          <p className="mt-4 text-p-body text-navy/80">{type.description}</p>

          {why && (
            <p className="mt-4 text-p-body text-navy/70">
              Te mostramos esto porque nos dijiste que {why}.
            </p>
          )}

          <p className="mt-5 flex flex-wrap items-baseline gap-x-1.5 text-p-caption text-navy/55">
            <BadgeCheck size={13} className="relative top-px shrink-0 text-accent" />
            Fuente:{" "}
            <a
              href={type.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              {type.source.label}
            </a>
          </p>
        </div>

        <Disclaimer emphatic={false} />
        <SaveCta
          isAuthenticated={isAuthenticated}
          saving={saving}
          saved={saved}
          saveError={saveError}
          onSave={onSave}
          onRestart={onRestart}
        />
      </div>
    );
  }

  // No concluyente: no se fuerza una categoría. El texto no debe sonar a que
  // el quiz "falló" -- es la salida responsable.
  const closest = result.topTypes.map((code) => alopeciaTypeByCode(code).name);

  return (
    <div className="animate-fade-in-blur motion-reduce:animate-none flex flex-col gap-6">
      <div className="rounded-card-lg border border-navy/12 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-h4-label text-accent">Tu orientación</p>
        <h1 className="mt-3 text-h3-lg text-navy">
          Con tus respuestas no podemos orientarte con claridad
        </h1>

        <p className="mt-4 text-p-body text-navy/80">
          Y está bien que así sea. Varias formas de alopecia comparten señales, y
          responder con honestidad —incluido &ldquo;no sé&rdquo;— es más útil que
          forzar una etiqueta que podría mandarte por el camino equivocado.
        </p>

        {closest.length > 0 && (
          <p className="mt-4 text-p-body text-navy/70">
            Por lo que nos contaste, lo más cercano fue{" "}
            <span className="font-semibold text-navy">
              {closest.join(" y ")}
            </span>
            , pero no con fuerza suficiente para decírtelo con seguridad.
          </p>
        )}

        <p className="mt-4 text-p-body text-navy/70">
          El siguiente paso más útil es una evaluación con un dermatólogo: en una
          consulta corta puede distinguir lo que este quiz no alcanza a separar.
        </p>
      </div>

      <Disclaimer emphatic />
      <SaveCta
        isAuthenticated={isAuthenticated}
        saving={saving}
        saved={saved}
        saveError={saveError}
        onSave={onSave}
        onRestart={onRestart}
      />
    </div>
  );
}
