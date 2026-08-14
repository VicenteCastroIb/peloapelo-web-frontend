"use client";

import { useEffect, useState } from "react";
import type { ArticleRequest } from "@/lib/api/adminBlog";
import { slugify } from "@/lib/slugify";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const inputClass =
  "mt-1 w-full rounded-card-md border border-navy/15 bg-cream px-4 py-2.5 text-p-body text-navy outline-none focus:border-accent";

// Mismo patron que components/admin/CourseForm.tsx: formulario controlado
// para los campos "de portada" del articulo (todo lo que no es contenido en
// bloques -- eso lo maneja BlockList.tsx aparte, mas abajo en la pagina de
// edicion). `onChange` (ago 2026, vista previa en vivo) es opcional a
// proposito y separado de `onSubmit`: dispara en cada tecla para alimentar
// LiveArticlePreview sin guardar nada todavia -- el guardado real sigue
// siendo un paso explicito (boton "Guardar cambios").
export default function ArticleForm({
  initial,
  submitLabel,
  onSubmit,
  onDelete,
  onChange,
}: {
  initial: ArticleRequest;
  submitLabel: string;
  onSubmit: (values: ArticleRequest) => Promise<void>;
  onDelete?: () => Promise<void>;
  onChange?: (values: ArticleRequest) => void;
}) {
  const [values, setValues] = useState<ArticleRequest>(initial);
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
      setError(err instanceof Error ? err.message : "No se pudo guardar el artículo");
    } finally {
      setSaving(false);
    }
  }

  // El dialogo de confirmacion (ConfirmDialog, ago 2026 -- reemplaza el
  // confirm() nativo del navegador por uno con el diseño del panel) vive
  // controlado ACA, no en el onDelete que pasa la pagina, para que
  // `setDeleting(true)` solo se dispare DESPUES de confirmar -- si cancela,
  // `deleting` ni se toca. `deleting` evita el doble-click real: sin esta
  // guardia, un segundo click mientras el primer DELETE todavia esta en
  // vuelo mandaba una segunda request para un articulo que el primer click
  // ya habia borrado -- el backend respondia 404 "Articulo no encontrado" y,
  // al no estar atajado, esa excepcion se escapaba sin manejar y tumbaba
  // toda la pagina con la pantalla roja de Next.js.
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
      setError(err instanceof Error ? err.message : "No se pudo eliminar el artículo");
      setDeleting(false);
    }
    // sin `finally`: si onDelete tuvo exito, la pagina que llama navega afuera
    // (router.push) -- dejar deleting=true evita un segundo click en el
    // instante entre el 204 y que la navegacion realmente ocurra.
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
            // Slug calculado inline en el mismo setValues (no en un useEffect
            // aparte con [values.title] como dependencia): un efecto separado
            // se dispara en un commit posterior, ya tarde para escrituras
            // rapidas seguidas en distintos campos (ej. rellenar el
            // formulario por script para pruebas) -- otro campo puede
            // "ganarle la carrera" y guardar un `values` viejo todavia sin
            // slug, pisando el que el efecto recien iba a calcular. Haciendolo
            // aca, en la misma actualizacion funcional, es atomico.
            onChange={(e) => {
              const title = e.target.value;
              setValues((v) => ({ ...v, title, slug: slugify(title) }));
            }}
          />
        </label>

        <label className="text-p-small font-semibold text-navy/70 sm:col-span-2">
          Resumen (tarjeta del listado, debajo del título)
          <textarea
            rows={2}
            className={inputClass}
            value={values.excerpt}
            onChange={(e) => {
              const excerpt = e.target.value;
              setValues((v) => ({ ...v, excerpt }));
            }}
          />
        </label>

        <label className="text-p-small font-semibold text-navy/70">
          Categoría
          <input
            className={inputClass}
            placeholder="Ej: Bienestar emocional"
            value={values.category}
            onChange={(e) => {
              const category = e.target.value;
              setValues((v) => ({ ...v, category }));
            }}
          />
        </label>

        <label className="text-p-small font-semibold text-navy/70">
          Tiempo de lectura
          <input
            className={inputClass}
            placeholder="Ej: 6 min de lectura"
            value={values.readTime}
            onChange={(e) => {
              const readTime = e.target.value;
              setValues((v) => ({ ...v, readTime }));
            }}
          />
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
          Publicado (visible en el blog)
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
            {deleting ? "Eliminando…" : "Eliminar artículo"}
          </button>
        )}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title={`¿Eliminar "${values.title || "este artículo"}"?`}
        description="Se va a eliminar el artículo junto con todo su contenido (todos los bloques). Esta acción no se puede deshacer."
        confirmLabel="Eliminar artículo"
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </form>
  );
}
