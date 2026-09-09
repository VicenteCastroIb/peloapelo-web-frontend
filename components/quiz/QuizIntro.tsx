"use client";

import { ClipboardList, Clock, ShieldCheck } from "lucide-react";
import Button from "@/components/ui/Button";
import { QUIZ_LENGTH } from "@/lib/quiz/questions";

const PUNTOS = [
  { icon: ClipboardList, label: `${QUIZ_LENGTH} preguntas de opción única` },
  { icon: Clock, label: "Unos 2 minutos" },
  { icon: ShieldCheck, label: "Anónimo hasta que decidas guardarlo" },
];

export default function QuizIntro({ onStart }: { onStart: () => void }) {
  return (
    <div className="animate-fade-in-blur motion-reduce:animate-none rounded-card-lg bg-white p-8 shadow-sm sm:p-10">
      <p className="text-h4-label text-accent">Autoevaluación de orientación</p>
      <h1 className="mt-3 text-h3-lg text-navy">
        Entendamos juntas qué está pasando con tu pelo
      </h1>
      <p className="mt-4 text-p-body text-navy/75">
        Te vamos a preguntar cómo empezó tu caída y cómo se ve hoy. Al final te
        damos una orientación sobre qué tipo de alopecia podría ser y qué hacer
        con eso.
      </p>

      <ul className="mt-6 flex flex-col gap-3">
        {PUNTOS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 text-p-small text-navy/70">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-icon bg-accent/10 text-accent">
              <Icon size={16} strokeWidth={1.8} />
            </span>
            {label}
          </li>
        ))}
      </ul>

      {/* Disclaimer obligatorio, mismo criterio que /therapist y el reporte de
          /progress: esto acompaña, no reemplaza a un profesional. */}
      <div className="mt-6 flex items-start gap-3 rounded-card-md border border-navy/10 bg-navy/5 p-4 text-p-small text-navy/70">
        <ShieldCheck size={18} className="mt-0.5 shrink-0 text-accent" />
        <p>
          Esto <strong className="font-semibold text-navy/80">no es un diagnóstico</strong>. Ningún
          test reemplaza a un dermatólogo: tómalo como un punto de partida para
          esa conversación, no como una conclusión médica.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Button variant="gradient" size="lg" onClick={onStart}>
          Empezar el quiz
        </Button>
        <Button href="/#como-funciona" variant="ghost">
          Cómo funciona Pelo a Pelo
        </Button>
      </div>
    </div>
  );
}
