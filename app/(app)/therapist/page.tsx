"use client";

import { useState } from "react";
import { Heart, Calendar as CalendarIcon, Mail } from "lucide-react";
import Button from "@/components/ui/Button";

const MORNING_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30"];
const AFTERNOON_SLOTS = ["14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];

export default function TherapistPage() {
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    // TODO: no existe endpoint de agendamiento todavia (ver backend/README.md
    // "Pendiente"). Por ahora solo confirmamos en pantalla, sin persistir nada.
    setSubmitted(true);
  }

  return (
    <div className="max-w-2xl">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-navy/50">
        <Heart size={14} /> Acompañamiento profesional
      </p>
      <h1 className="mt-2 text-2xl font-semibold">Agenda con tu Terapeuta 🧠</h1>
      <p className="mt-2 text-navy/70">
        Sabemos que no todo es digital. Por eso tenemos profesionales de la salud
        mental para apoyarte en todo momento. Agenda una sesión y te acompañamos.
      </p>

      <div className="mt-6 flex items-center gap-4 rounded-card-md bg-white p-5 shadow-sm">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Heart size={20} />
        </span>
        <div>
          <p className="font-semibold">Jessica Lagno</p>
          <p className="text-sm text-navy/60">Profesional de salud mental · Pelo a Pelo</p>
          <p className="text-sm text-navy/50">jessica.lagno@beehrteam.com</p>
        </div>
      </div>

      {submitted ? (
        <div className="mt-6 rounded-card-md bg-accent/10 p-6 text-center">
          <p className="font-semibold text-accent">¡Solicitud enviada!</p>
          <p className="mt-1 text-sm text-navy/70">
            Esta función todavía no está conectada a un sistema de agendamiento
            real — por ahora, escríbenos directo para coordinar tu sesión.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-6 rounded-card-md bg-white p-6 shadow-sm">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy/70">Selecciona una fecha</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-pill border border-navy/10 bg-cream px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-navy/70">Horario disponible</p>
            <div className="flex flex-wrap gap-2">
              {[...MORNING_SLOTS, ...AFTERNOON_SLOTS].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSlot(time)}
                  className={`rounded-pill border px-3.5 py-1.5 text-sm transition-colors ${
                    slot === time
                      ? "border-accent bg-accent text-white"
                      : "border-navy/10 text-navy/70 hover:border-accent/40"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-navy/70">
              ¿Sobre qué te gustaría hablar? (opcional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-navy/10 bg-cream px-4 py-3 text-sm outline-none"
            />
          </div>

          <Button type="submit" variant="gradient" className="w-full" disabled={!date || !slot}>
            Agendar sesión
          </Button>

          <div className="text-center text-sm text-navy/60">
            ¿Prefieres agendar directamente?
            <br />
            <a
              href="mailto:jessica.lagno@beehrteam.com"
              className="mt-1 inline-flex items-center gap-1.5 font-semibold text-accent"
            >
              <Mail size={14} /> Escribir directo
            </a>
          </div>
        </form>
      )}

      <p className="mt-6 flex items-start gap-2 text-sm text-navy/60">
        <CalendarIcon size={16} className="mt-0.5 shrink-0 text-accent" />
        Este servicio es un complemento a tu proceso. Las sesiones son orientativas
        y no reemplazan un tratamiento clínico formal. Si estás en crisis, acude a
        urgencias o llama a una línea de ayuda.
      </p>
    </div>
  );
}
