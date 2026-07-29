"use client";

import { useState } from "react";
import type { CourseLevel } from "@/lib/api/courses";
import type { CourseRequest } from "@/lib/api/adminCourses";

const LEVEL_OPTIONS: { value: CourseLevel; label: string }[] = [
  { value: "BASICO", label: "Básico" },
  { value: "INTERMEDIO", label: "Intermedio" },
  { value: "AVANZADO", label: "Avanzado" },
];

const inputClass =
  "mt-1 w-full rounded-card-md border border-navy/15 bg-cream px-4 py-2.5 text-p-body text-navy outline-none focus:border-accent";

export default function CourseForm({
  initial,
  submitLabel,
  onSubmit,
  onDelete,
}: {
  initial: CourseRequest;
  submitLabel: string;
  onSubmit: (values: CourseRequest) => Promise<void>;
  onDelete?: () => Promise<void>;
}) {
  const [values, setValues] = useState<CourseRequest>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el curso");
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
          Slug (URL)
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
          Descripción
          <textarea
            rows={3}
            className={inputClass}
            value={values.description}
            onChange={(e) => setValues({ ...values, description: e.target.value })}
          />
        </label>

        <label className="text-p-small font-semibold text-navy/70">
          Nivel
          <select
            className={inputClass}
            value={values.level}
            onChange={(e) => setValues({ ...values, level: e.target.value as CourseLevel })}
          >
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-p-small font-semibold text-navy/70">
          Orden en el listado
          <input
            type="number"
            className={inputClass}
            value={values.displayOrder}
            onChange={(e) => setValues({ ...values, displayOrder: Number(e.target.value) })}
          />
        </label>

        <label className="text-p-small font-semibold text-navy/70 sm:col-span-2">
          URL de imagen de portada (opcional)
          <input
            className={inputClass}
            placeholder="https://…"
            value={values.coverImageUrl}
            onChange={(e) => setValues({ ...values, coverImageUrl: e.target.value })}
          />
        </label>

        <label className="flex items-center gap-2 text-p-small font-semibold text-navy/70 sm:col-span-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={values.published}
            onChange={(e) => setValues({ ...values, published: e.target.checked })}
          />
          Publicado (visible en Aprender)
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
            Eliminar curso
          </button>
        )}
      </div>
    </form>
  );
}
