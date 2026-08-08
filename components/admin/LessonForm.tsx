"use client";

import { useState } from "react";
import type { LessonRequest } from "@/lib/api/adminCourses";

const inputClass =
  "mt-1 w-full rounded-card-md border border-navy/15 bg-cream px-4 py-2.5 text-p-body text-navy outline-none focus:border-accent";

export default function LessonForm({
  initial,
  submitLabel,
  onSubmit,
  onDelete,
}: {
  initial: LessonRequest;
  submitLabel: string;
  onSubmit: (values: LessonRequest) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [values, setValues] = useState<LessonRequest>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar la lección");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card-md bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-p-small font-semibold text-navy/70">
          Título
          <input
            required
            className={inputClass}
            value={values.title}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
          />
        </label>

        <label className="text-p-small font-semibold text-navy/70">
          Slug (URL, único dentro del módulo)
          <input
            required
            pattern="[a-z0-9]+(-[a-z0-9]+)*"
            title="Solo minúsculas, números y guiones"
            className={inputClass}
            value={values.slug}
            onChange={(e) => setValues({ ...values, slug: e.target.value })}
          />
        </label>

        <label className="text-p-small font-semibold text-navy/70 sm:col-span-2">
          URL del video (Youtube/Vimeo, opcional)
          <input
            className={inputClass}
            placeholder="https://www.youtube.com/watch?v=…"
            value={values.videoUrl}
            onChange={(e) => setValues({ ...values, videoUrl: e.target.value })}
          />
        </label>

        <label className="text-p-small font-semibold text-navy/70 sm:col-span-2">
          Resumen breve (aparece bajo el título en la lista de lecciones del curso)
          <input
            maxLength={300}
            className={inputClass}
            placeholder="Una frase corta que resuma la lección"
            value={values.summary}
            onChange={(e) => setValues({ ...values, summary: e.target.value })}
          />
        </label>

        <label className="text-p-small font-semibold text-navy/70 sm:col-span-2">
          Objetivos de la lección (opcional)
          <textarea
            rows={3}
            className={inputClass}
            placeholder={"Escribe un objetivo por línea, por ejemplo:\nIdentificar los tipos de alopecia más comunes\nReconocer cuándo pedir ayuda profesional"}
            value={values.objectives}
            onChange={(e) => setValues({ ...values, objectives: e.target.value })}
          />
          <span className="mt-1 block text-p-caption font-normal text-navy/50">
            Cada línea aparece como un punto en el recuadro &quot;En esta lección aprenderás a…&quot;. Déjalo vacío si no aplica.
          </span>
        </label>

        <label className="text-p-small font-semibold text-navy/70 sm:col-span-2">
          Contenido de la lección
          <textarea
            rows={8}
            className={inputClass}
            placeholder="Texto de la lección. Separa párrafos con una línea en blanco."
            value={values.body}
            onChange={(e) => setValues({ ...values, body: e.target.value })}
          />
        </label>

        <label className="text-p-small font-semibold text-navy/70">
          Duración (minutos)
          <input
            type="number"
            min={0}
            className={inputClass}
            value={values.durationMinutes}
            onChange={(e) => setValues({ ...values, durationMinutes: Number(e.target.value) })}
          />
        </label>

        <label className="text-p-small font-semibold text-navy/70">
          Orden dentro del módulo
          <input
            type="number"
            className={inputClass}
            value={values.displayOrder}
            onChange={(e) => setValues({ ...values, displayOrder: Number(e.target.value) })}
          />
        </label>

        <label className="flex items-center gap-2 text-p-small font-semibold text-navy/70 sm:col-span-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={values.published}
            onChange={(e) => setValues({ ...values, published: e.target.checked })}
          />
          Publicada (visible en Aprender)
        </label>
      </div>

      {error && <p className="mt-4 text-p-small text-coral">{error}</p>}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-pill bg-navy px-5 py-2.5 text-a-inline font-semibold text-cream disabled:opacity-50"
        >
          {saving ? "Guardando…" : submitLabel}
        </button>
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="rounded-pill border border-coral/30 px-4 py-2.5 text-a-inline font-semibold text-coral hover:bg-coral-soft"
          >
            Eliminar lección
          </button>
        )}
      </div>
    </form>
  );
}
