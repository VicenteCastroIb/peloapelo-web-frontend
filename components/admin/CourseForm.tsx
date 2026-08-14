"use client";

import { useEffect, useState } from "react";
import type { CourseLevel } from "@/lib/api/courses";
import type { CourseRequest } from "@/lib/api/adminCourses";
import { slugify } from "@/lib/slugify";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const LEVEL_OPTIONS: { value: CourseLevel; label: string }[] = [
  { value: "BASICO", label: "Básico" },
  { value: "INTERMEDIO", label: "Intermedio" },
  { value: "AVANZADO", label: "Avanzado" },
];

const inputClass =
  "mt-1 w-full rounded-card-md border border-navy/15 bg-cream px-4 py-2.5 text-p-body text-navy outline-none focus:border-accent";

// Mismo patron que ArticleForm.tsx (ago 2026): sin input de slug (se deriva
// siempre del titulo, atomico dentro del mismo onChange -- ver comentario en
// ArticleForm sobre la condicion de carrera que esto evita) y sin input de
// "Orden en el listado" (el orden ahora se define con las flechas de
// /admin/courses, ver reorderCourses en adminCourses.ts). `onChange` es
// opcional y alimenta la vista previa en vivo (LiveCoursePreview) sin
// guardar nada -- el guardado real sigue siendo explicito con el boton.
export default function CourseForm({
  initial,
  submitLabel,
  onSubmit,
  onDelete,
  onChange,
}: {
  initial: CourseRequest;
  submitLabel: string;
  onSubmit: (values: CourseRequest) => Promise<void>;
  onDelete?: () => Promise<void>;
  onChange?: (values: CourseRequest) => void;
}) {
  const [values, setValues] = useState<CourseRequest>(initial);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    onChange?.(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

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

  // Mismo patron que ArticleForm.tsx (ago 2026, a pedido: "mismo diseño que
  // aparece al eliminar blog"): ConfirmDialog en vez del confirm() nativo
  // del navegador, controlado aca para que `deleting` solo se active
  // despues de confirmar.
  function handleDeleteClick() {
    if (!onDelete || deleting) return;
    setConfirmOpen(true);
  }

  async function confirmDelete() {
    setConfirmOpen(false);
    setDeleting(true);
    setError(null);
    try {
      await onDelete!();
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo eliminar el curso");
      setDeleting(false);
    }
    // sin `finally`: si onDelete tuvo exito, la pagina que llama navega afuera.
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card-md bg-white p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-p-small font-semibold text-navy/70 sm:col-span-2">
          Título
          <input
            required
            className={inputClass}
            value={values.title}
            onChange={(e) => {
              const title = e.target.value;
              setValues((v) => ({ ...v, title, slug: slugify(title) }));
            }}
          />
        </label>

        <label className="text-p-small font-semibold text-navy/70 sm:col-span-2">
          Descripción corta (tarjeta del listado y subtítulo del curso)
          <textarea
            rows={2}
            className={inputClass}
            value={values.description}
            onChange={(e) => {
              const description = e.target.value;
              setValues((v) => ({ ...v, description }));
            }}
          />
        </label>

        <label className="text-p-small font-semibold text-navy/70 sm:col-span-2">
          Descripción larga (párrafo en la página del curso, opcional)
          <textarea
            rows={4}
            className={inputClass}
            value={values.longDescription}
            onChange={(e) => {
              const longDescription = e.target.value;
              setValues((v) => ({ ...v, longDescription }));
            }}
          />
        </label>

        <label className="text-p-small font-semibold text-navy/70">
          Nivel
          <select
            className={inputClass}
            value={values.level}
            onChange={(e) => {
              const level = e.target.value as CourseLevel;
              setValues((v) => ({ ...v, level }));
            }}
          >
            {LEVEL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>

        <label className="text-p-small font-semibold text-navy/70">
          URL de imagen de portada (opcional)
          <input
            className={inputClass}
            placeholder="https://…"
            value={values.coverImageUrl}
            onChange={(e) => {
              const coverImageUrl = e.target.value;
              setValues((v) => ({ ...v, coverImageUrl }));
            }}
          />
        </label>

        <label className="flex items-center gap-2 text-p-small font-semibold text-navy/70 sm:col-span-2">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={values.published}
            onChange={(e) => {
              const published = e.target.checked;
              setValues((v) => ({ ...v, published }));
            }}
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
            onClick={handleDeleteClick}
            disabled={deleting}
            className="rounded-pill border border-coral/30 px-4 py-2.5 text-a-inline font-semibold text-coral hover:bg-coral-soft disabled:opacity-50"
          >
            {deleting ? "Eliminando…" : "Eliminar curso"}
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={`¿Eliminar "${values.title || "este curso"}"?`}
        description="Se va a eliminar el curso junto con todos sus módulos y lecciones. Esta acción no se puede deshacer."
        confirmLabel="Eliminar curso"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </form>
  );
}
